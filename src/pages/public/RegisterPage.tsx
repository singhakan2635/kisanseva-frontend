import { useState, type FormEvent } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useAuth } from '@/hooks/useAuth';
import { useToast } from '@/hooks/useToast';
import { Input } from '@/components/common/Input';
import { Button } from '@/components/common/Button';
import { friendlyError } from '@/utils/firebaseErrors';

export function RegisterPage() {
  const { t } = useTranslation();
  const { register } = useAuth();
  const { addToast } = useToast();
  const navigate = useNavigate();

  const [form, setForm] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    password: '',
    confirmPassword: '',
    role: 'farmer' as 'farmer' | 'expert',
  });
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const updateField = (field: string, value: string) => {
    setForm((prev) => ({ ...prev, [field]: value }));
    if (errors[field]) setErrors((prev) => ({ ...prev, [field]: '' }));
  };

  const validate = (): boolean => {
    const newErrors: Record<string, string> = {};
    if (!form.firstName.trim()) newErrors.firstName = t('auth.firstNameRequired');
    if (!form.lastName.trim()) newErrors.lastName = t('auth.lastNameRequired');
    if (!form.email.trim()) newErrors.email = t('auth.emailRequired');
    if (!form.phone.trim()) newErrors.phone = t('auth.phoneRequired');
    if (!form.password) newErrors.password = t('auth.passwordRequired');
    if (form.password.length < 6) newErrors.password = t('auth.passwordMinLength');
    if (form.password !== form.confirmPassword) newErrors.confirmPassword = t('auth.passwordMismatch');
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!validate()) return;

    setIsLoading(true);
    try {
      await register({
        firstName: form.firstName,
        lastName: form.lastName,
        email: form.email,
        phone: form.phone,
        password: form.password,
        role: form.role,
      });
      addToast({ type: 'success', title: 'Account created successfully!' });
      navigate(form.role === 'farmer' ? '/farmer' : '/expert');
    } catch (err) {
      addToast({ type: 'error', title: friendlyError(err) });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary-50 via-white to-accent-50 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <div className="w-12 h-12 sm:w-16 sm:h-16 rounded-2xl shadow-lg shadow-primary-500/25 mx-auto mb-4 bg-gradient-to-br from-primary-500 to-primary-700 flex items-center justify-center text-white font-bold text-lg sm:text-xl">
            KS
          </div>
          <h1 className="text-lg sm:text-2xl font-bold text-gray-900">{t('auth.registerTitle')}</h1>
          <p className="text-gray-500 mt-1">{t('auth.registerSubtitle')}</p>
        </div>

        <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-xl shadow-gray-200/50 p-4 sm:p-8 border border-white/40">
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-2 gap-3">
              <Input
                label={t('auth.firstName')}
                value={form.firstName}
                onChange={(e) => updateField('firstName', e.target.value)}
                error={errors.firstName}
                placeholder="Ravi"
              />
              <Input
                label={t('auth.lastName')}
                value={form.lastName}
                onChange={(e) => updateField('lastName', e.target.value)}
                error={errors.lastName}
                placeholder="Kumar"
              />
            </div>
            <Input
              label={t('auth.email')}
              type="email"
              value={form.email}
              onChange={(e) => updateField('email', e.target.value)}
              error={errors.email}
              placeholder="your@email.com"
              autoComplete="email"
            />
            <Input
              label={t('auth.phone')}
              type="tel"
              value={form.phone}
              onChange={(e) => updateField('phone', e.target.value)}
              error={errors.phone}
              placeholder="+91 98765 43210"
            />

            {/* Role selection */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">{t('auth.role')}</label>
              <div className="grid grid-cols-2 gap-3">
                <button
                  type="button"
                  onClick={() => updateField('role', 'farmer')}
                  className={`flex items-center justify-center gap-2 px-4 py-3 rounded-lg border-2 text-sm font-medium transition-all duration-200 ${
                    form.role === 'farmer'
                      ? 'border-primary-500 bg-primary-50 text-primary-700'
                      : 'border-gray-200 bg-white text-gray-600 hover:border-gray-300'
                  }`}
                >
                  {t('auth.roleFarmer')}
                </button>
                <button
                  type="button"
                  onClick={() => updateField('role', 'expert')}
                  className={`flex items-center justify-center gap-2 px-4 py-3 rounded-lg border-2 text-sm font-medium transition-all duration-200 ${
                    form.role === 'expert'
                      ? 'border-primary-500 bg-primary-50 text-primary-700'
                      : 'border-gray-200 bg-white text-gray-600 hover:border-gray-300'
                  }`}
                >
                  {t('auth.roleExpert')}
                </button>
              </div>
            </div>

            <Input
              label={t('auth.password')}
              type="password"
              value={form.password}
              onChange={(e) => updateField('password', e.target.value)}
              error={errors.password}
              placeholder="Min. 6 characters"
              autoComplete="new-password"
            />
            <Input
              label={t('auth.confirmPassword')}
              type="password"
              value={form.confirmPassword}
              onChange={(e) => updateField('confirmPassword', e.target.value)}
              error={errors.confirmPassword}
              placeholder="Re-enter password"
              autoComplete="new-password"
            />

            <Button
              type="submit"
              isLoading={isLoading}
              className="w-full"
              size="lg"
            >
              {t('auth.registerButton')}
            </Button>
          </form>

          <p className="mt-6 text-center text-sm text-gray-600">
            {t('auth.hasAccount')}{' '}
            <Link to="/login" className="text-primary-600 hover:text-primary-700 font-medium">
              {t('auth.signIn')}
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
