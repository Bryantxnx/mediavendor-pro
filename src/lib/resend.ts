/* ── Resend Email Helper ──
 *  Server-side only — kirim email transaksional via Resend API.
 *  Dipake pas admin tandai lunas → email notif + invoice PDF ke customer.
 */

import { Resend } from "resend";
import { siteConfig } from "@/data/site-config";

const resend = new Resend(process.env.RESEND_API_KEY);

// Sebelum verify domain, pake onboarding@resend.dev
// Setelah verify domain mediavendorpro.id, ganti ke noreply@mediavendorpro.id
const FROM_EMAIL = "MediaVendor Pro <onboarding@resend.dev>";

interface OrderItem {
  product_name: string;
  quantity: number;
  unit_price: number;
  subtotal: number;
}

interface SendPaymentConfirmationParams {
  to: string;
  customerName: string;
  orderNumber: string;
  orderItems: OrderItem[];
  totalAmount: number;
  rentalDays: number;
  discountPct: number;
  rentalStartDate?: string | null;
  rentalEndDate?: string | null;
  pdfBuffer: Buffer;
}

function fmtRp(n: number): string {
  return new Intl.NumberFormat("id-ID").format(n);
}

function fmtDate(d: string): string {
  return new Date(d).toLocaleDateString("id-ID", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });
}

function toTitleCase(str: string): string {
  return str
    .toLowerCase()
    .split(" ")
    .filter(Boolean)
    .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
    .join(" ");
}

export async function sendPaymentConfirmationEmail(
  params: SendPaymentConfirmationParams
) {
  const {
    to,
    customerName,
    orderNumber,
    orderItems,
    totalAmount,
    rentalDays,
    discountPct,
    rentalStartDate,
    rentalEndDate,
    pdfBuffer,
  } = params;

  const name = toTitleCase(customerName);
  const subtotal = orderItems.reduce((s, i) => s + i.subtotal, 0);
  const discountAmount =
    discountPct > 0 ? Math.round(subtotal * (discountPct / 100)) : 0;

  const rentalPeriod =
    rentalStartDate && rentalEndDate
      ? `${fmtDate(rentalStartDate)} s/d ${fmtDate(rentalEndDate)}`
      : `${rentalDays} hari`;

  const itemsHtml = orderItems
    .map(
      (item, idx) =>
        `<tr>
          <td style="padding:8px 12px;border-bottom:1px solid #e2e8f0;color:#4b5563;font-size:14px;">${idx + 1}</td>
          <td style="padding:8px 12px;border-bottom:1px solid #e2e8f0;color:#111827;font-size:14px;font-weight:600;">${item.product_name}</td>
          <td style="padding:8px 12px;border-bottom:1px solid #e2e8f0;color:#4b5563;font-size:14px;text-align:center;">${item.quantity}</td>
          <td style="padding:8px 12px;border-bottom:1px solid #e2e8f0;color:#111827;font-size:14px;text-align:right;font-weight:600;">Rp ${fmtRp(item.subtotal)}</td>
        </tr>`
    )
    .join("");

  const html = `
<!DOCTYPE html>
<html>
<head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"></head>
<body style="margin:0;padding:0;background-color:#f1f5f9;font-family:Arial,Helvetica,sans-serif;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background-color:#f1f5f9;padding:32px 16px;">
    <tr><td align="center">
      <table width="600" cellpadding="0" cellspacing="0" style="background-color:#ffffff;border-radius:12px;overflow:hidden;box-shadow:0 4px 6px rgba(0,0,0,0.07);">
        
        <!-- Header -->
        <tr>
          <td style="background-color:#172230;padding:28px 32px;">
            <table width="100%" cellpadding="0" cellspacing="0">
              <tr>
                <td>
                  <div style="color:#ffffff;font-size:20px;font-weight:bold;">MEDIA VENDOR</div>
                  <div style="color:#94a3b8;font-size:12px;margin-top:2px;">PRO ENTERPRISE</div>
                </td>
                <td align="right">
                  <div style="background-color:#22c55e;color:#ffffff;font-size:13px;font-weight:bold;padding:6px 18px;border-radius:20px;display:inline-block;">LUNAS</div>
                </td>
              </tr>
            </table>
          </td>
        </tr>

        <!-- Amber accent -->
        <tr><td style="background-color:#F59E0B;height:4px;"></td></tr>

        <!-- Body -->
        <tr>
          <td style="padding:32px;">
            <h2 style="color:#111827;font-size:20px;margin:0 0 8px;">Pembayaran Dikonfirmasi</h2>
            <p style="color:#4b5563;font-size:15px;line-height:1.6;margin:0 0 24px;">
              Yth. ${name},<br><br>
              Pembayaran Anda untuk pesanan <strong style="color:#F59E0B;">${orderNumber}</strong> telah kami terima dan dikonfirmasi. Terima kasih atas kepercayaan Anda menggunakan jasa ${siteConfig.name}.
            </p>

            <!-- Order Info -->
            <table width="100%" cellpadding="0" cellspacing="0" style="background-color:#f8fafc;border-radius:8px;margin-bottom:24px;">
              <tr>
                <td style="padding:16px 20px;">
                  <table width="100%" cellpadding="0" cellspacing="0">
                    <tr>
                      <td style="color:#6b7280;font-size:13px;padding-bottom:6px;">No. Pesanan</td>
                      <td align="right" style="color:#111827;font-size:13px;font-weight:bold;padding-bottom:6px;">${orderNumber}</td>
                    </tr>
                    <tr>
                      <td style="color:#6b7280;font-size:13px;padding-bottom:6px;">Periode Sewa</td>
                      <td align="right" style="color:#111827;font-size:13px;font-weight:bold;padding-bottom:6px;">${rentalPeriod}</td>
                    </tr>
                    <tr>
                      <td style="color:#6b7280;font-size:13px;">Status</td>
                      <td align="right" style="color:#22c55e;font-size:13px;font-weight:bold;">LUNAS</td>
                    </tr>
                  </table>
                </td>
              </tr>
            </table>

            <!-- Items Table -->
            <table width="100%" cellpadding="0" cellspacing="0" style="border-radius:8px;overflow:hidden;margin-bottom:16px;">
              <thead>
                <tr style="background-color:#F59E0B;">
                  <th style="padding:10px 12px;color:#ffffff;font-size:12px;text-align:left;font-weight:bold;">No</th>
                  <th style="padding:10px 12px;color:#ffffff;font-size:12px;text-align:left;font-weight:bold;">Item</th>
                  <th style="padding:10px 12px;color:#ffffff;font-size:12px;text-align:center;font-weight:bold;">Qty</th>
                  <th style="padding:10px 12px;color:#ffffff;font-size:12px;text-align:right;font-weight:bold;">Subtotal</th>
                </tr>
              </thead>
              <tbody>
                ${itemsHtml}
              </tbody>
            </table>

            <!-- Totals -->
            <table width="100%" cellpadding="0" cellspacing="0" style="margin-bottom:24px;">
              ${
                discountPct > 0
                  ? `<tr>
                      <td style="padding:4px 0;color:#6b7280;font-size:14px;">Subtotal</td>
                      <td align="right" style="padding:4px 0;color:#111827;font-size:14px;">Rp ${fmtRp(subtotal)}</td>
                    </tr>
                    <tr>
                      <td style="padding:4px 0;color:#6b7280;font-size:14px;">Diskon (${discountPct}%)</td>
                      <td align="right" style="padding:4px 0;color:#ef4444;font-size:14px;">- Rp ${fmtRp(discountAmount)}</td>
                    </tr>`
                  : ""
              }
              <tr>
                <td style="padding:12px 0 0;border-top:2px solid #F59E0B;color:#111827;font-size:16px;font-weight:bold;">Total Dibayar</td>
                <td align="right" style="padding:12px 0 0;border-top:2px solid #F59E0B;color:#F59E0B;font-size:18px;font-weight:bold;">Rp ${fmtRp(totalAmount)}</td>
              </tr>
            </table>

            <p style="color:#4b5563;font-size:14px;line-height:1.6;margin:0 0 8px;">
              Invoice LUNAS terlampir dalam email ini sebagai bukti pembayaran resmi Anda. Silakan simpan untuk referensi.
            </p>
            <p style="color:#4b5563;font-size:14px;line-height:1.6;margin:0;">
              Untuk pertanyaan lebih lanjut, hubungi kami via WhatsApp di <strong>${siteConfig.phoneFormatted}</strong> atau email <strong>${siteConfig.email}</strong>.
            </p>
          </td>
        </tr>

        <!-- Footer -->
        <tr>
          <td style="background-color:#172230;padding:20px 32px;">
            <table width="100%" cellpadding="0" cellspacing="0">
              <tr>
                <td style="color:#94a3b8;font-size:12px;">${siteConfig.name}</td>
                <td align="right" style="color:#94a3b8;font-size:12px;">mediavendorpro.id</td>
              </tr>
            </table>
          </td>
        </tr>

      </table>
    </td></tr>
  </table>
</body>
</html>`;

  const { data, error } = await resend.emails.send({
    from: FROM_EMAIL,
    to,
    subject: `Pembayaran Dikonfirmasi — ${orderNumber} | ${siteConfig.name}`,
    html,
    attachments: [
      {
        filename: `Invoice_${orderNumber}_LUNAS.pdf`,
        content: pdfBuffer,
      },
    ],
  });

  if (error) {
    console.error("Resend email error:", error);
    throw new Error(`Failed to send email: ${error.message}`);
  }

  return data;
}
