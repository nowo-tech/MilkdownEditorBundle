# PHP 8.4 Alpine for development, tests (Xdebug coverage) and frontend builds (Node + pnpm).
FROM php:8.4-cli-alpine

RUN apk add --no-cache git unzip bash libzip-dev icu-dev nodejs npm \
    && docker-php-ext-configure intl \
    && docker-php-ext-install -j"$(nproc)" zip intl

RUN apk add --no-cache --virtual .build-deps $PHPIZE_DEPS linux-headers \
    && pecl install xdebug \
    && docker-php-ext-enable xdebug \
    && apk del .build-deps

RUN npm install -g pnpm@10.34.9

COPY --from=composer:2 /usr/bin/composer /usr/bin/composer

RUN git config --global --add safe.directory /app

WORKDIR /app

ENV COMPOSER_ALLOW_SUPERUSER=1
ENV PATH="/app/vendor/bin:${PATH}"
ENV XDEBUG_MODE=coverage
