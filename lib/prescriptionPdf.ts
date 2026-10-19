import { PDFDocument, StandardFonts, rgb, PDFFont, PDFPage } from 'pdf-lib';
import {
  Prescription,
  CLINIC_INFO,
  describeTiming,
  formatRxDate,
} from './prescriptionTemplate';

// A4 in PDF points
const PAGE_W = 595.28;
const PAGE_H = 841.89;
const MARGIN = 42;
const CONTENT_W = PAGE_W - MARGIN * 2;

const INDIGO = rgb(0.216, 0.188, 0.639); // #3730A3
const BRAND = rgb(0.337, 0.353, 0.812); // #565ACF
const ORANGE = rgb(0.918, 0.345, 0.047); // #EA580C
const INK = rgb(0.122, 0.161, 0.216); // #1F2937
const GRAY = rgb(0.42, 0.447, 0.502); // #6B7280
const LIGHT = rgb(0.898, 0.906, 0.922); // #E5E7EB
const TINT = rgb(0.961, 0.965, 1); // #F5F6FF
const HEAD_BG = rgb(0.933, 0.941, 1); // #EEF0FF

/** Standard PDF fonts only cover Latin text; drop anything the font can't draw so the PDF never fails. */
function clean(text: string, font: PDFFont): string {
  const supported = font.getCharacterSet();
  let out = '';
  for (const ch of String(text ?? '').replace(/\t/g, ' ')) {
    if (ch === '\n') {
      out += ch;
      continue;
    }
    if (ch === '\u2019' || ch === '\u2018') out += "'";
    else if (ch === '\u201C' || ch === '\u201D') out += '"';
    else if (ch === '\u20B9') out += 'Rs.';
    else if (supported.includes(ch.codePointAt(0)!)) out += ch;
  }
  return out;
}

function wrap(text: string, font: PDFFont, size: number, maxWidth: number): string[] {
  const lines: string[] = [];
  for (const paragraph of clean(text, font).split('\n')) {
    const words = paragraph.split(/\s+/).filter(Boolean);
    if (words.length === 0) {
      lines.push('');
      continue;
    }
    let line = '';
    for (const word of words) {
      const test = line ? `${line} ${word}` : word;
      if (font.widthOfTextAtSize(test, size) <= maxWidth) {
        line = test;
      } else {
        if (line) lines.push(line);
        // very long single word: hard-split
        let w = word;
        while (font.widthOfTextAtSize(w, size) > maxWidth && w.length > 1) {
          let cut = w.length - 1;
          while (cut > 1 && font.widthOfTextAtSize(w.slice(0, cut), size) > maxWidth) cut--;
          lines.push(w.slice(0, cut));
          w = w.slice(cut);
        }
        line = w;
      }
    }
    if (line) lines.push(line);
  }
  return lines;
}

export async function generatePrescriptionPdf(rx: Prescription): Promise<Uint8Array> {
  const pdf = await PDFDocument.create();
  pdf.setTitle(`Prescription - ${clean(rx.patientName, await pdf.embedFont(StandardFonts.Helvetica))}`);
  pdf.setAuthor(CLINIC_INFO.doctorName);

  const regular = await pdf.embedFont(StandardFonts.Helvetica);
  const bold = await pdf.embedFont(StandardFonts.HelveticaBold);
  const serifItalic = await pdf.embedFont(StandardFonts.TimesRomanBoldItalic);

  let page: PDFPage = pdf.addPage([PAGE_W, PAGE_H]);
  let y = PAGE_H - MARGIN;

  const newPage = () => {
    page = pdf.addPage([PAGE_W, PAGE_H]);
    y = PAGE_H - MARGIN;
  };
  const ensure = (needed: number) => {
    if (y - needed < MARGIN + 60) newPage();
  };
  const text = (
    value: string,
    x: number,
    yy: number,
    opts: { font?: PDFFont; size?: number; color?: ReturnType<typeof rgb> } = {}
  ) => {
    const font = opts.font || regular;
    const t = clean(value, font);
    if (t) page.drawText(t, { x, y: yy, size: opts.size || 10, font, color: opts.color || INK });
  };

  // ---------- Letterhead ----------
  text(CLINIC_INFO.doctorName, MARGIN, y - 18, { font: bold, size: 20, color: INDIGO });
  const qualLines = wrap(CLINIC_INFO.qualification, regular, 8.5, CONTENT_W * 0.55);
  let hy = y - 33;
  qualLines.forEach((l) => {
    text(l, MARGIN, hy, { size: 8.5, color: GRAY });
    hy -= 11;
  });
  text(CLINIC_INFO.clinicName, MARGIN, hy - 1, { font: bold, size: 10, color: ORANGE });
  const leftBottom = hy - 8;

  const rightX = PAGE_W - MARGIN;
  let ry = y - 14;
  const addrLines = wrap(CLINIC_INFO.address, regular, 8.5, CONTENT_W * 0.38);
  [...addrLines, `Phone: ${CLINIC_INFO.phone}`].forEach((l) => {
    const t = clean(l, regular);
    page.drawText(t, {
      x: rightX - regular.widthOfTextAtSize(t, 8.5),
      y: ry,
      size: 8.5,
      font: regular,
      color: GRAY,
    });
    ry -= 11;
  });

  y = Math.min(leftBottom, ry) - 6;
  page.drawRectangle({ x: MARGIN, y, width: CONTENT_W, height: 2.5, color: BRAND });
  y -= 16;

  // ---------- Patient box ----------
  const boxH = 44;
  page.drawRectangle({
    x: MARGIN,
    y: y - boxH,
    width: CONTENT_W,
    height: boxH,
    color: TINT,
    borderColor: rgb(0.875, 0.886, 0.984),
    borderWidth: 0.8,
  });
  const cols = [
    { label: 'Patient', value: rx.patientName || '-', x: MARGIN + 12 },
    { label: 'Age', value: rx.patientAge ? `${rx.patientAge} yrs` : '-', x: MARGIN + 215 },
    { label: 'Phone', value: rx.patientPhone || '-', x: MARGIN + 290 },
  ];
  cols.forEach((c) => {
    text(c.label, c.x, y - 15, { size: 8, color: GRAY });
    text(c.value, c.x, y - 31, { font: bold, size: 10.5 });
  });
  const dateStr = clean(formatRxDate(rx.date), bold);
  text('Date', PAGE_W - MARGIN - 12 - bold.widthOfTextAtSize(dateStr, 10.5), y - 15, { size: 8, color: GRAY });
  text(dateStr, PAGE_W - MARGIN - 12 - bold.widthOfTextAtSize(dateStr, 10.5), y - 31, { font: bold, size: 10.5 });
  y -= boxH + 16;

  // ---------- Diagnosis ----------
  if (rx.diagnosis.trim()) {
    text('COMPLAINTS / DIAGNOSIS', MARGIN, y - 8, { font: bold, size: 8, color: GRAY });
    y -= 22;
    wrap(rx.diagnosis, regular, 10.5, CONTENT_W).forEach((l) => {
      ensure(14);
      text(l, MARGIN, y, { size: 10.5 });
      y -= 14;
    });
    y -= 6;
  }

  // ---------- Rx table ----------
  text('Rx', MARGIN, y - 20, { font: serifItalic, size: 26, color: INDIGO });
  y -= 30;

  const col = {
    num: MARGIN + 6,
    med: MARGIN + 30,
    qty: MARGIN + 250,
    when: MARGIN + 335,
    dur: MARGIN + 445,
  };
  const widths = {
    med: col.qty - col.med - 10,
    qty: col.when - col.qty - 10,
    when: col.dur - col.when - 10,
    dur: PAGE_W - MARGIN - col.dur - 4,
  };

  const drawHeader = () => {
    page.drawRectangle({ x: MARGIN, y: y - 20, width: CONTENT_W, height: 20, color: HEAD_BG });
    const hy2 = y - 14;
    text('#', col.num, hy2, { font: bold, size: 8, color: GRAY });
    text('MEDICINE', col.med, hy2, { font: bold, size: 8, color: GRAY });
    text('QUANTITY', col.qty, hy2, { font: bold, size: 8, color: GRAY });
    text('WHEN TO TAKE', col.when, hy2, { font: bold, size: 8, color: GRAY });
    text('DURATION', col.dur, hy2, { font: bold, size: 8, color: GRAY });
    y -= 20;
  };
  drawHeader();

  const meds = rx.medicines.filter((m) => m.name.trim());
  if (meds.length === 0) {
    text('No medicines added.', col.med, y - 18, { color: GRAY });
    y -= 30;
  }

  meds.forEach((m, i) => {
    const nameLine = m.potency ? `${m.name}  ${m.potency}` : m.name;
    const nameLines = wrap(nameLine, bold, 10.5, widths.med);
    const noteLines = m.instructions ? wrap(m.instructions, regular, 8.5, widths.med) : [];
    const qtyLines = wrap(m.quantity || '-', regular, 10, widths.qty);
    const schedule = [m.morning && 'Morning', m.afternoon && 'Afternoon', m.night && 'Night']
      .filter(Boolean)
      .join(', ') || '-';
    const whenLines = wrap(schedule, regular, 10, widths.when);
    const timing = describeTiming(m.timing);
    const timingLines = timing ? wrap(timing, regular, 8.5, widths.when) : [];
    const durLines = wrap(m.duration || '-', regular, 10, widths.dur);

    const h1 = nameLines.length * 13 + noteLines.length * 11 + (noteLines.length ? 2 : 0);
    const h2 = qtyLines.length * 13;
    const h3 = whenLines.length * 13 + timingLines.length * 11;
    const h4 = durLines.length * 13;
    const rowH = Math.max(h1, h2, h3, h4, 14) + 16;

    if (y - rowH < MARGIN + 60) {
      newPage();
      drawHeader();
    }

    const top = y - 12;
    text(String(i + 1), col.num, top, { color: GRAY });
    let ty = top;
    nameLines.forEach((l) => {
      text(l, col.med, ty, { font: bold, size: 10.5 });
      ty -= 13;
    });
    noteLines.forEach((l) => {
      text(l, col.med, ty + 1, { size: 8.5, color: GRAY });
      ty -= 11;
    });
    ty = top;
    qtyLines.forEach((l) => {
      text(l, col.qty, ty);
      ty -= 13;
    });
    ty = top;
    whenLines.forEach((l) => {
      text(l, col.when, ty);
      ty -= 13;
    });
    timingLines.forEach((l) => {
      text(l, col.when, ty + 1, { size: 8.5, color: GRAY });
      ty -= 11;
    });
    ty = top;
    durLines.forEach((l) => {
      text(l, col.dur, ty);
      ty -= 13;
    });

    y -= rowH;
    page.drawLine({
      start: { x: MARGIN, y },
      end: { x: PAGE_W - MARGIN, y },
      thickness: 0.6,
      color: LIGHT,
    });
  });

  y -= 18;

  // ---------- Advice ----------
  if (rx.advice.trim()) {
    ensure(40);
    text('ADVICE / DIET', MARGIN, y - 8, { font: bold, size: 8, color: GRAY });
    y -= 22;
    wrap(rx.advice, regular, 10.5, CONTENT_W).forEach((l) => {
      ensure(15);
      text(l, MARGIN, y, { size: 10.5 });
      y -= 14.5;
    });
    y -= 8;
  }

  // ---------- Follow-up ----------
  if (rx.followUp.trim()) {
    ensure(24);
    text('FOLLOW-UP:', MARGIN, y - 8, { font: bold, size: 8, color: GRAY });
    text(rx.followUp, MARGIN + 62, y - 8, { font: bold, size: 10.5 });
    y -= 26;
  }

  // ---------- Signature + footer (always on the last page) ----------
  ensure(70);
  const sigY = Math.min(y - 30, MARGIN + 50);
  const sigW = 170;
  page.drawLine({
    start: { x: PAGE_W - MARGIN - sigW, y: sigY },
    end: { x: PAGE_W - MARGIN, y: sigY },
    thickness: 0.8,
    color: GRAY,
  });
  const doc = clean(CLINIC_INFO.doctorName, regular);
  text(doc, PAGE_W - MARGIN - sigW / 2 - regular.widthOfTextAtSize(doc, 10) / 2, sigY - 13, { size: 10 });
  text(`This prescription was issued by ${CLINIC_INFO.clinicName}.`, MARGIN, sigY + 4, { size: 8, color: GRAY });
  text('Take medicines only as directed.', MARGIN, sigY - 7, { size: 8, color: GRAY });

  return pdf.save();
}

export function prescriptionFileName(rx: Prescription): string {
  const safe = (rx.patientName || 'patient').replace(/[^a-zA-Z0-9]+/g, '-').replace(/^-+|-+$/g, '');
  return `Prescription-${safe || 'patient'}-${rx.date}.pdf`;
}
