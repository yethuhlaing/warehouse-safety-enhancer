# Frontend Dockerfile (./frontend/Dockerfile)
FROM node:18-slim AS base

WORKDIR /app

# Install dependencies
COPY package*.json ./
COPY prisma ./prisma/

RUN apt-get update
RUN apt-get install -y openssl

# Install dependencies
RUN npm ci --legacy-peer-deps
RUN npx prisma generate

# Copy application code
COPY . .

# Set development environment
ENV NODE_ENV=development

# Expose port
EXPOSE 3000

# Start development server
CMD ["npm", "run", "dev"]