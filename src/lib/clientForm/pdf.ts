// Renders a completed questionnaire to a downloadable PDF that mirrors the
// firm's original letterhead document.
//
// jsPDF is ~350 KB, so it is dynamically imported inside the download handler:
// the admin bundle only pays for it when someone actually clicks Download.

import {
  FORM_SECTIONS,
  displayValue,
  isBlank,
  isFieldVisible,
  isTableRows,
  rowHasContent,
  type FieldDef,
  type FormValues,
} from "./schema";

export interface QuestionnaireRecord {
  id: string;
  email: string;
  status: string;
  data: FormValues;
  /** Absent on the client-facing copy, which never loads the started date. */
  created_at?: string;
  updated_at: string;
  submitted_at: string | null;
  schema_version: number;
}

// Letter portrait, in points.
const PAGE_MARGIN = 54;
/** Room reserved at the top of every page for the letterhead block. */
const CONTENT_TOP = 118;
/** Room reserved at the bottom for the page number. */
const CONTENT_BOTTOM = 56;

const NAVY: [number, number, number] = [11, 28, 62];
const GOLD: [number, number, number] = [197, 164, 126];
const GREY: [number, number, number] = [90, 98, 112];
const LIGHT: [number, number, number] = [150, 156, 168];

const LETTERHEAD = [
  "Anchor Business Valuations & Financial Services, LLC",
  "365 Fifth Avenue South, Naples, FL 34102",
  "O: (239) 919-3092 • C: (312) 632-9144",
  "info@anchorbvfs.com",
];

function safeFilePart(value: string): string {
  return (
    value
      .replace(/[^a-zA-Z0-9._-]/g, "-")
      .replace(/-+/g, "-")
      .replace(/^-|-$/g, "")
      .slice(0, 60) || "questionnaire"
  );
}

/** Prefer the company name the client typed; fall back to their email. */
function subjectName(record: QuestionnaireRecord): string {
  const company = record.data?.b_legal_name;
  if (typeof company === "string" && company.trim()) return company.trim();
  return record.email.split("@")[0];
}

/**
 * Builds the document and returns it with its filename. Kept separate from the
 * download so the rendering can be exercised without a browser.
 */
export async function buildQuestionnairePdf(
  record: QuestionnaireRecord,
  options: { includeBlanks?: boolean } = {},
) {
  const { includeBlanks = false } = options;

  const [{ jsPDF }, { default: autoTable }] = await Promise.all([
    import("jspdf"),
    import("jspdf-autotable"),
  ]);

  const doc = new jsPDF({ unit: "pt", format: "letter", compress: true });
  const pageWidth = doc.internal.pageSize.getWidth();
  const pageHeight = doc.internal.pageSize.getHeight();
  const contentWidth = pageWidth - PAGE_MARGIN * 2;
  const bottomLimit = pageHeight - CONTENT_BOTTOM;

  let y = CONTENT_TOP;

  const newPage = () => {
    doc.addPage();
    y = CONTENT_TOP;
  };

  /** Start a new page unless `needed` points still fit on this one. */
  const ensure = (needed: number) => {
    if (y + needed > bottomLimit) newPage();
  };

  const writeWrapped = (
    text: string,
    fontSize: number,
    style: "normal" | "bold",
    color: [number, number, number],
    lineHeight: number,
    indent = 0,
  ) => {
    doc.setFont("helvetica", style);
    doc.setFontSize(fontSize);
    doc.setTextColor(...color);

    const lines: string[] = doc.splitTextToSize(text, contentWidth - indent);
    for (const line of lines) {
      ensure(lineHeight);
      doc.text(line, PAGE_MARGIN + indent, y);
      y += lineHeight;
    }
  };

  // --- Title block ---------------------------------------------------------

  doc.setFont("helvetica", "bold");
  doc.setFontSize(15);
  doc.setTextColor(...NAVY);
  doc.text("COMPANY INFORMATIONAL QUESTIONNAIRE", PAGE_MARGIN, y);
  y += 20;

  doc.setDrawColor(...GOLD);
  doc.setLineWidth(2);
  doc.line(PAGE_MARGIN, y, PAGE_MARGIN + 150, y);
  y += 22;

  const metaRows: Array<[string, string]> = [
    ["Company", subjectName(record)],
    ["Submitted by", record.email],
    [
      "Status",
      record.status === "submitted"
        ? `Submitted ${record.submitted_at ? new Date(record.submitted_at).toLocaleString() : ""}`
        : `Draft — last updated ${new Date(record.updated_at).toLocaleString()}`,
    ],
    ["Exported", new Date().toLocaleString()],
  ];

  if (record.created_at) {
    metaRows.splice(3, 0, [
      "Started",
      new Date(record.created_at).toLocaleString(),
    ]);
  }

  for (const [label, value] of metaRows) {
    ensure(14);
    doc.setFont("helvetica", "bold");
    doc.setFontSize(9);
    doc.setTextColor(...GREY);
    doc.text(`${label}:`, PAGE_MARGIN, y);
    doc.setFont("helvetica", "normal");
    doc.setTextColor(40, 40, 40);
    const valueLines: string[] = doc.splitTextToSize(value, contentWidth - 90);
    doc.text(valueLines[0] ?? "", PAGE_MARGIN + 84, y);
    y += 14;
  }

  y += 10;

  // --- Sections ------------------------------------------------------------

  const values = record.data ?? {};

  for (const section of FORM_SECTIONS) {
    const fields = section.fields
      .filter((field) => isFieldVisible(field, values))
      .filter((field) => includeBlanks || !isBlank(values[field.key]));

    if (fields.length === 0) continue;

    // Keep a heading with at least the start of its first answer.
    ensure(64);
    y += 6;
    doc.setFont("helvetica", "bold");
    doc.setFontSize(12);
    doc.setTextColor(...NAVY);
    doc.text(
      `${section.letter}. ${section.title.toUpperCase()}`,
      PAGE_MARGIN,
      y,
    );
    y += 8;
    doc.setDrawColor(...GOLD);
    doc.setLineWidth(1);
    doc.line(PAGE_MARGIN, y, pageWidth - PAGE_MARGIN, y);
    y += 16;

    for (const field of fields) {
      const value = values[field.key] ?? null;

      writeWrapped(field.label, 9.5, "bold", GREY, 12);
      y += 2;

      if (field.type === "table" && isTableRows(value)) {
        renderTable(field, value.filter(rowHasContent));
      } else {
        const answer = isBlank(value) ? "—" : displayValue(field, value);
        writeWrapped(answer, 10, "normal", [25, 25, 25], 13, 10);
      }

      y += 10;
    }
  }

  /** autoTable manages its own pagination; re-sync `y` from where it ended. */
  function renderTable(field: FieldDef, rows: Record<string, string>[]) {
    const columns = field.columns || [];
    if (rows.length === 0) {
      writeWrapped("—", 10, "normal", [25, 25, 25], 13, 10);
      return;
    }

    autoTable(doc, {
      startY: y,
      margin: {
        top: CONTENT_TOP,
        bottom: CONTENT_BOTTOM,
        left: PAGE_MARGIN,
        right: PAGE_MARGIN,
      },
      head: [columns.map((column) => column.label)],
      body: rows.map((row) => columns.map((column) => row[column.key] || "")),
      styles: {
        font: "helvetica",
        fontSize: 9,
        cellPadding: 5,
        overflow: "linebreak",
        lineColor: [225, 229, 235],
        lineWidth: 0.5,
      },
      headStyles: {
        fillColor: [244, 246, 249],
        textColor: NAVY,
        fontStyle: "bold",
        fontSize: 8.5,
      },
      theme: "grid",
    });

    const finalY = (doc as unknown as { lastAutoTable?: { finalY: number } })
      .lastAutoTable?.finalY;
    y = (finalY ?? y) + 6;
  }

  // --- Letterhead and page numbers, once the page count is known -----------

  const pageCount = doc.getNumberOfPages();
  for (let page = 1; page <= pageCount; page++) {
    doc.setPage(page);

    doc.setFont("helvetica", "bold");
    doc.setFontSize(9);
    doc.setTextColor(...NAVY);
    doc.text(LETTERHEAD[0], pageWidth / 2, 44, { align: "center" });

    doc.setFont("helvetica", "normal");
    doc.setFontSize(8);
    doc.setTextColor(...GREY);
    LETTERHEAD.slice(1).forEach((line, index) => {
      doc.text(line, pageWidth / 2, 56 + index * 10, { align: "center" });
    });

    doc.setDrawColor(...GOLD);
    doc.setLineWidth(0.75);
    doc.line(PAGE_MARGIN, 92, pageWidth - PAGE_MARGIN, 92);

    doc.setFontSize(8);
    doc.setTextColor(...LIGHT);
    doc.text(
      `${page} | Page`,
      pageWidth - PAGE_MARGIN,
      pageHeight - 30,
      { align: "right" },
    );
    doc.text(
      "Company Informational Questionnaire",
      PAGE_MARGIN,
      pageHeight - 30,
    );
  }

  const stamp = (record.submitted_at ?? record.updated_at).slice(0, 10);
  const filename = `Questionnaire-${safeFilePart(subjectName(record))}-${stamp}.pdf`;

  return { doc, filename };
}

export async function downloadQuestionnairePdf(
  record: QuestionnaireRecord,
  options: { includeBlanks?: boolean } = {},
): Promise<void> {
  const { doc, filename } = await buildQuestionnairePdf(record, options);
  doc.save(filename);
}
