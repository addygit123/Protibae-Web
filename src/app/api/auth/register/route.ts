import { NextResponse } from 'next/server';
import { authService } from '@/lib/services/auth.service';
import { registerSchema } from '@/lib/validations/auth';
import { ZodError } from 'zod';

export async function POST(request: Request) {
  try {
    const body = await request.json();

    // Server-side Zod validation
    const parsed = registerSchema.safeParse(body);
    if (!parsed.success) {
      const errors = parsed.error.flatten().fieldErrors;
      return NextResponse.json({ error: 'Validation failed', errors }, { status: 422 });
    }

    const { email, password, firstName, lastName } = parsed.data;

    const user = await authService.registerUser({
      email,
      password,
      firstName,
      lastName,
    });

    return NextResponse.json({ user }, { status: 201 });
  } catch (error) {
    if (error instanceof ZodError) {
      return NextResponse.json({ error: 'Validation failed' }, { status: 422 });
    }
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Internal Server Error' },
      { status: 500 }
    );
  }
}
