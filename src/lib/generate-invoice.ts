/* ── Client-side Invoice PDF Generator ──
 *  Pakai jsPDF + jspdf-autotable (dynamic import — hemat ~300KB dari initial bundle).
 *  Jalan 100% di browser (client-side), zero server, Vercel free tier aman.
 *  Design ngikutin brand MediaVendor Pro: Navy #172230 + Amber #F59E0B.
 */

import type { PriceItem } from "@/data/pricelist";
import { siteConfig } from "@/data/site-config";

/* ── Types ── */
export interface InvoiceItem {
  item: PriceItem;
  qty: number;
}

export interface InvoiceData {
  items: InvoiceItem[];
  days: number;
  totalBeforeDiscount: number;
  totalAfterDiscount: number;
  discountPct: number;
  discountLabel: string;
  customerName?: string;
  customerPhone?: string;
  customerEmail?: string;
  orderNumber?: string;
  isPaid?: boolean;
  orderDate?: string | Date;
}

/* ── Helpers ── */
function fmt(n: number): string {
  return new Intl.NumberFormat("id-ID").format(n);
}

function makeInvoiceNo(): string {
  const d = new Date();
  const stamp = [
    d.getFullYear(),
    String(d.getMonth() + 1).padStart(2, "0"),
    String(d.getDate()).padStart(2, "0"),
  ].join("");
  const seq = String(Math.floor(Math.random() * 900) + 100);
  return `INV-${stamp}-${seq}`;
}

function fmtDate(d: Date): string {
  return d.toLocaleDateString("id-ID", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });
}

/* ── Brand Colors ── */
const NAVY: [number, number, number] = [23, 34, 48];
const AMBER: [number, number, number] = [245, 158, 11];
const DARK: [number, number, number] = [17, 24, 39];
const GRAY: [number, number, number] = [75, 85, 99];
const WHITE: [number, number, number] = [255, 255, 255];
const FAINT: [number, number, number] = [248, 250, 252];
const BORDER: [number, number, number] = [226, 232, 240];
const SLATE: [number, number, number] = [148, 163, 184];

/* ── Draw Section Badge ── */
// eslint-disable-next-line @typescript-eslint/no-explicit-any
function drawBadge(doc: any, x: number, y: number, label: string) {
  doc.setFillColor(...AMBER);
  doc.rect(x, y, 3, 6.5, "F");
  doc.setFillColor(...NAVY);
  doc.rect(x + 3, y, 60, 6.5, "F");
  doc.setTextColor(...WHITE);
  doc.setFontSize(7);
  doc.setFont("helvetica", "bold");
  doc.text(label, x + 7, y + 4.5);
}

/* ══════════════════════════════════════════════
 *  MAIN: Generate & Auto-Download Invoice PDF
 *  Dynamic import jsPDF + autotable — hemat ~300KB dari initial bundle.
 * ══════════════════════════════════════════════ */
export async function generateInvoicePDF(data: InvoiceData): Promise<void> {
  const [{ default: jsPDF }, { default: autoTable }] = await Promise.all([
    import("jspdf"),
    import("jspdf-autotable"),
  ]);

  const doc = new jsPDF("p", "mm", "a4");
  const pw = 210;
  const mx = 15;
  const inv = data.orderNumber || makeInvoiceNo();
  const today = data.orderDate ? new Date(data.orderDate) : new Date();
  const isWeekly = data.days >= 7;

  // ═══════════════════════════════════════
  // 1. HEADER — Navy block + amber accents
  // ═══════════════════════════════════════
  const headerH = 42;

  // Navy background
  doc.setFillColor(...NAVY);
  doc.rect(0, 0, pw, headerH, "F");

  // Top amber accent line
  doc.setFillColor(...AMBER);
  doc.rect(0, 0, pw, 1.5, "F");

  // Bottom-left amber bar
  doc.setFillColor(...AMBER);
  doc.rect(0, headerH - 4.5, pw * 0.48, 4.5, "F");

  // Brand text — left
  doc.setTextColor(...WHITE);
  doc.setFontSize(20);
  doc.setFont("helvetica", "bold");
  doc.text("MEDIA VENDOR", mx + 2, 16);

  doc.setFontSize(9.5);
  doc.setFont("helvetica", "normal");
  doc.setTextColor(226, 232, 240);
  doc.text("PRO ENTERPRISE", mx + 2, 23);

  doc.setTextColor(...SLATE);
  doc.setFontSize(6.5);
  doc.text("Premium Production & Broadcast Solutions", mx + 2, 29);

  // INVOICE title — right
  doc.setTextColor(...AMBER);
  doc.setFontSize(30);
  doc.setFont("helvetica", "bold");
  doc.text("INVOICE", pw - mx - 2, 17, { align: "right" });

  doc.setTextColor(...WHITE);
  doc.setFontSize(9);
  doc.setFont("helvetica", "bold");
  doc.text(`ID NO : ${inv}`, pw - mx - 2, 25, { align: "right" });

  doc.setTextColor(...SLATE);
  doc.setFontSize(8);
  doc.setFont("helvetica", "normal");
  doc.text(fmtDate(today), pw - mx - 2, 32, { align: "right" });

  // Sleek status indicator in header
  if (data.isPaid !== undefined) {
    if (data.isPaid) {
      doc.setFillColor(34, 197, 94); // emerald-500
      doc.roundedRect(pw - mx - 26, 34.5, 26, 5, 1, 1, "F");
      doc.setTextColor(255, 255, 255);
      doc.setFontSize(7);
      doc.setFont("helvetica", "bold");
      doc.text("LUNAS", pw - mx - 13, 38.2, { align: "center" });
    } else {
      doc.setFillColor(239, 68, 68); // red-500
      doc.roundedRect(pw - mx - 34, 34.5, 34, 5, 1, 1, "F");
      doc.setTextColor(255, 255, 255);
      doc.setFontSize(7);
      doc.setFont("helvetica", "bold");
      doc.text("BELUM LUNAS", pw - mx - 17, 38.2, { align: "center" });
    }
  }

  // ═══════════════════════════════════════
  // 2. ADDRESS SECTION
  // ═══════════════════════════════════════
  let y = 50;
  const colR = pw / 2 + 8;

  // --- Left: Ditagihkan Kepada ---
  drawBadge(doc, mx, y, "DITAGIHKAN KEPADA");
  doc.setTextColor(...DARK);
  doc.setFontSize(11);
  doc.setFont("helvetica", "bold");
  doc.text(data.customerName || "Customer / Klien", mx, y + 12);
  doc.setTextColor(...GRAY);
  doc.setFontSize(8.5);
  doc.setFont("helvetica", "normal");
  if (data.customerPhone) {
    doc.text(`WhatsApp: ${data.customerPhone}`, mx, y + 17);
    if (data.customerEmail) {
      doc.text(`Email: ${data.customerEmail}`, mx, y + 21.5);
      doc.text(`Tanggal order: ${fmtDate(today)}`, mx, y + 26);
    } else {
      doc.text(`Tanggal order: ${fmtDate(today)}`, mx, y + 21.5);
    }
  } else {
    doc.text("Pemesanan via website MediaVendor Pro", mx, y + 17);
    doc.text(`Tanggal order: ${fmtDate(today)}`, mx, y + 21.5);
  }

  // --- Right: Dari ---
  drawBadge(doc, colR, y, "DARI");
  doc.setTextColor(...DARK);
  doc.setFontSize(11);
  doc.setFont("helvetica", "bold");
  doc.text("Media Vendor Pro", colR, y + 12);
  doc.setTextColor(...GRAY);
  doc.setFontSize(8.5);
  doc.setFont("helvetica", "normal");
  doc.text("Broadcast & Cinema Equipment Rental", colR, y + 17);
  doc.text(`Phone: ${siteConfig.phoneFormatted}`, colR, y + 21.5);
  doc.text(`Email: ${siteConfig.email}`, colR, y + 26);

  // ═══════════════════════════════════════
  // 3. SCOPE BAR
  // ═══════════════════════════════════════
  y += 34;
  const totalUnits = data.items.reduce((s, e) => s + e.qty, 0);
  const durLabel = isWeekly
    ? "DURASI: 1 MINGGU (7H)"
    : `DURASI: ${data.days} HARI`;

  doc.setFillColor(...NAVY);
  doc.roundedRect(mx, y, pw - 2 * mx, 9, 1.5, 1.5, "F");
  doc.setFillColor(...AMBER);
  doc.rect(mx, y, 3, 9, "F");

  doc.setTextColor(...AMBER);
  doc.setFontSize(7.5);
  doc.setFont("helvetica", "bold");
  doc.text(durLabel, mx + 7, y + 5.8);

  doc.setTextColor(...WHITE);
  doc.setFontSize(8);
  doc.setFont("helvetica", "normal");
  doc.text(`Total: ${totalUnits} Item`, pw - mx - 5, y + 5.8, {
    align: "right",
  });

  // ═══════════════════════════════════════
  // 4. ITEMS TABLE
  // ═══════════════════════════════════════
  y += 14;
  const rateLabel = isWeekly ? "Tarif/Minggu" : "Tarif/Hari";

  const rows = data.items.map((entry, idx) => {
    const rate = isWeekly
      ? entry.item.pricePerWeek
      : entry.item.pricePerDay;
    const sub = rate * entry.qty;
    const unitLabel = entry.item.category === "Kru" ? "Personel" : "Unit";
    return [
      String(idx + 1),
      entry.item.name,
      `${entry.qty} ${unitLabel}`,
      `Rp ${fmt(rate)}`,
      `Rp ${fmt(sub)}`,
    ];
  });

  autoTable(doc, {
    startY: y,
    head: [["No", "Deskripsi Unit & Layanan", "Jumlah", rateLabel, "Subtotal"]],
    body: rows,
    theme: "plain",
    styles: {
      font: "helvetica",
      fontSize: 9,
      cellPadding: { top: 3.5, bottom: 3.5, left: 4, right: 4 },
      textColor: DARK,
      lineColor: BORDER,
      lineWidth: 0.2,
    },
    headStyles: {
      fillColor: AMBER,
      textColor: WHITE,
      fontStyle: "bold",
      fontSize: 8.5,
      halign: "left",
    },
    columnStyles: {
      0: { halign: "center", cellWidth: 12 },
      1: { cellWidth: "auto", fontStyle: "bold" },
      2: { halign: "center", cellWidth: 24 },
      3: { halign: "right", cellWidth: 30 },
      4: { halign: "right", cellWidth: 32, fontStyle: "bold" },
    },
    alternateRowStyles: {
      fillColor: FAINT,
    },
    margin: { left: mx, right: mx },
  });

  // ═══════════════════════════════════════
  // 5. BOTTOM — Payment + Totals
  // ═══════════════════════════════════════
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const tblFinalY = (doc as any).lastAutoTable?.finalY ?? y + 50;
  y = tblFinalY + 10;

  // --- Left column: Payment info ---
  drawBadge(doc, mx, y, "PEMBAYARAN");
  let pyL = y + 10;
  doc.setFontSize(8.5);

  const payRows: [string, string][] = [
    ["No. Rekening", siteConfig.bank.accountNumber],
    ["Atas Nama", siteConfig.bank.accountName],
    ["Bank", siteConfig.bank.name],
  ];
  payRows.forEach(([lbl, val]) => {
    doc.setTextColor(...GRAY);
    doc.setFont("helvetica", "normal");
    doc.text(lbl, mx, pyL);
    doc.setTextColor(...DARK);
    doc.setFont("helvetica", "bold");
    doc.text(`: ${val}`, mx + 28, pyL);
    pyL += 4.5;
  });

  // Notes
  pyL += 6;
  doc.setTextColor(...DARK);
  doc.setFontSize(9);
  doc.setFont("helvetica", "bold");
  doc.text("Catatan Penting", mx, pyL);
  pyL += 5;
  doc.setTextColor(...GRAY);
  doc.setFontSize(7.5);
  doc.setFont("helvetica", "normal");
  const notes = [
    "1. Ini adalah estimasi harga. Harga final dikonfirmasi via WhatsApp.",
    "2. Seluruh unit telah melalui Quality Check (QC) sebelum penyerahan.",
    "3. Harap cantumkan nomor invoice pada berita transfer.",
  ];
  notes.forEach((n) => {
    doc.text(n, mx, pyL);
    pyL += 4;
  });

  // --- Right column: Totals ---
  const equipItems = data.items.filter((e) => e.item.category !== "Kru");
  const crewItems = data.items.filter((e) => e.item.category === "Kru");
  const equipQty = equipItems.reduce((s, e) => s + e.qty, 0);
  const crewQty = crewItems.reduce((s, e) => s + e.qty, 0);
  const equipSub = equipItems.reduce((s, e) => {
    const r = isWeekly ? e.item.pricePerWeek : e.item.pricePerDay;
    return s + r * e.qty;
  }, 0);
  const crewSub = crewItems.reduce((s, e) => {
    const r = isWeekly ? e.item.pricePerWeek : e.item.pricePerDay;
    return s + r * e.qty;
  }, 0);

  let tY = y;

  // Totals card background
  const hasDiscount = data.discountPct > 0;
  const hasCrew = crewQty > 0;
  const totCardH = 38 + (hasDiscount ? 6 : 0) + (hasCrew ? 6 : 0);
  doc.setFillColor(...FAINT);
  doc.setDrawColor(...BORDER);
  doc.roundedRect(colR - 4, tY - 3, pw - mx - colR + 4, totCardH, 2, 2, "FD");

  tY += 4;
  doc.setFontSize(9.5);

  // Calc row helper
  function calcRow(label: string, value: string) {
    doc.setTextColor(...GRAY);
    doc.setFont("helvetica", "normal");
    doc.text(label, colR, tY);
    doc.setTextColor(...DARK);
    doc.setFont("helvetica", "bold");
    doc.text(value, pw - mx - 2, tY, { align: "right" });
    tY += 6;
  }

  if (equipQty > 0) calcRow(`Subtotal Alat (${equipQty} Unit)`, `Rp ${fmt(equipSub)}`);
  if (hasCrew) calcRow(`Subtotal Kru (${crewQty} Orang)`, `Rp ${fmt(crewSub)}`);
  calcRow(
    "Durasi Sewa",
    `${data.days} ${isWeekly ? "Hari (Tarif Mingguan)" : "Hari"}`
  );
  if (hasDiscount) {
    const saved = data.totalBeforeDiscount - data.totalAfterDiscount;
    calcRow(`Diskon (${data.discountLabel})`, `- Rp ${fmt(saved)}`);
  }

  // TOTAL bar (amber)
  tY += 2;
  const barW = pw - mx - colR + 4;
  doc.setFillColor(...AMBER);
  doc.roundedRect(colR - 4, tY - 4, barW, 13, 1.5, 1.5, "F");
  doc.setTextColor(...WHITE);
  doc.setFontSize(9);
  doc.setFont("helvetica", "bold");
  doc.text("TOTAL TAGIHAN", colR, tY + 4.5);
  doc.setFontSize(14);
  doc.text(`Rp ${fmt(data.totalAfterDiscount)}`, pw - mx - 2, tY + 5, {
    align: "right",
  });

  // Signature area
  tY += 22;
  doc.setTextColor(...DARK);
  doc.setFontSize(10);
  doc.setFont("helvetica", "bold");
  const sigCenterX = colR + barW / 2 - 4;
  doc.text("Media Vendor Pro", sigCenterX, tY, { align: "center" });
  doc.setDrawColor(...DARK);
  doc.setLineWidth(0.3);
  doc.line(sigCenterX - 30, tY + 2, sigCenterX + 30, tY + 2);
  if (data.isPaid) {
    doc.setTextColor(34, 197, 94);
    doc.text("PAID / VERIFIED", sigCenterX, tY + 7, { align: "center" });
  } else {
    doc.setTextColor(...GRAY);
    doc.text("AUTHORIZED", sigCenterX, tY + 7, { align: "center" });
  }

  // ═══════════════════════════════════════
  // 6. FOOTER BARS
  // ═══════════════════════════════════════
  doc.setFillColor(...AMBER);
  doc.rect(0, 290, pw * 0.5, 7, "F");
  doc.setFillColor(...NAVY);
  doc.rect(pw * 0.54, 290, pw * 0.46, 7, "F");

  // Footer text
  doc.setTextColor(...WHITE);
  doc.setFontSize(6.5);
  doc.setFont("helvetica", "normal");
  doc.text("mediavendorpro.id", pw * 0.77, 294.5, {
    align: "center",
  });

  // ═══════════════════════════════════════
  // SAVE / DOWNLOAD
  // ═══════════════════════════════════════
  const statusSuffix =
    data.isPaid === true
      ? "_LUNAS"
      : data.isPaid === false
        ? "_BELUM_LUNAS"
        : "";
  doc.save(`Invoice_MediaVendorPro_${inv}${statusSuffix}.pdf`);
}
