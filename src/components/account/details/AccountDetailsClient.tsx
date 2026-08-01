'use client';

import { useState } from 'react';
import { User, RewardAccount } from '@prisma/client';
import { useRouter } from 'next/navigation';
import { format } from 'date-fns';
import { Loader2, CheckCircle, AlertCircle, X, Shield, Lock, Bell, Sparkles, EyeOff, Eye } from 'lucide-react';
import Image from 'next/image';
import { useSession } from 'next-auth/react';

interface AccountDetailsClientProps {
  user: User & {
    rewardAccount: RewardAccount | null;
  };
}

interface Toast {
  id: string;
  message: string;
  type: 'success' | 'error';
}

export function AccountDetailsClient({ user }: AccountDetailsClientProps) {
  const router = useRouter();
  const { update } = useSession();

  const [firstName, setFirstName] = useState(user.firstName || '');
  const [lastName, setLastName] = useState(user.lastName || '');
  const [phone, setPhone] = useState(user.phone || '');

  // Change Password Modal state
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isPasswordSubmitting, setIsPasswordSubmitting] = useState(false);
  const [passwordErrors, setPasswordErrors] = useState<Record<string, string>>({});

  // Password requirements check
  const hasLength = newPassword.length >= 8;
  const hasUpper = /[A-Z]/.test(newPassword);
  const hasNumberOrSymbol = /[0-9!@#$%^&*]/.test(newPassword);

  let strengthScore = 0;
  if (hasLength) strengthScore++;
  if (hasUpper) strengthScore++;
  if (hasNumberOrSymbol) strengthScore++;
  if (newPassword.length > 12 && strengthScore >= 3) strengthScore++;

  const strengthLabels = ['Weak', 'Moderate', 'Secure', 'Ironclad'];
  const strengthLabel = newPassword ? strengthLabels[strengthScore - 1] || 'Vulnerable' : 'Waiting...';

  const getStrengthBarClass = (barIndex: number) => {
    if (strengthScore < barIndex) return 'bg-surface-variant';
    switch (strengthScore) {
      case 1:
        return 'bg-error';
      case 2:
        return 'bg-orange-500';
      case 3:
        return 'bg-yellow-500';
      case 4:
        return 'bg-primary-container';
      default:
        return 'bg-surface-variant';
    }
  };

  const handlePasswordSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const errors: Record<string, string> = {};
    if (!currentPassword) errors.currentPassword = 'Current password is required';
    if (!newPassword) {
      errors.newPassword = 'New password is required';
    } else {
      if (newPassword.length < 8) errors.newPassword = 'Password must be at least 8 characters';
      if (!/[A-Z]/.test(newPassword)) errors.newPassword = 'Password must contain one uppercase letter';
      if (!/[0-9!@#$%^&*]/.test(newPassword)) errors.newPassword = 'Password must contain one number or special character';
    }
    if (newPassword !== confirmPassword) {
      errors.confirmPassword = 'Passwords do not match';
    }

    if (Object.keys(errors).length > 0) {
      setPasswordErrors(errors);
      return;
    }

    setPasswordErrors({});
    setIsPasswordSubmitting(true);

    try {
      const res = await fetch('/api/account/password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          currentPassword,
          newPassword,
          confirmPassword,
        }),
      });

      if (!res.ok) {
        const errData = await res.json();
        throw new Error(errData.error || 'Failed to update password');
      }

      showToast('Password updated successfully!', 'success');
      setCurrentPassword('');
      setNewPassword('');
      setConfirmPassword('');
      setIsModalOpen(false);
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : 'An error occurred while saving.';
      showToast(message, 'error');
    } finally {
      setIsPasswordSubmitting(false);
    }
  };
  
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [validationErrors, setValidationErrors] = useState<Record<string, string>>({});
  const [toasts, setToasts] = useState<Toast[]>([]);

  const showToast = (message: string, type: 'success' | 'error') => {
    const id = Math.random().toString(36).substring(2, 9);
    setToasts((prev) => [...prev, { id, message, type }]);
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, 4000);
  };

  const validate = () => {
    const newErrors: Record<string, string> = {};
    if (!firstName.trim()) newErrors.firstName = 'First Name is required';
    if (!lastName.trim()) newErrors.lastName = 'Last Name is required';
    if (phone && !/^[0-9+ ]{10,15}$/.test(phone.trim())) {
      newErrors.phone = 'Enter a valid phone number (10-15 digits)';
    }

    setValidationErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) {
      showToast('Please fix the errors in the form.', 'error');
      return;
    }

    setIsSubmitting(true);
    try {
      const res = await fetch('/api/account/details', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          firstName,
          lastName,
          phone: phone || null,
        }),
      });

      if (!res.ok) {
        const errData = await res.json();
        throw new Error(errData.error || 'Failed to update details');
      }

      showToast('Profile updated successfully!', 'success');
      await update();
      router.refresh();
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : 'An error occurred while saving.';
      showToast(message, 'error');
    } finally {
      setIsSubmitting(false);
    }
  };

  const formattedDate = user.createdAt ? format(new Date(user.createdAt), 'MMMM yyyy') : 'Recently';
  const fullName = `${firstName} ${lastName}`.trim().toUpperCase() || user.name?.toUpperCase() || 'ATHLETE';
  const points = user.rewardAccount?.currentPoints || 0;
  const tier = user.rewardAccount?.tier || 'MEMBER';

  return (
    <div className="space-y-12">
      {/* Toast Notification Container */}
      <div className="fixed top-24 right-6 z-50 flex flex-col gap-2 pointer-events-none">
        {toasts.map((t) => (
          <div 
            key={t.id}
            className={`flex items-center gap-3 px-6 py-4 rounded-lg border shadow-lg backdrop-blur-xl animate-fade-in pointer-events-auto bg-[rgba(18,19,23,0.9)] max-w-sm ${
              t.type === 'success' 
                ? 'border-green-500/30 text-green-400' 
                : 'border-red-500/30 text-red-400'
            }`}
          >
            {t.type === 'success' ? <CheckCircle className="w-5 h-5" /> : <AlertCircle className="w-5 h-5" />}
            <span className="text-sm font-body font-bold uppercase tracking-wide">{t.message}</span>
            <button 
              onClick={() => setToasts((prev) => prev.filter((toast) => toast.id !== t.id))}
              className="ml-auto p-1 hover:opacity-80 transition-opacity text-on-surface-variant cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        ))}
      </div>

      {/* Profile Header */}
      <header className="flex flex-col md:flex-row items-center gap-8 bg-surface-container-low p-8 rounded-xl border border-outline-variant/20 shadow-xl relative overflow-hidden">
        {/* Background bolt */}
        <div className="absolute top-0 right-0 p-4 opacity-10 text-primary pointer-events-none">
          <span className="material-symbols-outlined text-[120px]" style={{ fontVariationSettings: "'FILL' 1" }}>bolt</span>
        </div>
        
        <div className="relative group">
          <div className="w-32 h-32 md:w-40 md:h-40 rounded-full border-4 border-primary-container overflow-hidden bg-surface-container-highest relative">
            <Image 
              src={user.image || 'https://lh3.googleusercontent.com/aida-public/AB6AXuDA55GEaxz86sLmVGq04rBq8iCs8-V6NGPOPpMw4wVqwPPCmlUWYh8_kiQAB_hr7LP41xI2GCaOb46hGaAKee13C3F0NdDs2J5mH7sAaF-FloJJuzMyjOBYYJaO5DxW08JfPL5ACETSwYlUApfmvjS0AqwD2ur4-R5kNFi0Yk_WQuciMCifY6p0RPZCPRHnKWKh4rkHaEln2E22mpZY5MaDxCnAp2hI3uCLNF9WvbJw8IqzfbG57ZXfPINgfnoFswtFl5bCjg9s1_o'}
              alt={fullName}
              fill
              className="object-cover"
            />
          </div>
        </div>

        <div className="text-center md:text-left z-10">
          <h1 className="font-display text-headline-md md:text-headline-lg text-on-surface tracking-tighter uppercase">
            {fullName}
          </h1>
          <p className="font-label-bold text-label-bold text-primary uppercase tracking-widest mt-1">
            {tier} MEMBER • {points} POINTS
          </p>
          <p className="text-on-surface-variant mt-2 text-label-sm">
            Fueling ambition since {formattedDate}
          </p>
        </div>
      </header>

      {/* Account Profile Section */}
      <div className="space-y-6">
        <h2 className="font-display text-headline-md text-on-surface tracking-widest uppercase">
          ACCOUNT PROFILE
        </h2>
        <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-6 bg-surface-container-low p-8 rounded-xl border border-outline-variant/20">
          <div className="space-y-2 group">
            <label className="font-label-bold text-label-sm text-on-surface-variant uppercase tracking-widest block">
              First Name
            </label>
            <input 
              type="text" 
              value={firstName}
              onChange={(e) => {
                setFirstName(e.target.value);
                if (validationErrors.firstName) setValidationErrors(prev => ({ ...prev, firstName: '' }));
              }}
              className={`w-full bg-surface-container-highest border rounded-lg px-4 py-3 focus:ring-2 focus:ring-primary focus:border-primary text-on-surface transition-all ${
                validationErrors.firstName ? 'border-red-500/50' : 'border-outline-variant/50'
              }`}
            />
            {validationErrors.firstName && (
              <p className="text-xs text-red-400 font-label-bold uppercase tracking-wide">{validationErrors.firstName}</p>
            )}
          </div>

          <div className="space-y-2 group">
            <label className="font-label-bold text-label-sm text-on-surface-variant uppercase tracking-widest block">
              Last Name
            </label>
            <input 
              type="text" 
              value={lastName}
              onChange={(e) => {
                setLastName(e.target.value);
                if (validationErrors.lastName) setValidationErrors(prev => ({ ...prev, lastName: '' }));
              }}
              className={`w-full bg-surface-container-highest border rounded-lg px-4 py-3 focus:ring-2 focus:ring-primary focus:border-primary text-on-surface transition-all ${
                validationErrors.lastName ? 'border-red-500/50' : 'border-outline-variant/50'
              }`}
            />
            {validationErrors.lastName && (
              <p className="text-xs text-red-400 font-label-bold uppercase tracking-wide">{validationErrors.lastName}</p>
            )}
          </div>

          <div className="space-y-2 group">
            <label className="font-label-bold text-label-sm text-on-surface-variant uppercase tracking-widest block">
              Email Address
            </label>
            <input 
              type="email" 
              value={user.email || ''} 
              disabled
              className="w-full bg-surface-container-low border border-outline-variant/30 rounded-lg px-4 py-3 text-on-surface-variant opacity-60 cursor-not-allowed"
            />
          </div>

          <div className="space-y-2 group">
            <label className="font-label-bold text-label-sm text-on-surface-variant uppercase tracking-widest block">
              Phone Number
            </label>
            <input 
              type="tel" 
              value={phone}
              onChange={(e) => {
                setPhone(e.target.value);
                if (validationErrors.phone) setValidationErrors(prev => ({ ...prev, phone: '' }));
              }}
              className={`w-full bg-surface-container-highest border rounded-lg px-4 py-3 focus:ring-2 focus:ring-primary focus:border-primary text-on-surface transition-all ${
                validationErrors.phone ? 'border-red-500/50' : 'border-outline-variant/50'
              }`}
            />
            {validationErrors.phone && (
              <p className="text-xs text-red-400 font-label-bold uppercase tracking-wide">{validationErrors.phone}</p>
            )}
          </div>

          <div className="md:col-span-2 pt-4 flex justify-end">
            <button 
              type="submit"
              disabled={isSubmitting}
              className="bg-primary text-on-primary font-display text-label-bold px-8 py-3 uppercase tracking-widest hover:brightness-110 active:scale-95 transition-all duration-300 shadow-[0_0_15px_rgba(196,30,92,0.3)] cursor-pointer disabled:opacity-50 flex items-center gap-2"
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" /> SAVING...
                </>
              ) : (
                'SAVE CHANGES'
              )}
            </button>
          </div>
        </form>
      </div>

      {/* Security Section */}
      <div className="space-y-6">
        <h2 className="font-display text-headline-md text-on-surface tracking-widest uppercase">
          SECURITY
        </h2>
        <div className="bg-surface-container-low p-8 rounded-xl border border-outline-variant/20 flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-6">
            <div className="w-12 h-12 rounded-full bg-surface-container-highest flex items-center justify-center text-primary border border-outline-variant/10">
              <Lock className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-label-bold text-label-bold uppercase text-on-surface tracking-wide">
                Account Password
              </h3>
              <p className="text-on-surface-variant text-label-sm mt-1">
                ••••••••
              </p>
            </div>
          </div>
          <button 
            onClick={() => setIsModalOpen(true)}
            className="w-full md:w-auto border-2 border-on-surface text-on-surface font-display text-label-bold px-8 py-3 uppercase tracking-widest hover:bg-on-surface hover:text-background transition-all duration-300 cursor-pointer"
          >
            CHANGE PASSWORD
          </button>
        </div>
      </div>

      {/* Preferences Section */}
      <div className="space-y-6">
        <h2 className="font-display text-headline-md text-on-surface tracking-widest uppercase">
          PREFERENCES
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-surface-container p-6 rounded-xl border border-outline-variant/10 hover:border-primary/30 transition-all cursor-pointer group">
            <Bell className="text-primary w-6 h-6 mb-3" />
            <h4 className="font-label-bold text-label-bold uppercase tracking-wider text-on-surface mb-2">
              Notifications
            </h4>
            <p className="text-label-sm text-on-surface-variant">
              Stay updated on new product drops.
            </p>
          </div>
          <div className="bg-surface-container p-6 rounded-xl border border-outline-variant/10 hover:border-primary/30 transition-all cursor-pointer group">
            <Sparkles className="text-primary w-6 h-6 mb-3" />
            <h4 className="font-label-bold text-label-bold uppercase tracking-wider text-on-surface mb-2">
              Smart Reminders
            </h4>
            <p className="text-label-sm text-on-surface-variant">
              Get notified when your protein is low.
            </p>
          </div>
          <div className="bg-surface-container p-6 rounded-xl border border-outline-variant/10 hover:border-primary/30 transition-all cursor-pointer group">
            <Shield className="text-primary w-6 h-6 mb-3" />
            <h4 className="font-label-bold text-label-bold uppercase tracking-wider text-on-surface mb-2">
              Privacy Control
            </h4>
            <p className="text-label-sm text-on-surface-variant">
              Manage your data and social visibility.
            </p>
          </div>
        </div>
      </div>

      {/* Change Password Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-md transition-opacity duration-300 animate-in fade-in">
          {/* Modal Container */}
          <div className="bg-surface-container-low/95 backdrop-blur-[20px] border border-outline-variant/30 w-full max-w-[520px] rounded-lg overflow-hidden shadow-2xl relative animate-in zoom-in duration-300">
            {/* Close Button */}
            <button 
              type="button"
              className="absolute top-6 right-6 text-on-surface-variant hover:text-primary transition-colors cursor-pointer"
              onClick={() => setIsModalOpen(false)}
            >
              <X className="w-6 h-6" />
            </button>
            
            {/* Modal Header */}
            <div className="p-8 pb-4">
              <div className="flex items-center gap-3 mb-2">
                <div className="w-8 h-1 bg-primary-container"></div>
                <h2 className="font-display text-headline-md uppercase tracking-tight">SECURITY SETTINGS</h2>
              </div>
              <p className="font-body text-on-surface-variant text-sm mt-1">Update your password to keep your account secure.</p>
            </div>

            {/* Modal Body: Form */}
            <form onSubmit={handlePasswordSubmit} className="px-8 py-4 space-y-6">
              {/* Current Password */}
              <div className="space-y-2 group">
                <label className="block font-label-bold text-label-bold uppercase tracking-wider text-on-surface-variant group-focus-within:text-primary transition-colors">
                  Current Password
                </label>
                <div className="relative">
                  <input 
                    type={showCurrentPassword ? 'text' : 'password'}
                    value={currentPassword}
                    onChange={(e) => {
                      setCurrentPassword(e.target.value);
                      if (passwordErrors.currentPassword) setPasswordErrors(prev => ({ ...prev, currentPassword: '' }));
                    }}
                    className={`w-full bg-surface-container-low border focus:border-primary focus:ring-1 focus:ring-primary px-4 py-3 text-on-surface transition-all outline-none ${
                      passwordErrors.currentPassword ? 'border-red-500/50' : 'border-outline-variant'
                    }`}
                    placeholder="••••••••••••"
                  />
                  <button 
                    type="button"
                    onClick={() => setShowCurrentPassword(!showCurrentPassword)}
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-on-surface-variant hover:text-primary transition-colors cursor-pointer"
                  >
                    {showCurrentPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                  </button>
                </div>
                {passwordErrors.currentPassword && (
                  <p className="text-xs text-red-400 font-label-bold uppercase tracking-wide">{passwordErrors.currentPassword}</p>
                )}
              </div>

              {/* New Password */}
              <div className="space-y-2 group">
                <label className="block font-label-bold text-label-bold uppercase tracking-wider text-on-surface-variant group-focus-within:text-primary transition-colors">
                  New Password
                </label>
                <div className="relative">
                  <input 
                    type={showNewPassword ? 'text' : 'password'}
                    value={newPassword}
                    onChange={(e) => {
                      setNewPassword(e.target.value);
                      if (passwordErrors.newPassword) setPasswordErrors(prev => ({ ...prev, newPassword: '' }));
                    }}
                    className={`w-full bg-surface-container-low border focus:border-primary focus:ring-1 focus:ring-primary px-4 py-3 text-on-surface transition-all outline-none ${
                      passwordErrors.newPassword ? 'border-red-500/50' : 'border-outline-variant'
                    }`}
                    placeholder="••••••••••••"
                  />
                  <button 
                    type="button"
                    onClick={() => setShowNewPassword(!showNewPassword)}
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-on-surface-variant hover:text-primary transition-colors cursor-pointer"
                  >
                    {showNewPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                  </button>
                </div>
                {passwordErrors.newPassword && (
                  <p className="text-xs text-red-400 font-label-bold uppercase tracking-wide">{passwordErrors.newPassword}</p>
                )}

                {/* Strength Indicator */}
                <div className="flex gap-1 pt-1">
                  <div className={`h-1 flex-1 transition-colors ${getStrengthBarClass(1)}`}></div>
                  <div className={`h-1 flex-1 transition-colors ${getStrengthBarClass(2)}`}></div>
                  <div className={`h-1 flex-1 transition-colors ${getStrengthBarClass(3)}`}></div>
                  <div className={`h-1 flex-1 transition-colors ${getStrengthBarClass(4)}`}></div>
                </div>
                <p className="text-[10px] uppercase font-bold text-on-surface-variant">
                  Security Level: {strengthLabel}
                </p>
              </div>

              {/* Confirm Password */}
              <div className="space-y-2 group">
                <label className="block font-label-bold text-label-bold uppercase tracking-wider text-on-surface-variant group-focus-within:text-primary transition-colors">
                  Confirm Password
                </label>
                <div className="relative">
                  <input 
                    type={showConfirmPassword ? 'text' : 'password'}
                    value={confirmPassword}
                    onChange={(e) => {
                      setConfirmPassword(e.target.value);
                      if (passwordErrors.confirmPassword) setPasswordErrors(prev => ({ ...prev, confirmPassword: '' }));
                    }}
                    className={`w-full bg-surface-container-low border focus:border-primary focus:ring-1 focus:ring-primary px-4 py-3 text-on-surface transition-all outline-none ${
                      passwordErrors.confirmPassword ? 'border-red-500/50' : 'border-outline-variant'
                    }`}
                    placeholder="••••••••••••"
                  />
                  <button 
                    type="button"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-on-surface-variant hover:text-primary transition-colors cursor-pointer"
                  >
                    {showConfirmPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                  </button>
                </div>
                {passwordErrors.confirmPassword && (
                  <p className="text-xs text-red-400 font-label-bold uppercase tracking-wide">{passwordErrors.confirmPassword}</p>
                )}
              </div>

              {/* Requirements Checklist */}
              <div className="bg-surface-container-lowest/50 p-4 border-l-2 border-primary-container space-y-2">
                <p className="font-label-bold text-[11px] text-on-surface uppercase tracking-widest mb-2">Requirements</p>
                <ul className="space-y-2">
                  <li className={`flex items-center gap-3 text-label-sm ${hasLength ? 'text-primary' : 'text-on-surface-variant'}`}>
                    <span 
                      className="material-symbols-outlined text-sm"
                      style={{ fontVariationSettings: `'FILL' ${hasLength ? 1 : 0}` }}
                    >
                      {hasLength ? 'check_circle' : 'circle'}
                    </span>
                    <span>At least 8 characters</span>
                  </li>
                  <li className={`flex items-center gap-3 text-label-sm ${hasUpper ? 'text-primary' : 'text-on-surface-variant'}`}>
                    <span 
                      className="material-symbols-outlined text-sm"
                      style={{ fontVariationSettings: `'FILL' ${hasUpper ? 1 : 0}` }}
                    >
                      {hasUpper ? 'check_circle' : 'circle'}
                    </span>
                    <span>One uppercase letter</span>
                  </li>
                  <li className={`flex items-center gap-3 text-label-sm ${hasNumberOrSymbol ? 'text-primary' : 'text-on-surface-variant'}`}>
                    <span 
                      className="material-symbols-outlined text-sm"
                      style={{ fontVariationSettings: `'FILL' ${hasNumberOrSymbol ? 1 : 0}` }}
                    >
                      {hasNumberOrSymbol ? 'check_circle' : 'circle'}
                    </span>
                    <span>One number or symbol</span>
                  </li>
                </ul>
              </div>

              {/* Modal Footer */}
              <div className="pt-4 flex flex-col md:flex-row gap-4">
                <button 
                  type="submit"
                  disabled={isPasswordSubmitting}
                  className="flex-1 bg-primary text-on-primary font-display text-[20px] py-4 tracking-widest hover:brightness-110 active:scale-95 transition-all duration-300 disabled:opacity-50 uppercase cursor-pointer shadow-[0_0_15px_rgba(196,30,92,0.3)] flex items-center justify-center gap-2"
                >
                  {isPasswordSubmitting ? (
                    <>
                      <Loader2 className="w-5 h-5 animate-spin" /> UPDATING...
                    </>
                  ) : (
                    'UPDATE PASSWORD'
                  )}
                </button>
                <button 
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="flex-1 border border-outline-variant text-on-surface-variant hover:text-on-surface hover:bg-surface-container-high font-display text-[20px] py-4 tracking-widest transition-all duration-300 active:scale-95 uppercase cursor-pointer"
                >
                  DISCARD
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
