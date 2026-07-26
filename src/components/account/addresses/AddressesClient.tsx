'use client';

import { useState } from 'react';
import { Address } from '@prisma/client';
import { AddressCard } from './AddressCard';
import { Plus } from 'lucide-react';
import { useRouter } from 'next/navigation';

interface AddressesClientProps {
  initialAddresses: Address[];
}

export function AddressesClient({ initialAddresses }: AddressesClientProps) {
  const router = useRouter();
  const [addresses, setAddresses] = useState<Address[]>(initialAddresses);

  const fetchAddresses = async () => {
    try {
      const res = await fetch('/api/addresses');
      if (res.ok) {
        const data = await res.json();
        setAddresses(data);
      }
    } catch (err) {
      console.error('Error fetching addresses:', err);
    }
  };

  const handleEdit = (address: Address) => {
    router.push(`/account/addresses/${address.id}`);
  };

  const handleAddNew = () => {
    router.push('/account/addresses/new');
  };

  const handleDelete = (id: string) => {
    setAddresses((prev) => prev.filter((a) => a.id !== id));
  };

  const handleSetDefault = (id: string) => {
    setAddresses((prev) =>
      prev.map((a) => ({
        ...a,
        isDefault: a.id === id,
      }))
    );
    fetchAddresses();
  };

  return (
    <div className="w-full">
      {/* Header Info */}
      <div className="flex justify-between items-end mb-10">
        <div className="space-y-1">
          <h1 className="font-display text-headline-lg text-on-background tracking-wider uppercase">
            SAVED ADDRESSES
          </h1>
          <p className="text-on-surface-variant font-body-md">
            Manage your shipping and billing locations for faster checkout.
          </p>
        </div>
        <button 
          onClick={handleAddNew}
          className="bg-primary text-on-primary font-label-bold text-label-bold px-6 py-3 rounded-none uppercase tracking-widest hover:brightness-110 active:scale-95 transition-all shadow-[0_0_15px_rgba(196,30,92,0.3)] cursor-pointer"
        >
          + ADD NEW ADDRESS
        </button>
      </div>

      {/* Grid Content */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {addresses.map((address) => (
          <AddressCard 
            key={address.id} 
            address={address}
            onEdit={handleEdit}
            onDelete={handleDelete}
            onSetDefault={handleSetDefault}
          />
        ))}

        {/* Empty State / Add Address Card */}
        <button 
          onClick={handleAddNew}
          className="border-2 border-dashed border-outline-variant/50 p-6 flex flex-col items-center justify-center gap-4 hover:border-primary/50 hover:bg-surface-container-low transition-all duration-300 group min-h-[250px] cursor-pointer rounded-lg"
        >
          <div className="w-12 h-12 rounded-full border border-outline-variant flex items-center justify-center group-hover:scale-110 transition-transform">
            <Plus className="w-6 h-6 text-outline group-hover:text-primary" />
          </div>
          <span className="font-label-bold text-label-bold text-outline group-hover:text-on-surface uppercase tracking-widest">
            ADD NEW ADDRESS
          </span>
        </button>
      </div>

      {/* Promotional Banner */}
      <div className="mt-12 w-full h-64 relative overflow-hidden group rounded-lg">
        <div className="absolute inset-0 bg-gradient-to-r from-background via-transparent to-transparent z-10"></div>
        <div 
          className="absolute inset-0 bg-cover bg-center group-hover:scale-105 transition-transform duration-1000 opacity-60"
          style={{ 
            backgroundImage: "url('https://lh3.googleusercontent.com/aida-public/AB6AXuA2Qfsycf_-YHGvG-jnt8qSmW-gJw3jGGPpLAObN1fKIbZ8rRS5LK2VEepAoK_2mjXgRv1LpBmhFO-7vXbQJjzdEaFRVqDdxt-Jy-S1SQyg5t8Ir3ECaW9RlAN_CsiEFRivxV-ts0n0zACq_9zp3L_BC1jDS8mYVXXOSS2NwRUa7naxhQHf83pNl29zO95EdPVLD62rbLCxiM3iEexiNogvarkWR6bsiGnOGtY2aV3f0CSjxtaWRRDzEqJGm5HipomjuiutltigHb0')" 
          }}
        ></div>
        <div className="absolute inset-0 flex flex-col justify-center px-12 z-20">
          <span className="text-primary font-label-bold text-label-sm uppercase tracking-[0.3em] mb-2">
            Exclusive Rewards
          </span>
          <h2 className="font-display text-headline-md text-white mb-4 uppercase">
            SAVE YOUR ADDRESS FOR<br/>LIGHTNING-FAST CHECKOUT
          </h2>
          <p className="text-on-surface-variant max-w-md font-body-md mb-6">
            Earn 50 Pro-Points for every new verified address added to your account today.
          </p>
        </div>
      </div>
    </div>
  );
}
