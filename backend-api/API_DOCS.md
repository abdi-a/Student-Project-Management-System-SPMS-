# SPMS REST API Documentation

Base URL: `http://localhost:8000/api`

## Authentication

### 1. Register User
*   **Endpoint:** `POST /register`
*   **Access:** Public
*   **Body:**
    ```json
    {
      "name": "John Doe",
      "email": "john@student.com",
      "password": "password123",
      "password_confirmation": "password123",
      "role": "student",
      "matric_no": "123456", // Required if role is student
      "department": "Computer Science"
    }
    ```
*   **Response (201):**
    ```json
    {
      "message": "User registered successfully",
      "user": { ... },
      "access_token": "soemtoken...",
      "token_type": "Bearer"
    }
    ```

### 2. Login
*   **Endpoint:** `POST /login`
*   **Access:** Public
*   **Body:**
    ```json
    {
      "email": "john@student.com",
      "password": "password123"
    }
    ```
*   **Response (200):** includes `access_token`

### 3. Logout
*   **Endpoint:** `POST /logout`
*   **Headers:** `Authorization: Bearer <token>`

### 4. Get Current User
*   **Endpoint:** `GET /user`
*   **Headers:** `Authorization: Bearer <token>`

---

## Projects

### 5. List Projects
*   **Endpoint:** `GET /projects`
*   **Access:** Authenticated
*   **Description:**
    *   **Student:** Returns their own project.
    *   **Supervisor:** Returns projects assigned to them.
    *   **Evaluator:** Returns projects assigned for evaluation.
    *   **Admin:** Returns all projects.

### 6. Create Project (Proposal)
*   **Endpoint:** `POST /projects`
*   **Access:** Student Only
*   **Body:**
    ```json
    {
      "title": "AI Based Health System",
      "description": "A system that uses..."
    }
    ```

### 7. Get Project Details
*   **Endpoint:** `GET /projects/{id}`
*   **Access:** Owner / Supervisor / Admin

### 8. Update Project Status / Assign Supervisor
*   **Endpoint:** `PUT /projects/{id}`
*   **Access:** Supervisor / Admin
*   **Body:**
    ```json
    {
      "status": "approved",
      "supervisor_id": 5 // Only Admin can set this
    }
    ```

### 9. Delete Project
*   **Endpoint:** `DELETE /projects/{id}`
*   **Access:** Admin Only
