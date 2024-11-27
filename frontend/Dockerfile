# Use Node.js 20 on Alpine Linux as the base image
FROM node:20-alpine AS base

# Install necessary system packages
RUN apk add --no-cache libc6-compat git

# Set the working directory
WORKDIR /app

# Copy the source files
COPY . .

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
