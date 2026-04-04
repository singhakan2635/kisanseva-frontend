import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { createElement } from 'react';
import { Input } from '@/components/common/Input';
import { Card } from '@/components/common/Card';

describe('XSS Prevention', () => {
  const xssPayloads = [
    '<script>alert("xss")</script>',
    '<img src=x onerror=alert("xss")>',
    '"><svg onload=alert("xss")>',
    "javascript:alert('xss')",
    '<iframe src="javascript:alert(1)"></iframe>',
  ];

  describe('Input component escapes malicious content', () => {
    it('does not render script tags in label', () => {
      const maliciousLabel = '<script>alert("xss")</script>';
      render(createElement(Input, { label: maliciousLabel }));
      const label = screen.getByText(maliciousLabel);
      // The text should be rendered as text, not executed as HTML
      expect(label.innerHTML).not.toContain('<script>');
      expect(label.textContent).toBe(maliciousLabel);
    });

    it('does not render script tags in error message', () => {
      const maliciousError = '<img src=x onerror=alert("xss")>';
      render(createElement(Input, { label: 'Test', error: maliciousError }));
      const alert = screen.getByRole('alert');
      expect(alert.querySelector('img')).toBeNull();
      expect(alert.textContent).toBe(maliciousError);
    });

    it('does not render script tags in hint', () => {
      const maliciousHint = '<script>document.cookie</script>';
      render(createElement(Input, { label: 'Test', hint: maliciousHint }));
      const hint = screen.getByText(maliciousHint);
      expect(hint.querySelector('script')).toBeNull();
      expect(hint.textContent).toBe(maliciousHint);
    });
  });

  describe('Card component escapes malicious content', () => {
    it('does not render HTML in title', () => {
      const maliciousTitle = '<img src=x onerror=alert(1)>';
      render(createElement(Card, { title: maliciousTitle }, 'body'));
      const heading = screen.getByText(maliciousTitle);
      expect(heading.querySelector('img')).toBeNull();
      expect(heading.textContent).toBe(maliciousTitle);
    });

    it('does not render HTML in subtitle', () => {
      const malicious = '<script>steal()</script>';
      render(createElement(Card, { title: 'T', subtitle: malicious }, 'body'));
      const el = screen.getByText(malicious);
      expect(el.querySelector('script')).toBeNull();
      expect(el.textContent).toBe(malicious);
    });
  });

  describe('User-generated content in children', () => {
    xssPayloads.forEach((payload, i) => {
      it(`renders XSS payload ${i + 1} as safe text in Card children`, () => {
        render(createElement(Card, null, payload));
        const el = screen.getByText(payload);
        // Verify it's rendered as text content, not parsed as HTML
        expect(el.textContent).toBe(payload);
        expect(el.querySelector('script')).toBeNull();
        expect(el.querySelector('img')).toBeNull();
        expect(el.querySelector('svg')).toBeNull();
        expect(el.querySelector('iframe')).toBeNull();
      });
    });
  });

  describe('API response HTML is not rendered as raw HTML', () => {
    it('string content with HTML tags is text-escaped by React', () => {
      const apiResponse = '<div onclick="alert(1)">Click me</div>';
      render(createElement(Card, null, apiResponse));
      // React renders this as text, not as HTML
      const el = screen.getByText(apiResponse);
      expect(el.querySelector('div')).toBeNull();
      expect(el.textContent).toBe(apiResponse);
    });

    it('string with event handlers is text-escaped', () => {
      const apiResponse = '<button onmouseover="alert(1)">Hover</button>';
      render(createElement(Card, null, apiResponse));
      const el = screen.getByText(apiResponse);
      // Should not create an actual button element from the string
      expect(el.tagName).not.toBe('BUTTON');
      expect(el.textContent).toBe(apiResponse);
    });
  });
});
