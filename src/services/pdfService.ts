/** Geração de PDF isolada: recebe HTML do editor e produz um A4 profissional. */
export interface PdfOptions {
  header?: string;
  footer?: string;
  fileName?: string;
}

interface Block {
  text: string;
  style: "h1" | "h2" | "p" | "li";
}

function htmlToBlocks(html: string): Block[] {
  const doc = new DOMParser().parseFromString(`<div>${html}</div>`, "text/html");
  const blocks: Block[] = [];
  doc.querySelectorAll("h1, h2, h3, p, li").forEach((el) => {
    const text = (el.textContent ?? "").replace(/\s+/g, " ").trim();
    if (!text) return;
    const tag = el.tagName.toLowerCase();
    blocks.push({
      text,
      style: tag === "h1" ? "h1" : tag === "h2" || tag === "h3" ? "h2" : tag === "li" ? "li" : "p",
    });
  });
  return blocks;
}

export async function generatePdf(html: string, options: PdfOptions = {}): Promise<void> {
  const { jsPDF } = await import("jspdf");
  const blocks = htmlToBlocks(html);
  if (!blocks.length) throw new Error("O documento está vazio.");

  const pdf = new jsPDF({ unit: "mm", format: "a4" });
  const pageWidth = 210;
  const pageHeight = 297;
  const margin = { top: 25, bottom: 22, left: 22, right: 22 };
  const maxWidth = pageWidth - margin.left - margin.right;
  let y = margin.top;
  let page = 1;

  const drawChrome = () => {
    pdf.setFont("helvetica", "normal");
    pdf.setFontSize(8);
    pdf.setTextColor(130);
    if (options.header) pdf.text(options.header, margin.left, 14);
    const footer = options.footer ? `${options.footer}  ·  Página ${page}` : `Página ${page}`;
    pdf.text(footer, pageWidth / 2, pageHeight - 12, { align: "center" });
    pdf.setTextColor(20);
  };

  const newPage = () => {
    pdf.addPage();
    page += 1;
    y = margin.top;
    drawChrome();
  };

  drawChrome();

  for (const block of blocks) {
    const config = {
      h1: { size: 15, style: "bold" as const, spaceBefore: 4, spaceAfter: 7, align: "center" as const },
      h2: { size: 11, style: "bold" as const, spaceBefore: 6, spaceAfter: 3, align: "left" as const },
      p: { size: 10.5, style: "normal" as const, spaceBefore: 0, spaceAfter: 3.5, align: "justify" as const },
      li: { size: 10.5, style: "normal" as const, spaceBefore: 0, spaceAfter: 2, align: "left" as const },
    }[block.style];

    pdf.setFont("helvetica", config.style);
    pdf.setFontSize(config.size);
    const text = block.style === "li" ? `•  ${block.text}` : block.text;
    const lines = pdf.splitTextToSize(text, maxWidth) as string[];
    const lineHeight = config.size * 0.52;

    y += config.spaceBefore;
    for (const line of lines) {
      if (y + lineHeight > pageHeight - margin.bottom) newPage();
      const x = config.align === "center" ? pageWidth / 2 : margin.left;
      pdf.text(line, x, y, {
        align: config.align === "center" ? "center" : "left",
        maxWidth,
      });
      y += lineHeight;
    }
    y += config.spaceAfter;
  }

  pdf.save(`${(options.fileName ?? "documento").replace(/[^\w\-À-ÿ ]+/g, "").trim() || "documento"}.pdf`);
}
