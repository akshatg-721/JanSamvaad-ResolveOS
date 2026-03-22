import DOMPurify from 'isomorphic-dompurify';
import xss from 'xss';

/**
 * Strips all HTML tags and strictly escapes the payload.
 * Useful for titles, names, simple inputs.
 */
export function sanitizeInput(input: string): string {
  if (!input) return input;
  return xss(input, {
    whiteList: {}, // empty means no tags allowed
    stripIgnoreTag: true,
    stripIgnoreTagBody: ['script', 'style']
  }).trim();
}

/**
 * Allows safe HTML formatting (e.g., strong, em, b, i, p, br, ul, ol, li).
 * Useful for rich text fields like Complaint Descriptions.
 */
export function sanitizeHtml(html: string): string {
  if (!html) return html;
  return DOMPurify.sanitize(html, {
    ALLOWED_TAGS: ['b', 'i', 'em', 'strong', 'a', 'p', 'br', 'ul', 'ol', 'li', 'blockquote', 'code', 'pre'],
    ALLOWED_ATTR: ['href']
  });
}

/**
 * Deeply traverses an object and sanitizes all string values.
 * By default, uses strict text sanitization. 
 * specific rich text fields can be passed in `htmlFields` array to use sanitizeHtml instead.
 */
export function sanitizeObject<T extends Record<string, any>>(
  obj: T,
  htmlFields: string[] = ['description', 'comment']
): T {
  if (obj === null || typeof obj !== 'object') {
    return obj;
  }

  if (Array.isArray(obj)) {
    return obj.map(item => sanitizeObject(item, htmlFields)) as unknown as T;
  }

  const sanitized = {} as Record<string, any>;

  for (const [key, value] of Object.entries(obj)) {
    if (typeof value === 'string') {
      if (htmlFields.includes(key)) {
        sanitized[key] = sanitizeHtml(value);
      } else {
        sanitized[key] = sanitizeInput(value);
      }
    } else if (typeof value === 'object') {
      sanitized[key] = sanitizeObject(value, htmlFields);
    } else {
      sanitized[key] = value;
    }
  }

  return sanitized as T;
}
