const crypto = require('crypto');
const { handleCors } = require('../_utils/cors');
const { getSupabaseAdmin } = require('../_utils/supabase');

const LOGO_URL = 'https://emkizlshogvxtlelizic.supabase.co/storage/v1/object/public/public-assets/main_logo.png';
const BASE_URL = 'https://www.prontoservizi.app';

const EMAIL_HEADER = `<!DOCTYPE html>
<html lang="it">
<head>
  <meta charset="utf-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>Pronto Servizi</title>
</head>
<body style="margin: 0; padding: 0; background-color: #F9FAFB;">
  <div style="padding: 24px 16px;">
    <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="100%" style="max-width: 600px; margin: 0 auto; background-color: #ffffff;">
      <tr>
        <td style="padding: 24px 24px 16px 24px; border-bottom: 1px solid #E4E8EC;">
          <a href="${BASE_URL}/" target="_blank" style="text-decoration: none;">
            <img src="${LOGO_URL}" alt="Pronto Servizi" width="160" height="48" style="display: block; max-height: 48px; width: auto; border: 0;" />
          </a>
        </td>
      </tr>
      <tr>
        <td style="padding: 8px 24px 20px 24px;">
          <span style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif; font-size: 13px; color: #637381; line-height: 1.4;">
            Piattaforma per la gestione di servizi secondari e sportivi
          </span>
        </td>
      </tr>
    </table>
    <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="100%" style="max-width: 600px; margin: 0 auto; background-color: #ffffff;">
      <tr>
        <td style="padding: 32px 24px;">`;

const BODY_TABLE_CLOSE = `
        </td>
      </tr>
    </table>`;

const EMAIL_FOOTER = `
    <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="100%" style="max-width: 600px; margin: 0 auto; background-color: #ffffff;">
      <tr>
        <td style="padding: 24px 24px 16px 24px; border-top: 1px solid #E4E8EC;">
          <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="100%">
            <tr>
              <td style="vertical-align: top; padding-right: 24px;">
                <a href="${BASE_URL}/" target="_blank" style="text-decoration: none;">
                  <img src="${LOGO_URL}" alt="Pronto Servizi" width="120" height="36" style="display: block; max-height: 36px; width: auto; border: 0; margin-bottom: 16px;" />
                </a>
              </td>
              <td style="vertical-align: top; width: 180px;">
                <p style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif; font-size: 12px; font-weight: 600; color: #1C252E; margin: 0 0 8px 0;">Link utili</p>
                <p style="margin: 0 0 4px 0;"><a href="${BASE_URL}/sign-in" target="_blank" style="font-size: 12px; color: #1877F2; text-decoration: none;">Accedi</a></p>
                <p style="margin: 0 0 4px 0;"><a href="${BASE_URL}/sign-up" target="_blank" style="font-size: 12px; color: #1877F2; text-decoration: none;">Registrati</a></p>
                <p style="margin: 0 0 4px 0;"><a href="mailto:support@prontoservizi.app" style="font-size: 12px; color: #1877F2; text-decoration: none;">Supporto</a></p>
              </td>
            </tr>
          </table>
        </td>
      </tr>
      <tr>
        <td style="padding: 12px 24px 24px 24px;">
          <p style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif; font-size: 11px; color: #919EAB; line-height: 1.5; margin: 0;">© 2026 Pronto Servizi. Tutti i diritti riservati.</p>
        </td>
      </tr>
    </table>
  </div>
</body>
</html>`;

const FALLBACK_BODY_HTML = `
          <p style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Arial, sans-serif; font-size: 15px; color: #454F5B; line-height: 1.6; margin: 0 0 18px 0;">Buongiorno,</p>
          <p style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Arial, sans-serif; font-size: 18px; font-weight: 600; color: #1C252E; line-height: 1.4; margin: 0 0 24px 0;">Meno tempo sui fogli, più tempo per il volontariato.</p>
          <p style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Arial, sans-serif; font-size: 15px; color: #454F5B; line-height: 1.6; margin: 0 0 18px 0;">Coordinare servizi secondari e sportivi, volontari e mezzi richiede spesso di rincorrere dati tra fogli, Excel e email. Con <strong style="color: #1C252E;">Pronto Servizi</strong> tutto si riunisce in un'unica piattaforma: sempre aggiornata, chiara e comoda da usare anche da smartphone.</p>
          <p style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Arial, sans-serif; font-size: 15px; font-weight: 600; color: #1C252E; line-height: 1.6; margin: 0 0 24px 0;">Puoi provarlo gratuitamente quando vuoi.</p>
          <a href="${BASE_URL}/sign-up" target="_blank" style="display: inline-block; padding: 14px 28px; background-color: #1877F2; color: #ffffff; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; font-size: 14px; font-weight: 600; text-decoration: none; border-radius: 8px;">Prova gratis</a>
          <p style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Arial, sans-serif; font-size: 14px; color: #454F5B; line-height: 1.6; margin: 20px 0 0 0;">Cordiali saluti,<br />Il team di <span style="color: #1877F2; font-weight: 700;"><a href="${BASE_URL}/" target="_blank">Pronto Servizi</a></span></p>`;

function buildFullEmail(bodyHtml: string): string {
  return EMAIL_HEADER + bodyHtml + BODY_TABLE_CLOSE + EMAIL_FOOTER;
}

const EMAIL_ANGLES = [
  'Tema: risparmio di tempo — meno tempo su fogli e Excel, più tempo per il volontariato.',
  'Tema: semplicità — una sola piattaforma invece di fogli sparsi, email e file.',
  'Tema: rendicontazione — tutto pronto e ordinato per la rendicontazione senza sforzo.',
  'Tema: uso da smartphone — gestisci servizi e volontari anche in mobilità.',
  'Tema: coordinamento — volontari, mezzi e servizi coordinati in un unico posto.',
  'Tema: meno caos — niente più dati sparsi; visione chiara e aggiornata.',
  'Tema: prova gratuita — invito a provare senza impegno o a richiedere una demo.',
];

function pickRandomAngle(): string {
  const i = Math.floor(Math.random() * EMAIL_ANGLES.length);
  return EMAIL_ANGLES[i];
}

async function generateEmailContent(): Promise<{ subject: string; html: string }> {
  const { generateText } = await import('ai');
  const groqKey = process.env.GROQ_API_KEY;
  const googleKey = process.env.GOOGLE_GENERATIVE_AI_API_KEY;

  const angle = pickRandomAngle();

  const prompt = `Generate the BODY content only for a marketing email in Italian for "Pronto Servizi" (web app for Italian volunteering associations to manage transport and event services). Header and footer are already defined; you only output the middle content.

IMPORTANT: Write a FRESH, varied version. Do not reuse the same headline every time (e.g. avoid always "Meno tempo sui fogli, più tempo per il volontariato"). Vary the subject line and the angle. This run must focus on:
${angle}
Use this theme to shape the headline and the body. Be specific to this angle; avoid generic phrases that could apply to any run.

Reply with ONLY a valid JSON object. No markdown, no code fence, no extra text. Two keys:
- "subject": one subject line in Italian, under 60 characters. Must be different from generic options like "Pronto Servizi – Novità" or "Tutto sotto controllo"; make it specific to the theme above.
- "bodyHtml": HTML fragment for the email body only. This will be inserted between header and footer. Requirements:
  * Use only inline styles. No <style> blocks. No <html>, <body>, <table> wrapper—just the content that goes inside the main body cell.
  * Include in order: (1) Greeting "Buongiorno," in a <p> with style "font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Arial, sans-serif; font-size: 15px; color: #454F5B; line-height: 1.6; margin: 0 0 18px 0;"
  * (2) One catchy headline in a <p> with font-size 18px, font-weight 600, color #1C252E, line-height 1.4, margin 0 0 24px 0 — must reflect the theme above and be different from previous runs
  * (3) One or two short paragraphs (font-size 15px, color #454F5B, line-height 1.6, margin 0 0 18px 0) about the theme. You can use <strong style="color:#1C252E"> for "Pronto Servizi"
  * (4) One closing line inviting to try free or request a demo (same font, font-weight 600, color #1C252E)
  * (5) CTA button: <a href="${BASE_URL}/sign-up" target="_blank" style="display:inline-block;padding:14px 28px;background-color:#1877F2;color:#ffffff;font-family:-apple-system,sans-serif;font-size:14px;font-weight:600;text-decoration:none;border-radius:8px;">Prova gratis</a>
  * (6) Sign-off: "Cordiali saluti," and "Il team di Pronto Servizi" as a link to ${BASE_URL}/ with color #1877F2, in a <p> with margin 20px 0 0 0
  * Use double quotes for attributes. Keep the HTML clean and well-formatted.`;

  let text: string;

  if (groqKey) {
    const { groq } = await import('@ai-sdk/groq');
    const result = await generateText({
      model: groq('llama-3.3-70b-versatile'),
      prompt,
    });
    text = result.text;
  } else if (googleKey) {
    const { google } = await import('@ai-sdk/google');
    const result = await generateText({
      model: google('gemini-2.0-flash'),
      prompt,
    });
    text = result.text;
  } else {
    throw new Error('Set either GROQ_API_KEY or GOOGLE_GENERATIVE_AI_API_KEY in the environment');
  }

  try {
    const raw = text.trim().replace(/^```json\s*/i, '').replace(/```\s*$/i, '').trim();
    const parsed = JSON.parse(raw);
    const subject = typeof parsed.subject === 'string' && parsed.subject.trim()
      ? parsed.subject.trim()
      : 'Pronto Servizi – Novità per te';
    let bodyHtml = typeof parsed.bodyHtml === 'string' ? parsed.bodyHtml.trim() : '';
    if (!bodyHtml || bodyHtml.length < 50) bodyHtml = FALLBACK_BODY_HTML;
    const html = buildFullEmail(bodyHtml);
    return { subject, html };
  } catch {
    return {
      subject: 'Pronto Servizi – Tutto sotto controllo',
      html: buildFullEmail(FALLBACK_BODY_HTML),
    };
  }
}

async function sendPreviewEmail(params: {
  toEmail: string;
  subject: string;
  htmlContent: string;
  confirmUrl: string;
  regenerateUrl?: string;
}) {
  const apiKey = process.env.BREVO_API_KEY;
  if (!apiKey) throw new Error('BREVO_API_KEY is not set');

  const senderEmail = process.env.BREVO_SENDER_EMAIL || 'noreply@prontoservizi.app';
  const senderName = process.env.BREVO_SENDER_NAME || 'Pronto Servizi';

  let actionBlock = `
    <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="100%" style="max-width:600px;margin:24px auto;background:#E8F4FD;border-radius:8px;">
      <tr><td style="padding:20px 24px;">
        <p style="margin:0 0 12px 0;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,Arial,sans-serif;font-size:14px;color:#1C252E;">
          <strong>Anteprima campagna.</strong> Se va bene, clicca qui per inviare la campagna ai contatti:
        </p>
        <a href="${params.confirmUrl}" style="display:inline-block;padding:12px 24px;background:#1877F2;color:#fff;font-size:14px;font-weight:600;text-decoration:none;border-radius:8px;">
          Conferma e invia
        </a>`;
  if (params.regenerateUrl) {
    actionBlock += `
        <p style="margin:16px 0 0 0;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,Arial,sans-serif;font-size:13px;color:#637381;">
          Non ti piace? <a href="${params.regenerateUrl}" style="color:#1877F2;text-decoration:none;">Genera un'altra bozza</a>
        </p>`;
  }
  actionBlock += `
      </td></tr>
    </table>`;

  const fullHtml = params.htmlContent.replace('</body>', `${actionBlock}</body>`);

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

async function handler(req: any, res: any) {
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
    const regenerateUrl = `${baseUrl}/api/marketing/regenerate?token=${confirmToken}`;
    await sendPreviewEmail({
      toEmail: previewEmail,
      subject,
      htmlContent: html,
      confirmUrl,
      regenerateUrl,
    });

    return res.status(200).json({ success: true, draftId: draft?.id });
  } catch (err: any) {
    return res.status(500).json({
      success: false,
      message: err?.message || 'Failed to generate or send preview',
    });
  }
};

module.exports = handler;
module.exports.generateEmailContent = generateEmailContent;
module.exports.sendPreviewEmail = sendPreviewEmail;
module.exports.buildFullEmail = buildFullEmail;
module.exports.BASE_URL = BASE_URL;
