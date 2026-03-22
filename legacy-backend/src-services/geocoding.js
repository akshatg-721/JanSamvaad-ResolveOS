const logger = require('../utils/logger');
const { retryWithBackoff } = require('../utils/retry');

const NOMINATIM_BASE_URL = 'https://nominatim.openstreetmap.org/search';

async function geocodeAddress(location, fetchImpl = fetch) {
  const query = String(location || '').trim();
  if (!query) {
    return null;
  }

  const email = process.env.NOMINATIM_EMAIL || 'admin@jansamvaad.org';

  try {
    const response = await retryWithBackoff(
      async () => {
        const url = new URL(NOMINATIM_BASE_URL);
        url.searchParams.append('q', query);
        url.searchParams.append('format', 'json');
        url.searchParams.append('countrycodes', 'in'); // Limit to India
        url.searchParams.append('limit', '1');

        const res = await fetchImpl(url.toString(), {
          headers: {
            'User-Agent': `JanSamvaad/1.0 (${email})`
          }
        });

        if (!res.ok) {
          throw new Error(`Nominatim geocoding failed (${res.status})`);
        }
        return res.json();
      },
      {
        retries: 3,
        initialDelayMs: 1000
      }
    );

    if (Array.isArray(response) && response.length > 0) {
      const bestMatch = response[0];
      return {
        latitude: parseFloat(bestMatch.lat),
        longitude: parseFloat(bestMatch.lon),
        geo_address: bestMatch.display_name,
        location_accuracy: 1 // High accuracy from exact match
      };
    }

    return null;
  } catch (error) {
    logger.error({ err: error, location }, 'Geocoding service failed');
    return null;
  }
}

module.exports = {
  geocodeAddress
};
