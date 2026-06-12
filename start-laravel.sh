#!/bin/bash
set -e

cd laravel-api

# Inject MYSQL_PASSWORD into .env if the secret is available
if [ -n "$MYSQL_PASSWORD" ]; then
    sed -i "s/^DB_PASSWORD=.*/DB_PASSWORD=$MYSQL_PASSWORD/" .env
    echo "✅ DB_PASSWORD injected from environment"
else
    echo "⚠️  MYSQL_PASSWORD not set — DB will use empty password"
fi

# Update APP_URL to reflect the current Replit domain (so OAuth redirects work)
if [ -n "$REPLIT_DEV_DOMAIN" ]; then
    sed -i "s|^APP_URL=.*|APP_URL=https://$REPLIT_DEV_DOMAIN|" .env
    sed -i "s|^FRONTEND_URL=.*|FRONTEND_URL=https://$REPLIT_DEV_DOMAIN|" .env
    # Update SANCTUM_STATEFUL_DOMAINS with the current Replit domain
    sed -i "s|^SANCTUM_STATEFUL_DOMAINS=.*|SANCTUM_STATEFUL_DOMAINS=localhost:5000,localhost:3000,$REPLIT_DEV_DOMAIN|" .env
    # Update GOOGLE_REDIRECT_URI
    sed -i "s|^GOOGLE_REDIRECT_URI=.*|GOOGLE_REDIRECT_URI=https://$REPLIT_DEV_DOMAIN/api/auth/google/callback|" .env
fi

php artisan config:clear
php artisan serve --host=0.0.0.0 --port=8000
