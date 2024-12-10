# Sliding Puzzle Game

A modern sliding puzzle game built with Angular and Laravel, featuring user authentication, achievements, and high scores.

## Features

- Interactive sliding puzzle with multiple difficulty levels (2x2 to 6x6)
- User authentication and profiles
- Achievement system
- High score tracking
- Modern, responsive UI

## Tech Stack

- Frontend: Angular 17 with TailwindCSS
- Backend: Laravel 10 with MySQL
- Authentication: Laravel Sanctum

## Setup Instructions

### Backend Setup

1. Navigate to backend directory and install dependencies:
```bash
cd backend
composer install
```

2. Configure your database in `.env` and run migrations:
```bash
php artisan migrate
```

3. Start Laravel server:
```bash
php artisan serve --host=127.0.0.1
```

### Frontend Setup

1. Install dependencies and start server:
```bash
npm install
ng serve
```

The application will be available at `http://localhost:4200`