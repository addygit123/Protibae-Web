import { type NextAuthOptions, type User } from 'next-auth';
import { type JWT } from 'next-auth/jwt';
import CredentialsProvider from 'next-auth/providers/credentials';
import GoogleProvider from 'next-auth/providers/google';
import { PrismaAdapter } from '@next-auth/prisma-adapter';
import { prisma } from './prisma';
import { env } from './env';
import bcrypt from 'bcryptjs';

declare module 'next-auth' {
  interface Session {
    user: {
      id: string;
      name?: string | null;
      firstName?: string | null;
      lastName?: string | null;
      email?: string | null;
      image?: string | null;
      role?: string;
      phone?: string | null;
    }
  }
}

declare module 'next-auth/jwt' {
  interface JWT {
    firstName?: string | null;
    lastName?: string | null;
    role?: string;
    phone?: string | null;
  }
}

function applyUserFields(token: JWT, user: {
  id: string;
  firstName?: string | null;
  lastName?: string | null;
  role?: string;
  phone?: string | null;
}) {
  token.sub = user.id;
  token.firstName = user.firstName ?? null;
  token.lastName = user.lastName ?? null;
  token.role = user.role;
  token.phone = user.phone ?? null;
}

const providers: NextAuthOptions['providers'] = [
  CredentialsProvider({
    name: 'Credentials',
    credentials: {
      email: { label: 'Email', type: 'email', placeholder: 'jsmith@example.com' },
      password: { label: 'Password', type: 'password' }
    },
    async authorize(credentials) {
      if (!credentials?.email || !credentials?.password) {
        throw new Error('Invalid credentials');
      }

      const user = await prisma.user.findUnique({
        where: {
          email: credentials.email
        }
      });

      if (!user || !user.password) {
        throw new Error('Invalid credentials');
      }

      const isPasswordValid = await bcrypt.compare(credentials.password, user.password);

      if (!isPasswordValid) {
        throw new Error('Invalid credentials');
      }

      return {
        id: user.id,
        email: user.email,
        name: user.name,
        firstName: user.firstName,
        lastName: user.lastName,
        role: user.role,
        phone: user.phone,
      };
    }
  })
];

if (env.GOOGLE_CLIENT_ID && env.GOOGLE_CLIENT_SECRET) {
  providers.unshift(
    GoogleProvider({
      clientId: env.GOOGLE_CLIENT_ID,
      clientSecret: env.GOOGLE_CLIENT_SECRET,
      allowDangerousEmailAccountLinking: true,
      profile(profile) {
        const [firstName = null, ...rest] = profile.name?.split(' ') ?? [];
        const lastName = rest.length > 0 ? rest.join(' ') : null;

        return {
          id: profile.sub,
          name: profile.name,
          email: profile.email,
          image: profile.picture,
          firstName,
          lastName,
          role: 'CUSTOMER',
          phone: null,
        } as any;
      }
    })
  );
}

export const authOptions: NextAuthOptions = {
  adapter: PrismaAdapter(prisma),
  providers,
  pages: {
    signIn: '/login',
    error: '/login',
  },
  session: {
    strategy: 'jwt',
  },
  callbacks: {
    async session({ session, token }) {
      if (token && session.user) {
        session.user.id = token.sub as string;
        session.user.firstName = token.firstName ?? null;
        session.user.lastName = token.lastName ?? null;
        session.user.role = token.role;
        session.user.phone = token.phone ?? null;
      }
      return session;
    },
    async jwt({ token, user }) {
      if (user) {
        const u = user as User & { firstName?: string | null; lastName?: string | null; role?: string; phone?: string | null };
        applyUserFields(token, {
          id: user.id,
          firstName: u.firstName,
          lastName: u.lastName,
          role: u.role,
          phone: u.phone,
        });
      } else if (token.sub) {
        const dbUser = await prisma.user.findUnique({
          where: { id: token.sub },
          select: {
            id: true,
            firstName: true,
            lastName: true,
            role: true,
            phone: true,
          }
        });

        if (dbUser) {
          applyUserFields(token, {
            id: dbUser.id,
            firstName: dbUser.firstName,
            lastName: dbUser.lastName,
            role: dbUser.role,
            phone: dbUser.phone,
          });
        }
      }
      return token;
    }
  },
};
