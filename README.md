# CETEN TV

[![Client Checks](https://github.com/FantomeBeignet/ceten_tv/actions/workflows/client.yml/badge.svg?branch=master)](https://github.com/FantomeBeignet/ceten_tv/actions/workflows/client.yml) [![Calendar Generator Checks](https://github.com/FantomeBeignet/ceten_tv/actions/workflows/calendar.yml/badge.svg?branch=master)](https://github.com/FantomeBeignet/ceten_tv/actions/workflows/calendar.yml) [![API Checks](https://github.com/FantomeBeignet/ceten_tv/actions/workflows/api.yml/badge.svg)](https://github.com/FantomeBeignet/ceten_tv/actions/workflows/api.yml)

## About

CETEN TV is a web application made to display images on TELECOM Nancy's cafeteria TV.

It also provides an automated tool to generate images from the events of the week.

## Installation

### Requirements

You should have Docker and Docker Compose installed on your machine.

### Configuration

To make the Traefik reverse proxy work, you should put the following variables in the `.env` file at the root of the repository:

- `DOMAIN` should be the domain name of the server
- `EMAIL` should be the email address of the administrator of the server, used for Let's Encrypt
- `CERT_RESOLVER` should be the name of the certificate resolver used by Traefik (letsencrypt is recommended)

The client requires the following environment variables:

- `GOOGLE_CLIENT_ID` should be the Google OAuth client ID
- `GOOGLE_CLIENT_SECRET` should be the Google OAuth client secret
- `AUTH_SECRET` should be a secret used to sign the authentication cookies. You can generate one with `openssl rand -hex 32`
- `NEXTAUTH_URL` should be the URL of the server, with the protocol (e.g. `https://raspberry-cafet.telecomnancy.univ-lorraine.fr`)
- `USER_WHITELIST` should be a semicolon-separated list of Google account IDs that can access the admin interface

Redis (used to remember wich images are displayed or hidden) requires the following environment variables:

- `REDIS_PASSWORD` should be the password of the Redis server. You can generate one with `openssl rand -base64 32`

To make the automated calendar image generator work, you should put the `credentials.json` and `token.json` files from the Google Cloud Platform in the `calendar/config` folder.
You also need to set the `CALENDAR_URL` environment variable to the URL of the calendar to use.

## Usage

### Calendar image generator

The calendar images are generated automatically every day at 7:00, 12:00 and 17:00. This can be changed in the `calendar/config/cron` file.

### Slideshow

The slideshow is made of images in the `images` folder. The images are displayed in alphabetical order. It is displayed on the `/` route.

### Admin

The admin interface is available on the `/admin` route. It allows you to upload images to display them on the TV, or hide displayed images. It is protected by Google OAuth, and only users in the `USER_WHITELIST` can access it.

### Traefik

The Traefik dashboard is available on the `https://traefik.DOMAIN` route.

## Development

A development environment is available with Docker Compose. To start it, run `docker-compose -f docker-compose.dev.yml up -d`. The app will be available the same way as in production, with everything running on `localhost` and hot module reloading working.
