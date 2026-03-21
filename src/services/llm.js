const { GoogleGenAI } = require('@google/genai');
const logger = require('../utils/logger');

const MODEL_NAME = 'gemini-2.5-flash';

async function transcribeAudio(recordingUrl) {
  // Twilio transcription is handled via /transcribe callback
  // This function is kept for interface compatibility only
  return '';
}

function fallbackIntent(transcript) {
  return {
    category: 'other',
    subcategory: 'general',
    ward: null,
    summary: String(transcript || '').slice(0, 100),
    urgency: 'medium',
    language_detected: 'hinglish'
  };
}

async function extractIntent(transcript, translatedText = '') {
  const apiKey = process.env.GEMINI_API_KEY || process.env.GOOGLE_API_KEY;
  if (!apiKey) {
    logger.warn('GEMINI_API_KEY is not set. Using fallback intent.');
    return fallbackIntent(transcript);
  }

  const ai = new GoogleGenAI({ apiKey });
  const prompt = `
You are a high-accuracy civic intake AI for JanSamvaad ResolveOS.
Analyze the following citizen transcript (often in Hinglish, Tamil, or regional dialects).

Extract:
- category: one of [water, road, electricity, sanitation, other]
- subcategory: brief descriptor
- ward: ward name or number if mentioned, else null
- location: specific street, area, or landmark mentioned
- summary: one sentence summary in English
- urgency: one of [Low, Medium, High, Critical]
- language_detected: original language (e.g., Hinglish, Tamil, Hindi)
- sentiment: [positive, neutral, negative]

Return ONLY valid JSON, no explanation, no markdown.
If the transcript is in Tamil or mixed Hinglish, use your deep multilingual capabilities to extract intent accurately.

Original Transcript:
${transcript}

English Translation:
${translatedText}
`;

  try {
    const result = await ai.models.generateContent({
      model: MODEL_NAME,
      contents: prompt
    });

    const rawText = result.text ? result.text.trim() : '';
    const cleaned = rawText
      .replace(/^```json\s*/i, '')
      .replace(/^```\s*/i, '')
      .replace(/\s*```$/, '');

    return JSON.parse(cleaned);
  } catch (error) {
    logger.error({ err: error, transcript }, 'Gemini extraction failed. Using fallback intent.');
    return fallbackIntent(transcript);
  }
}

module.exports = {
  transcribeAudio,
  extractIntent
};
