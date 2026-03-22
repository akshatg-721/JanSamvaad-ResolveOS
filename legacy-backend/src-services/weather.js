const logger = require('../utils/logger');
const { retryWithBackoff } = require('../utils/retry');

const OPENWEATHER_URL = 'https://api.openweathermap.org/data/2.5/weather';

async function getWeatherData(lat, lon, fetchImpl = fetch) {
  const apiKey = process.env.OPENWEATHER_API_KEY;
  if (!apiKey || !lat || !lon) {
    return null;
  }

  try {
    const response = await retryWithBackoff(
      async () => {
        const url = new URL(OPENWEATHER_URL);
        url.searchParams.append('lat', lat);
        url.searchParams.append('lon', lon);
        url.searchParams.append('appid', apiKey);
        url.searchParams.append('units', 'metric');

        const res = await fetchImpl(url.toString());
        if (!res.ok) {
          throw new Error(`OpenWeatherMap failed (${res.status})`);
        }
        return res.json();
      },
      {
        retries: 3,
        initialDelayMs: 1000
      }
    );

    return {
      condition: response?.weather?.[0]?.main || 'Clear',
      temperature: response?.main?.temp || 25,
      humidity: response?.main?.humidity,
      rainfall: response?.rain?.['1h'] || 0
    };
  } catch (error) {
    logger.error({ err: error, lat, lon }, 'Weather service failed');
    return null;
  }
}

function calculateWeatherBoost(category, weatherData, currentSeverity) {
  if (!weatherData) return { severity: currentSeverity, weather_boosted: false };

  const cat = String(category || '').toLowerCase();
  const cond = String(weatherData.condition || '').toLowerCase();
  const temp = weatherData.temperature || 0;

  let boosted = false;
  let severity = currentSeverity;

  // Rule 1: Rain/Thunderstorm + Water/Drainage
  if ((cond.includes('rain') || cond.includes('storm')) && 
      (cat.includes('drainage') || cat.includes('water') || cat.includes('flood'))) {
    severity = 'High';
    boosted = true;
  }

  // Rule 2: High Heat + Water Supply
  if (temp > 42 && cat.includes('water supply')) {
    severity = 'High';
    boosted = true;
  }

  return { severity, weather_boosted: boosted };
}

module.exports = {
  getWeatherData,
  calculateWeatherBoost
};
