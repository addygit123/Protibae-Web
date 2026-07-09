'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

export function CreateShipmentButton({ orderId }: { orderId: string }) {
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const handleCreateShipment = async () => {
    setIsLoading(true);
    try {
      const res = await fetch(`/api/admin/orders/${orderId}/shipment`, {
        method: 'POST',
      });
      const data = await res.json();
      
      if (!res.ok) {
        alert(data.error || 'Failed to create shipment');
      } else {
        router.refresh();
      }
    } catch (error) {
      console.error(error);
      alert('An error occurred');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <button
      onClick={handleCreateShipment}
      disabled={isLoading}
      className="w-full flex justify-center items-center gap-2 h-[42px] bg-[#c41e5c] hover:bg-[#a0184b] text-white font-label-bold text-[12px] uppercase tracking-widest rounded transition-colors disabled:opacity-50"
    >
      {isLoading ? (
        <span className="material-symbols-outlined animate-spin text-[16px]">sync</span>
      ) : (
        <span className="material-symbols-outlined text-[16px]">local_shipping</span>
      )}
      {isLoading ? 'Creating...' : 'Create Shiprocket Shipment'}
    </button>
  );
}
