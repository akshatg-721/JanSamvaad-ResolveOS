import DOMPurify from 'dompurify';
import { JSDOM } from 'jsdom';

const window = new JSDOM('').window;
const purify = DOMPurify(window as any);

export function sanitizeString(input: string): string {
  return input
    .trim()
    .replace(/[^\w\s\-.,!?()]/g, '')
    .slice(0, 1000);
}

export function sanitizeHtml(input: string): string {
  return purify.sanitize(input, {
    ALLOWED_TAGS: ['p', 'br', 'strong', 'em', 'u', 'a'],
    ALLOWED_ATTR: ['href'],
  });
}

export function sanitizeEmail(email: string): string {
  return email.toLowerCase().trim();
}

export function sanitizeSearchQuery(query: string): string {
  return query
    .trim()
    .replace(/[^\w\s\-]/g, '')
    .slice(0, 100);
}

export function validateFileName(filename: string): string {
  return filename
    .replace(/[^\w\-_. ]/g, '')
    .replace(/\s+/g, '_')
    .slice(0, 255);
}
