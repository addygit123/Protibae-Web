'use client';

import { useState } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';

export function ResetPasswordForm() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const token = searchParams.get('token');
  const email = searchParams.get('email');

  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
  const [message, setMessage] = useState('');

  if (!token || !email) {
    return (
      <div className="text-red-500 text-sm text-center">
        Invalid or missing reset token. Please request a new password reset link.
      </div>
    );
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (password !== confirmPassword) {
      setStatus('error');
      setMessage('Passwords do not match');
      return;
    }

    setStatus('loading');
    
    try {
      const res = await fetch('/api/auth/reset-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, token, password }),
      });
      
      const data = await res.json();
      
      if (!res.ok) {
        throw new Error(data.error || 'Failed to reset password');
      }
      
      setStatus('success');
      setMessage(data.message);
      setTimeout(() => {
        router.push('/login');
      }, 2000);
    } catch (err: any) {
      setStatus('error');
      setMessage(err.message);
    }
  };

  return (
    <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
      <div className="rounded-md shadow-sm space-y-4">
        <div>
          <label className="sr-only">New Password</label>
          <input
            type="password"
            required
            className="appearance-none rounded relative block w-full px-3 py-2 border border-outline-variant/30 placeholder-outline text-on-surface bg-surface-container-low focus:outline-none focus:ring-primary focus:border-primary sm:text-sm"
            placeholder="New Password (min 8 characters)"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        </div>
        <div>
          <label className="sr-only">Confirm Password</label>
          <input
            type="password"
            required
            className="appearance-none rounded relative block w-full px-3 py-2 border border-outline-variant/30 placeholder-outline text-on-surface bg-surface-container-low focus:outline-none focus:ring-primary focus:border-primary sm:text-sm"
            placeholder="Confirm Password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
          />
        </div>
      </div>

      {status === 'success' && (
        <div className="text-green-500 text-sm text-center">{message}<br/>Redirecting to login...</div>
      )}
      
      {status === 'error' && (
        <div className="text-red-500 text-sm text-center">{message}</div>
      )}

      <div>
        <button
          type="submit"
          disabled={status === 'loading' || status === 'success'}
          className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-on-primary bg-primary hover:bg-primary/90 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary disabled:opacity-50"
        >
          {status === 'loading' ? 'Resetting...' : 'Reset Password'}
        </button>
      </div>
    </form>
  );
}
