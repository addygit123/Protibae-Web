import { NextResponse } from 'next/server';
import { authService } from '@/lib/services/auth.service';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const token = searchParams.get('token');
  const email = searchParams.get('email');

  if (!token || !email) {
    return NextResponse.json({ error: 'Missing token or email' }, { status: 400 });
  }

  try {
    await authService.verifyEmail(email, token);
    
    // Redirect to login with success message
    return NextResponse.redirect(new URL('/login?verified=true', request.url));
  } catch (error: unknown) {
    const msg = error instanceof Error ? error.message : 'Verification failed';
    return NextResponse.redirect(new URL(`/login?error=${encodeURIComponent(msg)}`, request.url));
  }
}
