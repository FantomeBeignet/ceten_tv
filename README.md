# CETEN TV

## About

CETEN TV is a web application made to display images on TELECOM Nancy's cafeteria TV.

It also provides an automated tool to generate images from the events of the week.

## Installation

### Requirements

You should have Docker and Docker Compose installed on your machine.

### Configuration

To make the automated calendar image generator work, you should put the `credentials.json` and `token.json` files from the Google Cloud Platform in the `calendar/config` folder.

## Usage

### Calendar image generator

The calendar images are generated automatically every day at 7:00, 12:00 and 17:00. This can be changed in the `calendar/config/cron` file.

### Slideshow

The slideshow is made of images in the `images` folder. The images are displayed in alphabetical order. It is displayed on the `/` route.

### Admin

The admin interface is available on the `/admin` route. It allows you to upload images to display them on the TV, or hide displayed images.
