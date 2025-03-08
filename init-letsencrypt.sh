#!/bin/bash
# init-letsencrypt.sh

domains=(example.com www.example.com)
email="yethuhlaing.dev@gmail.com" # Adding a valid address is strongly recommended
staging=0 # Set to 1 if you're testing your setup to avoid hitting request limits

# Make sure docker-compose is installed
if ! [ -x "$(command -v docker-compose)" ]; then
  echo 'Error: docker-compose is not installed.' >&2
  exit 1
fi

# Create required directories
mkdir -p ./certbot/conf
mkdir -p ./certbot/www

# Stop any existing containers
docker-compose down

# Delete any existing certificates (BE CAREFUL WITH THIS!)
# docker-compose run --rm certbot rm -rf /etc/letsencrypt/*

echo "### Creating dummy certificate for ${domains[0]} ###"
path="/etc/letsencrypt/live/${domains[0]}"
docker-compose run --rm --entrypoint "\
  openssl req -x509 -nodes -newkey rsa:2048 -days 1\
    -keyout '$path/privkey.pem' \
    -out '$path/fullchain.pem' \
    -subj '/CN=localhost'" certbot

echo "### Starting nginx ###"
docker-compose up --force-recreate -d nginx

echo "### Deleting dummy certificate for ${domains[0]} ###"
docker-compose run --rm --entrypoint "\
  rm -Rf /etc/letsencrypt/live/${domains[0]} && \
  rm -Rf /etc/letsencrypt/archive/${domains[0]} && \
  rm -Rf /etc/letsencrypt/renewal/${domains[0]}.conf" certbot

echo "### Requesting Let's Encrypt certificate for ${domains[*]} ###"
domain_args=""
for domain in "${domains[@]}"; do
  domain_args="$domain_args -d $domain"
done

# Select appropriate email arg
case "$email" in
  "") email_arg="--register-unsafely-without-email" ;;
  *) email_arg="--email $email" ;;
esac

# Enable staging mode if needed
if [ $staging != "0" ]; then staging_arg="--staging"; fi

docker-compose run --rm --entrypoint "\
  certbot certonly --webroot -w /var/www/certbot \
    $staging_arg \
    $email_arg \
    $domain_args \
    --rsa-key-size 4096 \
    --agree-tos \
    --force-renewal" certbot

echo "### Reloading nginx ###"
docker-compose exec nginx nginx -s reload