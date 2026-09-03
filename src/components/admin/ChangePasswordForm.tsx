'use client';

import React, { useState } from 'react';

export default function ChangePasswordForm() {
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setMessage('');

    if (newPassword !== confirmPassword) {
      setError('New passwords do not match');
      return;
    }

    if (newPassword.length < 12) {
      setError('New password must be at least 12 characters');
      return;
    }

    setLoading(true);
    try {
      const res = await fetch('/api/admin/change-password', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ currentPassword, newPassword }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || 'Failed to change password');
      }

      setMessage(data.message);
      setCurrentPassword('');
      setNewPassword('');
      setConfirmPassword('');
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {error && <div className="p-3 bg-red-500/20 text-red-400 font-label-bold text-[12px] rounded">{error}</div>}
      {message && <div className="p-3 bg-green-500/20 text-green-400 font-label-bold text-[12px] rounded">{message}</div>}

      <div>
        <label className="block font-label-bold text-[14px] text-[#e3e2e7] mb-2">Current Password</label>
        <input 
          className="w-full bg-[#1a1b1f] border border-[#594045] p-3 font-body text-[16px] text-[#e3e2e7] focus:ring-1 focus:ring-[#ffb1c1] focus:border-[#ffb1c1] rounded" 
          type="password" 
          value={currentPassword}
          onChange={(e) => setCurrentPassword(e.target.value)}
          required
        />
      </div>

      <div>
        <label className="block font-label-bold text-[14px] text-[#e3e2e7] mb-2">New Password (Min 12 Characters)</label>
        <input 
          className="w-full bg-[#1a1b1f] border border-[#594045] p-3 font-body text-[16px] text-[#e3e2e7] focus:ring-1 focus:ring-[#ffb1c1] focus:border-[#ffb1c1] rounded" 
          type="password" 
          value={newPassword}
          onChange={(e) => setNewPassword(e.target.value)}
          required
          minLength={12}
        />
      </div>

      <div>
        <label className="block font-label-bold text-[14px] text-[#e3e2e7] mb-2">Confirm New Password</label>
        <input 
          className="w-full bg-[#1a1b1f] border border-[#594045] p-3 font-body text-[16px] text-[#e3e2e7] focus:ring-1 focus:ring-[#ffb1c1] focus:border-[#ffb1c1] rounded" 
          type="password" 
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
          required
          minLength={12}
        />
      </div>

      <div className="pt-4 flex justify-end">
        <button 
          type="submit" 
          disabled={loading}
          className="px-8 py-3 bg-[#c41e5c] text-white font-label-bold text-[14px] uppercase tracking-widest drop-shadow-[0_0_15px_rgba(196,30,92,0.3)] hover:brightness-110 transition-all rounded disabled:opacity-50"
        >
          {loading ? 'Updating...' : 'Update Password'}
        </button>
      </div>
    </form>
  );
}
