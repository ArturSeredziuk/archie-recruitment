// Generates contract-cooperation-agreement.docx with Archie Recruitment branding.
// Run from repo root: node scripts/generate-contract.js
//
// Requires the global `docx` package (npm install -g docx). The script resolves
// from the global node_modules dir so users don't need a local package.json.

const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

// Resolve `docx` from the global node_modules (works on Windows/macOS/Linux).
const globalRoot = execSync('npm root -g').toString().trim();
const docx = require(path.join(globalRoot, 'docx'));

const {
  Document, Packer, Paragraph, TextRun, Table, TableRow, TableCell, ImageRun,
  Header, Footer, AlignmentType, PageOrientation, LevelFormat, HeadingLevel,
  BorderStyle, WidthType, ShadingType, VerticalAlign, PageNumber, PageBreak,
} = docx;

// ───────── Brand tokens ─────────
const ORANGE       = "FF7A45";
const ORANGE_SOFT  = "FFE8DD";
const BLACK        = "0A0A0A";
const GREY_DARK    = "1A1A1A";
const GREY_BODY    = "3A3A3A";
const GREY_MUTED   = "6B6B6B";
const GREY_RULE    = "D4D4D4";

const FONT_SERIF = "Cambria";    // Instrument Serif fallback
const FONT_SANS  = "Calibri";    // Geist fallback

// ───────── Page (A4) ─────────
const PAGE_W       = 11906;
const PAGE_H       = 16838;
const MARGIN_TOP   = 1134;       // ~2cm
const MARGIN_BOT   = 1134;
const MARGIN_LEFT  = 1247;       // ~2.2cm
const MARGIN_RIGHT = 1247;
const CONTENT_W    = PAGE_W - MARGIN_LEFT - MARGIN_RIGHT;  // 9412 DXA

// ───────── Helpers ─────────
function run(text, opts = {}) {
  const { bold, italic, color = GREY_BODY, size = 20, font = FONT_SANS, underline } = opts;
  return new TextRun({ text, bold, italics: italic, color, size, font, underline: underline ? {} : undefined });
}

function body(text, opts = {}) {
  const { alignment, spacing = { after: 100, line: 280 }, indent, children } = opts;
  return new Paragraph({
    alignment,
    spacing,
    indent,
    children: children || [run(text, opts)],
  });
}

function sectionHeading(text) {
  return new Paragraph({
    spacing: { before: 320, after: 140, line: 280 },
    keepNext: true,
    keepLines: true,
    border: { bottom: { style: BorderStyle.SINGLE, size: 8, color: ORANGE, space: 4 } },
    children: [
      new TextRun({ text, bold: true, font: FONT_SERIF, size: 26, color: BLACK }),
    ],
  });
}

function bullet(text, opts = {}) {
  const { children, level = 0 } = opts;
  return new Paragraph({
    numbering: { reference: "bullets", level },
    spacing: { after: 60, line: 280 },
    children: children || [run(text, { size: 20, color: GREY_BODY })],
  });
}

function lettered(letter, text) {
  return new Paragraph({
    indent: { left: 720, hanging: 360 },
    spacing: { after: 60, line: 280 },
    children: [
      new TextRun({ text: `${letter}) `, bold: true, font: FONT_SANS, size: 20, color: ORANGE }),
      run(text, { size: 20, color: GREY_BODY }),
    ],
  });
}

// Party block: single-cell table with thick orange left border.
function partyBlock(label, contentChildren) {
  const inner = [
    new Paragraph({
      spacing: { after: 80 },
      children: [
        new TextRun({ text: label, bold: true, font: FONT_SANS, size: 18, color: ORANGE, characterSpacing: 30 }),
      ],
    }),
    ...contentChildren,
  ];

  const noBorder = { style: BorderStyle.NONE, size: 0, color: "FFFFFF" };
  const leftBorder = { style: BorderStyle.SINGLE, size: 24, color: ORANGE };

  return new Table({
    width: { size: CONTENT_W, type: WidthType.DXA },
    columnWidths: [CONTENT_W],
    borders: {
      top: noBorder, bottom: noBorder, right: noBorder, left: leftBorder,
      insideHorizontal: noBorder, insideVertical: noBorder,
    },
    rows: [
      new TableRow({
        children: [
          new TableCell({
            width: { size: CONTENT_W, type: WidthType.DXA },
            margins: { top: 120, bottom: 120, left: 280, right: 200 },
            borders: { top: noBorder, bottom: noBorder, right: noBorder, left: leftBorder },
            children: inner,
          }),
        ],
      }),
    ],
  });
}

// ───────── Content ─────────
const logoBuffer = fs.readFileSync(path.join(__dirname, '..', 'AR_black_tight.png'));

const partyA = partyBlock("PARTY A — SOURCING AGENCY", [
  new Paragraph({ spacing: { after: 40 }, children: [
    run("Artur Seredziuk Archie Recruitment", { bold: true, size: 22, color: GREY_DARK }),
  ]}),
  new Paragraph({ spacing: { after: 40 }, children: [
    run("ul. Rynek Solny 1/6, 22-400 Zamość, Poland", { size: 20, color: GREY_BODY }),
  ]}),
  new Paragraph({ spacing: { after: 40 }, children: [
    run("Represented by: ", { size: 20, color: GREY_MUTED }),
    run("Artur Seredziuk", { size: 20, color: GREY_BODY }),
  ]}),
  new Paragraph({ spacing: { after: 40 }, children: [
    run("VAT ID: ", { size: 20, color: GREY_MUTED }),
    run("PL9222957890", { size: 20, color: GREY_BODY }),
    run("    REGON: ", { size: 20, color: GREY_MUTED }),
    run("543460480", { size: 20, color: GREY_BODY }),
  ]}),
  new Paragraph({ spacing: { after: 0 }, children: [
    run("Hereinafter referred to as the ", { size: 20, italic: true, color: GREY_MUTED }),
    run("“Sourcing Agency”", { size: 20, italic: true, bold: true, color: GREY_BODY }),
  ]}),
]);

const partyB = partyBlock("PARTY B — EMPLOYER USER", [
  new Paragraph({ spacing: { after: 40 }, children: [
    run("[Company name]", { bold: true, size: 22, color: GREY_MUTED }),
  ]}),
  new Paragraph({ spacing: { after: 40 }, children: [
    run("[Street address], [Postal Code + Place]", { size: 20, color: GREY_MUTED }),
  ]}),
  new Paragraph({ spacing: { after: 40 }, children: [
    run("Represented by: ", { size: 20, color: GREY_MUTED }),
    run("[Name]", { size: 20, color: GREY_MUTED }),
  ]}),
  new Paragraph({ spacing: { after: 40 }, children: [
    run("VAT: ", { size: 20, color: GREY_MUTED }),
    run("[VAT ID]", { size: 20, color: GREY_MUTED }),
    run("    Reg. No.: ", { size: 20, color: GREY_MUTED }),
    run("[KvK / CRN / equivalent]", { size: 20, color: GREY_MUTED }),
  ]}),
  new Paragraph({ spacing: { after: 0 }, children: [
    run("Hereinafter referred to as the ", { size: 20, italic: true, color: GREY_MUTED }),
    run("“Employer User”", { size: 20, italic: true, bold: true, color: GREY_BODY }),
  ]}),
]);

// Fee table
const feeTable = new Table({
  width: { size: CONTENT_W, type: WidthType.DXA },
  columnWidths: [Math.floor(CONTENT_W * 0.45), Math.floor(CONTENT_W * 0.55)],
  rows: [
    // Header row
    new TableRow({
      tableHeader: true,
      children: [
        new TableCell({
          width: { size: Math.floor(CONTENT_W * 0.45), type: WidthType.DXA },
          shading: { fill: ORANGE, type: ShadingType.CLEAR, color: "auto" },
          margins: { top: 120, bottom: 120, left: 160, right: 160 },
          children: [new Paragraph({
            alignment: AlignmentType.LEFT,
            children: [new TextRun({ text: "Level of Worker (per hourly wage)", bold: true, color: "FFFFFF", font: FONT_SANS, size: 20 })],
          })],
        }),
        new TableCell({
          width: { size: Math.floor(CONTENT_W * 0.55), type: WidthType.DXA },
          shading: { fill: ORANGE, type: ShadingType.CLEAR, color: "auto" },
          margins: { top: 120, bottom: 120, left: 160, right: 160 },
          children: [new Paragraph({
            alignment: AlignmentType.LEFT,
            children: [new TextRun({ text: "Success Fee (per hour)", bold: true, color: "FFFFFF", font: FONT_SANS, size: 20 })],
          })],
        }),
      ],
    }),
    // Body row
    new TableRow({
      children: [
        new TableCell({
          width: { size: Math.floor(CONTENT_W * 0.45), type: WidthType.DXA },
          shading: { fill: ORANGE_SOFT, type: ShadingType.CLEAR, color: "auto" },
          margins: { top: 120, bottom: 120, left: 160, right: 160 },
          children: [new Paragraph({
            alignment: AlignmentType.LEFT,
            children: [new TextRun({ text: "Professionals+", bold: true, font: FONT_SANS, size: 20, color: GREY_DARK })],
          })],
        }),
        new TableCell({
          width: { size: Math.floor(CONTENT_W * 0.55), type: WidthType.DXA },
          margins: { top: 120, bottom: 120, left: 160, right: 160 },
          children: [new Paragraph({
            alignment: AlignmentType.LEFT,
            children: [
              new TextRun({ text: "€1.50 – €2.00 (discussed per profile)", font: FONT_SANS, size: 20, color: GREY_BODY }),
              new TextRun({ text: "    |    ", font: FONT_SANS, size: 20, color: GREY_RULE }),
              new TextRun({ text: "1,500 hour limit", bold: true, font: FONT_SANS, size: 20, color: GREY_DARK }),
            ],
          })],
        }),
      ],
    }),
  ],
});

// Signature block: two-column borderless table with signature lines
function signatureBlock() {
  const colW = Math.floor(CONTENT_W / 2);
  const noBorder = { style: BorderStyle.NONE, size: 0, color: "FFFFFF" };
  const cellBorders = { top: noBorder, bottom: noBorder, left: noBorder, right: noBorder };

  function col(party, company, repBy) {
    return new TableCell({
      width: { size: colW, type: WidthType.DXA },
      margins: { top: 80, bottom: 80, left: 0, right: 200 },
      borders: cellBorders,
      children: [
        new Paragraph({ spacing: { after: 80 }, children: [
          new TextRun({ text: party, bold: true, font: FONT_SANS, size: 18, color: ORANGE, characterSpacing: 30 }),
        ]}),
        new Paragraph({ spacing: { after: 30 }, children: [
          new TextRun({ text: company, bold: true, font: FONT_SANS, size: 22, color: GREY_DARK }),
        ]}),
        new Paragraph({ spacing: { after: 600 }, children: [
          new TextRun({ text: `Represented by: ${repBy}`, font: FONT_SANS, size: 20, color: GREY_BODY }),
        ]}),
        new Paragraph({
          spacing: { after: 40 },
          border: { top: { style: BorderStyle.SINGLE, size: 8, color: GREY_RULE, space: 4 } },
          children: [new TextRun({ text: "Signature & Date", font: FONT_SANS, size: 18, color: GREY_MUTED })],
        }),
      ],
    });
  }

  return new Table({
    width: { size: CONTENT_W, type: WidthType.DXA },
    columnWidths: [colW, colW],
    borders: {
      top: noBorder, bottom: noBorder, left: noBorder, right: noBorder,
      insideHorizontal: noBorder, insideVertical: noBorder,
    },
    rows: [
      new TableRow({
        children: [
          col("SOURCING AGENCY", "Archie Recruitment", "Artur Seredziuk"),
          col("EMPLOYER USER", "[Company name]", "[Name]"),
        ],
      }),
    ],
  });
}

// ───────── Build doc ─────────
const doc = new Document({
  creator: "Archie Recruitment",
  title: "Cooperation Agreement",
  description: "Archie Recruitment cooperation agreement template",
  styles: {
    default: {
      document: { run: { font: FONT_SANS, size: 20, color: GREY_BODY } },
    },
  },
  numbering: {
    config: [
      {
        reference: "bullets",
        levels: [
          { level: 0, format: LevelFormat.BULLET, text: "•", alignment: AlignmentType.LEFT,
            style: { paragraph: { indent: { left: 600, hanging: 280 } }, run: { color: ORANGE, font: FONT_SANS } } },
        ],
      },
    ],
  },
  sections: [
    {
      properties: {
        page: {
          size: { width: PAGE_W, height: PAGE_H, orientation: PageOrientation.PORTRAIT },
          margin: { top: MARGIN_TOP, bottom: MARGIN_BOT, left: MARGIN_LEFT, right: MARGIN_RIGHT, header: 600, footer: 600 },
        },
      },
      headers: {
        default: new Header({
          children: [
            new Paragraph({
              spacing: { after: 100 },
              border: { bottom: { style: BorderStyle.SINGLE, size: 6, color: ORANGE, space: 6 } },
              children: [
                new ImageRun({
                  type: "png",
                  data: logoBuffer,
                  transformation: { width: 110, height: 38 },
                  altText: { title: "Archie Recruitment", description: "Archie Recruitment logo", name: "ArchieRecruitmentLogo" },
                }),
              ],
            }),
          ],
        }),
      },
      footers: {
        default: new Footer({
          children: [
            new Paragraph({
              alignment: AlignmentType.CENTER,
              children: [
                new TextRun({ text: "COOPERATION AGREEMENT — Archie Recruitment | Confidential | Page ", font: FONT_SANS, size: 16, color: GREY_MUTED }),
                new TextRun({ children: [PageNumber.CURRENT], font: FONT_SANS, size: 16, color: GREY_MUTED }),
                new TextRun({ text: " of ", font: FONT_SANS, size: 16, color: GREY_MUTED }),
                new TextRun({ children: [PageNumber.TOTAL_PAGES], font: FONT_SANS, size: 16, color: GREY_MUTED }),
              ],
            }),
          ],
        }),
      },
      children: [
        // ── Title block ──
        new Paragraph({
          alignment: AlignmentType.LEFT,
          spacing: { before: 80, after: 60 },
          children: [
            new TextRun({ text: "COOPERATION AGREEMENT", bold: true, font: FONT_SERIF, size: 56, color: BLACK, characterSpacing: 6 }),
          ],
        }),
        new Paragraph({
          alignment: AlignmentType.LEFT,
          spacing: { after: 360 },
          border: { bottom: { style: BorderStyle.SINGLE, size: 6, color: GREY_RULE, space: 6 } },
          children: [
            new TextRun({ text: "Concluded on: ", font: FONT_SANS, size: 22, color: GREY_MUTED }),
            new TextRun({ text: "[Date]", bold: true, font: FONT_SANS, size: 22, color: GREY_DARK }),
            new TextRun({ text: "    |    ", font: FONT_SANS, size: 22, color: GREY_RULE }),
            new TextRun({ text: "[Place]", bold: true, font: FONT_SANS, size: 22, color: GREY_DARK }),
          ],
        }),

        // ── Party A ──
        partyA,

        // & divider
        new Paragraph({
          alignment: AlignmentType.CENTER,
          spacing: { before: 160, after: 160 },
          children: [
            new TextRun({ text: "&", bold: true, font: FONT_SERIF, size: 36, color: ORANGE }),
          ],
        }),

        // ── Party B ──
        partyB,

        new Paragraph({
          alignment: AlignmentType.CENTER,
          spacing: { before: 280, after: 240 },
          children: [
            run("Collectively referred to as the ", { italic: true, color: GREY_MUTED, size: 20 }),
            new TextRun({ text: "“Parties”", italics: true, bold: true, font: FONT_SANS, size: 20, color: GREY_BODY }),
          ],
        }),

        body("The Parties agree to conclude a new cooperation agreement. The previous contract is terminated, but commissions will be charged in accordance with this contract.", { italic: true, color: GREY_MUTED, spacing: { after: 120, line: 280 } }),
        body("The Parties declare to have agreed the following:", { color: GREY_BODY, spacing: { after: 200, line: 280 } }),

        // ── §1 ──
        sectionHeading("§1 — Subject of the Contract"),
        body("The Parties agree that the subject of this Agreement is to define cooperation in the search, acquisition and employment of temporary workers and to determine the rules for the provision of work by temporary workers."),
        body("Each time the Employer User provides the Sourcing Agency with information on the demand for temporary workers, the Parties will sign an “Understanding” determining:"),
        lettered("A", "The type of work undertaken by the temporary agency worker(s);"),
        lettered("B", "The number and qualifications of the temporary agency worker(s);"),
        lettered("C", "The expected duration of employment;"),
        lettered("D", "The expected working time;"),
        lettered("E", "Place of temporary work;"),
        lettered("F", "Remuneration for the work;"),
        lettered("H", "Rules for granting leave to temporary employees."),

        // ── §2 ──
        sectionHeading("§2 — Terms of Payment"),
        body("The Employer User is obliged to remunerate the Sourcing Agency for each employee provided. The commission (success fee) is classified as follows:", { spacing: { after: 160, line: 280 } }),
        feeTable,
        new Paragraph({ spacing: { after: 120 }, children: [run("", {})] }), // spacer
        bullet("", { children: [
          run("The above rates are valid from ", { size: 20, color: GREY_BODY }),
          run("[Date]", { bold: true, size: 20, color: GREY_DARK }),
          run(" and concern both the candidates already working and those who will be employed by the client in the future.", { size: 20, color: GREY_BODY }),
        ]}),
        bullet("The Sourcing Agency will receive the success fee for the period of time the Employer User has agreed to with their clients."),
        bullet("", { children: [
          run("Payment for each recruited candidate shall be made within ", { size: 20, color: GREY_BODY }),
          run("30 calendar days", { bold: true, size: 20, color: GREY_DARK }),
          run(" after invoice issuing. Bank details as specified on each invoice issued by the Sourcing Agency.", { size: 20, color: GREY_BODY }),
        ]}),
        bullet("", { children: [
          run("The Employer User is obliged to send the list of work hours every ", { size: 20, color: GREY_BODY }),
          run("10th of the month", { bold: true, size: 20, color: GREY_DARK }),
          run(" to: ", { size: 20, color: GREY_BODY }),
          run("info@archie-recruitment.com", { bold: true, size: 20, color: ORANGE }),
          run(".", { size: 20, color: GREY_BODY }),
        ]}),

        // ── §3 ──
        sectionHeading("§3 — Duration of the Agreement"),
        bullet("", { children: [
          run("This agreement shall come into effect on ", { size: 20, color: GREY_BODY }),
          run("[Date]", { bold: true, size: 20, color: GREY_DARK }),
          run(".", { size: 20, color: GREY_BODY }),
        ]}),
        bullet("", { children: [
          run("This agreement is concluded for an ", { size: 20, color: GREY_BODY }),
          run("indefinite period", { bold: true, size: 20, color: GREY_DARK }),
          run(". It can be terminated by either party with a notice period of ", { size: 20, color: GREY_BODY }),
          run("2 weeks", { bold: true, size: 20, color: GREY_DARK }),
          run(". The Employer User is obliged to pay the remuneration indicated in §2 (Terms of Payment).", { size: 20, color: GREY_BODY }),
        ]}),

        // ── §4 ──
        sectionHeading("§4 — Rights and Obligations of the Employer User"),
        bullet("Timely payment of remuneration to the Sourcing Agency as set out in §2;"),
        bullet("Provide temporary workers with a job and workplace throughout their clients;"),
        bullet("Provide detailed and sufficient job descriptions;"),
        bullet("Provide all proposed candidates with feedback."),

        // ── §5 ──
        sectionHeading("§5 — Rights and Duties of the Sourcing Agency"),
        bullet("Provision of temporary workers in accordance with the Understanding signed by the Parties;"),
        bullet("Preparing and providing the Employer User with relevant documentation of temporary employees in English/Dutch/Polish, including all personal data and qualification confirmations;"),
        bullet("Assist in organising or arranging travel for the candidate to the place of employment;"),
        bullet("Information concerning clients or outstanding vacancies of the Employer User will not be shared without written permission;"),
        bullet("", { children: [
          run("The clients of the Employer User may not be contacted by the Sourcing Agency during the duration of this Agreement ", { size: 20, color: GREY_BODY }),
          run("(§3)", { bold: true, size: 20, color: GREY_DARK }),
          run(" and for one year after termination. Violation will result in a ", { size: 20, color: GREY_BODY }),
          run("€50,000 fine", { bold: true, size: 20, color: GREY_DARK }),
          run(", payable effective immediately.", { size: 20, color: GREY_BODY }),
        ]}),

        // ── §6 ──
        sectionHeading("§6 — Law and Jurisdiction"),
        bullet("Any disputes arising under this Agreement shall be settled by the court competent for the place of the headquarters of the Employer User."),
        bullet("Both parties undertake to keep confidential all information obtained during cooperation and to treat candidate personal data in accordance with the Data Protection Act."),

        // ── §7 ──
        sectionHeading("§7 — Final Provisions"),
        bullet("This Agreement has been drawn up in two identical counterparts, one for each Party."),
        bullet("Any changes to this Agreement shall be made in writing, under penalty of nullity."),
        bullet("The Parties agree on the possibility of elaborating this Agreement through separate Understandings for specific tasks."),

        // ── §8 ──
        sectionHeading("§8 — Confidentiality"),
        body("The Employer User will treat information provided by the Sourcing Agency in strict confidence, with due observance of the Personal Data Protection Act, and will only use it in the context of the Assignment. The Employer User will likewise treat information provided to it — including information regarding Candidates — in strict confidence and in accordance with applicable data protection law."),

        // ── §9 ──
        sectionHeading("§9 — Non-Discrimination"),
        body("Every Candidate will be treated equally by the Employer User and the Sourcing Agency regardless of age, religion, belief, political opinion, race, gender, nationality, sexual orientation, marital status, disability, or chronic illness, without prejudice to job-relevant requirements."),

        // ── Signature block ──
        new Paragraph({
          spacing: { before: 480, after: 240 },
          border: { top: { style: BorderStyle.SINGLE, size: 6, color: GREY_RULE, space: 6 } },
          children: [run("", {})],
        }),
        signatureBlock(),
      ],
    },
  ],
});

// ───────── Pack ─────────
const outDir = path.join(__dirname, '..', 'contracts');
if (!fs.existsSync(outDir)) fs.mkdirSync(outDir, { recursive: true });
const outPath = path.join(outDir, 'cooperation-agreement.docx');
Packer.toBuffer(doc).then(buf => {
  fs.writeFileSync(outPath, buf);
  console.log(`OK → ${outPath} (${buf.length} bytes)`);
}).catch(err => {
  console.error('Generation failed:', err);
  process.exit(1);
});
