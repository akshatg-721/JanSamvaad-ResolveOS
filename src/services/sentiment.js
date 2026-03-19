const logger = require('../utils/logger');
const { retryWithBackoff } = require('../utils/retry');

const HF_MODEL = 'cardiffnlp/twitter-xlm-roberta-base-sentiment-multilingual';
const HF_ENDPOINT = `https://api-inference.huggingface.co/models/${HF_MODEL}`;

function normalizeSentimentLabel(label) {
  const normalized = String(label || '').toLowerCase();
  if (normalized.includes('neg')) return 'negative';
  if (normalized.includes('pos')) return 'positive';
  return 'neutral';
}

function sentimentToFrustration(sentiment, score) {
  if (sentiment === 'negative' && score >= 0.85) return 'very_high';
  if (sentiment === 'negative' && score >= 0.65) return 'high';
  if (sentiment === 'negative' && score >= 0.45) return 'medium';
  if (sentiment === 'neutral') return 'low';
  return 'low';
}

function keywordFallback(text) {
  const input = String(text || '').toLowerCase();
  const intenseWords = ['urgent', 'immediately', 'angry', 'frustrated', 'pareshan', 'bahut bura', 'complaint again'];
  const mildWords = ['delay', 'late', 'problem', 'issue', 'leak', 'not working'];

  if (intenseWords.some((w) => input.includes(w))) {
    return {
      sentiment: 'negative',
      sentiment_score: 0.9,
      frustration_level: 'very_high'
    };
  }

  if (mildWords.some((w) => input.includes(w))) {
    return {
      sentiment: 'negative',
      sentiment_score: 0.6,
      frustration_level: 'high'
    };
  }

  return {
    sentiment: 'neutral',
    sentiment_score: 0.5,
    frustration_level: 'low'
  };
}

function applyFrustrationUrgency(currentUrgency, frustrationLevel) {
  const urgency = String(currentUrgency || 'medium').toLowerCase();
  if (frustrationLevel === 'very_high' || frustrationLevel === 'high') {
    return 'high';
  }
  if (urgency === 'low' || urgency === 'medium' || urgency === 'high') {
    return urgency;
  }
  return 'medium';
}

async function analyzeSentiment(text, fetchImpl = fetch) {
  const input = String(text || '').trim();
  if (!input) {
    return {
      sentiment: 'neutral',
      sentiment_score: 0.5,
      frustration_level: 'low'
    };
  }

  const hfToken = process.env.HUGGINGFACE_API_KEY;
  if (!hfToken) {
    return keywordFallback(input);
  }

  try {
    const response = await retryWithBackoff(
      async () => {
        const res = await fetchImpl(HF_ENDPOINT, {
          method: 'POST',
          headers: {
            Authorization: `Bearer ${hfToken}`,
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({ inputs: input })
        });
        if (!res.ok) {
          const body = await res.text();
          throw new Error(`HuggingFace sentiment failed (${res.status}): ${body.slice(0, 120)}`);
        }
        return res.json();
      },
      {
        retries: 3,
        initialDelayMs: 500,
        onRetry: (error, attempt) => {
          logger.warn({ err: error, attempt }, 'Retrying sentiment request');
        }
      }
    );

    const candidates = Array.isArray(response?.[0]) ? response[0] : Array.isArray(response) ? response : [];
    if (candidates.length === 0) {
      return keywordFallback(input);
    }
    const best = candidates.reduce((acc, cur) => {
      const curScore = Number(cur.score || 0);
      const accScore = Number(acc.score || 0);
      return curScore > accScore ? cur : acc;
    }, candidates[0]);

    const sentiment = normalizeSentimentLabel(best.label);
    const sentimentScore = Number(best.score || 0.5);
    const frustrationLevel = sentimentToFrustration(sentiment, sentimentScore);
    return {
      sentiment,
      sentiment_score: sentimentScore,
      frustration_level: frustrationLevel
    };
  } catch (error) {
    logger.error({ err: error }, 'Sentiment service failed, using keyword fallback');
    return keywordFallback(input);
  }
}

module.exports = {
  analyzeSentiment,
  applyFrustrationUrgency
};

