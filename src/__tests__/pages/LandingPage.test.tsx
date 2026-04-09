import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { LandingPage } from '@/pages/public/LandingPage';

// Mock react-router-dom
const navigateMock = vi.fn();
vi.mock('react-router-dom', () => ({
  useNavigate: () => navigateMock,
}));

describe('LandingPage', () => {
  beforeEach(() => {
    navigateMock.mockClear();
  });

  it('renders brand name FasalRakshak', () => {
    render(<LandingPage />);
    expect(screen.getByText('FasalRakshak')).toBeInTheDocument();
  });

  it('renders Hindi brand name as subtitle when English is active', () => {
    render(<LandingPage />);
    // In English mode, the Hindi subtitle "\u092B\u0938\u0932\u0930\u0915\u094D\u0937\u0915" is shown
    expect(screen.getByText('\u092B\u0938\u0932\u0930\u0915\u094D\u0937\u0915')).toBeInTheDocument();
  });

  it('language toggle switches to Hindi', () => {
    render(<LandingPage />);
    const toggleBtn = screen.getByText(/\u0939\u093F\u0928\u094D\u0926\u0940 \u092E\u0947\u0902 \u0926\u0947\u0916\u0947\u0902/);
    fireEvent.click(toggleBtn);
    // After switching, the brand becomes Hindi
    expect(screen.getByText('\u092B\u0938\u0932\u0930\u0915\u094D\u0937\u0915')).toBeInTheDocument();
    // And the toggle now shows English option
    expect(screen.getByText(/View in English/)).toBeInTheDocument();
  });

  it('language toggle switches back to English', () => {
    render(<LandingPage />);
    // Switch to Hindi first
    fireEvent.click(screen.getByText(/\u0939\u093F\u0928\u094D\u0926\u0940 \u092E\u0947\u0902 \u0926\u0947\u0916\u0947\u0902/));
    // Switch back to English
    fireEvent.click(screen.getByText(/View in English/));
    expect(screen.getByText('FasalRakshak')).toBeInTheDocument();
  });

  it('Get Started button navigates to /register', () => {
    render(<LandingPage />);
    const btn = screen.getByText('Get Started');
    fireEvent.click(btn);
    expect(navigateMock).toHaveBeenCalledWith('/register');
  });

  it('Login link navigates to /login', () => {
    render(<LandingPage />);
    const loginLink = screen.getByText('Login');
    fireEvent.click(loginLink);
    expect(navigateMock).toHaveBeenCalledWith('/login');
  });

  it('renders trust badges', () => {
    render(<LandingPage />);
    expect(screen.getByText('AI Powered')).toBeInTheDocument();
    expect(screen.getByText('99.5% Accurate')).toBeInTheDocument();
    expect(screen.getByText('10+ Languages')).toBeInTheDocument();
  });

  it('renders feature cards', () => {
    render(<LandingPage />);
    expect(screen.getByText('AI-powered instant diagnosis')).toBeInTheDocument();
    expect(screen.getByText('ICAR-recommended pesticides & dosage')).toBeInTheDocument();
  });

  it('renders footer with copyright', () => {
    render(<LandingPage />);
    expect(screen.getByText(/FasalRakshak/)).toBeInTheDocument();
    expect(screen.getByText(/Your Crop's Guardian/)).toBeInTheDocument();
  });
});
