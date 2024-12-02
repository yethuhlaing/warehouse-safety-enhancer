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

ARG NFLUXDB_TOKEN
ARG INFLUXDB_ORG
ARG INFLUXDB_BUCKET
ARG INFLUXDB_URL
ARG SEED

ENV NFLUXDB_TOKEN=${NFLUXDB_TOKEN}
ENV INFLUXDB_ORG=${INFLUXDB_ORG}
ENV INFLUXDB_BUCKET=${INFLUXDB_BUCKET}
ENV INFLUXDB_URL=${INFLUXDB_URL}
ENV SEED=${SEED}

# Run the application
CMD ["sh", "/app/start.sh"]