# Use Node.js 20 on Alpine Linux as the base image
FROM node:20-alpine AS base

# Install necessary system packages
RUN apk add --no-cache libc6-compat git

# Set the working directory
WORKDIR /app

# Copy the source files
COPY . .

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

# Install dependencies using npm
RUN npm install --only=production

# Set environment variables
ENV NODE_ENV=production

# Build the application
FROM base AS build
RUN npm install
RUN npm run build

# Create a new layer for the production runner
FROM base AS runner
WORKDIR /app

# Set up a non-root user
RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 yethuhlaing

# Copy the build output and node_modules from the build stage
COPY --from=build /app/.contentlayer /app/.contentlayer
COPY --from=build /app/node_modules /app/node_modules
COPY --from=build /app/.next /app/.next

# Set permissions for the yethuhlaing user
RUN chown -R yethuhlaing:nodejs /app/.next

# Switch to the yethuhlaing user
USER yethuhlaing

# Set the port and expose it
EXPOSE 3000
ENV PORT 3000

# Define the command to start the application
CMD ["npm", "run", "start"]
