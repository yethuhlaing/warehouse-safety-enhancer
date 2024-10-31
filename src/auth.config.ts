
import { User, UserRole } from "@prisma/client";
import NextAuth, { type DefaultSession } from "next-auth";
import { getUserById } from "@/lib/user";
import { PrismaAdapter } from "@auth/prisma-adapter"
import EmailProvider from "next-auth/providers/email";
import GitHubProvider from "next-auth/providers/github";
import Google from "next-auth/providers/google";
import CredentialsProvider from "next-auth/providers/credentials";
import prisma from "@/lib/prisma";
import Github from "next-auth/providers/github";
import { env } from "./env.mjs";


export default {
    providers: [
        // CredentialsProvider({
        //     name: "Sign in",
        //     credentials: {
        //       email: {
        //         label: "Email",
        //         type: "email",
        //         placeholder: "example@example.com",
        //       },
        //       password: { label: "Password", type: "password" },
        //     },
        //     async authorize(credentials) {
        //       if (!credentials || !credentials.email || !credentials.password)
        //         return null;
      
        //       const dbUser = await prisma.user.findFirst({
        //         where: { email: credentials.email },
        //       });
      
        //       //Verify Password here
        //       //We are going to use a simple === operator
        //       //In production DB, passwords should be encrypted using something like bcrypt...
        //       if (dbUser && dbUser.password === credentials.password) {
        //         const { password, id, ...dbUserWithoutPassword } = dbUser;
        //         return dbUserWithoutPassword as User;
        //       }
      
        //       return null;
        //     },
        //   }),
        Google({
            clientId: env.GOOGLE_CLIENT_ID,
            clientSecret: env.GOOGLE_CLIENT_SECRET,
        }),
        Github( {
            clientId: env.GITHUB_ID,   
            clientSecret: env.GITHUB_SECRET,
        })
        // EmailProvider({
        //     server: {
        //         host: process.env.EMAIL_SERVER_HOST,
        //         port: process.env.EMAIL_SERVER_PORT,
        //         auth: {
        //             user: process.env.EMAIL_SERVER_USER,
        //             pass: process.env.EMAIL_SERVER_PASSWORD,
        //         },
        //     },
        //     from: process.env.EMAIL_FROM,
        //     sendVerificationRequest,
        // }),
    ],
} ;
