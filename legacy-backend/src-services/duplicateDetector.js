const pool = require('../db');
const logger = require('../utils/logger');

function parsePositiveNumber(value, fallback) {
  const parsed = Number(value);
  return Number.isFinite(parsed) && parsed > 0 ? parsed : fallback;
}

const DUPLICATE_LOOKBACK_DAYS = parsePositiveNumber(process.env.DUPLICATE_LOOKBACK_DAYS, 7);
const DUPLICATE_CANDIDATE_THRESHOLD = parsePositiveNumber(process.env.DUPLICATE_CANDIDATE_THRESHOLD, 0.3);
const DUPLICATE_MATCH_THRESHOLD = parsePositiveNumber(process.env.DUPLICATE_MATCH_THRESHOLD, 0.6);
const ACTIVE_DUPLICATE_STATUSES = (process.env.DUPLICATE_ACTIVE_STATUSES || 'open,in_progress')
  .split(',')
  .map((value) => value.trim())
  .filter(Boolean);

async function findDuplicate(summary, category, ward_id) {
  if (!summary || !category) {
    return { is_duplicate: false, duplicate_of: null };
  }

  try {
    // Search for similar tickets in the same category and ward within configurable lookback.
    const query = `
      SELECT id, ref, similarity(summary, $1) as similarity_score
      FROM tickets
      WHERE category = $2
      AND (ward_id = $3 OR $3 IS NULL)
      AND status = ANY($4::text[])
      AND created_at >= NOW() - ($5::int * INTERVAL '1 day')
      AND similarity(summary, $1) > $6
      ORDER BY similarity_score DESC
      LIMIT 1
    `;

    const res = await pool.query(query, [
      summary,
      category,
      ward_id,
      ACTIVE_DUPLICATE_STATUSES,
      DUPLICATE_LOOKBACK_DAYS,
      DUPLICATE_CANDIDATE_THRESHOLD
    ]);

    if (res.rows.length > 0) {
      const bestMatch = res.rows[0];
      const similarity = parseFloat(bestMatch.similarity_score);

      if (similarity >= DUPLICATE_MATCH_THRESHOLD) {
        return {
          is_duplicate: true,
          duplicate_of: bestMatch.id,
          ref: bestMatch.ref,
          score: similarity
        };
      }
    }

    return { is_duplicate: false, duplicate_of: null };
  } catch (error) {
    logger.error({ err: error, summary }, 'Duplicate detection failed');
    return { is_duplicate: false, duplicate_of: null };
  }
}

module.exports = {
  findDuplicate
};
