const { getSupabaseAdmin } = require('../_utils/supabase');

const HTML_400 = `<!DOCTYPE html><html lang="it"><head><meta charset="utf-8"/><meta name="viewport" content="width=device-width, initial-scale=1.0"/><title>Link non valido</title></head><body style="margin:0;padding:24px;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,Arial,sans-serif;color:#454F5B;"><h1 style="font-size:18px;">Link non valido</h1><p>Il link di conferma non è valido o non è stato fornito.</p></body></html>`;

const HTML_404 = `<!DOCTYPE html><html lang="it"><head><meta charset="utf-8"/><meta name="viewport" content="width=device-width, initial-scale=1.0"/><title>Link non valido</title></head><body style="margin:0;padding:24px;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,Arial,sans-serif;color:#454F5B;"><h1 style="font-size:18px;">Link già usato o non valido</h1><p>Questo link è già stato utilizzato o non esiste.</p></body></html>`;

const HTML_500 = (msg: string) => `<!DOCTYPE html><html lang="it"><head><meta charset="utf-8"/><meta name="viewport" content="width=device-width, initial-scale=1.0"/><title>Errore</title></head><body style="margin:0;padding:24px;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,Arial,sans-serif;color:#454F5B;"><h1 style="font-size:18px;">Errore</h1><p>${msg.replace(/</g, '&lt;')}</p></body></html>`;

const HTML_SUCCESS = `<!DOCTYPE html><html lang="it"><head><meta charset="utf-8"/><meta name="viewport" content="width=device-width, initial-scale=1.0"/><title>Campagna inviata</title></head><body style="margin:0;padding:24px;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,Arial,sans-serif;color:#454F5B;max-width:600px;margin:24px auto;"><h1 style="font-size:20px;color:#1C252E;">Campagna inviata con successo</h1><p>La campagna marketing è stata inviata ai contatti in lista.</p><p><a href="https://www.prontoservizi.app/" style="color:#1877F2;">Torna a Pronto Servizi</a></p></body></html>`;

async function createAndSendCampaign(params: {
  subject: string;
  htmlContent: string;
  listIds: number[];
  senderEmail: string;
  senderName: string;
}): Promise<void> {
  const apiKey = process.env.BREVO_API_KEY;
  if (!apiKey) throw new Error('BREVO_API_KEY is not set');

  const createRes = await fetch('https://api.brevo.com/v3/emailCampaigns', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'api-key': apiKey,
    },
    body: JSON.stringify({
      name: `Marketing - ${new Date().toISOString().slice(0, 10)}`,
      subject: params.subject,
      htmlContent: params.htmlContent,
      sender: { email: params.senderEmail, name: params.senderName },
      recipients: { listIds: params.listIds },
    }),
  });

  if (!createRes.ok) {
    const err = await createRes.text();
    throw new Error(`Brevo create campaign failed: ${createRes.status} ${err}`);
  }

  const { id: campaignId } = await createRes.json();
  const sendRes = await fetch(`https://api.brevo.com/v3/emailCampaigns/${campaignId}/sendNow`, {
    method: 'POST',
    headers: { 'api-key': apiKey },
  });

  if (!sendRes.ok) {
    const err = await sendRes.text();
    throw new Error(`Brevo sendNow failed: ${sendRes.status} ${err}`);
  }
}

module.exports = async function handler(req: any, res: any) {
  if (req.method !== 'GET') {
    res.setHeader('Content-Type', 'text/html; charset=utf-8');
    return res.status(405).send(HTML_400);
  }

  const token = typeof req.query?.token === 'string' ? req.query.token.trim() : '';
  if (!token) {
    res.setHeader('Content-Type', 'text/html; charset=utf-8');
    return res.status(400).send(HTML_400);
  }

  const supabase = getSupabaseAdmin();
  const { data: draft, error: fetchError } = await supabase
    .from('marketing_drafts')
    .select('id, subject, html_content')
    .eq('confirm_token', token)
    .eq('status', 'pending')
    .maybeSingle();

  if (fetchError || !draft) {
    res.setHeader('Content-Type', 'text/html; charset=utf-8');
    return res.status(404).send(HTML_404);
  }

  const listIdsRaw = process.env.BREVO_LIST_IDS || '';
  const listIds = listIdsRaw
    .split(',')
    .map((s) => parseInt(s.trim(), 10))
    .filter((n) => Number.isFinite(n) && n > 0);

  if (listIds.length === 0) {
    res.setHeader('Content-Type', 'text/html; charset=utf-8');
    return res.status(500).send(HTML_500('BREVO_LIST_IDS non configurato.'));
  }

  const senderEmail = process.env.BREVO_SENDER_EMAIL || 'noreply@prontoservizi.app';
  const senderName = process.env.BREVO_SENDER_NAME || 'Pronto Servizi';

  try {
    await createAndSendCampaign({
      subject: draft.subject,
      htmlContent: draft.html_content,
      listIds,
      senderEmail,
      senderName,
    });
  } catch (err: any) {
    res.setHeader('Content-Type', 'text/html; charset=utf-8');
    return res.status(500).send(HTML_500(err?.message || 'Errore durante l\'invio.'));
  }

  await supabase
    .from('marketing_drafts')
    .update({ status: 'sent' })
    .eq('id', draft.id);

  res.setHeader('Content-Type', 'text/html; charset=utf-8');
  return res.status(200).send(HTML_SUCCESS);
};
