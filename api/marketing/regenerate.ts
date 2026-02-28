const { getSupabaseAdmin } = require('../_utils/supabase');
const { generateEmailContent, sendPreviewEmail } = require('../cron/generate-marketing-draft');

const HTML_404 = `<!DOCTYPE html><html lang="it"><head><meta charset="utf-8"/><meta name="viewport" content="width=device-width, initial-scale=1.0"/><title>Link non valido</title></head><body style="margin:0;padding:24px;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,Arial,sans-serif;color:#454F5B;"><h1 style="font-size:18px;">Link non valido</h1><p>Questo link è già stato utilizzato o non esiste.</p><p><a href="https://www.prontoservizi.app/" style="color:#1877F2;">Torna a Pronto Servizi</a></p></body></html>`;

const HTML_500 = (msg: string) => `<!DOCTYPE html><html lang="it"><head><meta charset="utf-8"/><meta name="viewport" content="width=device-width, initial-scale=1.0"/><title>Errore</title></head><body style="margin:0;padding:24px;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,Arial,sans-serif;color:#454F5B;"><h1 style="font-size:18px;">Errore</h1><p>${msg.replace(/</g, '&lt;')}</p><p><a href="https://www.prontoservizi.app/" style="color:#1877F2;">Torna a Pronto Servizi</a></p></body></html>`;

const HTML_SUCCESS = `<!DOCTYPE html><html lang="it"><head><meta charset="utf-8"/><meta name="viewport" content="width=device-width, initial-scale=1.0"/><title>Nuova bozza</title></head><body style="margin:0;padding:24px;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,Arial,sans-serif;color:#454F5B;max-width:600px;margin:24px auto;"><h1 style="font-size:20px;color:#1C252E;">Nuova bozza generata</h1><p>Controlla la tua email: ti abbiamo inviato un'anteprima aggiornata. Se ti piace, clicca "Conferma e invia" nel messaggio.</p><p><a href="https://www.prontoservizi.app/" style="color:#1877F2;">Torna a Pronto Servizi</a></p></body></html>`;

module.exports = async function regenerateHandler(req: any, res: any) {
  if (req.method !== 'GET') {
    res.setHeader('Content-Type', 'text/html; charset=utf-8');
    return res.status(405).send(HTML_404);
  }

  const token = typeof req.query?.token === 'string' ? req.query.token.trim() : '';
  if (!token) {
    res.setHeader('Content-Type', 'text/html; charset=utf-8');
    return res.status(400).send(HTML_404);
  }

  const supabase = getSupabaseAdmin();
  const { data: draft, error: fetchError } = await supabase
    .from('marketing_drafts')
    .select('id')
    .eq('confirm_token', token)
    .eq('status', 'pending')
    .maybeSingle();

  if (fetchError || !draft) {
    res.setHeader('Content-Type', 'text/html; charset=utf-8');
    return res.status(404).send(HTML_404);
  }

  const baseUrl = process.env.MARKETING_APP_BASE_URL || (process.env.VERCEL_URL
    ? `https://${process.env.VERCEL_URL}`
    : 'https://www.prontoservizi.app');
  const previewEmail = process.env.MARKETING_PREVIEW_EMAIL;
  if (!previewEmail) {
    res.setHeader('Content-Type', 'text/html; charset=utf-8');
    return res.status(500).send(HTML_500('MARKETING_PREVIEW_EMAIL non configurato.'));
  }

  try {
    const { subject, html } = await generateEmailContent();

    const { error: updateError } = await supabase
      .from('marketing_drafts')
      .update({ subject, html_content: html })
      .eq('id', draft.id);

    if (updateError) {
      res.setHeader('Content-Type', 'text/html; charset=utf-8');
      return res.status(500).send(HTML_500(updateError.message));
    }

    const confirmUrl = `${baseUrl}/api/marketing/confirm?token=${token}`;
    const regenerateUrl = `${baseUrl}/api/marketing/regenerate?token=${token}`;
    await sendPreviewEmail({
      toEmail: previewEmail,
      subject,
      htmlContent: html,
      confirmUrl,
      regenerateUrl,
    });

    res.setHeader('Content-Type', 'text/html; charset=utf-8');
    return res.status(200).send(HTML_SUCCESS);
  } catch (err: any) {
    res.setHeader('Content-Type', 'text/html; charset=utf-8');
    return res.status(500).send(HTML_500(err?.message || 'Errore durante la generazione.'));
  }
};
