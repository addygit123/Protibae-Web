import { userRepository } from '../repositories/user.repository';
import bcrypt from 'bcryptjs';
import { prisma } from '@/lib/prisma';
import crypto from 'crypto';
import { emailService } from './email.service';
import { getBaseUrl } from '@/lib/utils';

interface RegisterParams {
  email: string;
  password?: string;
  firstName: string;
  lastName: string;
}

export interface UserDTO {
  id: string;
  email: string;
  firstName: string | null;
  lastName: string | null;
  name: string | null;
  role: string;
}

export class AuthService {
  async registerUser({ email, password, firstName, lastName }: RegisterParams) {
    if (!password) {
      throw new Error('Password is required');
    }
    
    const existingUser = await userRepository.findByEmail(email);
    if (existingUser) {
      throw new Error('User already exists with this email.');
    }

    const saltRounds = 10;
    const hashedPassword = await bcrypt.hash(password, saltRounds);

    const user = await userRepository.create({
      email,
      password: hashedPassword,
      firstName,
      lastName,
      name: `${firstName} ${lastName}`.trim(),
    });

    // Generate Verification Token
    const token = crypto.randomBytes(32).toString('hex');
    await prisma.verificationToken.create({
      data: {
        identifier: email,
        token,
        expires: new Date(Date.now() + 24 * 60 * 60 * 1000), // 24 hours
      },
    });

    const verificationLink = `${getBaseUrl()}/api/auth/verify?token=${token}&email=${encodeURIComponent(email)}`;
    
    await emailService.sendVerificationEmail(email, 'Verify your PROTIBAE account', {
      name: firstName,
      verificationLink,
    });

    const userDTO: UserDTO = {
      id: user.id,
      email: user.email!,
      firstName: user.firstName,
      lastName: user.lastName,
      name: user.name,
      role: user.role,
    };
    
    return userDTO;
  }

  async verifyEmail(email: string, token: string) {
    const existingToken = await prisma.verificationToken.findUnique({
      where: {
        identifier_token: {
          identifier: email,
          token,
        },
      },
    });

    if (!existingToken) {
      throw new Error('Invalid verification token.');
    }

    if (existingToken.expires < new Date()) {
      throw new Error('Verification token has expired.');
    }

    await prisma.user.update({
      where: { email },
      data: { emailVerified: new Date() },
    });

    await prisma.verificationToken.delete({
      where: {
        identifier_token: { identifier: email, token },
      },
    });

    return true;
  }

  async requestPasswordReset(email: string) {
    const user = await userRepository.findByEmail(email);
    if (!user) {
      // Do not reveal if the user exists for security
      return true;
    }

    const token = crypto.randomBytes(32).toString('hex');
    const identifier = `reset:${email}`;

    // Clean up existing reset tokens for this user
    await prisma.verificationToken.deleteMany({
      where: { identifier },
    });

    await prisma.verificationToken.create({
      data: {
        identifier,
        token,
        expires: new Date(Date.now() + 1 * 60 * 60 * 1000), // 1 hour
      },
    });

    const resetLink = `${getBaseUrl()}/reset-password?token=${token}&email=${encodeURIComponent(email)}`;

    await emailService.sendPasswordResetEmail(email, 'Reset your PROTIBAE password', {
      name: user.firstName || 'Customer',
      resetLink,
    });

    return true;
  }

  async resetPassword(email: string, token: string, newPassword: string) {
    const identifier = `reset:${email}`;
    const existingToken = await prisma.verificationToken.findUnique({
      where: {
        identifier_token: {
          identifier,
          token,
        },
      },
    });

    if (!existingToken) {
      throw new Error('Invalid or expired password reset token.');
    }

    if (existingToken.expires < new Date()) {
      await prisma.verificationToken.delete({
        where: { identifier_token: { identifier, token } },
      });
      throw new Error('Password reset token has expired.');
    }

    const saltRounds = 10;
    const hashedPassword = await bcrypt.hash(newPassword, saltRounds);

    await prisma.user.update({
      where: { email },
      data: { password: hashedPassword },
    });

    await prisma.verificationToken.delete({
      where: { identifier_token: { identifier, token } },
    });

    return true;
  }
}

export const authService = new AuthService();
