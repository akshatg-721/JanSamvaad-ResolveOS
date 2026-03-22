/**
 * Retries an async task with exponential backoff.
 * Immediately throws on client errors (4xx) without retrying.
 */
async function retryWithBackoff(task, options = {}) {
  const {
    retries = 3,
    initialDelayMs = 400,
    factor = 2,
    onRetry = null
  } = options;

  let attempt = 0;
  let delay = initialDelayMs;
  let lastError;

  while (attempt < retries) {
    try {
      return await task(attempt + 1);
    } catch (error) {
      lastError = error;

      // Don't retry client errors (4xx) — they won't resolve on retry
      const status = error?.response?.status ?? error?.status;
      if (status >= 400 && status < 500) {
        throw error;
      }

      attempt += 1;
      if (attempt >= retries) break;

      if (typeof onRetry === 'function') {
        onRetry(error, attempt);
      }

      await new Promise((resolve) => setTimeout(resolve, delay));
      delay *= factor;
    }
  }

  throw lastError;
}

module.exports = { retryWithBackoff };
