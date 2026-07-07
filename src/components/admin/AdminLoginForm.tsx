'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { ShieldAlert } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { signIn } from 'next-auth/react';

const loginSchema = z.object({
  email: z.string().email('Please enter a valid email address'),
  password: z.string().min(1, 'Password is required'),
});

type LoginFormData = z.infer<typeof loginSchema>;

export default function AdminLoginForm() {
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
        throw new Error('Invalid credentials or unauthorized');
      }

      // Refresh to ensure server components update with the new session
      router.refresh();
      // AdminGuard will handle the redirect to /admin once the session is loaded
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Invalid credentials');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="bg-[#1a1b1f] border border-[#343539] p-8 rounded-xl shadow-2xl relative overflow-hidden">
      {/* Decorative top border */}
      <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-[#c41e5c] to-[#7a1239]" />

      {error && (
        <div className="mb-6 p-4 bg-[#93000a]/20 border border-[#ffb4ab] text-[#ffb4ab] text-sm rounded flex items-center gap-3">
          <ShieldAlert className="w-5 h-5 shrink-0" />
          {error}
        </div>
      )}

      <form className="space-y-6" onSubmit={handleSubmit(onSubmit)}>
        <div className="space-y-2">
          <label className="font-label-bold text-label-bold uppercase tracking-widest text-[#e1bec3] ml-1">Admin Email</label>
          <div className="relative">
            <input 
              {...register('email')}
              className="w-full bg-[#0d0e12] border border-[#594045] rounded-none px-4 py-4 text-white placeholder:text-[#594045] focus:outline-none focus:border-[#c41e5c] focus:shadow-[0_0_15px_rgba(196,30,92,0.2)] transition-all" 
              placeholder="admin@protibae.com" 
              type="email"
              disabled={isLoading}
            />
            {errors.email && <p className="text-[#ffb4ab] text-xs mt-1">{errors.email.message}</p>}
          </div>
        </div>

        <div className="space-y-2">
          <label className="font-label-bold text-label-bold uppercase tracking-widest text-[#e1bec3] ml-1">Password</label>
          <div className="relative">
            <input 
              {...register('password')}
              className="w-full bg-[#0d0e12] border border-[#594045] rounded-none px-4 py-4 text-white placeholder:text-[#594045] focus:outline-none focus:border-[#c41e5c] focus:shadow-[0_0_15px_rgba(196,30,92,0.2)] transition-all" 
              placeholder="••••••••" 
              type="password"
              disabled={isLoading}
            />
            {errors.password && <p className="text-[#ffb4ab] text-xs mt-1">{errors.password.message}</p>}
          </div>
        </div>

        <div className="pt-4">
          <button 
            type="submit"
            disabled={isLoading}
            className="w-full bg-[#c41e5c] text-white font-display-hero text-headline-md py-4 tracking-wider hover:shadow-[0_0_20px_rgba(196,30,92,0.4)] transition-all flex items-center justify-center gap-3 active:scale-95 disabled:opacity-70 disabled:cursor-not-allowed uppercase"
          >
            {isLoading ? 'AUTHENTICATING...' : 'ENTER SECURE PORTAL'}
          </button>
        </div>
      </form>
    </div>
  );
}
