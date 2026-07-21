'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { UserPlus } from 'lucide-react';
import { trackSignup } from '@/lib/analytics/events';
import { useRouter } from 'next/navigation';
import { signIn } from 'next-auth/react';

const signupSchema = z.object({
  firstName: z.string().min(1, 'First name is required'),
  lastName: z.string().min(1, 'Last name is required'),
  email: z.string().email('Please enter a valid email address'),
  password: z.string().min(8, 'Password must be at least 8 characters'),
  terms: z.boolean().refine(val => val === true, 'You must agree to the terms'),
});

type SignupFormData = z.infer<typeof signupSchema>;

interface SignupFormProps {
  onToggleView: () => void;
  isVisible: boolean;
}

export function SignupForm({ onToggleView, isVisible }: SignupFormProps) {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<SignupFormData>({
    resolver: zodResolver(signupSchema),
  });

  const onSubmit = async (data: SignupFormData) => {
    setIsLoading(true);
    setError(null);
    try {
      console.log('Signup attempt:', data);
      
      const res = await fetch('/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });

      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.error || 'Failed to register');
      }

      // Automatically sign in after successful registration
      const signInRes = await signIn('credentials', {
        email: data.email,
        password: data.password,
        redirect: false,
      });

      if (signInRes?.error) {
        throw new Error(signInRes.error);
      }

      trackSignup('credentials');
      router.push('/account');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred during signup');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div 
      className={`w-full max-w-md auth-transition transition-all duration-500 absolute ${
        isVisible ? 'opacity-100 translate-x-0 relative z-10' : 'opacity-0 translate-x-12 pointer-events-none z-0'
      }`}
    >
      <header className="mb-10">
        <h2 className="font-display-hero text-headline-md text-on-surface mb-2 uppercase tracking-tight">Join Protibae</h2>
        <p className="text-on-surface-variant font-body-md">Start your performance journey with premium fuel.</p>
      </header>

      {error && (
        <div className="mb-6 p-4 bg-error-container/20 border border-error text-error text-sm rounded">
          {error}
        </div>
      )}

      <form className="space-y-4" onSubmit={handleSubmit(onSubmit)}>
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <label className="font-label-bold text-label-bold uppercase tracking-widest text-on-surface-variant ml-1">First Name</label>
            <input 
              {...register('firstName')}
              className="w-full bg-surface-container-low border border-outline-variant/30 rounded-none px-4 py-3 text-on-surface focus:outline-none focus:border-primary focus:shadow-[0_0_15px_rgba(196,30,92,0.2)] transition-all" 
              placeholder="John" 
              type="text"
              disabled={isLoading}
            />
            {errors.firstName && <p className="text-error text-xs mt-1">{errors.firstName.message}</p>}
          </div>
          <div className="space-y-2">
            <label className="font-label-bold text-label-bold uppercase tracking-widest text-on-surface-variant ml-1">Last Name</label>
            <input 
              {...register('lastName')}
              className="w-full bg-surface-container-low border border-outline-variant/30 rounded-none px-4 py-3 text-on-surface focus:outline-none focus:border-primary focus:shadow-[0_0_15px_rgba(196,30,92,0.2)] transition-all" 
              placeholder="Doe" 
              type="text"
              disabled={isLoading}
            />
            {errors.lastName && <p className="text-error text-xs mt-1">{errors.lastName.message}</p>}
          </div>
        </div>

        <div className="space-y-2">
          <label className="font-label-bold text-label-bold uppercase tracking-widest text-on-surface-variant ml-1">Email Address</label>
          <input 
            {...register('email')}
            className="w-full bg-surface-container-low border border-outline-variant/30 rounded-none px-4 py-3 text-on-surface focus:outline-none focus:border-primary focus:shadow-[0_0_15px_rgba(196,30,92,0.2)] transition-all" 
            placeholder="name@example.com" 
            type="email"
            disabled={isLoading}
          />
          {errors.email && <p className="text-error text-xs mt-1">{errors.email.message}</p>}
        </div>

        <div className="space-y-2">
          <label className="font-label-bold text-label-bold uppercase tracking-widest text-on-surface-variant ml-1">Create Password</label>
          <input 
            {...register('password')}
            className="w-full bg-surface-container-low border border-outline-variant/30 rounded-none px-4 py-3 text-on-surface focus:outline-none focus:border-primary focus:shadow-[0_0_15px_rgba(196,30,92,0.2)] transition-all" 
            placeholder="Min. 8 characters" 
            type="password"
            disabled={isLoading}
          />
          {errors.password && <p className="text-error text-xs mt-1">{errors.password.message}</p>}
        </div>

        <div className="flex items-start gap-3 py-2">
          <input 
            {...register('terms')}
            className="mt-1 w-4 h-4 rounded-none bg-surface-container-low border-outline-variant text-primary focus:ring-primary" 
            id="terms" 
            type="checkbox"
            disabled={isLoading}
          />
          <label className="text-label-sm text-on-surface-variant leading-tight" htmlFor="terms">
            I agree to the <a className="text-primary hover:underline" href="#">Terms of Service</a> and <a className="text-primary hover:underline" href="#">Privacy Policy</a>.
          </label>
        </div>
        {errors.terms && <p className="text-error text-xs">{errors.terms.message}</p>}

        <div className="pt-4">
          <button 
            type="submit"
            disabled={isLoading}
            className="w-full bg-primary-container text-on-primary-container font-display-hero text-headline-md py-4 tracking-wider hover:shadow-[0_0_20px_rgba(196,30,92,0.4)] transition-all flex items-center justify-center gap-3 active:scale-95 disabled:opacity-70 disabled:cursor-not-allowed"
          >
            {isLoading ? 'CREATING...' : 'CREATE ACCOUNT'}
            <UserPlus className="w-6 h-6" />
          </button>
        </div>
      </form>

      <footer className="mt-10 text-center">
        <p className="text-on-surface-variant font-body-md">
          Already part of the team? 
          <button type="button" className="text-primary font-label-bold hover:underline ml-1" onClick={onToggleView}>SIGN IN</button>
        </p>
      </footer>
    </div>
  );
}
