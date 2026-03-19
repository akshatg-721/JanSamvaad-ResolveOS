const pool = require('../db');
const logger = require('../utils/logger');

async function findDuplicate(summary, category, ward_id) {
  if (!summary || !category) {
    return { is_duplicate: false, duplicate_of: null };
  }

  try {
    // Search for similar tickets in the same category and ward within last 7 days
    const query = `
      SELECT id, ref, similarity(summary, $1) as similarity_score
      FROM tickets
      WHERE category = $2
      AND (ward_id = $3 OR $3 IS NULL)
      AND status IN ('open', 'in_progress')
      AND created_at >= NOW() - INTERVAL '7 days'
      AND similarity(summary, $1) > 0.3
      ORDER BY similarity_score DESC
      LIMIT 1
    `;

    const res = await pool.query(query, [summary, category, ward_id]);

    if (res.rows.length > 0) {
      const bestMatch = res.rows[0];
      const similarity = parseFloat(bestMatch.similarity_score);

      if (similarity > 0.6) {
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
