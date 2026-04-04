import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { getToken, setToken, removeToken, apiClient } from '@/services/api';

// Mock fetch globally
const mockFetch = vi.fn();
vi.stubGlobal('fetch', mockFetch);

describe('Token management', () => {
  beforeEach(() => {
    localStorage.clear();
  });

  it('getToken returns null when no token is stored', () => {
    expect(getToken()).toBeNull();
  });

  it('setToken stores token in localStorage', () => {
    setToken('test-token-123');
    expect(localStorage.getItem('kisanseva_token')).toBe('test-token-123');
  });

  it('getToken retrieves stored token', () => {
    setToken('my-token');
    expect(getToken()).toBe('my-token');
  });

  it('removeToken clears the token from localStorage', () => {
    setToken('to-remove');
    removeToken();
    expect(getToken()).toBeNull();
  });

  it('setToken overwrites existing token', () => {
    setToken('first');
    setToken('second');
    expect(getToken()).toBe('second');
  });
});

describe('apiClient', () => {
  beforeEach(() => {
    localStorage.clear();
    mockFetch.mockReset();
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it('adds Authorization header when token exists', async () => {
    setToken('bearer-token');
    mockFetch.mockResolvedValueOnce({
      ok: true,
      status: 200,
      json: async () => ({ success: true, data: {} }),
    });

    await apiClient('/test');

    const [, options] = mockFetch.mock.calls[0];
    expect(options.headers['Authorization']).toBe('Bearer bearer-token');
  });

  it('does not add Authorization header when no token', async () => {
    mockFetch.mockResolvedValueOnce({
      ok: true,
      status: 200,
      json: async () => ({ success: true, data: {} }),
    });

    await apiClient('/test');

    const [, options] = mockFetch.mock.calls[0];
    expect(options.headers['Authorization']).toBeUndefined();
  });

  it('sets Content-Type to application/json by default', async () => {
    mockFetch.mockResolvedValueOnce({
      ok: true,
      status: 200,
      json: async () => ({ success: true }),
    });

    await apiClient('/test');

    const [, options] = mockFetch.mock.calls[0];
    expect(options.headers['Content-Type']).toBe('application/json');
  });

  it('returns parsed JSON data on success', async () => {
    mockFetch.mockResolvedValueOnce({
      ok: true,
      status: 200,
      json: async () => ({ success: true, data: { id: 1 } }),
    });

    const result = await apiClient('/test');
    expect(result).toEqual({ success: true, data: { id: 1 } });
  });

  it('throws error on non-ok response', async () => {
    mockFetch.mockResolvedValueOnce({
      ok: false,
      status: 400,
      statusText: 'Bad Request',
      json: async () => ({ message: 'Validation failed' }),
    });

    await expect(apiClient('/auth/login', {}, false)).rejects.toThrow('Validation failed');
  });

  it('handles 401 by attempting silent refresh', async () => {
    setToken('expired-token');

    // First call returns 401
    mockFetch.mockResolvedValueOnce({
      ok: false,
      status: 401,
      statusText: 'Unauthorized',
      json: async () => ({ message: 'Token expired' }),
    });

    // Silent refresh call
    mockFetch.mockResolvedValueOnce({
      ok: true,
      status: 200,
      json: async () => ({ data: { token: 'new-token' } }),
    });

    // Retry call succeeds
    mockFetch.mockResolvedValueOnce({
      ok: true,
      status: 200,
      json: async () => ({ success: true, data: { refreshed: true } }),
    });

    const result = await apiClient('/protected');
    expect(result).toEqual({ success: true, data: { refreshed: true } });
    expect(getToken()).toBe('new-token');
  });

  it('throws on network error', async () => {
    mockFetch.mockRejectedValueOnce(new Error('Network failure'));
    await expect(apiClient('/test', {}, false)).rejects.toThrow('Failed to connect to server');
  });
});
