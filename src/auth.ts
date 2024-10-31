import authConfig from "@/auth.config";
import { PrismaAdapter } from "@auth/prisma-adapter";
import { UserRole } from "@prisma/client";
import NextAuth, { type DefaultSession } from "next-auth";

import { getUserById } from "@/lib/user";
import prisma from "./lib/prisma";


export const auth = NextAuth({
    adapter: PrismaAdapter(prisma),
    session: { strategy: 'jwt' },
    pages: {
      signIn: '/login',
      signOut: '/logout',
      error: '/error',
      verifyRequest: '/verify-request',
    },
    callbacks: {
        async jwt({ token, user }) {
            if (user) {
                const existingUser = await getUserById(user.id);
                if (existingUser) {
                    token = {
                        ...token,
                        role: existingUser.role ?? '',
                        name: existingUser.name ?? '',
                        email: existingUser.email ?? '',
                        picture: existingUser.image ?? '',
                    };
                }
            }
            return token;
        },
        async session({ session, token }) {
            console.log(session, token)
            if (token.sub) {
                session.user = {
                    id: token.sub,
                    email: token.email ?? '',
                    name: token.name ?? '',
                    image: token.picture ?? '',
                    role: token.role ?? '',
                };
            }
            return session;
        },

    },
    ...authConfig,
    // debug: process.env.NODE_ENV !== "production",
});

