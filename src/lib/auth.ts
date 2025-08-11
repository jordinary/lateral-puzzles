import { type NextAuthOptions } from "next-auth";
import type { Session } from "next-auth";
import type { JWT } from "next-auth/jwt";
import CredentialsProvider from "next-auth/providers/credentials";
// Google OAuth removed for credentials-only auth
import { prisma } from "@/lib/prisma";
import bcrypt from "bcrypt";
import type { Role } from "@prisma/client";


type TokenWithRole = JWT & { role?: Role };

type SessionUserWithExtras = NonNullable<Session["user"]> & {
  id: string;
  role?: Role;
};

export const authOptions: NextAuthOptions = {
  secret: process.env.NEXTAUTH_SECRET,
  debug: process.env.NEXTAUTH_DEBUG === 'true' || process.env.NODE_ENV !== 'production',
  session: { strategy: "jwt" },
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "text" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) return null;
        const user = await prisma.user.findUnique({ where: { email: credentials.email } });
        if (!user?.passwordHash) return null;
        const isValid = await bcrypt.compare(credentials.password, user.passwordHash);
        if (!isValid) return null;
        await prisma.user.update({ where: { id: user.id }, data: { lastLoginAt: new Date() } });
        return { id: user.id, email: user.email, name: user.name, image: user.image, role: user.role } as {
          id: string;
          email: string | null;
          name: string | null;
          image: string | null;
          role: Role;
        };
      },
    }),
  ],
  pages: {
    signIn: "/login",
  },
  callbacks: {
    async signIn() {
      return true;
    },
    async jwt({ token, user }) {
      const tokenWithRole: TokenWithRole = token as TokenWithRole;

      if (user?.id) {
        const userWithRole = user as { id?: string; role?: Role };
        if (userWithRole.id) tokenWithRole.sub = userWithRole.id;
        if (userWithRole.role) tokenWithRole.role = userWithRole.role;
        return tokenWithRole;
      }

      if (tokenWithRole.sub && tokenWithRole.role === undefined) {
        const dbUser = await prisma.user.findUnique({ where: { id: tokenWithRole.sub } });
        tokenWithRole.role = dbUser?.role;
      }
      return tokenWithRole;
    },
    async session({ session, token }) {
      const tokenWithRole: TokenWithRole = token as TokenWithRole;
      if (session.user && tokenWithRole.sub) {
        const userInSession = session.user as SessionUserWithExtras;
        userInSession.id = tokenWithRole.sub;
        userInSession.role = tokenWithRole.role;
      }
      return session;
    },
  },
};

// Export only options for NextAuth v4 consumers
export default authOptions;


