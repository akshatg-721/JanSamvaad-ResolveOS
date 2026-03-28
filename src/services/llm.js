const { GoogleGenAI } = require('@google/genai');
const logger = require('../utils/logger');

const MODEL = process.env.GEMINI_MODEL || 'gemini-2.5-flash';
const ALLOWED_TICKET_CATEGORIES = ['Road', 'Water Supply', 'Electricity', 'Sanitation', 'Public Safety', 'Other'];

async function transcribeAudio(recordingUrl) {
  // Twilio transcription is handled via /transcribe callback
  // This function is kept for interface compatibility only
  return '';
}

function fallbackIntent(transcript) {
  const safeTranscript = String(transcript || '');
  const normalizedTranscript = safeTranscript.toLowerCase();
  const wardMatch = safeTranscript.match(/ward\s*(\d+)/i);
  const ward = wardMatch ? wardMatch[1] : null;
  let category = 'Other';
  if (/(garbage|trash|waste|sewage|drain|sanitation)/i.test(normalizedTranscript)) {
    category = 'Sanitation';
  } else if (/(water|leak|pipeline|tap)/i.test(normalizedTranscript)) {
    category = 'Water Supply';
  } else if (/(power|electric|streetlight|street light|voltage)/i.test(normalizedTranscript)) {
    category = 'Electricity';
  } else if (/(road|pothole|traffic|street)/i.test(normalizedTranscript)) {
    category = 'Road';
  } else if (/(theft|crime|unsafe|safety|assault)/i.test(normalizedTranscript)) {
    category = 'Public Safety';
  }
  return {
    category,
    subcategory: 'general',
    ward,
    summary: safeTranscript.slice(0, 100),
    urgency: 'medium',
    language_detected: 'hinglish'
  };
}

function fallbackResolutionSummary(tickets, reason = 'model_unavailable') {
  const safeTickets = Array.isArray(tickets) ? tickets : [];
  const firstTicket = safeTickets[0];
  const firstRef = firstTicket?.ref || '#UNKNOWN';
  const categories = safeTickets
    .map((ticket) => String(ticket.category || '').toLowerCase())
    .filter(Boolean);
  const categoryCounts = categories.reduce((acc, category) => {
    acc[category] = (acc[category] || 0) + 1;
    return acc;
  }, {});
  const topCategory = Object.entries(categoryCounts).sort((a, b) => b[1] - a[1])[0]?.[0] || 'general issue';
  const duplicateCount = Math.max(0, safeTickets.length - 1);
  return {
    summaryText: `Ticket ${firstRef} highlights a recurring ${topCategory} pattern in nearby wards. Multiple unresolved reports suggest a shared infrastructure root cause requiring coordinated action.`,
    highlightedEntities: [firstRef, 'shared infrastructure root cause'],
    suggestedActions: [
      { title: 'Dispatch Maintenance Crew', subtitle: 'Estimated Resolve: 2h' },
      { title: 'Notify Ward Counselor', subtitle: 'Protocol requirement' },
      { title: 'Merge Related Tickets', subtitle: `${duplicateCount} duplicates detected` }
    ],
    meta: {
      fallback: true,
      reason
    }
  };
}

async function extractIntent(transcript) {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    logger.warn('No GEMINI_API_KEY set — using fallback intent');
    return fallbackIntent(transcript);
  }

  const ai = new GoogleGenAI({ apiKey });
  const prompt = `
You are a civic grievance intake assistant for Indian municipalities.
Extract from the caller transcript:
- category: one of [Road, Water Supply, Electricity, Sanitation, Public Safety, Other]
- subcategory: brief descriptor
- ward: ward name or number if mentioned, else null
- summary: one sentence summary in English
- urgency: low/medium/high based on language used
- language_detected: hindi/english/hinglish
Return ONLY a valid JSON object in this exact shape:
{"category":"Road","subcategory":"string","ward":null,"summary":"string","urgency":"medium","language_detected":"hinglish"}
Do not return markdown, code fences, or extra text.

Transcript:
${transcript}
`;

  try {
    const result = await ai.models.generateContent({
      model: MODEL,
      contents: prompt
    });

    const rawText = result.text ? result.text.trim() : '';
    logger.info({ model: MODEL, rawTextLength: rawText.length }, 'Gemini response received');

    if (!rawText) {
      logger.warn({ model: MODEL, transcript: transcript.slice(0, 80) }, 'Gemini returned empty response');
      return fallbackIntent(transcript);
    }

    const cleaned = rawText
      .replace(/^```(?:json)?\s*/i, '')
      .replace(/\s*```$/i, '')
      .trim();
    const jsonStart = cleaned.indexOf('{');
    const jsonEnd = cleaned.lastIndexOf('}');
    const jsonPayload = jsonStart !== -1 && jsonEnd !== -1 && jsonEnd >= jsonStart
      ? cleaned.slice(jsonStart, jsonEnd + 1)
      : cleaned;

    let parsed;
    try {
      parsed = JSON.parse(jsonPayload);
    } catch (parseError) {
      logger.error({ rawText, parseError: parseError.message, model: MODEL }, 'Failed to parse Gemini JSON response');
      console.error('Gemini category fallback triggered: failed to parse JSON response');
      const fallback = fallbackIntent(transcript);
      fallback.category = 'Other';
      return fallback;
    }

    const aiCategory = String(parsed?.category || '').trim();
    const matchedCategory = ALLOWED_TICKET_CATEGORIES.find(
      (category) => category.toLowerCase() === aiCategory.toLowerCase()
    );
    if (!matchedCategory) {
      console.error(`Gemini category fallback triggered: invalid category "${aiCategory || 'EMPTY'}"`);
    }

    return {
      ...fallbackIntent(transcript),
      ...(parsed && typeof parsed === 'object' ? parsed : {}),
      category: matchedCategory || 'Other'
    };
  } catch (error) {
    logger.error({ err: error, model: MODEL, errorMessage: error.message, transcript: transcript.slice(0, 80) }, 'Gemini API call failed');
    return fallbackIntent(transcript);
  }
}

async function generateResolutionSummary(tickets) {
  const safeTickets = Array.isArray(tickets)
    ? tickets.map((ticket) => ({
      ref: ticket.ref,
      category: ticket.category,
      severity: ticket.severity,
      status: ticket.status,
      ward_id: ticket.ward_id,
      created_at: ticket.created_at,
      summary: ticket.summary || ticket.ai_summary || null
    }))
    : [];
  if (safeTickets.length === 0) {
    return fallbackResolutionSummary([], 'no_open_tickets');
  }

  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    logger.warn('No GEMINI_API_KEY set — using fallback AI resolution summary');
    return fallbackResolutionSummary(safeTickets, 'missing_api_key');
  }

  const ai = new GoogleGenAI({ apiKey });
  const prompt = `
You are an operations copilot for an Indian civic grievance dashboard.
Given recent unresolved tickets, infer likely common root causes and produce concise action guidance.
Return ONLY valid JSON with this exact schema:
{
  "summaryText": "string",
  "highlightedEntities": ["string", "string"],
  "suggestedActions": [
    {"title": "string", "subtitle": "string"},
    {"title": "string", "subtitle": "string"},
    {"title": "string", "subtitle": "string"}
  ]
}
Constraints:
- summaryText max 60 words
- highlightedEntities length 2 to 4
- suggestedActions length exactly 3
- Keep language professional and operator-focused
- Use ticket refs and concrete infrastructure terms when possible

Tickets:
${JSON.stringify(safeTickets)}
`;

  try {
    const result = await ai.models.generateContent({
      model: MODEL,
      contents: prompt
    });
    const rawText = result.text ? result.text.trim() : '';
    if (!rawText) {
      return fallbackResolutionSummary(safeTickets, 'empty_model_response');
    }
    const cleaned = rawText
      .replace(/^```json\s*/i, '')
      .replace(/^```\s*/i, '')
      .replace(/\s*```$/, '');
    const parsed = JSON.parse(cleaned);
    if (
      !parsed ||
      typeof parsed.summaryText !== 'string' ||
      !Array.isArray(parsed.highlightedEntities) ||
      !Array.isArray(parsed.suggestedActions)
    ) {
      return fallbackResolutionSummary(safeTickets, 'invalid_model_schema');
    }
    const normalizedActions = parsed.suggestedActions
      .map((action) => ({
        title: String(action?.title || '').trim(),
        subtitle: String(action?.subtitle || '').trim()
      }))
      .filter((action) => action.title && action.subtitle)
      .slice(0, 3);
    const finalActions = normalizedActions.length === 3
      ? normalizedActions
      : fallbackResolutionSummary(safeTickets).suggestedActions;
    return {
      summaryText: parsed.summaryText.trim() || fallbackResolutionSummary(safeTickets).summaryText,
      highlightedEntities: parsed.highlightedEntities.map((entity) => String(entity || '').trim()).filter(Boolean).slice(0, 4),
      suggestedActions: finalActions,
      meta: {
        fallback: false,
        reason: null
      }
    };
  } catch (error) {
    logger.error({ err: error }, 'Failed to generate AI resolution summary');
    const message = String(error?.message || '').toLowerCase();
    const isRateLimit = message.includes('429') || message.includes('quota') || message.includes('rate limit');
    return fallbackResolutionSummary(safeTickets, isRateLimit ? 'rate_limited' : 'model_failure');
  }
}

async function askJanSamvaadAssistant(userMessage, tickets) {
  const safeMessage = String(userMessage || '').trim();
  const safeTickets = Array.isArray(tickets)
    ? tickets.map((ticket) => ({
      id: ticket.id,
      ref: ticket.ref,
      category: ticket.category,
      ward_id: ticket.ward_id,
      severity: ticket.severity,
      created_at: ticket.created_at
    }))
    : [];
  const fallback = {
    response: 'JanSamvaad Assistant is temporarily unavailable. Please try again in a moment.',
    fallback: true
  };

  if (!safeMessage) {
    return {
      response: 'Please share a question so I can help with ticket actions and next steps.',
      fallback: true
    };
  }

  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    logger.warn('No GEMINI_API_KEY set — JanSamvaad Assistant fallback');
    return fallback;
  }

  const ai = new GoogleGenAI({ apiKey });
  const prompt = `You are JanSamvaad Assistant, an expert municipal operations advisor for Indian city corporations. The operator has asked: "${safeMessage}". Here is the current open ticket data for context: ${JSON.stringify(safeTickets)}. Provide clear, actionable, concise guidance in plain text. Be specific about steps, who to notify, and estimated timelines where relevant. Do not output JSON.`;

  try {
    const result = await ai.models.generateContent({
      model: MODEL,
      contents: prompt
    });
    const text = String(result?.text || '').trim();
    if (!text) {
      return fallback;
    }
    return {
      response: text,
      fallback: false
    };
  } catch (error) {
    logger.error({ err: error }, 'JanSamvaad Assistant generation failed');
    return fallback;
  }
}

module.exports = {
  transcribeAudio,
  extractIntent,
  generateResolutionSummary,
  askJanSamvaadAssistant
};
