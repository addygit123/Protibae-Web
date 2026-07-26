'use client';

import { Address } from '@prisma/client';
import { Edit2, Trash2, Check, Star } from 'lucide-react';
import { useState } from 'react';

interface AddressCardProps {
  address: Address;
  onEdit: (address: Address) => void;
  onDelete: (id: string) => void;
  onSetDefault: (id: string) => void;
}

export function AddressCard({ address, onEdit, onDelete, onSetDefault }: AddressCardProps) {
  const [isDeleting, setIsDeleting] = useState(false);
  const [isSettingDefault, setIsSettingDefault] = useState(false);

  const fullName = `${address.firstName} ${address.lastName === '.' ? '' : address.lastName}`.trim();
  const addressTypeLabel = address.type === 'BILLING' ? 'Office' : 'Home';

  // Format street address nicely (replace newlines with <br/>)
  const streetLines = address.street.split('\n');

  const handleDelete = async () => {
    if (confirm('Are you sure you want to delete this address?')) {
      setIsDeleting(true);
      try {
        const res = await fetch(`/api/addresses/${address.id}`, { method: 'DELETE' });
        if (res.ok) {
          onDelete(address.id);
        }
      } catch (err) {
        console.error('Delete error:', err);
      } finally {
        setIsDeleting(false);
      }
    }
  };

  const handleSetDefault = async () => {
    setIsSettingDefault(true);
    try {
      const res = await fetch(`/api/addresses/${address.id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          fullName,
          phone: address.phone || '',
          zip: address.zip,
          houseBuilding: streetLines[0] || '',
          streetArea: streetLines[1] || '',
          city: address.city,
          state: address.state,
          addressType: address.type === 'BILLING' ? 'office' : 'home',
          isDefault: true,
        }),
      });
      if (res.ok) {
        onSetDefault(address.id);
      }
    } catch (err) {
      console.error('Set default error:', err);
    } finally {
      setIsSettingDefault(false);
    }
  };

  return (
    <div className={`p-6 flex flex-col justify-between border transition-all duration-300 bg-[rgba(26,27,31,0.7)] backdrop-blur-[20px] rounded-lg ${
      address.isDefault 
        ? 'border-primary shadow-[0_0_20px_rgba(196,30,92,0.1)]' 
        : 'border-outline-variant/30 hover:border-primary/50 hover:shadow-[0_0_20px_rgba(196,30,92,0.15)]'
    }`}>
      <div>
        <div className="flex justify-between items-start mb-4">
          <h3 className={`font-label-bold text-body-lg uppercase tracking-tight ${address.isDefault ? 'text-primary' : 'text-on-background'}`}>
            {fullName}
          </h3>
          <div className="flex items-center gap-2">
            <span className="text-[10px] font-label-bold px-2 py-0.5 bg-surface-container-highest text-on-surface-variant border border-outline-variant/30 rounded uppercase tracking-wider">
              {addressTypeLabel}
            </span>
            {address.isDefault && (
              <span className="bg-primary-container text-on-primary-container text-[10px] font-label-bold px-2 py-0.5 uppercase tracking-widest rounded">
                DEFAULT
              </span>
            )}
          </div>
        </div>
        
        <div className="text-on-surface-variant leading-relaxed font-body">
          {streetLines.map((line, index) => (
            <p key={index}>{line}</p>
          ))}
          <p>{address.city}, {address.state} {address.zip}</p>
          <p>{address.country === 'IN' ? 'India' : address.country}</p>
        </div>

        {address.phone && (
          <div className="mt-4 flex items-center gap-2 text-outline font-body">
            <span className="material-symbols-outlined text-[18px]">phone</span>
            <span className="text-label-bold font-semibold">{address.phone}</span>
          </div>
        )}
      </div>

      <div className="mt-8 pt-4 border-t border-outline-variant/30 flex justify-between items-center">
        <div className="flex gap-4">
          <button 
            onClick={() => onEdit(address)}
            className="text-label-bold text-on-surface hover:text-primary transition-colors flex items-center gap-1 cursor-pointer font-bold"
          >
            <Edit2 size={14} /> EDIT
          </button>
          
          <button 
            onClick={handleDelete}
            disabled={isDeleting}
            className="text-label-bold text-on-surface-variant hover:text-error transition-colors flex items-center gap-1 cursor-pointer disabled:opacity-50 font-bold"
          >
            <Trash2 size={14} /> DELETE
          </button>
        </div>

        {!address.isDefault && (
          <button
            onClick={handleSetDefault}
            disabled={isSettingDefault}
            className="text-xs text-primary/80 hover:text-primary hover:underline flex items-center gap-1 cursor-pointer disabled:opacity-50 font-bold"
          >
            <Star size={12} className="fill-current" /> SET AS DEFAULT
          </button>
        )}
      </div>
    </div>
  );
}
