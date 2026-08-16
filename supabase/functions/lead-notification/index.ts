import nodemailer from "npm:nodemailer@6.9.7";

// ---------------------------------------------------------------------------
// SMTP / notification config. In production prefer Deno.env.get(...) so these
// secrets aren't committed. Set them with:
//   supabase secrets set SMTP_PASS=... NOTIFICATION_EMAIL=...
// ---------------------------------------------------------------------------
const SMTP_HOST = 'smtp.gmail.com';
const SMTP_PORT = '465';
const SMTP_USER = 'leadsinfoanchorbvfs@gmail.com';
const SMTP_PASS = 'jblnhswnliyvjtki';
const NOTIFICATION_EMAIL = 'info@anchorbv.com, trisch@anchorbvfs.com';

const transporter = nodemailer.createTransport({
  host: SMTP_HOST,
  port: SMTP_PORT,
  secure: true, // true for 465, false for other ports (like 587)
  auth: {
    user: SMTP_USER,
    pass: SMTP_PASS,
  },
});

// Shared brand styling wrapper so both email types look consistent.
function wrap(title: string, inner: string): string {
  return `
    <div style="font-family: Arial, sans-serif; color: #333; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #eee; border-radius: 8px;">
        <div style="background-color: #0b1c3e; padding: 20px; border-radius: 8px 8px 0 0; text-align: center;">
            <h2 style="color: #c5a47e; margin: 0;">${title}</h2>
        </div>
        <div style="padding: 20px; background-color: #ffffff;">
            ${inner}
        </div>
        <div style="padding: 15px; text-align: center; color: #888; font-size: 12px; border-top: 1px solid #eee;">
            <p>Received via Anchor Business Valuations Website</p>
        </div>
    </div>
  `;
}

function row(label: string, value: string): string {
  return `<p style="font-size: 16px;"><strong>${label}:</strong> ${value}</p>`;
}

function formatBytes(bytes: number): string {
  if (!bytes || bytes <= 0) return "0 B";
  const units = ["B", "KB", "MB", "GB"];
  const i = Math.min(
    Math.floor(Math.log(bytes) / Math.log(1024)),
    units.length - 1,
  );
  const value = bytes / Math.pow(1024, i);
  return `${value.toFixed(value >= 10 || i === 0 ? 0 : 1)} ${units[i]}`;
}

// Build the "new contact form lead" email (leads table).
function buildLeadEmail(record: Record<string, any>) {
  const inner = `
    ${row("Name", record.name ?? "N/A")}
    ${row("Email", `<a href="mailto:${record.email}" style="color: #0b1c3e;">${record.email}</a>`)}
    ${row("Phone", record.phone || "N/A")}
    ${row("Subject", record.subject ?? "N/A")}
    <div style="margin-top: 20px; padding: 15px; background-color: #f9f9f9; border-left: 4px solid #c5a47e;">
        <strong>Message:</strong><br>
        <p style="white-space: pre-wrap; margin-top: 10px;">${record.message ?? ""}</p>
    </div>
  `;
  return {
    subject: `New Lead: ${record.subject ?? "Contact form submission"}`,
    html: wrap("New Contact Form Submission", inner),
  };
}

// Build the "new document upload" email (document_submissions table).
function buildUploadEmail(record: Record<string, any>) {
  const files: Array<{ name?: string; size?: number }> = Array.isArray(
    record.files,
  )
    ? record.files
    : [];

  const fileRows = files.length
    ? files
        .map(
          (f) =>
            `<li style="margin-bottom: 4px;">${f.name ?? "file"} <span style="color:#888;">(${formatBytes(Number(f.size) || 0)})</span></li>`,
        )
        .join("")
    : "<li>(no file details)</li>";

  const notes = record.notes
    ? `<div style="margin-top: 20px; padding: 15px; background-color: #f9f9f9; border-left: 4px solid #c5a47e;">
         <strong>Notes:</strong><br>
         <p style="white-space: pre-wrap; margin-top: 10px;">${record.notes}</p>
       </div>`
    : "";

  const inner = `
    ${row("Name", record.name ?? "N/A")}
    ${row("Email", `<a href="mailto:${record.email}" style="color: #0b1c3e;">${record.email}</a>`)}
    ${row("Phone", record.phone || "N/A")}
    ${row("Company", record.company || "N/A")}
    ${row("Files", `${files.length} file${files.length === 1 ? "" : "s"} · ${formatBytes(Number(record.total_size) || 0)} total`)}
    <ul style="font-size: 15px; padding-left: 20px; margin-top: 8px;">${fileRows}</ul>
    ${notes}
    <p style="font-size: 14px; margin-top: 20px; color: #555;">
        Download the files from the <strong>Admin → Document Uploads</strong> panel.
    </p>
  `;
  return {
    subject: `New Document Upload from ${record.name ?? "a client"}`,
    html: wrap("New Document Upload", inner),
  };
}

Deno.serve(async (req) => {
  try {
    if (!SMTP_USER || !SMTP_PASS || !NOTIFICATION_EMAIL) {
      throw new Error(
        "Missing environment variables (SMTP_USER, SMTP_PASS, or NOTIFICATION_EMAIL)",
      );
    }

    const payload = await req.json();

    // Supabase Database Webhook payload: { type, table, schema, record, old_record }
    const { table, record } = payload;
    if (!record) {
      return new Response("No record found in payload", { status: 400 });
    }

    // Route by which table fired the webhook.
    const { subject, html } =
      table === "document_submissions"
        ? buildUploadEmail(record)
        : buildLeadEmail(record);

    console.log(`New ${table ?? "lead"} received:`, record.email);

    const info = await transporter.sendMail({
      from: `"Anchor Leads" <${SMTP_USER}>`,
      to: NOTIFICATION_EMAIL,
      cc: "Uncoredigital@gmail.com",
      subject,
      html,
    });

    console.log("Email sent: %s", info.messageId);

    return new Response(
      JSON.stringify({ success: true, messageId: info.messageId }),
      { headers: { "Content-Type": "application/json" } },
    );
  } catch (error) {
    console.error("Error sending email:", error);
    return new Response(JSON.stringify({ error: (error as Error).message }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  }
});
