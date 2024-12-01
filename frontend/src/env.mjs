import { createEnv } from "@t3-oss/env-nextjs";
import { z } from "zod";

export const env = createEnv({
    server: {
        // This is optional because it's only used in development.
        // See https://next-auth.js.org/deployment.
        NEXT_PUBLIC_APP_URL: z.string().url().optional(),
        // AUTH_SECRET: z.string().min(1),
        GOOGLE_CLIENT_ID: z.string().min(1),
        GOOGLE_CLIENT_SECRET: z.string().min(1),
        NEXTAUTH_GITHUB_ID:z.string().min(1),
        NEXTAUTH_GITHUB_SECRET:z.string().min(1),
        DATABASE_URL: z.string().min(1),
        RESEND_API_KEY: z.string().min(1),
        EMAIL_FROM: z.string().min(1),
        SENDGRID_API: z.string().min(1),
        STRIPE_API_KEY: z.string().min(1),
        STRIPE_WEBHOOK_SECRET: z.string().min(1),
    },
    client: {
        NEXT_PUBLIC_APP_URL: z.string().min(1),
        NEXT_PUBLIC_STRIPE_PRO_MONTHLY_PLAN_ID: z.string().min(1),
        NEXT_PUBLIC_STRIPE_PRO_YEARLY_PLAN_ID: z.string().min(1),
        NEXT_PUBLIC_STRIPE_BUSINESS_MONTHLY_PLAN_ID: z.string().min(1),
        NEXT_PUBLIC_STRIPE_BUSINESS_YEARLY_PLAN_ID: z.string().min(1),
    },
    runtimeEnv: {
        NEXT_PUBLIC_APP_URL: process.env.NEXT_PUBLIC_APP_URL,
        // AUTH_SECRET: process.env.AUTH_SECRET,
        GOOGLE_CLIENT_ID: process.env.GOOGLE_CLIENT_ID,
        GOOGLE_CLIENT_SECRET: process.env.GOOGLE_CLIENT_SECRET,
        NEXTAUTH_GITHUB_ID:process.env.NEXTAUTH_GITHUB_ID,
        NEXTAUTH_GITHUB_SECRET:process.env.NEXTAUTH_GITHUB_SECRET,
        DATABASE_URL: process.env.DATABASE_URL,
        RESEND_API_KEY: process.env.RESEND_API_KEY,
        SENDGRID_API: process.env.SENDGRID_API,
        EMAIL_FROM: process.env.EMAIL_FROM,
        NEXT_PUBLIC_APP_URL: process.env.NEXT_PUBLIC_APP_URL,
        // Stripe
        STRIPE_API_KEY: process.env.STRIPE_API_KEY,
        STRIPE_WEBHOOK_SECRET: process.env.STRIPE_WEBHOOK_SECRET,
        NEXT_PUBLIC_STRIPE_PRO_MONTHLY_PLAN_ID:
            process.env.NEXT_PUBLIC_STRIPE_PRO_MONTHLY_PLAN_ID,
        NEXT_PUBLIC_STRIPE_PRO_YEARLY_PLAN_ID:
            process.env.NEXT_PUBLIC_STRIPE_PRO_YEARLY_PLAN_ID,
        NEXT_PUBLIC_STRIPE_BUSINESS_MONTHLY_PLAN_ID:
            process.env.NEXT_PUBLIC_STRIPE_BUSINESS_MONTHLY_PLAN_ID,
        NEXT_PUBLIC_STRIPE_BUSINESS_YEARLY_PLAN_ID:
            process.env.NEXT_PUBLIC_STRIPE_BUSINESS_YEARLY_PLAN_ID,
    },
});
