import { userRepository } from '../repositories/user.repository';
import bcrypt from 'bcryptjs';

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
    
    // 1. Check if user already exists
    const existingUser = await userRepository.findByEmail(email);
    if (existingUser) {
      throw new Error('User already exists with this email.');
    }

    // 2. Hash password
    const saltRounds = 10;
    const hashedPassword = await bcrypt.hash(password, saltRounds);

    // 3. Create user
    const user = await userRepository.create({
      email,
      password: hashedPassword,
      firstName,
      lastName,
      name: `${firstName} ${lastName}`.trim(),
    });

    // 4. Return typed DTO
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
}

export const authService = new AuthService();
