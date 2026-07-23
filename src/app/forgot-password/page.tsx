import { ForgotPasswordForm } from '@/components/auth/ForgotPasswordForm';

export default function ForgotPasswordPage() {
  return (
    <div className="min-h-screen bg-surface-container-lowest flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div>
          <h2 className="mt-6 text-center text-3xl font-display font-bold text-on-surface uppercase italic">
            Forgot Password
          </h2>
          <p className="mt-2 text-center text-sm text-on-surface-variant">
            Enter your email to receive a reset link
          </p>
        </div>
        <ForgotPasswordForm />
      </div>
    </div>
  );
}
