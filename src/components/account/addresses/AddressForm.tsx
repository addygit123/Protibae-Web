'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Address } from '@prisma/client';
import { Loader2, CheckCircle, AlertCircle, X } from 'lucide-react';

interface AddressFormProps {
  initialAddress: Address | null;
}

interface Toast {
  id: string;
  message: string;
  type: 'success' | 'error';
}

export function AddressForm({ initialAddress }: AddressFormProps) {
  const router = useRouter();
  
  const [fullName, setFullName] = useState('');
  const [phone, setPhone] = useState('');
  const [zip, setZip] = useState('');
  const [landmark, setLandmark] = useState('');
  const [houseBuilding, setHouseBuilding] = useState('');
  const [streetArea, setStreetArea] = useState('');
  const [city, setCity] = useState('');
  const [state, setState] = useState('');
  const [addressType, setAddressType] = useState<'home' | 'office'>('home');
  const [isDefault, setIsDefault] = useState(false);
  
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

  useEffect(() => {
    if (initialAddress) {
      setFullName(`${initialAddress.firstName} ${initialAddress.lastName === '.' ? '' : initialAddress.lastName}`.trim());
      setPhone(initialAddress.phone || '');
      setZip(initialAddress.zip);
      
      const parts = initialAddress.street.split('\n');
      setHouseBuilding(parts[0] || '');
      
      let secondPart = parts[1] || '';
      let parsedLandmark = '';
      const landmarkIndex = initialAddress.street.indexOf('\nLandmark: ');
      if (landmarkIndex !== -1) {
        parsedLandmark = initialAddress.street.slice(landmarkIndex + 11);
        secondPart = parts.slice(1).join('\n');
        const endOfStreetAreaIndex = secondPart.indexOf('\nLandmark: ');
        if (endOfStreetAreaIndex !== -1) {
          secondPart = secondPart.slice(0, endOfStreetAreaIndex);
        } else if (secondPart.startsWith('Landmark: ')) {
          secondPart = '';
        }
      }
      setStreetArea(secondPart);
      setLandmark(parsedLandmark);
      
      setCity(initialAddress.city);
      setState(initialAddress.state);
      setAddressType(initialAddress.type === 'BILLING' ? 'office' : 'home');
      setIsDefault(initialAddress.isDefault);
    }
  }, [initialAddress]);

  const validate = () => {
    const newErrors: Record<string, string> = {};
    if (!fullName.trim()) newErrors.fullName = 'Full Name is required';
    if (!phone.trim()) {
      newErrors.phone = 'Phone Number is required';
    } else if (!/^[0-9+ ]{10,15}$/.test(phone.trim())) {
      newErrors.phone = 'Enter a valid phone number (10-15 digits)';
    }
    if (!zip.trim()) {
      newErrors.zip = 'ZIP / PIN Code is required';
    } else if (!/^\d{5,6}$/.test(zip.trim())) {
      newErrors.zip = 'Enter a valid ZIP / PIN Code (5-6 digits)';
    }
    if (!houseBuilding.trim()) newErrors.houseBuilding = 'House / Flat / Building No. is required';
    if (!streetArea.trim()) newErrors.streetArea = 'Street / Area is required';
    if (!city.trim()) newErrors.city = 'City is required';
    if (!state) newErrors.state = 'State is required';

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
    
    const payload = {
      fullName,
      phone,
      zip,
      landmark,
      houseBuilding,
      streetArea,
      city,
      state,
      addressType,
      isDefault,
    };

    try {
      const url = initialAddress ? `/api/addresses/${initialAddress.id}` : '/api/addresses';
      const method = initialAddress ? 'PATCH' : 'POST';

      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      if (!res.ok) {
        const errData = await res.json();
        throw new Error(errData.error || 'Failed to save address');
      }

      showToast(initialAddress ? 'Address updated successfully!' : 'Address added successfully!', 'success');
      
      // Delay navigation slightly so they see the success toast
      setTimeout(() => {
        router.push('/account/addresses');
        router.refresh();
      }, 1000);

    } catch (err: any) {
      showToast(err.message || 'An error occurred while saving.', 'error');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="w-full relative">
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

      <div className="max-w-[720px] bg-[rgba(18,19,23,0.7)] backdrop-blur-[24px] border border-outline-variant/30 rounded-lg p-8">
        <h2 className="font-display text-headline-md tracking-wider mb-6 text-white uppercase">
          {initialAddress ? 'EDIT ADDRESS' : 'ADD NEW ADDRESS'}
        </h2>
        <form onSubmit={handleSubmit} className="space-y-8">
          
          {/* Form Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            
            {/* Full Name */}
            <div className="space-y-2 group">
              <label className="font-label-bold text-label-bold uppercase tracking-widest text-on-surface-variant group-focus-within:text-primary transition-colors block">
                Full Name
              </label>
              <input 
                type="text"
                placeholder="e.g. Alex Hunter"
                value={fullName}
                onChange={(e) => {
                  setFullName(e.target.value);
                  if (validationErrors.fullName) {
                    setValidationErrors(prev => ({ ...prev, fullName: '' }));
                  }
                }}
                className={`w-full bg-surface-container-low border rounded-DEFAULT px-4 py-3 outline-none focus:shadow-[0_0_15px_rgba(196,30,92,0.2)] transition-all text-on-surface focus:ring-0 font-body ${
                  validationErrors.fullName ? 'border-red-500/50 focus:border-red-500' : 'border-outline-variant focus:border-primary'
                }`}
              />
              {validationErrors.fullName && (
                <p className="text-xs text-red-400 font-label-bold uppercase tracking-wide">{validationErrors.fullName}</p>
              )}
            </div>

            {/* Phone */}
            <div className="space-y-2 group">
              <label className="font-label-bold text-label-bold uppercase tracking-widest text-on-surface-variant group-focus-within:text-primary transition-colors block">
                Phone Number
              </label>
              <input 
                type="tel"
                placeholder="+1 (555) 000-0000"
                value={phone}
                onChange={(e) => {
                  setPhone(e.target.value);
                  if (validationErrors.phone) {
                    setValidationErrors(prev => ({ ...prev, phone: '' }));
                  }
                }}
                className={`w-full bg-surface-container-low border rounded-DEFAULT px-4 py-3 outline-none focus:shadow-[0_0_15px_rgba(196,30,92,0.2)] transition-all text-on-surface focus:ring-0 font-body ${
                  validationErrors.phone ? 'border-red-500/50 focus:border-red-500' : 'border-outline-variant focus:border-primary'
                }`}
              />
              {validationErrors.phone && (
                <p className="text-xs text-red-400 font-label-bold uppercase tracking-wide">{validationErrors.phone}</p>
              )}
            </div>

            {/* PIN Code */}
            <div className="space-y-2 group">
              <label className="font-label-bold text-label-bold uppercase tracking-widest text-on-surface-variant group-focus-within:text-primary transition-colors block">
                PIN / Zip Code
              </label>
              <input 
                type="text"
                placeholder="000000"
                value={zip}
                onChange={(e) => {
                  setZip(e.target.value);
                  if (validationErrors.zip) {
                    setValidationErrors(prev => ({ ...prev, zip: '' }));
                  }
                }}
                className={`w-full bg-surface-container-low border rounded-DEFAULT px-4 py-3 outline-none focus:shadow-[0_0_15px_rgba(196,30,92,0.2)] transition-all text-on-surface focus:ring-0 font-body ${
                  validationErrors.zip ? 'border-red-500/50 focus:border-red-500' : 'border-outline-variant focus:border-primary'
                }`}
              />
              {validationErrors.zip && (
                <p className="text-xs text-red-400 font-label-bold uppercase tracking-wide">{validationErrors.zip}</p>
              )}
            </div>

            {/* Landmark */}
            <div className="space-y-2 group">
              <label className="font-label-bold text-label-bold uppercase tracking-widest text-on-surface-variant group-focus-within:text-primary transition-colors block">
                Landmark (Optional)
              </label>
              <input 
                type="text"
                placeholder="Near Gym / Park"
                value={landmark}
                onChange={(e) => setLandmark(e.target.value)}
                className="w-full bg-surface-container-low border border-outline-variant rounded-DEFAULT px-4 py-3 outline-none focus:border-primary focus:shadow-[0_0_15px_rgba(196,30,92,0.2)] transition-all text-on-surface focus:ring-0 font-body"
              />
            </div>
          </div>

          {/* Full Width Inputs */}
          <div className="space-y-6">
            {/* House/Flat */}
            <div className="space-y-2 group">
              <label className="font-label-bold text-label-bold uppercase tracking-widest text-on-surface-variant group-focus-within:text-primary transition-colors block">
                House / Flat / Building No.
              </label>
              <input 
                type="text"
                placeholder="Apt 4B, Iron Gym Residence"
                value={houseBuilding}
                onChange={(e) => {
                  setHouseBuilding(e.target.value);
                  if (validationErrors.houseBuilding) {
                    setValidationErrors(prev => ({ ...prev, houseBuilding: '' }));
                  }
                }}
                className={`w-full bg-surface-container-low border rounded-DEFAULT px-4 py-3 outline-none focus:shadow-[0_0_15px_rgba(196,30,92,0.2)] transition-all text-on-surface focus:ring-0 font-body ${
                  validationErrors.houseBuilding ? 'border-red-500/50 focus:border-red-500' : 'border-outline-variant focus:border-primary'
                }`}
              />
              {validationErrors.houseBuilding && (
                <p className="text-xs text-red-400 font-label-bold uppercase tracking-wide">{validationErrors.houseBuilding}</p>
              )}
            </div>

            {/* Area/Street */}
            <div className="space-y-2 group">
              <label className="font-label-bold text-label-bold uppercase tracking-widest text-on-surface-variant group-focus-within:text-primary transition-colors block">
                Area / Street / Sector
              </label>
              <textarea 
                placeholder="Muscle Beach Blvd, Sector 7"
                rows={2}
                value={streetArea}
                onChange={(e) => {
                  setStreetArea(e.target.value);
                  if (validationErrors.streetArea) {
                    setValidationErrors(prev => ({ ...prev, streetArea: '' }));
                  }
                }}
                className={`w-full bg-surface-container-low border rounded-DEFAULT px-4 py-3 outline-none focus:shadow-[0_0_15px_rgba(196,30,92,0.2)] transition-all text-on-surface focus:ring-0 resize-none font-body ${
                  validationErrors.streetArea ? 'border-red-500/50 focus:border-red-500' : 'border-outline-variant focus:border-primary'
                }`}
              />
              {validationErrors.streetArea && (
                <p className="text-xs text-red-400 font-label-bold uppercase tracking-wide">{validationErrors.streetArea}</p>
              )}
            </div>
          </div>

          {/* City & State Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* City */}
            <div className="space-y-2 group">
              <label className="font-label-bold text-label-bold uppercase tracking-widest text-on-surface-variant group-focus-within:text-primary transition-colors block">
                City
              </label>
              <input 
                type="text"
                placeholder="Metropolis"
                value={city}
                onChange={(e) => {
                  setCity(e.target.value);
                  if (validationErrors.city) {
                    setValidationErrors(prev => ({ ...prev, city: '' }));
                  }
                }}
                className={`w-full bg-surface-container-low border rounded-DEFAULT px-4 py-3 outline-none focus:shadow-[0_0_15px_rgba(196,30,92,0.2)] transition-all text-on-surface focus:ring-0 font-body ${
                  validationErrors.city ? 'border-red-500/50 focus:border-red-500' : 'border-outline-variant focus:border-primary'
                }`}
              />
              {validationErrors.city && (
                <p className="text-xs text-red-400 font-label-bold uppercase tracking-wide">{validationErrors.city}</p>
              )}
            </div>

            {/* State */}
            <div className="space-y-2 group">
              <label className="font-label-bold text-label-bold uppercase tracking-widest text-on-surface-variant group-focus-within:text-primary transition-colors block">
                State
              </label>
              <div className="relative">
                <select 
                  value={state}
                  onChange={(e) => {
                    setState(e.target.value);
                    if (validationErrors.state) {
                      setValidationErrors(prev => ({ ...prev, state: '' }));
                    }
                  }}
                  className={`w-full bg-surface-container-low border rounded-DEFAULT px-4 py-3 outline-none appearance-none focus:ring-0 font-body uppercase ${
                    validationErrors.state ? 'border-red-500/50 focus:border-red-500' : 'border-outline-variant focus:border-primary'
                  }`}
                >
                  <option value="" disabled>Select State</option>
                  <option value="California">California</option>
                  <option value="New York">New York</option>
                  <option value="Texas">Texas</option>
                  <option value="Florida">Florida</option>
                  <option value="Delhi">Delhi</option>
                  <option value="Maharashtra">Maharashtra</option>
                  <option value="Karnataka">Karnataka</option>
                  <option value="Haryana">Haryana</option>
                </select>
                <span className="material-symbols-outlined absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-outline">
                  expand_more
                </span>
              </div>
              {validationErrors.state && (
                <p className="text-xs text-red-400 font-label-bold uppercase tracking-wide">{validationErrors.state}</p>
              )}
            </div>
          </div>

          {/* Address Type Selection */}
          <div className="space-y-4">
            <label className="font-label-bold text-label-bold uppercase tracking-widest text-on-surface-variant block">
              Address Type
            </label>
            <div className="flex gap-4">
              <label className="flex-1 cursor-pointer group">
                <input 
                  type="radio" 
                  name="address_type" 
                  checked={addressType === 'home'}
                  onChange={() => setAddressType('home')}
                  className="hidden peer" 
                />
                <div className="flex items-center justify-center gap-3 py-4 border border-outline-variant rounded-DEFAULT peer-checked:border-primary peer-checked:bg-primary-container/10 transition-all hover:bg-surface-container-high">
                  <span className="material-symbols-outlined peer-checked:text-primary">home</span>
                  <span className="font-label-bold text-label-bold uppercase tracking-widest text-on-surface">Home</span>
                </div>
              </label>
              <label className="flex-1 cursor-pointer group">
                <input 
                  type="radio" 
                  name="address_type"
                  checked={addressType === 'office'}
                  onChange={() => setAddressType('office')}
                  className="hidden peer" 
                />
                <div className="flex items-center justify-center gap-3 py-4 border border-outline-variant rounded-DEFAULT peer-checked:border-primary peer-checked:bg-primary-container/10 transition-all hover:bg-surface-container-high">
                  <span className="material-symbols-outlined peer-checked:text-primary">work</span>
                  <span className="font-label-bold text-label-bold uppercase tracking-widest text-on-surface">Office</span>
                </div>
              </label>
            </div>
          </div>

          {/* Default Toggle */}
          <div className="flex items-center justify-between py-4 border-y border-outline-variant/20">
            <div className="flex items-center gap-3">
              <span className="material-symbols-outlined text-primary">verified_user</span>
              <span className="font-label-bold text-label-bold uppercase tracking-widest text-on-surface">Set as default address</span>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input 
                type="checkbox" 
                checked={isDefault}
                onChange={(e) => setIsDefault(e.target.checked)}
                className="sr-only peer" 
              />
              <div className="w-11 h-6 bg-surface-container-highest peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary-container"></div>
            </label>
          </div>

          {/* Submit/Cancel Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 pt-4">
            <button 
              type="submit"
              disabled={isSubmitting}
              className="flex-grow bg-primary-container text-white py-4 rounded-DEFAULT font-label-bold text-label-bold uppercase tracking-widest shadow-[0_0_20px_rgba(196,30,92,0.4)] hover:bg-inverse-primary transition-all active:scale-95 flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin" /> SAVING...
                </>
              ) : (
                'SAVE ADDRESS'
              )}
            </button>
            <button 
              type="button"
              onClick={() => router.push('/account/addresses')}
              className="flex-grow border border-outline-variant text-on-surface py-4 rounded-DEFAULT font-label-bold text-label-bold uppercase tracking-widest hover:bg-surface-container-high transition-all active:scale-95 cursor-pointer text-center"
            >
              CANCEL
            </button>
          </div>

        </form>
      </div>
    </div>
  );
}
