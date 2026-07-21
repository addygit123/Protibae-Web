'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Zap } from 'lucide-react';
import { trackLogin } from '@/lib/analytics/events';
import { useRouter } from 'next/navigation';
import { signIn } from 'next-auth/react';

const loginSchema = z.object({
  email: z.string().email('Please enter a valid email address'),
  password: z.string().min(1, 'Password is required'),
});

type LoginFormData = z.infer<typeof loginSchema>;

interface LoginFormProps {
  onToggleView: () => void;
  isVisible: boolean;
}

export function LoginForm({ onToggleView, isVisible }: LoginFormProps) {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
  });

  const onSubmit = async (data: LoginFormData) => {
    setIsLoading(true);
    setError(null);
    try {
      const res = await signIn('credentials', {
        email: data.email,
        password: data.password,
        redirect: false,
      });

      if (res?.error) {
        throw new Error('Invalid email or password');
      }

      trackLogin('credentials');
      router.push('/account');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Invalid email or password');
    } finally {
      setIsLoading(false);
    }
  };

  const handleGoogleSignIn = async () => {
    setError(null);
    setIsLoading(true);
    try {
      await signIn('google', { callbackUrl: '/account' });
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unable to sign in with Google');
      setIsLoading(false);
    }
  };

  return (
    <div 
      className={`w-full max-w-md auth-transition transition-all duration-500 absolute ${
        isVisible ? 'opacity-100 translate-x-0 relative z-10' : 'opacity-0 -translate-x-12 pointer-events-none z-0'
      }`}
    >
      <header className="mb-10">
        <h2 className="font-display-hero text-headline-md text-on-surface mb-2 uppercase tracking-tight">Welcome Back</h2>
        <p className="text-on-surface-variant font-body-md">Enter your credentials to access your nutrition dashboard.</p>
      </header>

      {error && (
        <div className="mb-6 p-4 bg-error-container/20 border border-error text-error text-sm rounded">
          {error}
        </div>
      )}

      <form className="space-y-6" onSubmit={handleSubmit(onSubmit)}>
        <div className="space-y-2">
          <label className="font-label-bold text-label-bold uppercase tracking-widest text-on-surface-variant ml-1">Email Address</label>
          <div className="relative">
            <input 
              {...register('email')}
              className="w-full bg-surface-container-low border border-outline-variant/30 rounded-none px-4 py-4 text-on-surface placeholder:text-outline focus:outline-none focus:border-primary focus:shadow-[0_0_15px_rgba(196,30,92,0.2)] transition-all" 
              placeholder="name@example.com" 
              type="email"
              disabled={isLoading}
            />
            {errors.email && <p className="text-error text-xs mt-1">{errors.email.message}</p>}
          </div>
        </div>

        <div className="space-y-2">
          <div className="flex justify-between items-center px-1">
            <label className="font-label-bold text-label-bold uppercase tracking-widest text-on-surface-variant">Password</label>
            <a className="text-label-sm font-label-bold text-primary hover:underline" href="#">Forgot?</a>
          </div>
          <div className="relative">
            <input 
              {...register('password')}
              className="w-full bg-surface-container-low border border-outline-variant/30 rounded-none px-4 py-4 text-on-surface placeholder:text-outline focus:outline-none focus:border-primary focus:shadow-[0_0_15px_rgba(196,30,92,0.2)] transition-all" 
              placeholder="••••••••" 
              type="password"
              disabled={isLoading}
            />
            {errors.password && <p className="text-error text-xs mt-1">{errors.password.message}</p>}
          </div>
        </div>

        <div className="pt-2">
          <button 
            type="submit"
            disabled={isLoading}
            className="w-full bg-primary-container text-on-primary-container font-display-hero text-headline-md py-4 tracking-wider hover:shadow-[0_0_20px_rgba(196,30,92,0.4)] transition-all flex items-center justify-center gap-3 active:scale-95 disabled:opacity-70 disabled:cursor-not-allowed"
          >
            {isLoading ? 'SIGNING IN...' : 'SIGN IN'}
            <Zap className="w-6 h-6" />
          </button>
        </div>

        <div className="relative py-4">
          <div className="absolute inset-0 flex items-center"><div className="w-full border-t border-outline-variant/20"></div></div>
          <div className="relative flex justify-center text-label-sm uppercase tracking-widest"><span className="bg-surface px-4 text-outline">Or continue with</span></div>
        </div>

        <div className="grid grid-cols-1 gap-4">
          <button
            type="button"
            onClick={handleGoogleSignIn}
            disabled={isLoading}
            className="flex items-center justify-center gap-2 border border-outline-variant/30 py-3 font-label-bold text-label-bold hover:bg-surface-container-high transition-colors disabled:cursor-not-allowed disabled:opacity-70"
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img alt="Google Logo" className="w-5 h-5" src="https://lh3.googleusercontent.com/aida-public/AB6AXuDf1Zml-N0FWpaeWf0dZSe4C1xe_g6MfjzlxUfLtxpP1Ss_LJLZfZvnkXC2FA2-VObr-BWHYFDbN-RWC4YOJcPFNaQ5Xe5N6gXapGu11Y9pVl7PXnA1XM_fIxdLWpsFGA78o8zgsEhK6CuEAk5C6l2b2IciPGGSPyW8oeodLH66NiklKNit1gIArN5il6o2mk1eJdYGuxiNGo3TUSiz5WwOl5gat8z9A3-Yu6iQfeCDih6b0bUvNgXnVCqGzf1-XqadsxXCGS2ATHs"/>
            GOOGLE
          </button>
        </div>
      </form>

      <footer className="mt-10 text-center">
        <p className="text-on-surface-variant font-body-md">
          Don&apos;t have an account? 
          <button type="button" className="text-primary font-label-bold hover:underline ml-1" onClick={onToggleView}>JOIN THE SQUAD</button>
        </p>
      </footer>
    </div>
  );
}
