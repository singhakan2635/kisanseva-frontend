import { useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import {
  Camera, LogOut, Trash2, Plus, X, Bell, Globe, User, Phone, Save, Wheat,
} from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';
import { useLanguage } from '@/hooks/useLanguage';
import { apiClient } from '@/services/api';
import type { ApiResponse } from '@/types';
import { useToast } from '@/hooks/useToast';
import type { SupportedLanguage } from '@/hooks/useLanguage';

const languages: { code: SupportedLanguage; label: string; labelEn: string }[] = [
  { code: 'en', label: 'English', labelEn: 'English' },
  { code: 'hi', label: 'हिन्दी', labelEn: 'Hindi' },
];

const CROP_KEYS = [
  'rice', 'wheat', 'maize', 'cotton',
  'soybean', 'sugarcane', 'potato', 'tomato',
  'onion', 'chilli',
] as const;

export function FarmerProfilePage() {
  const { t } = useTranslation();
  const { user, logout } = useAuth();
  const { currentLanguage, setLanguage } = useLanguage();
  const navigate = useNavigate();
  const toast = useToast();
  const photoInputRef = useRef<HTMLInputElement>(null);

  const [firstName, setFirstName] = useState(user?.firstName || '');
  const [lastName, setLastName] = useState(user?.lastName || '');
  const [phone, setPhone] = useState(user?.phone || '');
  const [selectedLanguage, setSelectedLanguage] = useState<SupportedLanguage>(currentLanguage);
  const [myCrops, setMyCrops] = useState<string[]>([]);
  const [showCropPicker, setShowCropPicker] = useState(false);
  const [notifications, setNotifications] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [profilePhoto, setProfilePhoto] = useState<string | null>(null);

  const handlePhotoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (ev) => {
      setProfilePhoto(ev.target?.result as string);
    };
    reader.readAsDataURL(file);
  };

  const addCrop = (crop: string) => {
    if (!myCrops.includes(crop)) {
      setMyCrops([...myCrops, crop]);
    }
    setShowCropPicker(false);
  };

  const removeCrop = (crop: string) => {
    setMyCrops(myCrops.filter((c) => c !== crop));
  };

  const handleLanguageSelect = (code: SupportedLanguage) => {
    setSelectedLanguage(code);
    setLanguage(code);
  };

  const handleSave = async () => {
    setIsSaving(true);
    try {
      await apiClient<ApiResponse<unknown>>('/users/profile', {
        method: 'PATCH',
        body: JSON.stringify({
          firstName,
          lastName,
          phone,
          preferredLanguage: selectedLanguage,
          crops: myCrops,
          notificationsEnabled: notifications,
        }),
      });
      toast.addToast({ type: 'success', title: t('farmer.profile.profileSaved') });
    } catch {
      toast.addToast({ type: 'error', title: t('farmer.profile.saveFailed') });
    } finally {
      setIsSaving(false);
    }
  };

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const handleDeleteData = () => {
    if (window.confirm(t('farmer.profile.deleteConfirm'))) {
      apiClient<ApiResponse<unknown>>('/users/me', { method: 'DELETE' })
        .then(() => {
          logout();
          navigate('/login');
        })
        .catch(() => toast.addToast({ type: 'error', title: t('farmer.profile.deleteFailed') }));
    }
  };

  return (
    <div className="space-y-6 pb-24">
      <h1 className="text-xl font-bold text-earth-900">{t('farmer.profile.title')}</h1>

      {/* Profile photo */}
      <div className="flex justify-center">
        <button
          onClick={() => photoInputRef.current?.click()}
          className="relative"
          aria-label="Change profile photo"
        >
          <div className="w-28 h-28 rounded-full bg-earth-100 border-4 border-white shadow-lg overflow-hidden flex items-center justify-center">
            {profilePhoto ? (
              <img src={profilePhoto} alt="Profile" className="w-full h-full object-cover" />
            ) : (
              <User className="w-14 h-14 text-earth-400" />
            )}
          </div>
          <div className="absolute bottom-0 right-0 w-9 h-9 bg-primary-600 rounded-full flex items-center justify-center border-2 border-white">
            <Camera className="w-4 h-4 text-white" />
          </div>
        </button>
        <input
          ref={photoInputRef}
          type="file"
          accept="image/*"
          onChange={handlePhotoChange}
          className="hidden"
        />
      </div>

      {/* Name fields */}
      <div className="bg-white rounded-2xl border border-earth-200 p-4 space-y-4">
        <div>
          <label className="block text-base font-bold text-earth-800 mb-1.5">
            <User className="w-4 h-4 inline mr-1.5" />
            {t('farmer.profile.firstName')}
          </label>
          <input
            type="text"
            value={firstName}
            onChange={(e) => setFirstName(e.target.value)}
            className="w-full min-h-[56px] px-4 py-3 border-2 border-earth-200 rounded-2xl text-lg focus:outline-none focus:border-primary-500 focus:ring-2 focus:ring-primary-200"
          />
        </div>
        <div>
          <label className="block text-base font-bold text-earth-800 mb-1.5">
            {t('farmer.profile.lastName')}
          </label>
          <input
            type="text"
            value={lastName}
            onChange={(e) => setLastName(e.target.value)}
            className="w-full min-h-[56px] px-4 py-3 border-2 border-earth-200 rounded-2xl text-lg focus:outline-none focus:border-primary-500 focus:ring-2 focus:ring-primary-200"
          />
        </div>
        <div>
          <label className="block text-base font-bold text-earth-800 mb-1.5">
            <Phone className="w-4 h-4 inline mr-1.5" />
            {t('farmer.profile.phone')}
          </label>
          <div className="flex">
            <span className="inline-flex items-center min-h-[56px] px-4 text-lg font-medium text-earth-700 bg-earth-100 border-2 border-r-0 border-earth-200 rounded-l-2xl">
              +91
            </span>
            <input
              type="tel"
              inputMode="numeric"
              maxLength={10}
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              className="w-full min-h-[56px] px-4 py-3 border-2 border-earth-200 rounded-r-2xl text-lg focus:outline-none focus:border-primary-500 focus:ring-2 focus:ring-primary-200"
            />
          </div>
        </div>
      </div>

      {/* Language selector */}
      <div className="bg-white rounded-2xl border border-earth-200 p-4">
        <div className="flex items-center gap-2 mb-3">
          <Globe className="w-5 h-5 text-earth-600" />
          <p className="text-base font-bold text-earth-800">{t('farmer.profile.language')}</p>
        </div>
        <div className="grid grid-cols-2 gap-3">
          {languages.map((lang) => (
            <button
              key={lang.code}
              onClick={() => handleLanguageSelect(lang.code)}
              className={`min-h-[56px] rounded-xl border-2 text-lg font-bold transition-colors ${
                selectedLanguage === lang.code
                  ? 'bg-primary-600 text-white border-primary-600'
                  : 'bg-white text-earth-700 border-earth-200 hover:border-primary-300'
              }`}
            >
              {lang.label}
            </button>
          ))}
        </div>
      </div>

      {/* My Crops */}
      <div className="bg-white rounded-2xl border border-earth-200 p-4">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <Wheat className="w-5 h-5 text-earth-600" />
            <p className="text-base font-bold text-earth-800">{t('farmer.profile.myCrops')}</p>
          </div>
          <button
            onClick={() => setShowCropPicker(true)}
            className="w-10 h-10 bg-primary-100 rounded-full flex items-center justify-center"
          >
            <Plus className="w-5 h-5 text-primary-700" />
          </button>
        </div>

        {myCrops.length === 0 ? (
          <p className="text-base text-earth-400 text-center py-4">
            {t('farmer.profile.noCrops')}
          </p>
        ) : (
          <div className="flex flex-wrap gap-2">
            {myCrops.map((cropKey) => (
              <span
                key={cropKey}
                className="inline-flex items-center gap-1.5 bg-primary-50 border border-primary-200 text-primary-800 px-3 py-2 rounded-full text-base font-medium"
              >
                {t(`farmer.profile.crops.${cropKey}`)}
                <button onClick={() => removeCrop(cropKey)} className="hover:text-red-600">
                  <X className="w-4 h-4" />
                </button>
              </span>
            ))}
          </div>
        )}

        {/* Crop picker modal */}
        {showCropPicker && (
          <div className="fixed inset-0 bg-black/50 z-50 flex items-end">
            <div className="bg-white rounded-t-3xl w-full max-h-[70vh] overflow-y-auto p-6 animate-slide-up">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-bold text-earth-900">{t('farmer.profile.selectCrop')}</h3>
                <button onClick={() => setShowCropPicker(false)}>
                  <X className="w-6 h-6 text-earth-500" />
                </button>
              </div>
              <div className="grid grid-cols-2 gap-3">
                {CROP_KEYS.map((cropKey) => {
                  const cropLabel = t(`farmer.profile.crops.${cropKey}`);
                  return (
                    <button
                      key={cropKey}
                      onClick={() => addCrop(cropKey)}
                      disabled={myCrops.includes(cropKey)}
                      className={`min-h-[56px] rounded-xl border-2 text-base font-bold transition-colors ${
                        myCrops.includes(cropKey)
                          ? 'bg-earth-100 text-earth-400 border-earth-200'
                          : 'bg-white text-earth-700 border-earth-200 hover:border-primary-400 hover:bg-primary-50'
                      }`}
                    >
                      {cropLabel}
                    </button>
                  );
                })}
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Notifications */}
      <div className="bg-white rounded-2xl border border-earth-200 p-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Bell className="w-5 h-5 text-earth-600" />
            <div>
              <p className="text-base font-bold text-earth-800">{t('farmer.profile.notifications')}</p>
              <p className="text-sm text-earth-500">{t('farmer.profile.notificationsSub')}</p>
            </div>
          </div>
          <button
            onClick={() => setNotifications(!notifications)}
            className={`w-14 h-8 rounded-full transition-colors ${
              notifications ? 'bg-primary-600' : 'bg-earth-300'
            }`}
          >
            <div
              className={`w-6 h-6 rounded-full bg-white shadow transform transition-transform ${
                notifications ? 'translate-x-7' : 'translate-x-1'
              }`}
            />
          </button>
        </div>
      </div>

      {/* Save button */}
      <button
        onClick={handleSave}
        disabled={isSaving}
        className="w-full bg-primary-600 hover:bg-primary-700 text-white font-bold py-4 rounded-xl text-lg flex items-center justify-center gap-2 transition-colors disabled:opacity-50"
      >
        <Save className="w-5 h-5" />
        {isSaving ? t('farmer.profile.saving') : t('farmer.profile.save')}
      </button>

      {/* Logout */}
      <button
        onClick={handleLogout}
        className="w-full bg-white border-2 border-earth-300 text-earth-700 font-bold py-4 rounded-xl text-lg flex items-center justify-center gap-2 hover:bg-earth-50 transition-colors"
      >
        <LogOut className="w-5 h-5" />
        {t('farmer.profile.logout')}
      </button>

      {/* Delete data */}
      <button
        onClick={handleDeleteData}
        className="w-full text-red-500 text-base font-medium py-3 flex items-center justify-center gap-2"
      >
        <Trash2 className="w-4 h-4" />
        {t('farmer.profile.deleteData')}
      </button>
    </div>
  );
}
