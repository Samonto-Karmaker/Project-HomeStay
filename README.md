# Project HomeStay

Hello World! Welcome to Project HomeStay, a MERN stack web application designed to help you find and book the perfect home-stay for your next vacation!

## Overview

Are you someone who wants to travel the world and meet with great peeple from various cultures? Home-stay can be a great and perheps cheaper option for you to explore not just places but people and cultures. Welcome to Project HomeStay. Here, travelers can explore a variety of home-stays, filter based on their preferences, book their stays with ease, and rate their experiences. Experience seamless booking and management with our user-friendly interface and robust notification system.

Do you own amazing places and want guests from all over the world to welcome and host their vacations? No worries! We have you covered. Easily add your places here and let them get discovered by travelers for bookings. Don't worry, all bookings will only be confirmed by you. Manage your place's availability status and stay notified.

Let's connect together and explore!

## Table of Contents

- [Features](#features)
- [Tech Stack](#tech-stack)
- [Getting Started](#getting-started)

## Features

Project HomeStay includes the following features:

- User Registration, Login, and Logout using JWT and cookies
- Upload and update user avatar using Multer
- Password encryption using bcrypt
- Place booking and rating (after visit is confirmed)
- User dashboard for booking management
- Owner dashboard for place and booking management
- Proper authorization
- Add places for booking including image upload with preview
- Search and filter places with advanced amenity selection
- Sort places based on price and rating
- Manage place availability based on owner's requirements and bookings
- Robust notification system and booking management

## Tech Stack

This project uses the following technologies:

- [React](https://reactjs.org/): A JavaScript library for building user interfaces
- [Node.js](https://nodejs.org/): A JavaScript runtime built on Chrome's V8 JavaScript engine
- [Express](https://expressjs.com/): A minimal and flexible Node.js web application framework
- [MongoDB](https://www.mongodb.com/): A source-available cross-platform document-oriented database program

## Getting Started

To get a local copy up and running follow these simple steps:

### Prerequisites

Ensure you have the following installed:
- Node.js
- npm
- MongoDB

### Installation

1. Clone the repo:
    ```sh
    git clone https://github.com/Samonto-Karmaker/Project-HomeStay.git
    ```
2. Navigate to the project directory:
    ```sh
    cd Project-HomeStay
    ```
3. Install NPM packages:
    ```sh
    npm install
    ```
4. Set up environment variables:
    Create a `.env` file in the root directory and add your variables.

5. Run the application:
    ```sh
    npm start
    ```

6. Populating the Database with Dummy Data

The application is configured to automatically populate the database with this dummy data when the server starts, if the database is empty. This is done by the [`pushDummyPlaces`](server/controllers/placeController.js) function in [server/controllers/placeController.js](server/controllers/placeController.js), which is called in the server startup script in [server/index.js](server/index.js).

If you want to add some dummy data, you can do so by adding the server/data/place_data.js file. Please ensure that the data structure and types match the schema defined in the [Places](server/models/Places.js) model. Additionally, you need at least 1 valid user to be represented as a owner.

If however, you want to add to populated the database using the application itself, please make sure to comment out the [`pushDummyPlaces`](server/controllers/placeController.js) function call in the server startup script in [server/index.js](server/index.js).
