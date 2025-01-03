# Base stage with minimal dependencies
FROM node:20-alpine AS base
RUN apk add --no-cache libc6-compat openssl
WORKDIR /app

# Dependencies stage - only install production dependencies
FROM base AS deps
COPY package*.json ./
COPY prisma/schema.prisma ./prisma/
RUN npm ci --legacy-peer-deps && \
    npx prisma generate && \
    # Clean npm cache
    npm cache clean --force

# Builder stage - compile the application
FROM base AS builder
WORKDIR /app
# Copy only necessary files for build
COPY --from=deps /app/node_modules ./node_modules
COPY --from=deps /app/package.json ./package.json
COPY --from=deps /app/prisma ./prisma
COPY . .
RUN npx prisma generate && \
    npm run build && \
    # Remove unnecessary files
    rm -rf node_modules/.cache && \
    # Remove development dependencies after build
    npm prune --production

# Production stage - minimal image with only necessary files
FROM node:20-alpine AS runner
WORKDIR /app

ENV NODE_ENV=production
ENV PORT=3000

# Install only essential production dependencies
RUN apk add --no-cache openssl && \
    addgroup --system --gid 1001 nodejs && \
    adduser --system --uid 1001 yethuhlaing

# Copy only the necessary built files
COPY --from=builder --chown=yethuhlaing:nodejs /app/public ./public
COPY --from=builder --chown=yethuhlaing:nodejs /app/package.json ./package.json
COPY --from=builder --chown=yethuhlaing:nodejs /app/.contentlayer ./.contentlayer
COPY --from=builder --chown=yethuhlaing:nodejs /app/.next ./.next
COPY --from=builder --chown=yethuhlaing:nodejs /app/node_modules ./node_modules
COPY --from=builder --chown=yethuhlaing:nodejs /app/prisma ./prisma

# Generate Prisma client for production
RUN npx prisma generate

USER yethuhlaing
EXPOSE 3000

CMD ["npm", "start"]