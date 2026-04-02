import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { MapPinOff } from 'lucide-react';
import { Button } from '@/components/common/Button';

export function NotFoundPage() {
  const navigate = useNavigate();
  const { t } = useTranslation();

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary-50 via-white to-accent-50 flex items-center justify-center p-4">
      <div className="text-center animate-fade-in-up">
        <div className="flex items-center justify-center w-20 h-20 bg-gradient-to-br from-primary-100 to-primary-200 rounded-2xl mx-auto mb-6">
          <MapPinOff className="w-10 h-10 text-primary-500" />
        </div>
        <h1 className="text-4xl font-bold text-gray-900 mb-2">404</h1>
        <h2 className="text-xl font-semibold text-gray-700 mb-3">{t('notFound.title')}</h2>
        <p className="text-gray-500 mb-8 max-w-md">{t('notFound.description')}</p>
        <Button variant="primary" size="lg" onClick={() => navigate('/')}>
          {t('notFound.goHome')}
        </Button>
      </div>
    </div>
  );
}
