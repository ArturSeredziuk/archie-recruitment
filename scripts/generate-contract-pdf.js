// Generates contract-cooperation-agreement.pdf from an HTML template, using
// the user's installed Chrome in headless mode.
//
// Run from repo root: node scripts/generate-contract-pdf.js
//
// No npm deps. Uses only Node built-ins + the existing Chrome binary.

const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

const ROOT = path.resolve(__dirname, '..');
const OUT_DIR = path.join(ROOT, 'contracts');
const LOGO_PATH = path.join(ROOT, 'AR_black_tight.png');
const HTML_PATH = path.join(OUT_DIR, 'cooperation-agreement.html');
const PDF_PATH = path.join(OUT_DIR, 'cooperation-agreement.pdf');

if (!fs.existsSync(OUT_DIR)) fs.mkdirSync(OUT_DIR, { recursive: true });

const CHROME_CANDIDATES = [
  'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe',
  'C:\\Program Files (x86)\\Google\\Chrome\\Application\\chrome.exe',
  '/usr/bin/google-chrome',
  '/usr/bin/chromium',
  '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome',
];

function findChrome() {
  for (const p of CHROME_CANDIDATES) {
    if (fs.existsSync(p)) return p;
  }
  throw new Error('Chrome executable not found. Install Chrome or edit CHROME_CANDIDATES.');
}

// ───────── Build HTML ─────────
const logoBase64 = fs.readFileSync(LOGO_PATH).toString('base64');
const logoDataUrl = `data:image/png;base64,${logoBase64}`;

const html = `<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8">
<title>Cooperation Agreement — Archie Recruitment</title>
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link href="https://fonts.googleapis.com/css2?family=Instrument+Serif:ital@0;1&family=Geist:wght@300;400;500;600;700&display=swap" rel="stylesheet">
<style>
:root {
  --orange: #ff7a45;
  --amber:  #ffb454;
  --rose:   #ff5c8a;
  --grad:   linear-gradient(100deg, #ff5c8a 0%, #ff7a45 50%, #ffb454 100%);
  --black:  #0a0a0a;
  --g1:     #1a1a1a;
  --g2:     #3a3a3a;
  --g3:     #6b6b6b;
  --g5:     #d4d4d4;
  --g6:     #ebebeb;
}

* {
  box-sizing: border-box;
  margin: 0;
  padding: 0;
  print-color-adjust: exact;
  -webkit-print-color-adjust: exact;
}

@page {
  size: A4;
  margin: 22mm 18mm 22mm 18mm;
  @top-left {
    content: element(running-header);
  }
  @bottom-center {
    content: "COOPERATION AGREEMENT — Archie Recruitment  |  Confidential  |  Page " counter(page) " of " counter(pages);
    font-family: 'Geist', system-ui, sans-serif;
    font-size: 7.5pt;
    color: #6b6b6b;
    padding-top: 4mm;
  }
}

body {
  font-family: 'Geist', system-ui, sans-serif;
  color: var(--g2);
  font-size: 10pt;
  line-height: 1.55;
}

/* Running header: logo + thin orange rule, on every page */
.running-header {
  position: running(running-header);
  width: 174mm;          /* page width − margins */
  padding-bottom: 3mm;
  border-bottom: 0.6pt solid var(--orange);
  display: flex;
  align-items: center;
}
.running-header img {
  height: 10mm;
  width: auto;
  display: block;
}

/* ── Title ─────────────────────────────────────────── */
.title-block {
  margin: 3mm 0 8mm 0;
}
.title {
  font-family: 'Instrument Serif', Georgia, serif;
  font-weight: 400;
  font-size: 36pt;
  color: var(--black);
  line-height: 1.0;
  letter-spacing: 0.2pt;
  margin-bottom: 4mm;
}
.subtitle-row {
  border-bottom: 0.6pt solid var(--g5);
  padding-bottom: 3mm;
  font-size: 10pt;
  color: var(--g3);
}
.subtitle-row .ph {
  color: var(--g1);
  font-weight: 600;
}
.subtitle-row .sep {
  color: var(--g5);
  padding: 0 5mm;
}

/* ── Party blocks ───────────────────────────────────── */
.party {
  border-left: 2.2pt solid var(--orange);
  padding: 3.5mm 5mm;
  margin: 3mm 0;
  background: linear-gradient(to right, rgba(255, 122, 69, 0.04), rgba(255, 255, 255, 0));
  break-inside: avoid;
}
.party-label {
  font-size: 8pt;
  font-weight: 700;
  color: var(--orange);
  letter-spacing: 1.6pt;
  margin-bottom: 2.5mm;
}
.party-name {
  font-weight: 600;
  color: var(--g1);
  font-size: 11.5pt;
  margin-bottom: 1mm;
}
.party-line {
  margin-bottom: 0.6mm;
  font-size: 10pt;
}
.party-line .lbl {
  color: var(--g3);
}
.party-placeholder {
  color: var(--g3);
}
.party-hereinafter {
  margin-top: 2.2mm;
  font-style: italic;
  color: var(--g3);
  font-size: 9.5pt;
}
.party-hereinafter strong {
  color: var(--g2);
}

.amp {
  text-align: center;
  font-family: 'Instrument Serif', Georgia, serif;
  font-size: 26pt;
  color: var(--orange);
  margin: 3mm 0;
  line-height: 1;
}

.collectively {
  text-align: center;
  font-style: italic;
  color: var(--g3);
  margin: 5mm 0;
  font-size: 10pt;
}
.collectively strong {
  color: var(--g2);
}

p.preamble {
  font-style: italic;
  color: var(--g3);
  margin-bottom: 2mm;
}

p { margin-bottom: 2mm; }

/* ── Sections ───────────────────────────────────────── */
h2.section {
  font-family: 'Instrument Serif', Georgia, serif;
  font-size: 17pt;
  font-weight: 400;
  color: var(--black);
  margin: 8mm 0 3.5mm 0;
  padding-bottom: 1.6mm;
  border-bottom: 0.8pt solid var(--orange);
  page-break-after: avoid;
  break-after: avoid;
  letter-spacing: 0.1pt;
}

/* ── Lists ──────────────────────────────────────────── */
ul.clean {
  list-style: none;
  padding-left: 6mm;
  margin: 1.5mm 0 3mm 0;
}
ul.clean li {
  position: relative;
  margin-bottom: 1.6mm;
  font-size: 10pt;
}
ul.clean li::before {
  content: "•";
  color: var(--orange);
  font-weight: 700;
  position: absolute;
  left: -4mm;
  font-size: 11pt;
  line-height: 1.3;
}

ol.lettered {
  list-style: none;
  padding-left: 6mm;
  margin: 2mm 0 3mm 0;
}
ol.lettered li {
  position: relative;
  margin-bottom: 1.4mm;
  padding-left: 7mm;
  font-size: 10pt;
}
ol.lettered li::before {
  content: attr(data-letter) ")";
  color: var(--orange);
  font-weight: 700;
  position: absolute;
  left: 0;
}

/* ── Fee table ──────────────────────────────────────── */
table.fee {
  width: 100%;
  border-collapse: collapse;
  margin: 3mm 0 3.5mm 0;
  break-inside: avoid;
  border-radius: 2mm;
  overflow: hidden;
}
table.fee th {
  background: var(--grad);
  color: white;
  font-weight: 600;
  padding: 3mm 4mm;
  text-align: left;
  font-size: 9.5pt;
  letter-spacing: 0.3pt;
}
table.fee td {
  padding: 3mm 4mm;
  border: 0.4pt solid var(--g5);
  border-top: none;
  font-size: 10pt;
}
table.fee td.level {
  background: rgba(255, 180, 84, 0.14);
  font-weight: 600;
  color: var(--g1);
  width: 42%;
}
.fee-limit {
  font-weight: 600;
  color: var(--g1);
}
.fee-sep {
  color: var(--g5);
  padding: 0 3mm;
}

/* ── Inline accents ─────────────────────────────────── */
strong.ph {
  color: var(--g1);
  font-weight: 600;
}
.email-accent {
  color: var(--orange);
  font-weight: 600;
}

/* ── Signature block ────────────────────────────────── */
.signature-section {
  margin-top: 12mm;
  padding-top: 5mm;
  border-top: 0.6pt solid var(--g5);
  break-inside: avoid;
  page-break-inside: avoid;
}
.signature-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 10mm;
}
.sig-label {
  font-size: 8pt;
  font-weight: 700;
  color: var(--orange);
  letter-spacing: 1.6pt;
  margin-bottom: 2mm;
}
.sig-company {
  font-weight: 600;
  font-size: 11.5pt;
  color: var(--g1);
  margin-bottom: 0.6mm;
}
.sig-rep {
  color: var(--g3);
  font-size: 10pt;
  margin-bottom: 18mm;
}
.sig-line {
  border-top: 0.6pt solid var(--g5);
  padding-top: 1.5mm;
  font-size: 8.5pt;
  color: var(--g3);
}
</style>
</head>
<body>

<div class="running-header">
  <img src="${logoDataUrl}" alt="Archie Recruitment">
</div>

<div class="title-block">
  <h1 class="title">Cooperation Agreement</h1>
  <div class="subtitle-row">
    Concluded on: <span class="ph">[Date]</span><span class="sep">|</span><span class="ph">[Place]</span>
  </div>
</div>

<div class="party">
  <div class="party-label">PARTY A — SOURCING AGENCY</div>
  <div class="party-name">Artur Seredziuk Archie Recruitment</div>
  <div class="party-line">ul. Rynek Solny 1/6, 22-400 Zamość, Poland</div>
  <div class="party-line"><span class="lbl">Represented by:</span> Artur Seredziuk</div>
  <div class="party-line"><span class="lbl">VAT ID:</span> PL9222957890 &nbsp;&nbsp; <span class="lbl">REGON:</span> 543460480</div>
  <div class="party-hereinafter">Hereinafter referred to as the <strong>"Sourcing Agency"</strong></div>
</div>

<div class="amp">&amp;</div>

<div class="party">
  <div class="party-label">PARTY B — EMPLOYER USER</div>
  <div class="party-name party-placeholder">[Company name]</div>
  <div class="party-line party-placeholder">[Street address], [Postal Code + Place]</div>
  <div class="party-line"><span class="lbl">Represented by:</span> <span class="party-placeholder">[Name]</span></div>
  <div class="party-line"><span class="lbl">VAT:</span> <span class="party-placeholder">[VAT ID]</span> &nbsp;&nbsp; <span class="lbl">Reg. No.:</span> <span class="party-placeholder">[KvK / CRN / equivalent]</span></div>
  <div class="party-hereinafter">Hereinafter referred to as the <strong>"Employer User"</strong></div>
</div>

<div class="collectively">Collectively referred to as the <strong>"Parties"</strong></div>

<p class="preamble">The Parties agree to conclude a new cooperation agreement. The previous contract is terminated, but commissions will be charged in accordance with this contract.</p>
<p>The Parties declare to have agreed the following:</p>

<h2 class="section">§1 — Subject of the Contract</h2>
<p>The Parties agree that the subject of this Agreement is to define cooperation in the search, acquisition and employment of temporary workers and to determine the rules for the provision of work by temporary workers.</p>
<p>Each time the Employer User provides the Sourcing Agency with information on the demand for temporary workers, the Parties will sign an "Understanding" determining:</p>
<ol class="lettered">
  <li data-letter="A">The type of work undertaken by the temporary agency worker(s);</li>
  <li data-letter="B">The number and qualifications of the temporary agency worker(s);</li>
  <li data-letter="C">The expected duration of employment;</li>
  <li data-letter="D">The expected working time;</li>
  <li data-letter="E">Place of temporary work;</li>
  <li data-letter="F">Remuneration for the work;</li>
  <li data-letter="H">Rules for granting leave to temporary employees.</li>
</ol>

<h2 class="section">§2 — Terms of Payment</h2>
<p>The Employer User is obliged to remunerate the Sourcing Agency for each employee provided. The commission (success fee) is classified as follows:</p>
<table class="fee">
  <thead>
    <tr><th>Level of Worker (per hourly wage)</th><th>Success Fee (per hour)</th></tr>
  </thead>
  <tbody>
    <tr>
      <td class="level">Professionals+</td>
      <td>€1.50 – €2.00 (discussed per profile)<span class="fee-sep">|</span><span class="fee-limit">1,500 hour limit</span></td>
    </tr>
  </tbody>
</table>
<ul class="clean">
  <li>The above rates are valid from <strong class="ph">[Date]</strong> and concern both the candidates already working and those who will be employed by the client in the future.</li>
  <li>The Sourcing Agency will receive the success fee for the period of time the Employer User has agreed to with their clients.</li>
  <li>Payment for each recruited candidate shall be made within <strong>30 calendar days</strong> after invoice issuing. Bank details as specified on each invoice issued by the Sourcing Agency.</li>
  <li>The Employer User is obliged to send the list of work hours every <strong>10th of the month</strong> to: <span class="email-accent">info@archie-recruitment.com</span>.</li>
</ul>

<h2 class="section">§3 — Duration of the Agreement</h2>
<ul class="clean">
  <li>This agreement shall come into effect on <strong class="ph">[Date]</strong>.</li>
  <li>This agreement is concluded for an <strong>indefinite period</strong>. It can be terminated by either party with a notice period of <strong>2 weeks</strong>. The Employer User is obliged to pay the remuneration indicated in §2 (Terms of Payment).</li>
</ul>

<h2 class="section">§4 — Rights and Obligations of the Employer User</h2>
<ul class="clean">
  <li>Timely payment of remuneration to the Sourcing Agency as set out in §2;</li>
  <li>Provide temporary workers with a job and workplace throughout their clients;</li>
  <li>Provide detailed and sufficient job descriptions;</li>
  <li>Provide all proposed candidates with feedback.</li>
</ul>

<h2 class="section">§5 — Rights and Duties of the Sourcing Agency</h2>
<ul class="clean">
  <li>Provision of temporary workers in accordance with the Understanding signed by the Parties;</li>
  <li>Preparing and providing the Employer User with relevant documentation of temporary employees in English/Dutch/Polish, including all personal data and qualification confirmations;</li>
  <li>Assist in organising or arranging travel for the candidate to the place of employment;</li>
  <li>Information concerning clients or outstanding vacancies of the Employer User will not be shared without written permission;</li>
  <li>The clients of the Employer User may not be contacted by the Sourcing Agency during the duration of this Agreement <strong>(§3)</strong> and for one year after termination. Violation will result in a <strong>€50,000 fine</strong>, payable effective immediately.</li>
</ul>

<h2 class="section">§6 — Law and Jurisdiction</h2>
<ul class="clean">
  <li>Any disputes arising under this Agreement shall be settled by the court competent for the place of the headquarters of the Employer User.</li>
  <li>Both parties undertake to keep confidential all information obtained during cooperation and to treat candidate personal data in accordance with the Data Protection Act.</li>
</ul>

<h2 class="section">§7 — Final Provisions</h2>
<ul class="clean">
  <li>This Agreement has been drawn up in two identical counterparts, one for each Party.</li>
  <li>Any changes to this Agreement shall be made in writing, under penalty of nullity.</li>
  <li>The Parties agree on the possibility of elaborating this Agreement through separate Understandings for specific tasks.</li>
</ul>

<h2 class="section">§8 — Confidentiality</h2>
<p>The Employer User will treat information provided by the Sourcing Agency in strict confidence, with due observance of the Personal Data Protection Act, and will only use it in the context of the Assignment. The Employer User will likewise treat information provided to it — including information regarding Candidates — in strict confidence and in accordance with applicable data protection law.</p>

<h2 class="section">§9 — Non-Discrimination</h2>
<p>Every Candidate will be treated equally by the Employer User and the Sourcing Agency regardless of age, religion, belief, political opinion, race, gender, nationality, sexual orientation, marital status, disability, or chronic illness, without prejudice to job-relevant requirements.</p>

<div class="signature-section">
  <div class="signature-grid">
    <div>
      <div class="sig-label">SOURCING AGENCY</div>
      <div class="sig-company">Archie Recruitment</div>
      <div class="sig-rep">Represented by: Artur Seredziuk</div>
      <div class="sig-line">Signature &amp; Date</div>
    </div>
    <div>
      <div class="sig-label">EMPLOYER USER</div>
      <div class="sig-company party-placeholder">[Company name]</div>
      <div class="sig-rep">Represented by: <span class="party-placeholder">[Name]</span></div>
      <div class="sig-line">Signature &amp; Date</div>
    </div>
  </div>
</div>

</body>
</html>
`;

fs.writeFileSync(HTML_PATH, html);
console.log(`HTML written: ${HTML_PATH}`);

// ───────── Render with Chrome headless ─────────
const chrome = findChrome();
const inputUrl = 'file:///' + HTML_PATH.replace(/\\/g, '/');
const args = [
  '--headless=new',
  '--disable-gpu',
  '--no-pdf-header-footer',
  '--virtual-time-budget=8000',
  `--print-to-pdf="${PDF_PATH}"`,
  `"${inputUrl}"`,
];

console.log('Rendering via Chrome…');
execSync(`"${chrome}" ${args.join(' ')}`, { stdio: 'inherit' });

const size = fs.statSync(PDF_PATH).size;
console.log(`PDF written: ${PDF_PATH} (${size} bytes)`);
