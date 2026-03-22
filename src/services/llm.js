const { GoogleGenAI } = require('@google/genai');
const logger = require('../utils/logger');

const MODEL_NAME = 'gemini-2.5-flash';

// JSON schema example embedded in prompt for consistent output
const JSON_SCHEMA_EXAMPLE = `{
  "category": "water",
  "subcategory": "supply shortage",
  "ward": "Ward 4",
  "location": "Main Road near Old Market",
  "summary": "Citizen reports no water supply for 3 days in Ward 4.",
  "urgency": "High",
  "language_detected": "Hinglish",
  "sentiment": "negative"
}`;

async function transcribeAudio(recordingUrl) {
  // Twilio transcription is handled via /transcribe callback
  return '';
}

function fallbackIntent(transcript) {
  return {
    category: 'other',
    subcategory: 'general',
    ward: null,
    summary: String(transcript || '').slice(0, 100),
    urgency: 'Medium',
    language_detected: 'unknown',
    sentiment: 'neutral'
  };
}

function parseJsonSafely(rawText) {
  if (!rawText) return null;
  // Strip markdown code fences
  const cleaned = rawText.replace(/^```json\s*/i, '').replace(/^```\s*/i, '').replace(/\s*```$/, '').trim();
  try {
    return JSON.parse(cleaned);
  } catch {
    // Second pass: extract first {...} block
    const match = cleaned.match(/\{[\s\S]+\}/);
    if (match) {
      try { return JSON.parse(match[0]); } catch { return null; }
    }
    return null;
  }
}

async function extractIntent(transcript, translatedText = '') {
  if (!transcript || transcript.trim().length === 0) {
    logger.warn('Empty transcript — skipping LLM extraction');
    return fallbackIntent(transcript);
  }

  const apiKey = process.env.GEMINI_API_KEY || process.env.GOOGLE_API_KEY;
  if (!apiKey) {
    logger.warn('GEMINI_API_KEY is not set. Using fallback intent.');
    return fallbackIntent(transcript);
  }

  const ai = new GoogleGenAI({ apiKey });
  const prompt = `You are a high-accuracy civic intake AI for JanSamvaad ResolveOS, a citizen grievance system in India.

Analyze the citizen complaint below (often in Hinglish, Hindi, Tamil, or regional dialects) and extract structured information.

RULES:
1. Return ONLY valid JSON — no markdown, no explanation, no extra text.
2. "category" MUST be one of: water, road, electricity, sanitation, other
3. "urgency" MUST be one of: Low, Medium, High, Critical
4. "sentiment" MUST be one of: positive, neutral, negative
5. If a field is unknown, use null (not empty string).

EXACT OUTPUT FORMAT:
${JSON_SCHEMA_EXAMPLE}

Original Transcript:
${transcript}

${translatedText ? `English Translation:\n${translatedText}` : ''}`;

  try {
    const result = await ai.models.generateContent({
      model: MODEL_NAME,
      contents: prompt
    });

    const rawText = result.text ? result.text.trim() : '';
    const parsed = parseJsonSafely(rawText);

    if (!parsed) {
      logger.warn({ rawText: rawText.slice(0, 200) }, 'LLM returned unparseable JSON — using fallback intent');
      return fallbackIntent(transcript);
    }

    // Normalize fields to prevent downstream constraint violations
    const validCategories = ['water', 'road', 'electricity', 'sanitation', 'other'];
    const validUrgencies = ['Low', 'Medium', 'High', 'Critical'];
    const validSentiments = ['positive', 'neutral', 'negative'];

    return {
      ...parsed,
      category: validCategories.includes(parsed.category) ? parsed.category : 'other',
      urgency: validUrgencies.includes(parsed.urgency) ? parsed.urgency : 'Medium',
      sentiment: validSentiments.includes(parsed.sentiment) ? parsed.sentiment : 'neutral'
    };
  } catch (error) {
    logger.error({ err: error, transcript: transcript.slice(0, 100) }, 'Gemini extraction failed. Using fallback intent.');
    return fallbackIntent(transcript);
  }
}

module.exports = {
  transcribeAudio,
  extractIntent
};
