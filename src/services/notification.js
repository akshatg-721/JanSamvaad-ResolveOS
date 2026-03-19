const axios = require('axios');
const { retryWithBackoff } = require('../utils/retry');
const logger = require('../utils/logger');

async function sendEmail(to, subject, text, html) {
  const apiKey = process.env.BREVO_API_KEY;
  if (!apiKey) return null;
  
  const data = {
    sender: { 
      name: "JanSamvaad ResolveOS", 
      email: process.env.SYSTEM_EMAIL || "alerts@jansamvaad.gov.in" 
    },
    to: [{ email: to }],
    subject: subject,
    textContent: text,
    htmlContent: html
  };

  try {
    await retryWithBackoff(() => axios.post('https://api.brevo.com/v3/smtp/email', data, {
      headers: {
        'api-key': apiKey,
        'Content-Type': 'application/json'
      }
    }), { retries: 2 });
    
    logger.info({ to, subject }, 'Email sent successfully via Brevo API');
    return true;
  } catch (error) {
    const errorMsg = error.response ? JSON.stringify(error.response.data) : error.message;
    logger.error({ err: errorMsg, to }, 'Failed to send email via Brevo API');
    return false;
  }
}

async function sendTelegramAlert(message) {
  const botToken = process.env.TELEGRAM_BOT_TOKEN;
  const chatId = process.env.TELEGRAM_CHAT_ID;
  
  if (!botToken || !chatId) return null;

  const url = `https://api.telegram.org/bot${botToken}/sendMessage`;
  
  try {
    const res = await axios.post(url, {
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
  const urgencyEmoji = ticket.severity === 'High' ? '🚨' : (ticket.severity === 'Medium' ? '⚠️' : 'ℹ️');
  
  const teleMsg = `${urgencyEmoji} *New Grievance: ${ticket.ref}*\n` +
                 `*Category:* ${ticket.category}\n` +
                 `*Urgency:* ${ticket.severity}\n` +
                 `*Summary:* ${ticket.summary || 'N/A'}\n` +
                 `*Address:* ${ticket.geo_address || 'Unmapped'}\n` +
                 `[View Dashboard](${process.env.DASHBOARD_URL}/tickets/${ticket.id})`;
  
  await sendTelegramAlert(teleMsg);

  if (contactEmail) {
    const subject = `Grievance Registered: ${ticket.ref}`;
    const text = `Your grievance has been successfully registered with reference ID: ${ticket.ref}.`;
    const html = `
      <div style="font-family: sans-serif; padding: 20px;">
        <h2>JanSamvaad ResolveOS</h2>
        <p>Your grievance has been registered successfully.</p>
        <p><strong>Reference ID:</strong> ${ticket.ref}</p>
        <p><strong>Category:</strong> ${ticket.category}</p>
        <hr/>
        <p>We will keep you updated on the progress.</p>
      </div>
    `;
    await sendEmail(contactEmail, subject, text, html);
  }
}

module.exports = {
  sendEmail,
  sendTelegramAlert,
  notifyNewTicket
};
