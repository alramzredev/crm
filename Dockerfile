# -----------------------
# Stage 1: Build assets
# -----------------------
FROM node:18 as node-build

WORKDIR /app

# Copy everything needed for build
COPY package*.json ./
RUN npm install

# Copy full project (important!)
COPY . .

# Build assets
RUN npm run build


# -----------------------
# Stage 2: PHP + Apache
# -----------------------
FROM php:8.2-apache

ENV APACHE_DOCUMENT_ROOT /var/www/html/public

RUN sed -ri -e 's!/var/www/html!${APACHE_DOCUMENT_ROOT}!g' /etc/apache2/sites-available/*.conf
RUN sed -ri -e 's!/var/www/!${APACHE_DOCUMENT_ROOT}!g' /etc/apache2/apache2.conf /etc/apache2/conf-available/*.conf

RUN apt-get update && apt-get install -y \
    git unzip libzip-dev libpng-dev libonig-dev libxml2-dev curl \
    && docker-php-ext-install pdo pdo_mysql zip gd mbstring exif pcntl bcmath

COPY --from=composer:2.5 /usr/bin/composer /usr/bin/composer

RUN a2enmod rewrite

WORKDIR /var/www/html

# Copy full app
COPY . .

# Copy built assets ONLY
COPY --from=node-build /app/public/build ./public/build

# Install PHP dependencies
RUN composer install --no-interaction --prefer-dist --optimize-autoloader --no-dev

# Fix permissions
RUN chown -R www-data:www-data storage bootstrap/cache

# Cloud Run port
EXPOSE 8080
RUN sed -i 's/80/8080/g' /etc/apache2/ports.conf /etc/apache2/sites-available/000-default.conf

HEALTHCHECK --interval=30s --timeout=5s --start-period=30s CMD curl -f http://localhost:8080/ || exit 1

CMD ["apache2-foreground"]
