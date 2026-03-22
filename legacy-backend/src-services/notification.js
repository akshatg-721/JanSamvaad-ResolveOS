const axios = require('axios');
const { retryWithBackoff } = require('../utils/retry');
const logger = require('../utils/logger');

async function sendEmail(to, subject, text, html) {
  const apiKey = process.env.BREVO_API_KEY;
  if (!apiKey) {
    logger.warn({ to, subject }, 'BREVO_API_KEY not set — email notification skipped');
    return null;
  }

  const systemEmail = process.env.SYSTEM_EMAIL;
  if (!systemEmail) {
    logger.warn('SYSTEM_EMAIL not set — email notification skipped');
    return null;
  }

  const data = {
    sender: { name: 'JanSamvaad ResolveOS', email: systemEmail },
    to: [{ email: to }],
    subject,
    textContent: text,
    htmlContent: html
  };

  try {
    await retryWithBackoff(() => axios.post('https://api.brevo.com/v3/smtp/email', data, {
      headers: { 'api-key': apiKey, 'Content-Type': 'application/json' }
    }), { retries: 2 });

    logger.info({ to, subject }, 'Email sent successfully');
    return true;
  } catch (error) {
    const errorMsg = error.response ? JSON.stringify(error.response.data) : error.message;
    logger.error({ err: errorMsg, to }, 'Failed to send email');
    return false;
  }
}

async function sendTelegramAlert(message) {
  const botToken = process.env.TELEGRAM_BOT_TOKEN;
  const chatId = process.env.TELEGRAM_CHAT_ID;
  if (!botToken || !chatId) return null;

  try {
    await axios.post(`https://api.telegram.org/bot${botToken}/sendMessage`, {
      chat_id: chatId,
      text: message,
      parse_mode: 'Markdown'
    });
    return true;
  } catch (error) {
    logger.error({ err: error.message }, 'Failed to send Telegram alert');
    return false;
  }
}

async function notifyNewTicket(ticket, contactEmail = null) {
  const urgencyEmoji = { Critical: '🚨', High: '🚨', Medium: '⚠️', Low: 'ℹ️' }[ticket.severity] || 'ℹ️';
  const dashboardUrl = process.env.DASHBOARD_URL || '';

  const teleMsg =
    `${urgencyEmoji} *New Grievance: ${ticket.ref}*\n` +
    `*Category:* ${ticket.category}\n` +
    `*Urgency:* ${ticket.severity}\n` +
    `*Summary:* ${ticket.summary || 'N/A'}\n` +
    `*Address:* ${ticket.geo_address || 'Unmapped'}\n` +
    (dashboardUrl ? `[View Dashboard](${dashboardUrl}/tickets/${ticket.id})` : '');

  await sendTelegramAlert(teleMsg);

  if (contactEmail) {
    const subject = `Grievance Registered: ${ticket.ref}`;
    const text = `Your grievance has been registered with reference ID: ${ticket.ref}.`;
    const html = `
      <div style="font-family: sans-serif; padding: 20px; max-width: 600px;">
        <h2 style="color: #1a1a2e;">JanSamvaad ResolveOS</h2>
        <p>Your grievance has been registered successfully.</p>
        <table style="border-collapse: collapse; width: 100%;">
          <tr><td style="padding: 8px; font-weight: bold;">Reference ID:</td><td>${ticket.ref}</td></tr>
          <tr><td style="padding: 8px; font-weight: bold;">Category:</td><td>${ticket.category}</td></tr>
          <tr><td style="padding: 8px; font-weight: bold;">Urgency:</td><td>${ticket.severity}</td></tr>
        </table>
        <hr/>
        <p style="color: #666; font-size: 12px;">We will keep you updated on the progress.</p>
      </div>
    `;
    await sendEmail(contactEmail, subject, text, html);
  }
}

module.exports = { sendEmail, sendTelegramAlert, notifyNewTicket };
