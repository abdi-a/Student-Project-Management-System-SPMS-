# Student Project Management System (SPMS) - Architecture & Database Design

## 1. System Architecture Diagram Explanation

This project follows a **Layered Architecture** pattern, ensuring separation of concerns, scalability, and maintainability.

### Layers Breakdown

1.  **Presentation Layer (Frontend - Next.js)**
    *   **Technology:** Next.js (App Router), React, Tailwind CSS.
    *   **Responsibility:** Renders the UI, handles user interactions, manages client-side state (Zustand/Context), and communicates with the backend via REST API calls.
    *   **Key Components:**
        *   `app/`: Routes and Pages.
        *   `components/`: Reusable UI elements (Buttons, Forms, Modals).
        *   `hooks/`: Custom React hooks for logic.
        *   `services/`: API wrapper functions (Axios instance).

2.  **API Layer (Integration - Laravel Routes)**
    *   **Technology:** Laravel API Routes (`api.php`).
    *   **Responsibility:** Entry point for all external requests. Handles routing, middleware (Authentication via Sanctum), and Request Validation.
    *   **Key Components:**
        *   `routes/api.php`: Defines endpoints.
        *   `Http/Middleware`: Auth, CORS, Role checks.
        *   `Http/Requests`: FormRequest validation classes.

3.  **Business Logic Layer (Backend - Laravel Controllers & Services)**
    *   **Technology:** Laravel Controllers, Service Classes (optional but recommended for complex logic), Policies.
    *   **Responsibility:** Implements the core business rules (e.g., "A student can only submit one proposal", "Only supervisors can approve").
    *   **Key Components:**
        *   `Http/Controllers`: Orchestrates the request flow.
        *   `Policies`: Authorization logic (RBAC).
        *   `Services`: Encapsulated complex logic (e.g., `ProposalService`, `NotificationService`).

4.  **Data Access Layer (Database - MySQL & Eloquent ORM)**
    *   **Technology:** MySQL, Eloquent Models.
    *   **Responsibility:** Interacts directly with the database. Handles queries, relationships, and data integrity.
    *   **Key Components:**
        *   `Models`: User, Project, Submission, Evaluation.
        *   `Migrations`: Database schema definitions.

---

## 2. MySQL Database Schema

We will use a relational database design.

### Entities (Tables)

#### 1. `users`
Stores all actors (Admin, Student, Supervisor, Evaluator).
*   `id` (PK)
*   `name` (string)
*   `email` (string, unique)
*   `password` (string)
*   `role` (enum: 'admin', 'student', 'supervisor', 'evaluator')
*   `matric_no` (string, nullable) - For students
*   `department` (string, nullable)
*   `created_at`, `updated_at`

#### 2. `projects`
 The core entity. A student proposes a project.
*   `id` (PK)
*   `title` (string)
*   `description` (text)
*   `student_id` (FK -> users.id)
*   `supervisor_id` (FK -> users.id, nullable)
*   `evaluator_id` (FK -> users.id, nullable)
*   `status` (enum: 'proposed', 'approved', 'rejected', 'in_progress', 'completed')
*   `deadline` (date, nullable)
*   `created_at`, `updated_at`

#### 3. `submissions`
Files or milestones submitted by students.
*   `id` (PK)
*   `project_id` (FK -> projects.id)
*   `student_id` (FK -> users.id)
*   `title` (string) - e.g., "Chapter 1", "Final Report"
*   `file_path` (string)
*   `submission_type` (enum: 'proposal', 'milestone', 'final')
*   `submitted_at` (timestamp)
*   `created_at`, `updated_at`

#### 4. `feedback` (or `comments`)
Feedback from supervisors on submissions.
*   `id` (PK)
*   `submission_id` (FK -> submissions.id)
*   `user_id` (FK -> users.id) - The supervisor/evaluator making the comment
*   `content` (text)
*   `created_at`, `updated_at`

#### 5. `evaluations`
Final grading by evaluators.
*   `id` (PK)
*   `project_id` (FK -> projects.id)
*   `evaluator_id` (FK -> users.id)
*   `criteria` (json) - e.g., {"clarity": 10, "impl": 20}
*   `score` (decimal)
*   `comments` (text)
*   `created_at`, `updated_at`

#### 6. `notifications`
System notifications to users.
*   `id` (PK)
*   `user_id` (FK -> users.id)
*   `type` (string)
*   `message` (text)
*   `read_at` (timestamp, nullable)
*   `created_at`, `updated_at`

### Relationships (Eloquent)

*   **User (Student)** `hasOne` **Project**
*   **User (Supervisor)** `hasMany` **Project**
*   **Project** `belongsTo` **Student**
*   **Project** `belongsTo` **Supervisor**
*   **Project** `hasMany` **Submission**
*   **Submission** `hasMany` **Feedback**
*   **Project** `hasOne` **Evaluation**
