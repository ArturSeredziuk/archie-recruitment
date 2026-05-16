// Generates banner_archie.png (1584×396 — LinkedIn cover) from an inline HTML
// template, using the user's installed Chrome in headless screenshot mode.
//
// Run from repo root: node scripts/generate-banner.js
//
// No npm deps. Uses only Node built-ins + the existing Chrome binary.

const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

const ROOT = path.resolve(__dirname, '..');
const LOGO_PATH = path.join(ROOT, 'AR_black_tight.png');
const HTML_PATH = path.join(ROOT, 'banner_archie.html');
const PNG_PATH = path.join(ROOT, 'banner_archie.png');

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
<title>Archie Recruitment — LinkedIn banner</title>
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link href="https://fonts.googleapis.com/css2?family=Instrument+Serif:ital@0;1&family=Geist:wght@300;400;500;600;700&display=swap" rel="stylesheet">
<style>
* { box-sizing: border-box; margin: 0; padding: 0; }
html, body { width: 1584px; height: 396px; overflow: hidden; }

.banner {
  width: 1584px;
  height: 396px;
  position: relative;
  background: #f7f6f2;
  background-image:
    radial-gradient(circle at 15% 50%, rgba(255,180,84,.10) 0%, transparent 45%),
    radial-gradient(circle at 85% 60%, rgba(255,92,138,.10) 0%, transparent 45%),
    linear-gradient(135deg, #faf8f3 0%, #f3efe6 100%);
  display: flex;
  align-items: center;
  padding: 0 110px 0 230px;
  font-family: 'Geist', system-ui, -apple-system, sans-serif;
  -webkit-font-smoothing: antialiased;
}

/* bottom gradient rule */
.banner::after {
  content: '';
  position: absolute;
  bottom: 0; left: 0; right: 0;
  height: 6px;
  background: linear-gradient(100deg, #ff5c8a 0%, #ff7a45 50%, #ffb454 100%);
}

.logo {
  height: 168px;
  width: auto;
  margin-right: 110px;
  flex-shrink: 0;
}

.content { flex: 1; }

.eyebrow {
  font-family: 'Geist', system-ui, sans-serif;
  font-size: 15px;
  font-weight: 600;
  letter-spacing: 0.22em;
  color: #ff7a45;
  margin-bottom: 18px;
  text-transform: uppercase;
}

.title {
  font-family: 'Instrument Serif', Georgia, serif;
  font-weight: 400;
  font-size: 68px;
  line-height: 1.05;
  color: #0a0a0a;
  margin-bottom: 22px;
  letter-spacing: -0.005em;
}

.title em {
  font-style: italic;
  background: linear-gradient(100deg, #ff5c8a 0%, #ff7a45 50%, #ffb454 100%);
  -webkit-background-clip: text;
  background-clip: text;
  -webkit-text-fill-color: transparent;
  color: transparent;
}

.body {
  font-family: 'Geist', system-ui, sans-serif;
  font-size: 18px;
  font-weight: 400;
  color: #6b6b6b;
  line-height: 1.55;
  max-width: 820px;
}

.body strong {
  color: #1a1a1a;
  font-weight: 600;
}

.dot {
  color: #d4d4d4;
  padding: 0 8px;
}
</style>
</head>
<body>
<div class="banner">
  <img src="${logoDataUrl}" alt="Archie Recruitment" class="logo">
  <div class="content">
    <div class="eyebrow">Archie Recruitment</div>
    <div class="title">Hiring on the Dutch market,<br><em>fully outsourced.</em></div>
    <div class="body">Outsourced recruitment for the Netherlands <span class="dot">·</span> <strong>5+ years</strong> in the industry <span class="dot">·</span> <strong>300+ placements</strong> that actually started.</div>
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
  '--hide-scrollbars',
  '--default-background-color=00000000',
  '--virtual-time-budget=8000',
  '--window-size=1584,396',
  `--screenshot="${PNG_PATH}"`,
  `"${inputUrl}"`,
];

console.log('Rendering via Chrome…');
execSync(`"${chrome}" ${args.join(' ')}`, { stdio: 'inherit', cwd: ROOT });

if (!fs.existsSync(PNG_PATH)) {
  throw new Error(`PNG not produced at ${PNG_PATH}`);
}
const size = fs.statSync(PNG_PATH).size;
console.log(`PNG written: ${PNG_PATH} (${size} bytes)`);

// Clean up the intermediate HTML file
fs.unlinkSync(HTML_PATH);
console.log(`Cleaned up: ${HTML_PATH}`);
