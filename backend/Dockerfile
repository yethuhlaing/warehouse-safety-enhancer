# Backend Dockerfile (Node.js)
FROM node:20-alpine AS base

# Create app directory
WORKDIR /app

# Install dependencies
FROM base AS deps
RUN apk add --no-cache libc6-compat
COPY package.json package-lock.json* ./
RUN npm ci

# Build stage
FROM base AS builder
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY . .

# Build TypeScript if applicable
RUN npm run build

# Production stage
FROM base AS runner
WORKDIR /app

# Set environment to production
ENV NODE_ENV production

# Create non-root user
RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 yethuhlaing

# Copy built files and node_modules
COPY --from=builder /app/dist ./dist
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/package.json ./package.json

# Change to non-root user
USER yethuhlaing

# Expose the port the app runs on
EXPOSE 5000

# Default command to run the application
CMD ["npm", "run", "start:prod"]