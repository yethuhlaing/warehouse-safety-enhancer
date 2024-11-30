import NextAuth from "next-auth";
import Github from "next-auth/providers/github";
import prisma from "./lib/prisma";
import { UserRole } from "@prisma/client";
import { env } from "./env.mjs";
import Google from "next-auth/providers/google";

export const { handlers, signIn, signOut, auth } = NextAuth({
    secret: env.NEXTAUTH_SECRET,
    providers: [
        Google({
            clientId: env.GOOGLE_CLIENT_ID,
            clientSecret: env.GOOGLE_CLIENT_SECRET,
            authorization: {
                params: {
                  prompt: "consent",
                  access_type: "offline",
                  response_type: "code"
                }
              }
        }),
        Github( {
            clientId: env.NEXTAUTH_GITHUB_ID,   
            clientSecret: env.NEXTAUTH_GITHUB_SECRET,
        }),
    ],
    callbacks: {
        // authorized({ request: { nextUrl }, auth }) {
        //     const isLoggedIn = !!auth?.user;
        //     const { pathname } = nextUrl;
        //     const role = auth?.user.role || 'user';
        //     if (pathname.startsWith('/auth/signin') && isLoggedIn) {
        //         return Response.redirect(new URL('/', nextUrl));
        //     }
        //     if (pathname.startsWith("/page2") && role !== "ADMIN") {
        //         return Response.redirect(new URL('/', nextUrl));
        //     }
        //     return !!auth;
        // },
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
                console.log("User", user)
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
        }
    },
    pages: {
        signIn: "/login"
    }
})