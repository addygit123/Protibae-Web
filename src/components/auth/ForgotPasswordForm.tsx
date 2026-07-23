'use client';

import { useState } from 'react';

export function ForgotPasswordForm() {
  const [email, setEmail] = useState('');
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
  const [message, setMessage] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus('loading');
    
    try {
      const res = await fetch('/api/auth/forgot-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
      });
      
      const data = await res.json();
      
      if (!res.ok) {
        throw new Error(data.error || 'Failed to send reset link');
      }
      
      setStatus('success');
      setMessage(data.message);
    } catch (err: any) {
      setStatus('error');
      setMessage(err.message);
    }
  };

  return (
    <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
      <div className="rounded-md shadow-sm space-y-4">
        <div>
          <label htmlFor="email-address" className="sr-only">Email address</label>
          <input
            id="email-address"
            name="email"
            type="email"
            required
            className="appearance-none rounded relative block w-full px-3 py-2 border border-outline-variant/30 placeholder-outline text-on-surface bg-surface-container-low focus:outline-none focus:ring-primary focus:border-primary sm:text-sm"
            placeholder="Email address"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
        </div>
      </div>

      {status === 'success' && (
        <div className="text-green-500 text-sm text-center">{message}</div>
      )}
      
      {status === 'error' && (
        <div className="text-red-500 text-sm text-center">{message}</div>
      )}

      <div>
        <button
          type="submit"
          disabled={status === 'loading'}
          className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-on-primary bg-primary hover:bg-primary/90 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary disabled:opacity-50"
        >
          {status === 'loading' ? 'Sending...' : 'Send Reset Link'}
        </button>
      </div>
    </form>
  );
}
