/**
 * Lightweight API client for JanSamvaad ResolveOS frontend.
 * - Reads JWT from localStorage.
 * - Attaches Authorization header to every request.
 * - On 401, clears token and reloads to login.
 */

const BASE = ''; // Vite proxy forwards /api/* to http://localhost:3000

export function getToken(): string | null {
  return localStorage.getItem('js_token');
}

export function setToken(token: string): void {
  localStorage.setItem('js_token', token);
}

export function clearToken(): void {
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

  const res = await fetch(`${BASE}${path}`, { ...options, headers });

  if (res.status === 401) {
    clearToken();
    window.location.href = '/';
    throw new Error('Unauthorized');
  }

  if (!res.ok) {
    const text = await res.text();
    throw new Error(text || `HTTP ${res.status}`);
  }

  return res.json() as Promise<T>;
}

/** Login helper – stores JWT on success */
export async function login(username: string, password: string): Promise<void> {
  const data = await apiFetch<{ token: string }>('/api/auth/login', {
    method: 'POST',
    body: JSON.stringify({ username, password }),
  });
  setToken(data.token);
}
