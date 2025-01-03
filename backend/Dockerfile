# Use official Node.js LTS image
FROM node:20-alpine

# Create app directory
WORKDIR /usr/src/app

# Copy package files
COPY package*.json ./

# Install dependencies
RUN npm ci --only=production

# Copy application code
COPY . .

# Expose port (adjust as needed)
EXPOSE 5000

# Set environment to production
ENV NODE_ENV=production

# Run the application
CMD ["node", "server.js"]