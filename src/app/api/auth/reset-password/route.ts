import { NextResponse } from 'next/server';
import { authService } from '@/lib/services/auth.service';
import { z } from 'zod';

const resetPasswordSchema = z.object({
  email: z.string().email(),
  token: z.string().min(1),
  password: z.string().min(8, 'Password must be at least 8 characters long'),
});

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const parsed = resetPasswordSchema.safeParse(body);
    
    if (!parsed.success) {
      return NextResponse.json({ error: 'Invalid data provided' }, { status: 400 });
    }

    const { email, token, password } = parsed.data;

    await authService.resetPassword(email, token, password);

    return NextResponse.json({ success: true, message: 'Password has been reset successfully.' });
  } catch (error: any) {
    console.error('Error in reset-password:', error);
    return NextResponse.json({ error: error.message || 'Failed to reset password' }, { status: 400 });
  }
}
