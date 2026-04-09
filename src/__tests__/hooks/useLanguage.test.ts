import { describe, it, expect, vi, beforeEach } from 'vitest';
import { renderHook, act } from '@testing-library/react';
import { useLanguage } from '@/hooks/useLanguage';

// Mock react-i18next
const changeLanguageMock = vi.fn();
let mockLanguage = 'en';

vi.mock('react-i18next', () => ({
  useTranslation: () => ({
    i18n: {
      get language() { return mockLanguage; },
      changeLanguage: (lang: string) => {
        mockLanguage = lang;
        changeLanguageMock(lang);
      },
    },
    t: (key: string) => key,
  }),
}));

describe('useLanguage', () => {
  beforeEach(() => {
    localStorage.clear();
    mockLanguage = 'en';
    changeLanguageMock.mockClear();
  });

  it('default language is en', () => {
    const { result } = renderHook(() => useLanguage());
    expect(result.current.currentLanguage).toBe('en');
    expect(result.current.isEnglish).toBe(true);
    expect(result.current.isHindi).toBe(false);
  });

  it('setLanguage changes to hi and persists to localStorage', () => {
    const { result } = renderHook(() => useLanguage());

    act(() => {
      result.current.setLanguage('hi');
    });

    expect(changeLanguageMock).toHaveBeenCalledWith('hi');
    expect(localStorage.getItem('fasalrakshak_lang')).toBe('hi');
  });

  it('setLanguage changes to en and persists to localStorage', () => {
    mockLanguage = 'hi';
    const { result } = renderHook(() => useLanguage());

    act(() => {
      result.current.setLanguage('en');
    });

    expect(changeLanguageMock).toHaveBeenCalledWith('en');
    expect(localStorage.getItem('fasalrakshak_lang')).toBe('en');
  });

  it('toggleLanguage switches from en to hi', () => {
    const { result } = renderHook(() => useLanguage());

    act(() => {
      result.current.toggleLanguage();
    });

    expect(changeLanguageMock).toHaveBeenCalledWith('hi');
    expect(localStorage.getItem('fasalrakshak_lang')).toBe('hi');
  });

  it('toggleLanguage switches from hi to en', () => {
    mockLanguage = 'hi';
    const { result } = renderHook(() => useLanguage());

    act(() => {
      result.current.toggleLanguage();
    });

    expect(changeLanguageMock).toHaveBeenCalledWith('en');
    expect(localStorage.getItem('fasalrakshak_lang')).toBe('en');
  });

  it('isHindi is true when language is hi', () => {
    mockLanguage = 'hi';
    const { result } = renderHook(() => useLanguage());
    expect(result.current.isHindi).toBe(true);
    expect(result.current.isEnglish).toBe(false);
  });
});
