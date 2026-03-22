import { RateLimitError } from './error-handler';
import { NextRequest } from 'next/server';

// Temporary in-memory store for rate limiting (can be substituted with Redis later)
const requestCounts = new Map<string, { count: number; windowStart: number }>();

export const rateLimitConfig = {
  windowMs: 15 * 60 * 1000, // 15 minutes
  maxRequests: 100 // limit each IP to 100 requests per windowMs
};

export function checkRateLimit(req: NextRequest, identifier?: string): void {
  const ip = req.headers.get('x-forwarded-for') || req.headers.get('x-real-ip') || 'unknown';
  const key = identifier ? `${identifier}-${ip}` : ip;
  
  const now = Date.now();
  const record = requestCounts.get(key);

  if (!record) {
    requestCounts.set(key, { count: 1, windowStart: now });
    return;
  }

  // Reset window if elapsed
  if (now - record.windowStart > rateLimitConfig.windowMs) {
    record.count = 1;
    record.windowStart = now;
    return;
  }

  record.count++;
  if (record.count > rateLimitConfig.maxRequests) {
    throw new RateLimitError(`Rate limit exceeded. Try again in ${Math.ceil((rateLimitConfig.windowMs - (now - record.windowStart))/1000)} seconds.`);
  }
}

/**
 * Cleanup job to prevent memory leak in dev mapping
 */
setInterval(() => {
  const now = Date.now();
  for (const [key, record] of requestCounts.entries()) {
    if (now - record.windowStart > rateLimitConfig.windowMs) {
      requestCounts.delete(key);
    }
  }
}, rateLimitConfig.windowMs);
