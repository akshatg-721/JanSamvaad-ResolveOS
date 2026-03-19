/**
 * Lightweight API client for JanSamvaad ResolveOS dashboard.
 */

// Use relative path to hit Next.js rewrites
const getDynamicBase = () => '';
const DIRECT_BACKEND_BASE = (process.env.NEXT_PUBLIC_API_URL || 'http://127.0.0.1:3000').replace(/\/$/, '');

function looksLikeHtml(text: string): boolean {
  const sample = text.trim().slice(0, 500).toLowerCase();
  return (
    sample.startsWith('<!doctype html') ||
    sample.startsWith('<html') ||
    sample.includes('<head') ||
    sample.includes('<meta') ||
    sample.includes('<body')
  );
}

function cleanErrorMessage(input: string | null | undefined, fallback: string): string {
  const message = (input || '').trim();
  if (!message) return fallback;
  if (looksLikeHtml(message)) return fallback;
  if (message.toLowerCase().includes('404: this page could not be found')) {
    return 'API endpoint not found. Please verify backend routes and proxy config.';
  }
  return message;
}

function extractMessageFromJson(payload: unknown): string | null {
  if (!payload || typeof payload !== 'object') {
    return null;
  }
  const obj = payload as Record<string, unknown>;
  const direct = obj.error ?? obj.message;
  return typeof direct === 'string' && direct.trim() ? direct.trim() : null;
}

export function getToken(): string | null {
  if (typeof window === 'undefined') return null;
  return localStorage.getItem('js_token');
}

export function setToken(token: string): void {
  if (typeof window === 'undefined') return;
  localStorage.setItem('js_token', token);
}

export function clearToken(): void {
  if (typeof window === 'undefined') return;
  localStorage.removeItem('js_token');
}

export async function apiFetch<T = unknown>(
  path: string,
  options: RequestInit = {}
): Promise<T> {
  const token = getToken();
  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
    ...(options.headers as Record<string, string>),
  };
  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }

  const runFetch = (base: string) => fetch(`${base}${path}`, { ...options, headers });

  let res: Response;
  try {
    res = await runFetch(getDynamicBase());
  } catch {
    try {
      res = await runFetch(DIRECT_BACKEND_BASE);
    } catch {
      throw new Error('Cannot reach backend service. Please ensure API server is running on port 3000.');
    }
  }

  const initialContentType = res.headers.get('content-type') || '';
  const gotHtml404 = res.status === 404 && initialContentType.includes('text/html');
  if (path.startsWith('/api/') && gotHtml404) {
    res = await runFetch(DIRECT_BACKEND_BASE);
  }

  if (res.status === 401 || res.status === 403) {
    const isLoginCall = path.startsWith('/api/auth/login');
    if (!isLoginCall) {
      clearToken();
    }
    if (!isLoginCall && typeof window !== 'undefined') {
      window.location.href = '/login';
    }
    throw new Error('Unauthorized');
  }

  if (!res.ok) {
    const contentType = res.headers.get('content-type') || '';

    if (contentType.includes('application/json')) {
      let payload: unknown = null;
      try {
        payload = await res.json();
      } catch {
        // ignore JSON parse errors and fall through to generic error
      }
      const fallback = `Request failed (${res.status})`;
      const message = cleanErrorMessage(extractMessageFromJson(payload), fallback);
      throw new Error(message);
    }

    const text = await res.text();
    if (looksLikeHtml(text)) {
      throw new Error('Backend/API route misconfigured. Received HTML instead of JSON response.');
    }
    throw new Error(cleanErrorMessage(text, `Request failed (${res.status})`));
  }

  const contentType = res.headers.get('content-type') || '';
  if (!contentType.includes('application/json')) {
    throw new Error('Unexpected response format from API. Expected JSON.');
  }

  return res.json() as Promise<T>;
}

export async function login(username: string, password: string): Promise<void> {
  const data = await apiFetch<{ token: string }>('/api/auth/login', {
    method: 'POST',
    body: JSON.stringify({ username, password }),
  });
  setToken(data.token);
}
