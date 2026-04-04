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

  it('renders brand name KisanSeva', () => {
    render(<LandingPage />);
    expect(screen.getByText('KisanSeva')).toBeInTheDocument();
  });

  it('renders Hindi brand name as subtitle when English is active', () => {
    render(<LandingPage />);
    // In English mode, the Hindi subtitle "kisanseva" is shown
    expect(screen.getByText('किसानसेवा')).toBeInTheDocument();
  });

  it('language toggle switches to Hindi', () => {
    render(<LandingPage />);
    const toggleBtn = screen.getByText(/हिन्दी में देखें/);
    fireEvent.click(toggleBtn);
    // After switching, the brand becomes Hindi
    expect(screen.getByText('किसानसेवा')).toBeInTheDocument();
    // And the toggle now shows English option
    expect(screen.getByText(/View in English/)).toBeInTheDocument();
  });

  it('language toggle switches back to English', () => {
    render(<LandingPage />);
    // Switch to Hindi first
    fireEvent.click(screen.getByText(/हिन्दी में देखें/));
    // Switch back to English
    fireEvent.click(screen.getByText(/View in English/));
    expect(screen.getByText('KisanSeva')).toBeInTheDocument();
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
    expect(screen.getByText(/KisanSeva/)).toBeInTheDocument();
    expect(screen.getByText(/Empowering Indian Farmers/)).toBeInTheDocument();
  });
});
