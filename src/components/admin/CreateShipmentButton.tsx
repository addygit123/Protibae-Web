'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import type { ShippingProviderId } from '@/lib/shipping/types';

interface CreateShipmentButtonProps {
  orderId: string;
  label?: string;
  defaultProvider?: string;
  enabledProviders: {
    shiprocket: boolean;
    indiapost: boolean;
    porter: boolean;
    nimbuspost: boolean;
  };
}

import type { ShippingOption } from '@/lib/shipping/types';

export function CreateShipmentButton({ orderId, label, defaultProvider, enabledProviders }: CreateShipmentButtonProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [provider, setProvider] = useState<ShippingProviderId>((defaultProvider as ShippingProviderId) || 'shiprocket');
  const router = useRouter();

  const [showConfirm, setShowConfirm] = useState(false);
  const [fetchedOptions, setFetchedOptions] = useState<ShippingOption[] | null>(null);
  const [selectedOptionId, setSelectedOptionId] = useState<string>('');

  const handleFetchOptions = async () => {
    setIsLoading(true);
    setFetchedOptions(null);
    try {
      const res = await fetch(`/api/admin/orders/${orderId}/shipping-options?provider=${provider}`);
      const data = await res.json();
      if (!res.ok) {
        alert(data.error || 'Failed to fetch options');
      } else {
        setFetchedOptions(data.options);
        if (data.options && data.options.length > 0) {
           setSelectedOptionId(data.options[0].id);
        }
      }
    } catch (error) {
      console.error(error);
      alert('An error occurred while fetching options');
    } finally {
      setIsLoading(false);
    }
  };

  const handleCreateShipment = async () => {
    if (fetchedOptions && fetchedOptions.length > 0 && !selectedOptionId) {
      alert('Please select a specific courier option');
      return;
    }

    setIsLoading(true);
    try {
      const res = await fetch(`/api/admin/orders/${orderId}/shipment`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ provider, selectedOptionId })
      });
      const data = await res.json();
      
      if (!res.ok) {
        alert(data.error || 'Failed to create shipment');
      } else {
        setShowConfirm(false);
        router.refresh();
      }
    } catch (error) {
      console.error(error);
      alert('An error occurred');
    } finally {
      setIsLoading(false);
    }
  };

  if (showConfirm) {
    return (
      <div className="flex flex-col gap-3 p-4 border border-[#c41e5c] bg-[#1a1b1f] rounded shadow-[0_0_15px_rgba(196,30,92,0.15)]">
        <h4 className="font-label-bold text-[14px] text-[#ffb1c1] uppercase tracking-widest">Confirm Shipment</h4>
        <p className="text-[12px] text-[#e3e2e7] leading-relaxed">
          Warning: This will create a real shipment with <strong className="text-white uppercase">{provider}</strong>. Confirm only when you are ready to ship this order.
        </p>
        <div className="flex gap-2 mt-2">
          <button
            onClick={() => setShowConfirm(false)}
            disabled={isLoading}
            className="flex-1 h-[36px] bg-[#343539] hover:bg-[#292a2e] text-[#e3e2e7] font-label-bold text-[11px] uppercase tracking-widest rounded transition-colors disabled:opacity-50"
          >
            Cancel
          </button>
          <button
            onClick={handleCreateShipment}
            disabled={isLoading}
            className="flex-1 h-[36px] bg-[#c41e5c] hover:bg-[#a0184b] text-white font-label-bold text-[11px] uppercase tracking-widest rounded transition-colors disabled:opacity-50 flex items-center justify-center"
          >
            {isLoading ? <span className="material-symbols-outlined animate-spin text-[14px]">sync</span> : 'Confirm & Ship'}
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-3">
      <div className="flex flex-col gap-1">
        <label className="text-[10px] text-[#e3e2e7]/70 uppercase tracking-wider font-label-bold">Shipping Provider</label>
        <select 
          value={provider}
          onChange={(e) => {
            setProvider(e.target.value as ShippingProviderId);
            setFetchedOptions(null);
            setSelectedOptionId('');
          }}
          className="bg-[#1a1b1f] border border-[#594045]/30 p-2 text-sm text-[#e3e2e7] rounded focus:outline-none focus:border-[#c41e5c]"
          disabled={isLoading}
        >
          {enabledProviders.shiprocket && <option value="shiprocket">Shiprocket (Default)</option>}
          {enabledProviders.porter && <option value="porter">Porter</option>}
          {enabledProviders.nimbuspost && <option value="nimbuspost">NimbusPost</option>}
          {enabledProviders.indiapost && <option value="indiapost">India Post (Manual)</option>}
        </select>
      </div>

      {fetchedOptions && (
        <div className="flex flex-col gap-1">
          <label className="text-[10px] text-[#e3e2e7]/70 uppercase tracking-wider font-label-bold">Select Courier Option</label>
          <select 
            value={selectedOptionId}
            onChange={(e) => setSelectedOptionId(e.target.value)}
            className="bg-[#1a1b1f] border border-[#594045]/30 p-2 text-sm text-[#e3e2e7] rounded focus:outline-none focus:border-[#c41e5c]"
            disabled={isLoading}
          >
            {fetchedOptions.length === 0 && <option disabled>No serviceable options found</option>}
            {fetchedOptions.map(opt => (
              <option key={opt.id} value={opt.id}>
                {opt.courierName} (₹{opt.rate}) - {opt.etaLabel || 'N/A'}
              </option>
            ))}
          </select>
        </div>
      )}

      {!fetchedOptions ? (
        <button
          onClick={handleFetchOptions}
          disabled={isLoading}
          className="w-full flex justify-center items-center gap-2 h-[42px] bg-[#343539] hover:bg-[#c41e5c] border border-[#594045]/50 hover:border-transparent text-[#e3e2e7] hover:text-white font-label-bold text-[12px] uppercase tracking-widest rounded transition-all disabled:opacity-50"
        >
          {isLoading ? <span className="material-symbols-outlined animate-spin text-[16px]">sync</span> : <span className="material-symbols-outlined text-[16px]">search</span>}
          {isLoading ? 'Fetching...' : 'Fetch Courier Options'}
        </button>
      ) : (
        <button
          onClick={() => setShowConfirm(true)}
          disabled={isLoading || fetchedOptions.length === 0}
          className="w-full flex justify-center items-center gap-2 h-[42px] bg-[#343539] hover:bg-[#c41e5c] border border-[#594045]/50 hover:border-transparent text-[#e3e2e7] hover:text-white font-label-bold text-[12px] uppercase tracking-widest rounded transition-all disabled:opacity-50"
        >
          <span className="material-symbols-outlined text-[16px]">local_shipping</span>
          {label || 'Create Shipment'}
        </button>
      )}
    </div>
  );
}
