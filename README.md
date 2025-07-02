
# Bookstore API

A simple REST API for user authentication and book management.

---

## Installation

```bash
npm install
npm run dev
```

Make sure `.env` is properly configured with JWT secret values.

## STEP 1: User Authentication

### 1.1 Register

- **Method:** POST
- **URL:** `/api/v1/user/register`
- **Headers:**
  ```http
  Content-Type: application/json
  ```
- **Body:**
  ```json
  {
    "name": "Test",
    "email": "test123@gmail.com",
    "password": "Test@123"
  }
  ```
 Returns JWT and user info

 Copy the JWT token — required for book APIs

### 1.2 Login

- **Method:** POST
- **URL:** `/api/v1/user/login`
- **Headers:**
  ```http
  Content-Type: application/json
  ```
- **Body:**
  ```json
  {
    "email": "test123@gmail.com",
    "password": "Test@123"
  }
  ```
 Returns JWT and user info

##  STEP 2: Book Management (JWT Required)

 For all book requests, add this header:
```http
Authorization: Bearer YOUR_JWT_TOKEN
```

### 2.1 Create Book

- **Method:** POST
- **URL:** `/api/v1/books`
- **Headers:**
  ```http
  Authorization: Bearer YOUR_JWT_TOKEN
  Content-Type: application/json
  ```
- **Body:**
  ```json
   {
    "title": "The White Tiger",
    "author": "Aravind Adiga",
    "genre": "Literary Fiction",
    "publishedYear": 2008
  }
  ```

### 2.2 Get All Books

- **Method:** GET
- **URL:** `/api/v1/books`
- **Headers:**
  ```http
  Authorization: Bearer YOUR_JWT_TOKEN
  ```

### 2.3 Get Book by ID

- **Method:** GET
- **URL:** `/api/v1/books/{BOOK_ID}`
- **Headers:**
  ```http
  Authorization: Bearer YOUR_JWT_TOKEN
  ```

### 2.4 Update Book

- **Method:** PUT
- **URL:** `/api/v1/books/{BOOK_ID}`
- **Headers:**
  ```http
  Authorization: Bearer YOUR_JWT_TOKEN
  Content-Type: application/json
  ```
- **Body:**
  ```json
  {
    "title": "Updated Title",
    "genre": "New Genre"
  }
  ```

### 2.5 Delete Book

- **Method:** DELETE
- **URL:** `/api/v1/books/{BOOK_ID}`
- **Headers:**
  ```http
  Authorization: Bearer YOUR_JWT_TOKEN
  ```

## STEP 3: Error Testing

### 3.1 Invalid Registration

- **Method:** POST
- **URL:** `/api/v1/user/register`
- **Invalid Body:**
  ```json
  {
    "name": "",
    "email": "invalid-email",
    "password": "123"
  }
  ```
→ Returns 400 Bad Request with validation errors

### 3.2 Unauthorized Access

- **Method:** GET
- **URL:** `/api/v1/books` without token
→ Returns 401 Unauthorized

### 3.3 Book Not Found

- **Method:** GET
- **URL:** `/api/v1/books/invalid-book-id`
→ Returns 404 Not Found

### 3.4 Unauthorized Book Update

- Logged in as User B, trying to update User A's book
→ Returns 403 Forbidden
