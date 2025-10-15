# Complete TypeScript Backend Setup:

# 1. Initialize project
npm init -y

# 2. Install dependencies
npm install express dotenv mongoose cors bcrypt jsonwebtoken express-validator

# 3. Install TypeScript dev dependencies
npm install -D typescript tsx @types/node @types/express @types/cors @types/bcrypt @types/jsonwebtoken

# 4. Generate tsconfig.json
npx tsc --init

# 5. Update package.json scripts
npm pkg set type="module"
npm pkg set scripts.dev="tsx watch server.ts"
npm pkg set scripts.start="tsx server.ts"
npm pkg set scripts.build="tsc"

# 6. Create project structure
mkdir db model routes controllers middleware services
touch server.ts app.ts .env .gitignore

# Done! Start coding

---

## API Documentation

### Base URL
```
http://localhost:4000
```

---

## User Endpoints

### 1. Register User

**Endpoint:** `POST /users/register`

**Description:**  
Creates a new user account with hashed password and returns a JWT authentication token.

**Request Body:**
```json
{
  "fullName": {
    "firstName": "string (min 3 characters, required)",
    "lastName": "string (min 3 characters, optional)"
  },
  "email": "string (valid email format, required)",
  "password": "string (min 6 characters, required)"
}
```

**Example Request:**
```json
{
  "fullName": {
    "firstName": "John",
    "lastName": "Doe"
  },
  "email": "john.doe@example.com",
  "password": "password123"
}
```

**Validation Rules:**
- `firstName`: Minimum 3 characters, required
- `lastName`: Minimum 3 characters, optional
- `email`: Must be valid email format, required, unique
- `password`: Minimum 6 characters, required

**Success Response:**

**Status Code:** `201 Created`

```json
{
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "fullName": {
      "firstName": "John",
      "lastName": "Doe"
    },
    "email": "john.doe@example.com",
    "_id": "68efc6ac570db6d9097aff84",
    "createdAt": "2024-10-15T10:30:00.000Z",
    "updatedAt": "2024-10-15T10:30:00.000Z"
  }
}
```

**Error Responses:**

**Status Code:** `400 Bad Request` - Validation Error
```json
{
  "errors": [
    {
      "type": "field",
      "msg": "First name must be at least 3 characters long",
      "path": "fullName.firstName",
      "location": "body"
    }
  ]
}
```

**Status Code:** `400 Bad Request` - Duplicate Email
```json
{
  "message": "Email already exists"
}
```

**Status Code:** `500 Internal Server Error`
```json
{
  "message": "Internal server error"
}
```

---

## Status Codes Summary

| Status Code | Description |
|-------------|-------------|
| `201` | User successfully created |
| `400` | Validation error or duplicate email |
| `500` | Server error |

---

## Authentication

The `/users/register` endpoint returns a JWT token that should be used for authenticated requests.

**Token Usage:**
```
Authorization: Bearer <token>
```

**Token Expiration:** 7 days (default)

---

## Environment Variables

Create a `.env` file in the backend directory:

```env
PORT=4000
MONGO_URI=mongodb+srv://username:password@cluster.mongodb.net/DeliveryApp
JWT_PRIVATE_KEY=your_jwt_private_key_here
```

---

## Running the Application

**Development Mode:**
```bash
npm run dev
```

**Production Mode:**
```bash
npm run build
npm start
```

---

## Project Structure

```
backend/
├── controllers/
│   └── user.controller.ts
├── db/
│   └── db.ts
├── middleware/
├── model/
│   └── user.model.ts
├── routes/
│   └── user.route.ts
├── services/
│   └── user.service.ts
├── app.ts
├── server.ts
├── .env
├── tsconfig.json
└── package.json
```
