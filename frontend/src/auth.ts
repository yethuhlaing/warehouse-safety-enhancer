import NextAuth from "next-auth";
import Github from "next-auth/providers/github";
import prisma from "./lib/prisma";
import { UserRole } from "@prisma/client";
import { env } from "./env.mjs";
import Google from "next-auth/providers/google";

export const { handlers, signIn, signOut, auth } = NextAuth({
    secret: env.NEXTAUTH_SECRET,
    trustHost: true,
    debug: process.env.NODE_ENV === 'production',
    providers: [
        Google({
            clientId: env.GOOGLE_CLIENT_ID,
            clientSecret: env.GOOGLE_CLIENT_SECRET,
            // authorization: {
            //     params: {
            //         prompt: "consent",
            //         access_type: "offline",
            //         response_type: "code"
            //     }
            // }
        }),
        Github( {
            clientId: env.NEXTAUTH_GITHUB_ID,   
            clientSecret: env.NEXTAUTH_GITHUB_SECRET,
        }),
    ],
    callbacks: {
        async signIn({ user }) {
            try{
                const existingUser = await prisma.user.findUnique({
                    where: { email: user.email! },
                  })
                
                if (!existingUser) {
                    await prisma.user.create({
                        data: {
                            name: user.name,
                            email: user.email,
                            image: user.image,
                            emailVerified: user.emailVerified,
                            role: user.role ?? "USER" as UserRole,
                        },
                })
                } else {
                    // Update existing user if needed
                    await prisma.user.update({
                        where: { id: existingUser.id },
                        data: {
                            name: user.name,
                            image: user.image,
                        },
                    })
                }
            } catch (error) {
                console.log(error)
                throw new Error(error)
            }
      
            return true
        },
        jwt({ token, user, trigger, session }) {
            if (user) {
                token.id = user.id as string;
                token.role = user.role
            }
            if (trigger === "update" && session) {
                token = { ...token, ...session };
            }
            return token;
        },
        session({ session, token }) {
            session.user.id = token.id as string;
            session.user.role = token.role ?? "USER";
            return session;
        },
        async redirect({ url, baseUrl }) {
            // Allows relative callback URLs
            if (url.startsWith("/")) return `${baseUrl}${url}`
            // Allows callback URLs on the same origin
            else if (new URL(url).origin === baseUrl) return url
            return baseUrl
        },
    },
    pages: {
        signIn: "/login"
    }
})