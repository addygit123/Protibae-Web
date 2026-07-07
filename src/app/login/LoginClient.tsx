'use client';

import { useState } from 'react';
import { AuthLayout } from '@/components/auth/AuthLayout';
import { LoginForm } from '@/components/auth/LoginForm';
import { SignupForm } from '@/components/auth/SignupForm';

export default function LoginClient() {
  const [view, setView] = useState<'login' | 'signup'>('login');

  return (
    <AuthLayout>
      <div className="relative w-full max-w-md h-full flex items-center min-h-[600px]">
        <LoginForm 
          isVisible={view === 'login'} 
          onToggleView={() => setView('signup')} 
        />
        <SignupForm 
          isVisible={view === 'signup'} 
          onToggleView={() => setView('login')} 
        />
      </div>
    </AuthLayout>
  );
}
