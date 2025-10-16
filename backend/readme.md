# Complete TypeScript Backend Setup:

# 1. Initialize project
npm init -y

# 2. Install dependencies
npm install express dotenv mongoose cors bcrypt jsonwebtoken express-validator cookie-parser

# 3. Install TypeScript dev dependencies
npm install -D typescript tsx @types/node @types/express @types/cors @types/bcrypt @types/jsonwebtoken @types/cookie-parser

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

### 2. Login User

**Endpoint:** `POST /users/login`

**Description:**  
Authenticates an existing user with email and password, returns a JWT authentication token and sets it as a cookie.

**Request Body:**
```json
{
  "email": "string (valid email format, required)",
  "password": "string (min 6 characters, required)"
}
```

**Example Request:**
```json
{
  "email": "john.doe@example.com",
  "password": "password123"
}
```

**Validation Rules:**
- `email`: Must be valid email format, required
- `password`: Minimum 6 characters, required

**Success Response:**

**Status Code:** `200 OK`

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

**Note:** The token is also set as an HTTP-only cookie named `token`.

**Error Responses:**

**Status Code:** `400 Bad Request` - Validation Error
```json
{
  "errors": [
    {
      "type": "field",
      "msg": "Invalid email format",
      "path": "email",
      "location": "body"
    }
  ]
}
```

**Status Code:** `401 Unauthorized` - Invalid Credentials
```json
{
  "message": "Invalid email or password"
}
```

**Status Code:** `500 Internal Server Error`
```json
{
  "message": "Internal server error"
}
```

---

### 3. Get User Profile

**Endpoint:** `GET /users/profile`

**Description:**  
Retrieves the authenticated user's profile information. Requires a valid JWT token.

**Authentication:** Required

**Headers:**
```
Authorization: Bearer <jwt_token>
```

Or token can be sent via cookie (automatically set after login).

**Request Body:** None

**Success Response:**

**Status Code:** `200 OK`

```json
{
  "fullName": {
    "firstName": "John",
    "lastName": "Doe"
  },
  "email": "john.doe@example.com",
  "_id": "68efc6ac570db6d9097aff84",
  "createdAt": "2024-10-15T10:30:00.000Z",
  "updatedAt": "2024-10-15T10:30:00.000Z"
}
```

**Error Responses:**

**Status Code:** `401 Unauthorized` - No Token Provided
```json
{
  "message": "Access denied. No token provided."
}
```

**Status Code:** `401 Unauthorized` - Token Revoked
```json
{
  "message": "Token has been revoked."
}
```

**Status Code:** `401 Unauthorized` - Invalid Token
```json
{
  "message": "Invalid or expired token."
}
```

**Status Code:** `401 Unauthorized` - User Not Found
```json
{
  "message": "User not found."
}
```

---

### 4. Logout User

**Endpoint:** `GET /users/logout`

**Description:**  
Logs out the authenticated user by blacklisting their JWT token. The token will no longer be valid for authentication.

**Authentication:** Required

**Headers:**
```
Authorization: Bearer <jwt_token>
```

Or token can be sent via cookie.

**Request Body:** None

**Success Response:**

**Status Code:** `200 OK`

```json
{
  "message": "Logged out successfully"
}
```

**Error Responses:**

**Status Code:** `401 Unauthorized` - No Token Provided
```json
{
  "message": "Access denied. No token provided."
}
```

**Status Code:** `401 Unauthorized` - Token Already Revoked
```json
{
  "message": "Token has been revoked."
}
```

**Status Code:** `401 Unauthorized` - Invalid Token
```json
{
  "message": "Invalid or expired token."
}
```

**Status Code:** `401 Unauthorized` - User Not Found
```json
{
  "message": "User not found."
}
```

**Status Code:** `500 Internal Server Error`
```json
{
  "message": "Internal server error"
}
```

**Note:** After logout, the token is added to a blacklist and cannot be reused. The blacklisted token automatically expires after 24 hours.

---

## Status Codes Summary

| Status Code | Description |
|-------------|-------------|
| `200` | Request successful (login, profile retrieval, logout) |
| `201` | User successfully created |
| `400` | Validation error or duplicate email |
| `401` | Unauthorized (invalid credentials, missing/invalid token) |
| `500` | Server error |

---

## Authentication

The `/users/register` and `/users/login` endpoints return a JWT token that should be used for authenticated requests.

**Protected Endpoints:**
- `GET /users/profile` - Requires authentication
- `GET /users/logout` - Requires authentication

**Token Usage (Two Methods):**

**Method 1: Authorization Header**
```
Authorization: Bearer <token>
```

**Method 2: Cookie (Automatic after login)**
- Token is automatically sent with requests after login
- Cookie name: `token`
- HTTP-only cookie for security

**Token Expiration:** 7 days (default)

**Token Blacklisting:** 
- Tokens are blacklisted after logout
- Blacklisted tokens expire after 24 hours in the database

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
├── middlewares/
│   └── auth.middleware.ts
├── model/
│   ├── user.model.ts
│   └── blacklistToken.model.ts
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

---

## Testing with Postman

### 1. Register User
```
POST http://localhost:4000/users/register
Content-Type: application/json

{
  "fullName": {
    "firstName": "John",
    "lastName": "Doe"
  },
  "email": "john.doe@example.com",
  "password": "password123"
}
```

### 2. Login User
```
POST http://localhost:4000/users/login
Content-Type: application/json

{
  "email": "john.doe@example.com",
  "password": "password123"
}
```

### 3. Get User Profile (Protected)
```
GET http://localhost:4000/users/profile
Authorization: Bearer <your_jwt_token>
```

### 4. Logout User (Protected)
```
GET http://localhost:4000/users/logout
Authorization: Bearer <your_jwt_token>
```

---

## Security Features

- ✅ **Password Hashing:** Passwords are hashed using bcrypt with salt rounds
- ✅ **JWT Authentication:** Secure token-based authentication
- ✅ **Token Blacklisting:** Logged-out tokens are blacklisted and cannot be reused
- ✅ **HTTP-Only Cookies:** Tokens stored in HTTP-only cookies to prevent XSS attacks
- ✅ **Password Exclusion:** Passwords are never returned in API responses
- ✅ **Input Validation:** Request validation using express-validator
- ✅ **Auto-Expiring Tokens:** Blacklisted tokens auto-expire after 24 hours

---

## Common Issues

### Token Not Working
- Make sure you're including `Bearer` prefix in Authorization header
- Check if token has been blacklisted (after logout)
- Verify JWT_PRIVATE_KEY matches the one used to create the token

### Cookie Not Being Set
- Check CORS settings if frontend and backend are on different domains
- Ensure cookie-parser middleware is properly configured

### User Not Found
- Token might contain an invalid user ID
- User might have been deleted from database

## Captain Endpoints

### 1. Register Captain

**Endpoint:** `POST /captains/register`

**Description:**  
Creates a new captain account with hashed password, vehicle details, and returns a JWT authentication token.

**Request Body:**
```json
{
  "fullName": {
    "firstName": "string (min 3 characters, required)",
    "lastName": "string (min 3 characters, optional)"
  },
  "email": "string (valid email format, required, unique)",
  "password": "string (min 6 characters, required)",
  "vehicle": {
    "color": "string (min 3 characters, required)",
    "plate": "string (min 3 characters, required)",
    "capacity": "number (min 1, required)",
    "vehicleType": "string (enum: 'car', 'motorcycle', 'auto', required)"
  }
}
```

**Example Request:**
```json
{
  "fullName": {
    "firstName": "Mike",
    "lastName": "Smith"
  },
  "email": "mike.smith@example.com",
  "password": "password123",
  "vehicle": {
    "color": "red",
    "plate": "MH 14 7487",
    "capacity": 2,
    "vehicleType": "motorcycle"
  }
}
```

**Validation Rules:**
- `firstName`: Minimum 3 characters, required
- `lastName`: Minimum 3 characters, optional
- `email`: Must be valid email format, required, unique
- `password`: Minimum 6 characters, required
- `vehicle.color`: Minimum 3 characters, required
- `vehicle.plate`: Minimum 3 characters, required
- `vehicle.capacity`: Must be an integer, minimum 1, required
- `vehicle.vehicleType`: Must be one of: `car`, `motorcycle`, `auto`, required

**Success Response:**

**Status Code:** `201 Created`

```json
{
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "captain": {
    "fullName": {
      "firstName": "Mike",
      "lastName": "Smith"
    },
    "email": "mike.smith@example.com",
    "vehicle": {
      "color": "red",
      "plate": "MH 14 7487",
      "capacity": 2,
      "vehicleType": "motorcycle"
    },
    "status": "active",
    "_id": "68efc6ac570db6d9097aff85",
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
      "msg": "First name must be at least 3 characters",
      "path": "fullName.firstName",
      "location": "body"
    }
  ]
}
```

**Status Code:** `400 Bad Request` - Invalid Vehicle Type
```json
{
  "errors": [
    {
      "type": "field",
      "msg": "Invalid vehicle type",
      "path": "vehicle.vehicleType",
      "location": "body"
    }
  ]
}
```

**Status Code:** `400 Bad Request` - Duplicate Email
```json
{
  "message": "Captain already exists"
}
```

**Status Code:** `500 Internal Server Error`
```json
{
  "message": "Internal server error"
}
```

---

### 2. Login Captain

**Endpoint:** `POST /captains/login`

**Description:**  
Authenticates an existing captain with email and password, returns a JWT authentication token and sets it as a cookie.

**Request Body:**
```json
{
  "email": "string (valid email format, required)",
  "password": "string (min 6 characters, required)"
}
```

**Example Request:**
```json
{
  "email": "mike.smith@example.com",
  "password": "password123"
}
```

**Validation Rules:**
- `email`: Must be valid email format, required
- `password`: Minimum 6 characters, required

**Success Response:**

**Status Code:** `200 OK`

```json
{
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "captain": {
    "fullName": {
      "firstName": "Mike",
      "lastName": "Smith"
    },
    "email": "mike.smith@example.com",
    "vehicle": {
      "color": "red",
      "plate": "MH 14 7487",
      "capacity": 2,
      "vehicleType": "motorcycle"
    },
    "status": "active",
    "_id": "68efc6ac570db6d9097aff85",
    "createdAt": "2024-10-15T10:30:00.000Z",
    "updatedAt": "2024-10-15T10:30:00.000Z"
  }
}
```

**Note:** The token is also set as an HTTP-only cookie named `token`.

**Error Responses:**

**Status Code:** `400 Bad Request` - Validation Error
```json
{
  "errors": [
    {
      "type": "field",
      "msg": "Invalid email format",
      "path": "email",
      "location": "body"
    }
  ]
}
```

**Status Code:** `401 Unauthorized` - Invalid Credentials
```json
{
  "message": "Invalid email or password"
}
```

**Status Code:** `500 Internal Server Error`
```json
{
  "message": "Internal server error"
}
```

---

### 3. Get Captain Profile

**Endpoint:** `GET /captains/profile`

**Description:**  
Retrieves the authenticated captain's profile information including vehicle details. Requires a valid JWT token.

**Authentication:** Required

**Headers:**
```
Authorization: Bearer <jwt_token>
```

Or token can be sent via cookie (automatically set after login).

**Request Body:** None

**Success Response:**

**Status Code:** `200 OK`

```json
{
  "fullName": {
    "firstName": "Mike",
    "lastName": "Smith"
  },
  "email": "mike.smith@example.com",
  "vehicle": {
    "color": "red",
    "plate": "MH 14 7487",
    "capacity": 2,
    "vehicleType": "motorcycle"
  },
  "status": "active",
  "_id": "68efc6ac570db6d9097aff85",
  "createdAt": "2024-10-15T10:30:00.000Z",
  "updatedAt": "2024-10-15T10:30:00.000Z"
}
```

**Error Responses:**

**Status Code:** `401 Unauthorized` - No Token Provided
```json
{
  "message": "Access denied. No token provided."
}
```

**Status Code:** `401 Unauthorized` - Token Revoked
```json
{
  "message": "Token has been revoked."
}
```

**Status Code:** `401 Unauthorized` - Invalid Token
```json
{
  "message": "Invalid or expired token."
}
```

**Status Code:** `401 Unauthorized` - Captain Not Found
```json
{
  "message": "Captain not found."
}
```

---

### 4. Logout Captain

**Endpoint:** `GET /captains/logout`

**Description:**  
Logs out the authenticated captain by blacklisting their JWT token. The token will no longer be valid for authentication.

**Authentication:** Required

**Headers:**
```
Authorization: Bearer <jwt_token>
```

Or token can be sent via cookie.

**Request Body:** None

**Success Response:**

**Status Code:** `200 OK`

```json
{
  "message": "Logged out successfully"
}
```

**Error Responses:**

**Status Code:** `401 Unauthorized` - No Token Provided
```json
{
  "message": "Access denied. No token provided."
}
```

**Status Code:** `401 Unauthorized` - Token Already Revoked
```json
{
  "message": "Token has been revoked."
}
```

**Status Code:** `401 Unauthorized` - Invalid Token
```json
{
  "message": "Invalid or expired token."
}
```

**Status Code:** `401 Unauthorized` - Captain Not Found
```json
{
  "message": "Captain not found."
}
```

**Status Code:** `500 Internal Server Error`
```json
{
  "message": "Internal server error"
}
```

**Note:** After logout, the token is added to a blacklist and cannot be reused. The blacklisted token automatically expires after 24 hours.

---

## Captain vs User Differences

| Feature | Users | Captains |
|---------|-------|----------|
| Base Route | `/users` | `/captains` |
| Additional Fields | None | `vehicle` (color, plate, capacity, vehicleType), `status` |
| Default Status | N/A | `active` |
| Vehicle Types | N/A | `car`, `motorcycle`, `auto` |
| Auth Middleware | `authUser` | `authCaptain` |

---

## Testing with Postman

### 1. Register Captain
```
POST http://localhost:4000/captains/register
Content-Type: application/json

{
  "fullName": {
    "firstName": "Mike",
    "lastName": "Smith"
  },
  "email": "mike.smith@example.com",
  "password": "password123",
  "vehicle": {
    "color": "red",
    "plate": "MH 14 7487",
    "capacity": 2,
    "vehicleType": "motorcycle"
  }
}
```

### 2. Login Captain
```
POST http://localhost:4000/captains/login
Content-Type: application/json

{
  "email": "mike.smith@example.com",
  "password": "password123"
}
```

### 3. Get Captain Profile (Protected)
```
GET http://localhost:4000/captains/profile
Authorization: Bearer <your_captain_jwt_token>
```

### 4. Logout Captain (Protected)
```
GET http://localhost:4000/captains/logout
Authorization: Bearer <your_captain_jwt_token>
```

---

## Captain Model Schema

```typescript
{
  fullName: {
    firstName: string (required, min 3 chars),
    lastName: string (optional, min 3 chars)
  },
  email: string (required, unique, valid email),
  password: string (required, min 6 chars, hashed, hidden in queries),
  status: 'active' | 'inactive' | 'suspended' (default: 'active'),
  vehicle: {
    color: string (required, min 3 chars),
    plate: string (required, min 3 chars),
    capacity: number (required, min 1),
    vehicleType: 'car' | 'motorcycle' | 'auto' (required)
  },
  socketId: string (optional),
  createdAt: Date (auto-generated),
  updatedAt: Date (auto-generated)
}
```

---

## Vehicle Type Reference

| Vehicle Type | Typical Capacity | Description |
|--------------|------------------|-------------|
| `car` | 4-5 passengers | Standard car/sedan |
| `motorcycle` | 1-2 passengers | Bike/scooter |
| `auto` | 3 passengers | Auto-rickshaw/tuk-tuk |

---

## Captain Status Types

| Status | Description |
|--------|-------------|
| `active` | Captain is available for rides (default) |
| `inactive` | Captain is not accepting rides |
| `suspended` | Captain account is suspended by admin |