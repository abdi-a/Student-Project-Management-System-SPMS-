# Deployment Guide for SPMS

## 1. Backend Deployment (Laravel on XAMPP)

1.  **Database**:
    *   Open phpMyAdmin (`http://localhost/phpmyadmin`).
    *   Create a database named `spms_db`.
    *   Import the migrations via `php artisan migrate` in the `backend-api` folder.

2.  **Server**:
    *   Serve the application using the built-in server for development:
        ```bash
        php artisan serve --port=8000
        ```
    *   For production on Apache (XAMPP):
        *   Move `backend-api` to `C:\xampp\htdocs\spms-backend`.
        *   Point your VirtualHost to `public/`.
        *   Ensure `.env` has correct DB credentials.

3.  **Storage**:
    *   Run `php artisan storage:link` to enable public access to uploaded files.

## 2. Frontend Deployment (Next.js)

1.  **Build**:
    *   Navigate to `frontend-web`.
    *   Run `npm run build` to create an optimized production build.

2.  **Run**:
    *   Start the production server:
        ```bash
        npm start
        ```
    *   The app will typically run on `http://localhost:3000`.

## 3. Connecting them together

*   Ensure the `NEXT_PUBLIC_API_URL` in `frontend-web/.env.local` points to your running backend (e.g., `http://localhost:8000/api`).
*   Ensure Laravel's `.env` has `APP_URL=http://localhost:8000`.
*   **CORS**: Ensure `config/cors.php` in Laravel allows requests from `http://localhost:3000`.

## 4. Notifications (Email)

*   Update `.env` in Backend with your SMTP settings (Mailtrap, Gmail, or SendGrid) to enable email notifications.
*   Example for Mailtrap:
    ```env
    MAIL_MAILER=smtp
    MAIL_HOST=smtp.mailtrap.io
    MAIL_PORT=2525
    MAIL_USERNAME=your_username
    MAIL_PASSWORD=your_password
    ```

## 5. First Time Setup

1.  Register an Admin account (You may need to seed this via `php artisan tinker` since the registration form might be restricted or create the first user via registration and manually change role in DB).
2.  Login as Admin/Student to start using the system.
