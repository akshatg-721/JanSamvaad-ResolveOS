export class UnauthorizedError extends Error {
  constructor(message = 'Unauthorized') {
    super(message);
    this.name = 'UnauthorizedError';
  }
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

  const API_BASE = (process.env.NEXT_PUBLIC_API_URL || '').replace(/\/$/, '');
  const url = `${API_BASE}${path}`;

  try {
    const res = await fetch(url, { ...options, headers });

    if (res.status === 401 || res.status === 403) {
      clearToken();
      throw new UnauthorizedError('Unauthorized access');
    }

    if (!res.ok) {
      let errorMessage = `API request failed with status: ${res.status}`;
      try {
        const errorData = await res.json();
        if (errorData?.message || errorData?.error) {
          errorMessage = errorData.message || errorData.error;
        }
      } catch (e) {
        // Fallback to generic message if response isn't JSON
      }
      throw new Error(errorMessage);
    }

    return res.json() as Promise<T>;
  } catch (err) {
    if (err instanceof UnauthorizedError) {
      throw err;
    }
    throw new Error(err instanceof Error ? err.message : 'Network error occurred');
  }
}

export async function login(username: string, password: string): Promise<void> {
  const data = await apiFetch<{ token: string }>('/api/auth/login', {
    method: 'POST',
    body: JSON.stringify({ username, password }),
  });
  setToken(data.token);
}
