# Laravel Backend Setup Guide

## 1. Project Initialization
Run the following commands in your terminal to set up the Laravel project:

```bash
# Create new Laravel project (if not already done)
composer create-project laravel/laravel backend-api

# Navigate into the project directory
cd backend-api

# Install API scaffolding (optional but recommended for API specific features)
php artisan install:api

# Install Sanctum for Authentication
composer require laravel/sanctum
```

## 2. Environment Configuration (.env)
Copy `.env.example` to `.env` and update your database credentials:

```env
DB_CONNECTION=mysql
DB_HOST=127.0.0.1
DB_PORT=3306
DB_DATABASE=spms_db
DB_USERNAME=root
DB_PASSWORD=
```

## 3. Run Migrations
After updating `.env` and creating the database in phpMyAdmin, run the migrations:

```bash
php artisan migrate
```

## 4. Run Development Server
Start the development server:

```bash
php artisan serve
```
