const logger = require('../utils/logger');
const { retryWithBackoff } = require('../utils/retry');

const NOMINATIM_REVERSE_URL = 'https://nominatim.openstreetmap.org/reverse';

async function getNearbyLandmarks(lat, lon, fetchImpl = fetch) {
  if (!lat || !lon) return [];

  const email = process.env.NOMINATIM_EMAIL;
  if (!email) {
    logger.warn('NOMINATIM_EMAIL not set — nearby landmarks lookup skipped');
    return [];
  }

  try {
    const response = await retryWithBackoff(
      async () => {
        const url = new URL(NOMINATIM_REVERSE_URL);
        url.searchParams.append('lat', lat);
        url.searchParams.append('lon', lon);
        url.searchParams.append('format', 'json');
        url.searchParams.append('zoom', '18');

        const res = await fetchImpl(url.toString(), {
          headers: { 'User-Agent': `JanSamvaad/1.0 (${email})` }
        });

        if (!res.ok) {
          const err = new Error(`Nominatim failed (${res.status})`);
          err.status = res.status;
          throw err;
        }
        return res.json();
      },
      { retries: 3, initialDelayMs: 1000 }
    );

    const address = response?.address || {};
    const landmarks = [];
    const pointsOfInterest = ['amenity', 'shop', 'tourism', 'leisure', 'railway', 'road', 'suburb', 'neighbourhood', 'hamlet'];
    for (const poi of pointsOfInterest) {
      if (address[poi]) landmarks.push(address[poi]);
    }

    return [...new Set(landmarks)];
  } catch (error) {
    logger.error({ err: error, lat, lon }, 'Nearby landmarks service failed');
    return [];
  }
}

module.exports = { getNearbyLandmarks };
