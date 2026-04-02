/**
 * Convert raw Firebase/API error messages to user-friendly text.
 */

const ERROR_MAP: Record<string, string> = {
  // OTP / Phone Auth
  'auth/invalid-verification-code': 'The verification code you entered is incorrect. Please check and try again.',
  'auth/code-expired': 'The verification code has expired. Please request a new one.',
  'auth/missing-verification-code': 'Please enter the 6-digit verification code.',
  'auth/too-many-requests': 'Too many attempts. Please wait a few minutes before trying again.',
  'auth/invalid-phone-number': 'Please enter a valid phone number with country code.',
  'auth/captcha-check-failed': 'Verification failed. Please refresh the page and try again.',

  // Email / Password
  'auth/user-not-found': 'No account found with this email address.',
  'auth/wrong-password': 'Incorrect password. Please try again.',
  'auth/invalid-credential': 'Invalid email or password. Please check and try again.',
  'auth/email-already-in-use': 'An account with this email already exists. Please sign in instead.',
  'auth/weak-password': 'Password is too weak. Please use at least 6 characters.',
  'auth/invalid-email': 'Please enter a valid email address.',

  // Google
  'auth/popup-closed-by-user': 'Sign-in was cancelled. Please try again.',
  'auth/popup-blocked': 'Pop-up was blocked by your browser. Please allow pop-ups and try again.',

  // General
  'auth/network-request-failed': 'Network error. Please check your internet connection and try again.',
  'auth/internal-error': 'An unexpected error occurred. Please try again.',

  // Backend errors
  'Invalid email or password': 'Invalid email or password. Please check and try again.',
  'Email already registered': 'An account with this email already exists. Please sign in instead.',
};

export function friendlyError(error: unknown): string {
  if (!(error instanceof Error)) return 'Something went wrong. Please try again.';

  const msg = error.message;

  // Check for Firebase error codes in the message
  const codeMatch = msg.match(/auth\/[\w-]+/);
  if (codeMatch && ERROR_MAP[codeMatch[0]]) {
    return ERROR_MAP[codeMatch[0]];
  }

  // Check for exact message match
  if (ERROR_MAP[msg]) {
    return ERROR_MAP[msg];
  }

  // If it starts with "Firebase:" strip the prefix
  if (msg.startsWith('Firebase:')) {
    const codeMatch2 = msg.match(/\(([^)]+)\)/);
    if (codeMatch2) return ERROR_MAP[codeMatch2[1]] || 'Authentication failed. Please try again.';
    return 'Authentication failed. Please try again.';
  }

  // Return as-is if it's already a readable message
  if (!msg.includes('auth/') && !msg.includes('Firebase') && msg.length < 200) {
    return msg;
  }

  return 'Something went wrong. Please try again.';
}
