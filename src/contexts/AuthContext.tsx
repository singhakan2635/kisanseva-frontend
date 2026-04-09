import { createContext, useState, useCallback, useEffect, useRef, type ReactNode } from 'react';
import { signInWithPhoneNumber, signInWithPopup, GoogleAuthProvider, RecaptchaVerifier, type ConfirmationResult } from 'firebase/auth';
import { firebaseAuth } from '@/config/firebase';
import type { User, ApiResponse } from '@/types';
import { apiClient, setToken, removeToken, getToken } from '@/services/api';

interface AuthContextValue {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<void>;
  loginWithPhone: (phone: string) => Promise<ConfirmationResult>;
  verifyOtp: (confirmationResult: ConfirmationResult, code: string, role?: string) => Promise<void>;
  loginWithGoogle: () => Promise<void>;
  register: (data: RegisterData) => Promise<void>;
  logout: () => void;
}

interface RegisterData {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  password: string;
  role: 'farmer' | 'expert';
}

// eslint-disable-next-line react-refresh/only-export-components
export const AuthContext = createContext<AuthContextValue | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const recaptchaVerifierRef = useRef<RecaptchaVerifier | null>(null);

  // Restore session on mount
  useEffect(() => {
    const token = getToken();
    if (!token) {
      setIsLoading(false);
      return;
    }

    const bootstrap = async () => {
      try {
        const res = await apiClient<ApiResponse<User>>('/auth/me');
        if (res.success && res.data) {
          setUser(res.data);
        } else {
          removeToken();
        }
      } catch {
        removeToken();
      } finally {
        setIsLoading(false);
      }
    };

    bootstrap();
  }, []);

  // Email/password login (fallback for admin)
  const login = useCallback(async (email: string, password: string) => {
    const res = await apiClient<ApiResponse<{ token: string; user: User }>>('/auth/login', {
      method: 'POST',
      body: JSON.stringify({ email, password }),
    });
    if (!res.success) throw new Error(res.message || 'Login failed');
    setToken(res.data.token);
    setUser(res.data.user);
  }, []);

  // Firebase Phone OTP — Step 1: Send OTP
  const loginWithPhone = useCallback(async (phone: string) => {
    // Clean up previous reCAPTCHA
    if (recaptchaVerifierRef.current) {
      try { recaptchaVerifierRef.current.clear(); } catch { /* already cleared */ }
      recaptchaVerifierRef.current = null;
    }

    // Ensure container exists (don't remove/recreate — causes React DOM conflicts)
    let container = document.getElementById('recaptcha-container');
    if (!container) {
      container = document.createElement('div');
      container.id = 'recaptcha-container';
      document.body.appendChild(container);
    } else {
      container.innerHTML = '';
    }

    // Small delay to let DOM settle after clear
    await new Promise(r => setTimeout(r, 100));

    const verifier = new RecaptchaVerifier(firebaseAuth, 'recaptcha-container', { size: 'invisible' });
    recaptchaVerifierRef.current = verifier;
    return signInWithPhoneNumber(firebaseAuth, phone, verifier);
  }, []);

  // Firebase Phone OTP — Step 2: Verify OTP & authenticate with backend
  const verifyOtp = useCallback(async (
    confirmationResult: ConfirmationResult,
    code: string,
    role: string = 'farmer'
  ) => {
    const result = await confirmationResult.confirm(code);
    const firebaseToken = await result.user.getIdToken();
    const phone = result.user.phoneNumber || '';

    // Authenticate with our backend (creates user if new, logs in if existing)
    const res = await apiClient<ApiResponse<{ token: string; user: User }>>('/auth/firebase', {
      method: 'POST',
      body: JSON.stringify({ firebaseToken, phone, role }),
    });

    if (!res.success) throw new Error(res.message || 'Authentication failed');
    setToken(res.data.token);
    setUser(res.data.user);
  }, []);

  // Google Sign-In
  const loginWithGoogle = useCallback(async () => {
    const provider = new GoogleAuthProvider();
    const result = await signInWithPopup(firebaseAuth, provider);
    const firebaseToken = await result.user.getIdToken();
    const email = result.user.email || '';
    const displayName = result.user.displayName || '';
    const nameParts = displayName.split(' ');

    const res = await apiClient<ApiResponse<{ token: string; user: User }>>('/auth/firebase', {
      method: 'POST',
      body: JSON.stringify({
        firebaseToken,
        phone: '',
        role: 'farmer',
        email,
        firstName: nameParts[0] || '',
        lastName: nameParts.slice(1).join(' ') || '',
      }),
    });

    if (!res.success) throw new Error(res.message || 'Google login failed');
    setToken(res.data.token);
    setUser(res.data.user);
  }, []);

  // Email/password register (fallback)
  const register = useCallback(async (data: RegisterData) => {
    const res = await apiClient<ApiResponse<{ token: string; user: User }>>('/auth/register', {
      method: 'POST',
      body: JSON.stringify(data),
    });
    if (!res.success) throw new Error(res.message || 'Registration failed');
    setToken(res.data.token);
    setUser(res.data.user);
  }, []);

  const logout = useCallback(() => {
    removeToken();
    setUser(null);
    firebaseAuth.signOut().catch(() => {});
    window.location.href = '/login';
  }, []);

  return (
    <AuthContext.Provider value={{
      user, isAuthenticated: !!user, isLoading,
      login, loginWithPhone, verifyOtp, loginWithGoogle, register, logout,
    }}>
      {children}
      {/* Invisible reCAPTCHA container */}
      <div id="recaptcha-container" />
    </AuthContext.Provider>
  );
}
