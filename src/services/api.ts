// eslint-disable-next-line @typescript-eslint/no-explicit-any
const runtimeConfig = (window as any).__RUNTIME_CONFIG__ || {};
export const API_BASE_URL =
  runtimeConfig.API_BASE_URL ||
  import.meta.env.VITE_API_BASE_URL ||
  'http://localhost:3002/api';

// ─── Access token ────────────────────────────────────────────────────────────
const TOKEN_KEY = 'fasalrakshak_token';

export function getToken(): string | null {
  return localStorage.getItem(TOKEN_KEY);
}

export function setToken(token: string): void {
  localStorage.setItem(TOKEN_KEY, token);
}

export function removeToken(): void {
  localStorage.removeItem(TOKEN_KEY);
}

// ─── Silent token refresh ─────────────────────────────────────────────────────
let isRefreshing = false;
let refreshQueue: Array<(token: string | null) => void> = [];

export async function silentRefresh(): Promise<string | null> {
  if (isRefreshing) {
    return new Promise((resolve) => {
      refreshQueue.push(resolve);
    });
  }

  isRefreshing = true;
  try {
    const res = await fetch(`${API_BASE_URL}/auth/refresh`, {
      method: 'POST',
      credentials: 'include',
    });
    if (!res.ok) {
      refreshQueue.forEach((cb) => cb(null));
      refreshQueue = [];
      return null;
    }
    const data = await res.json();
    const newToken: string = data?.data?.token;
    if (newToken) setToken(newToken);
    refreshQueue.forEach((cb) => cb(newToken || null));
    refreshQueue = [];
    return newToken || null;
  } catch {
    refreshQueue.forEach((cb) => cb(null));
    refreshQueue = [];
    return null;
  } finally {
    isRefreshing = false;
  }
}

// ─── API client ───────────────────────────────────────────────────────────────
export async function apiClient<T>(
  endpoint: string,
  options: RequestInit = {},
  _retry = true
): Promise<T> {
  const token = getToken();
  const headers: Record<string, string> = {
    ...(options.headers as Record<string, string> || {}),
  };

  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }

  if (!(options.body instanceof FormData)) {
    headers['Content-Type'] = 'application/json';
  }

  let response;
  try {
    response = await fetch(`${API_BASE_URL}${endpoint}`, {
      ...options,
      headers,
      credentials: 'include',
    });
  } catch (err) {
    const message = err instanceof Error ? err.message : 'Network error';
    throw new Error(`Failed to connect to server: ${message}. Please check your internet connection and try again.`);
  }

  // On 401: attempt a silent refresh once, then retry the original request
  const isAuthEndpoint = endpoint.startsWith('/auth/');
  if (response.status === 401 && _retry && !isAuthEndpoint) {
    const newToken = await silentRefresh();
    if (newToken) {
      return apiClient<T>(endpoint, options, false);
    }
    removeToken();
    window.location.href = '/login?session=expired';
    throw new Error('Session expired. Please log in again.');
  }

  let data;
  try {
    data = await response.json();
  } catch {
    throw new Error(`Server error: ${response.statusText}`);
  }

  if (!response.ok) {
    throw new Error(data.message || `Request failed with status ${response.status}: ${response.statusText}`);
  }

  return data as T;
}
