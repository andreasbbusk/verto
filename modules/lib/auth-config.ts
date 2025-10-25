import NextAuth from "next-auth";
import Google from "next-auth/providers/google";
import Credentials from "next-auth/providers/credentials";
import { userRepository } from "@/modules/server/database";
import bcrypt from "bcryptjs";

export const { handlers, auth, signIn, signOut } = NextAuth({
  providers: [
    Google({
      clientId: process.env.AUTH_GOOGLE_ID,
      clientSecret: process.env.AUTH_GOOGLE_SECRET,
    }),
    Credentials({
      credentials: {
        email: { type: "email" },
        password: { type: "password" },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) return null;

        const user = await userRepository.getByEmail(credentials.email as string);
        if (!user) return null;

        const isValid = await bcrypt.compare(credentials.password as string, user.password);
        if (!isValid) return null;

        await userRepository.updateLastLogin(user.id);

        return {
          id: user.id.toString(),
          email: user.email,
          name: user.name,
        };
      },
    }),
  ],
  session: {
    strategy: "jwt",
    maxAge: 7 * 24 * 60 * 60,
  },
  pages: {
    signIn: "/",
  },
  callbacks: {
    async jwt({ token, user, account, profile }) {
      if (user && account?.provider === "google") {
        // Handle Google OAuth sign-in
        let dbUser = await userRepository.getByEmail(user.email!);

        if (!dbUser) {
          // Create new user in our database
          dbUser = await userRepository.create({
            email: user.email!,
            name: user.name || profile?.name || "User",
            password: "", // OAuth users don't have passwords
            createdAt: new Date(),
            lastLogin: new Date(),
            preferences: {
              studyGoal: 20,
              theme: "system",
              notifications: true,
            },
            stats: {
              totalStudySessions: 0,
              currentStreak: 0,
              longestStreak: 0,
              totalCardsStudied: 0,
            },
          });
        } else {
          // Update last login
          await userRepository.updateLastLogin(dbUser.id);
        }

        token.id = dbUser.id.toString();
      } else if (user) {
        // Credentials login
        token.id = user.id;
      }

      return token;
    },
    async session({ session, token }) {
      if (session.user) {
        session.user.id = token.id as string;
      }
      return session;
    },
  },
});
