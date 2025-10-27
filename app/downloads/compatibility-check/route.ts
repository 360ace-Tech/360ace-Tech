import { NextResponse } from 'next/server';
import { PDFDocument, StandardFonts, rgb } from 'pdf-lib';
import { company, services, differentiators, process as deliveryProcess } from '@/lib/site-content';

export const runtime = 'nodejs';

export async function GET() {
  const pdf = await PDFDocument.create();
  const page = pdf.addPage([595.28, 841.89]); // A4 portrait
  const { width } = page.getSize();
  const margin = 48;
  const font = await pdf.embedFont(StandardFonts.Helvetica);
  const fontBold = await pdf.embedFont(StandardFonts.HelveticaBold);

  let y = 841.89 - margin;
  const sanitize = (t: string) =>
    t
      .replace(/[☐]/g, '[ ]')
      .replace(/[•]/g, '*')
      .replace(/[–—]/g, '-')
      .replace(/[“”]/g, '"')
      .replace(/[‘’]/g, "'");

  const drawText = (text: string, opts: { size?: number; bold?: boolean; color?: [number, number, number] } = {}) => {
    const size = opts.size ?? 12;
    const usedFont = opts.bold ? fontBold : font;
    const color = opts.color ? rgb(opts.color[0], opts.color[1], opts.color[2]) : rgb(1, 1, 1);
    const lines = text.split('\n');
    for (const line of lines) {
      y -= size + 4;
      page.drawText(sanitize(line), { x: margin, y, size, font: usedFont, color });
    }
  };

  // Background
  page.drawRectangle({ x: 0, y: 0, width, height: 841.89, color: rgb(0.05, 0.05, 0.07) });

  // Header
  drawText(`${company.name} - Compatibility Check`, { size: 18, bold: true, color: [0.82, 0.88, 1] });
  drawText(company.tagline, { size: 12, color: [0.78, 0.78, 0.85] });
  y -= 8;
  page.drawLine({ start: { x: margin, y }, end: { x: width - margin, y }, thickness: 1, color: rgb(0.18, 0.2, 0.28) });

  // Company fit
  y -= 12;
  drawText('Business Fit Checklist', { size: 14, bold: true, color: [0.9, 0.9, 0.9] });
  const fitItems = [
    'Clear product or platform ownership with a small, empowered decision group.',
    'Executive sponsor and engineering lead aligned on reliability and delivery goals.',
    'Appetite for paved-path developer experience (golden paths, templates, guardrails).',
    'Regulatory or uptime constraints where SRE practices materially improve outcomes.',
  ];
  for (const item of fitItems) drawText(`[ ] ${item}`, { size: 11, color: [0.86, 0.86, 0.9] });

  // Services
  y -= 8;
  drawText('Capabilities (What we do)', { size: 14, bold: true, color: [0.9, 0.9, 0.9] });
  for (const svc of services) {
    drawText(`- ${svc.name}`, { size: 12, bold: true });
    for (const o of svc.outcomes) drawText(`   - ${o}`, { size: 11, color: [0.86, 0.86, 0.9] });
    y -= 6;
  }

  // Delivery process
  y -= 4;
  drawText('Delivery Process', { size: 14, bold: true, color: [0.9, 0.9, 0.9] });
  for (const p of deliveryProcess) drawText(`- ${p.id}. ${p.title} - ${p.heading}`, { size: 11, color: [0.86, 0.86, 0.9] });

  // Differentiators
  y -= 6;
  drawText('Why teams choose us', { size: 14, bold: true, color: [0.9, 0.9, 0.9] });
  for (const d of differentiators) drawText(`- ${d.title}: ${d.description}`, { size: 11, color: [0.86, 0.86, 0.9] });

  // Footer
  y = Math.max(y, 64);
  page.drawLine({ start: { x: margin, y }, end: { x: width - margin, y }, thickness: 1, color: rgb(0.18, 0.2, 0.28) });
  drawText(`Contact: ${company.contactEmail}`, { size: 10, color: [0.78, 0.78, 0.85] });

  const bytes = await pdf.save();
  return new NextResponse(Buffer.from(bytes), {
    status: 200,
    headers: {
      'Content-Type': 'application/pdf',
      'Content-Disposition': 'attachment; filename="compatibility-check.pdf"',
      'Cache-Control': 'no-store',
    },
  });
}
