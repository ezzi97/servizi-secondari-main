const crypto = require('crypto');
const { handleCors } = require('../_utils/cors');
const { getSupabaseAdmin } = require('../_utils/supabase');

async function generateEmailContent(): Promise<{ subject: string; html: string }> {
  const { generateText } = await import('ai');
  const { google } = await import('@ai-sdk/google');

  const apiKey = process.env.GOOGLE_GENERATIVE_AI_API_KEY;
  if (!apiKey) {
    throw new Error('GOOGLE_GENERATIVE_AI_API_KEY is not set');
  }

  const prompt = `You are helping write a short marketing email for "Pronto Servizi", an Italian web app for volunteering associations (e.g. ANPAS, CRI) to manage transport and event services (servizi secondari e sportivi).

Reply with ONLY a valid JSON object (no markdown, no code block, no explanation) with exactly two keys:
- "subject": a single subject line in Italian (short, under 60 chars).
- "html": the full HTML email body in Italian. Use table-based layout with inline styles (no external CSS). Include: greeting (Buongiorno), one catchy line, one short paragraph about coordinating services/volunteers/vehicles in one platform, one line inviting to try free or request a demo, a CTA button "Prova gratis" linking to https://www.prontoservizi.app/sign-up, and sign-off "Cordiali saluti, Il team di Pronto Servizi". Use colors like #1877F2 for links and #454F5B for text. Max width 600px. Return the complete HTML document (from <!DOCTYPE html> to </html>).`;

  const { text } = await generateText({
    model: google('gemini-2.0-flash'),
    prompt,
  });

  try {
    const raw = text.trim().replace(/^```json\s*/i, '').replace(/```\s*$/i, '').trim();
    const parsed = JSON.parse(raw);
    const subject = typeof parsed.subject === 'string' ? parsed.subject : 'Pronto Servizi – Novità per te';
    const html = typeof parsed.html === 'string' ? parsed.html : '';
    if (!html || html.length < 100) {
      throw new Error('HTML too short or missing');
    }
    return { subject, html };
  } catch {
    return {
      subject: 'Pronto Servizi – Tutto sotto controllo',
      html: `<!DOCTYPE html><html lang="it"><head><meta charset="utf-8"/><meta name="viewport" content="width=device-width, initial-scale=1.0"/><title>Pronto Servizi</title></head><body style="margin:0;padding:24px;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,Arial,sans-serif;color:#454F5B;"><p>Buongiorno,</p><p>Con <strong>Pronto Servizi</strong> puoi gestire servizi secondari e sportivi, volontari e mezzi in un'unica piattaforma.</p><p><a href="https://www.prontoservizi.app/sign-up" style="color:#1877F2;">Prova gratis</a></p><p>Cordiali saluti,<br/>Il team di Pronto Servizi</p></body></html>`,
    };
  }
}

async function sendPreviewEmail(params: {
  toEmail: string;
  subject: string;
  htmlContent: string;
  confirmUrl: string;
}) {
  const apiKey = process.env.BREVO_API_KEY;
  if (!apiKey) throw new Error('BREVO_API_KEY is not set');

  const senderEmail = process.env.BREVO_SENDER_EMAIL || 'noreply@prontoservizi.app';
  const senderName = process.env.BREVO_SENDER_NAME || 'Pronto Servizi';

  const confirmBlock = `
    <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="100%" style="max-width:600px;margin:24px auto;background:#E8F4FD;border-radius:8px;">
      <tr><td style="padding:20px 24px;">
        <p style="margin:0 0 12px 0;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,Arial,sans-serif;font-size:14px;color:#1C252E;">
          <strong>Anteprima campagna.</strong> Se va bene, clicca qui per inviare la campagna ai contatti:
        </p>
        <a href="${params.confirmUrl}" style="display:inline-block;padding:12px 24px;background:#1877F2;color:#fff;font-size:14px;font-weight:600;text-decoration:none;border-radius:8px;">
          Conferma e invia
        </a>
      </td></tr>
    </table>`;

  const fullHtml = params.htmlContent.replace('</body>', `${confirmBlock}</body>`);

  const res = await fetch('https://api.brevo.com/v3/smtp/email', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'api-key': apiKey,
    },
    body: JSON.stringify({
      sender: { email: senderEmail, name: senderName },
      to: [{ email: params.toEmail }],
      subject: `Anteprima campagna: ${params.subject}`,
      htmlContent: fullHtml,
    }),
  });

  if (!res.ok) {
    const err = await res.text();
    throw new Error(`Brevo send failed: ${res.status} ${err}`);
  }
}

module.exports = async function handler(req: any, res: any) {
  if (handleCors(req, res)) return;

  if (req.method !== 'GET') {
    return res.status(405).json({ success: false, message: 'Method not allowed' });
  }

  const authHeader = req.headers.authorization;
  const token = authHeader?.startsWith('Bearer ') ? authHeader.slice(7) : '';
  const cronSecret = process.env.CRON_SECRET;
  if (!cronSecret || token !== cronSecret) {
    return res.status(401).json({ success: false, message: 'Unauthorized' });
  }

  const previewEmail = process.env.MARKETING_PREVIEW_EMAIL;
  if (!previewEmail) {
    return res.status(500).json({ success: false, message: 'MARKETING_PREVIEW_EMAIL not set' });
  }

  const baseUrl = process.env.MARKETING_APP_BASE_URL || (process.env.VERCEL_URL
    ? `https://${process.env.VERCEL_URL}`
    : 'https://www.prontoservizi.app');

  try {
    const { subject, html } = await generateEmailContent();
    const confirmToken = crypto.randomBytes(32).toString('hex');
    const supabase = getSupabaseAdmin();

    const { data: draft, error: insertError } = await supabase
      .from('marketing_drafts')
      .insert({
        subject,
        html_content: html,
        confirm_token: confirmToken,
        status: 'pending',
      })
      .select('id')
      .single();

    if (insertError) {
      return res.status(500).json({ success: false, message: insertError.message });
    }

    const confirmUrl = `${baseUrl}/api/marketing/confirm?token=${confirmToken}`;
    await sendPreviewEmail({
      toEmail: previewEmail,
      subject,
      htmlContent: html,
      confirmUrl,
    });

    return res.status(200).json({ success: true, draftId: draft?.id });
  } catch (err: any) {
    return res.status(500).json({
      success: false,
      message: err?.message || 'Failed to generate or send preview',
    });
  }
};
