#!/bin/sh

if [ "$SEED" = "true" ]; then
  echo "Running seed script..."
  npm run seed
fi

echo "Starting server..."
node server.js