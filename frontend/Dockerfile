# Dockerfile for Next.js with Contentlayer 2
FROM node:20-alpine AS base



# Install dependencies only when needed
FROM base AS deps
RUN apk add --no-cache libc6-compat
WORKDIR /app

# Install dependencies
COPY package.json package-lock.json* ./
COPY prisma/schema.prisma ./prisma/schema.prisma

# Install dependencies and generate Prisma client
RUN npm install
RUN npx prisma generate 




# Build the application
FROM base AS builder
WORKDIR /app

# Install build dependencies
RUN apk add --no-cache openssl

# Set build-time arguments for environment variables
ARG GOOGLE_CLIENT_ID
ARG GOOGLE_CLIENT_SECRET
ARG NEXTAUTH_GITHUB_ID
ARG NEXTAUTH_GITHUB_SECRET
ARG DATABASE_URL
ARG RESEND_API_KEY
ARG EMAIL_FROM
ARG SENDGRID_API
ARG STRIPE_API_KEY
ARG STRIPE_WEBHOOK_SECRET
ARG NEXT_PUBLIC_APP_URL
ARG NEXT_PUBLIC_STRIPE_PRO_MONTHLY_PLAN_ID
ARG NEXT_PUBLIC_STRIPE_PRO_YEARLY_PLAN_ID
ARG NEXT_PUBLIC_STRIPE_BUSINESS_MONTHLY_PLAN_ID
ARG NEXT_PUBLIC_STRIPE_BUSINESS_YEARLY_PLAN_ID

# Environment variables
ENV GOOGLE_CLIENT_ID=${GOOGLE_CLIENT_ID}
ENV GOOGLE_CLIENT_SECRET=${GOOGLE_CLIENT_SECRET}
ENV NEXTAUTH_GITHUB_ID=${NEXTAUTH_GITHUB_ID}
ENV NEXTAUTH_GITHUB_SECRET=${NEXTAUTH_GITHUB_SECRET}
ENV DATABASE_URL=${DATABASE_URL}
ENV RESEND_API_KEY=${RESEND_API_KEY}
ENV EMAIL_FROM=${EMAIL_FROM}
ENV SENDGRID_API=${SENDGRID_API}
ENV STRIPE_API_KEY=${STRIPE_API_KEY}
ENV STRIPE_WEBHOOK_SECRET=${STRIPE_WEBHOOK_SECRET}
ENV NEXT_PUBLIC_APP_URL=${NEXT_PUBLIC_APP_URL}
ENV NEXT_PUBLIC_STRIPE_PRO_MONTHLY_PLAN_ID=${NEXT_PUBLIC_STRIPE_PRO_MONTHLY_PLAN_ID}
ENV NEXT_PUBLIC_STRIPE_PRO_YEARLY_PLAN_ID=${NEXT_PUBLIC_STRIPE_PRO_YEARLY_PLAN_ID}
ENV NEXT_PUBLIC_STRIPE_BUSINESS_MONTHLY_PLAN_ID=${NEXT_PUBLIC_STRIPE_BUSINESS_MONTHLY_PLAN_ID}
ENV NEXT_PUBLIC_STRIPE_BUSINESS_YEARLY_PLAN_ID=${NEXT_PUBLIC_STRIPE_BUSINESS_YEARLY_PLAN_ID}

# Copy dependencies and source code
COPY --from=deps /app/node_modules ./node_modules
COPY --from=deps /app/prisma ./prisma
COPY . .


# Generate Prisma client again (for build stage)
RUN npx prisma generate
# Build the application
RUN npm run build





# Production image, copy all the files and run next
FROM base AS runner
WORKDIR /app

ENV NODE_ENV production

# Install production dependencies for Prisma
RUN apk add --no-cache openssl

# Set up a non-root user
RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 yethuhlaing

# Copy the build output and node_modules from the build stage
COPY --from=builder --chown=yethuhlaing:nodejs /app/public ./public
COPY --from=builder --chown=yethuhlaing:nodejs /app/.contentlayer /app/.contentlayer
COPY --from=builder --chown=yethuhlaing:nodejs /app/node_modules /app/node_modules
COPY --from=builder --chown=yethuhlaing:nodejs /app/.next /app/.next
COPY --from=builder --chown=yethuhlaing:nodejs /app/prisma ./prisma

# COPY --from=builder /app/contentlayer.config.ts ./contentlayer.config.ts
# COPY --from=builder /app/.contentlayer ./contentlayer

# Generate Prisma client in final stage
RUN npx prisma generate

# Switch to the yethuhlaing user
USER yethuhlaing
EXPOSE 3000
ENV PORT 3000

# Define the command to start the application
CMD ["npm", "start"]
