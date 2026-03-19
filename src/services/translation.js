const { franc } = require('franc');
const logger = require('../utils/logger');
const { retryWithBackoff } = require('../utils/retry');

const MYMEMORY_ENDPOINT = 'https://api.mymemory.translated.net/get';

const LANGUAGE_MAP = {
  hin: 'Hindi',
  tam: 'Tamil',
  tel: 'Telugu',
  ben: 'Bengali',
  kan: 'Kannada',
  mal: 'Malayalam',
  mar: 'Marathi',
  guj: 'Gujarati',
  pan: 'Punjabi',
  eng: 'English'
};

const ISO_639_1 = {
  hin: 'hi',
  tam: 'ta',
  tel: 'te',
  ben: 'bn',
  kan: 'kn',
  mal: 'ml',
  mar: 'mr',
  guj: 'gu',
  pan: 'pa',
  eng: 'en'
};

async function translateToEnglish(text, fetchImpl = fetch) {
  const input = String(text || '').trim();
  if (!input) {
    return {
      detected_language: 'eng',
      original_text: '',
      translated_text: ''
    };
  }

  // Detect language
  const langCode = franc(input, { minLength: 3 });
  const language = LANGUAGE_MAP[langCode] || 'English';
  const iso2 = ISO_639_1[langCode] || 'en';

  if (iso2 === 'en') {
    return {
      detected_language: langCode,
      original_text: input,
      translated_text: input
    };
  }

  try {
    const response = await retryWithBackoff(
      async () => {
        const url = new URL(MYMEMORY_ENDPOINT);
        url.searchParams.append('q', input);
        url.searchParams.append('langpair', `${iso2}|en`);

        const res = await fetchImpl(url.toString());
        if (!res.ok) {
          throw new Error(`MyMemory translation failed (${res.status})`);
        }
        return res.json();
      },
      {
        retries: 3,
        initialDelayMs: 500
      }
    );

    const translatedText = response?.responseData?.translatedText || input;

    return {
      detected_language: langCode,
      original_text: input,
      translated_text: translatedText
    };
  } catch (error) {
    logger.error({ err: error }, 'Translation service failed, using original text');
    return {
      detected_language: langCode,
      original_text: input,
      translated_text: input
    };
  }
}

module.exports = {
  translateToEnglish
};
