# Demo Backend Project

This project is a **Testing API** built with **Node.js**, **Express**, and **MongoDB**.

It supports **user sign-up**, **sign-in**, and **OTP-based verification** to ensure secure authentication.

---

## Features

-   **User Authentication**:

    -   Sign-up with email and password.
    -   Sign-in with email and password.
    -   OTP-based verification during sign-in.

-   **JWT Tokens**:

    -   Generate JWT tokens upon successful verification.

-   **Email Integration ([Google Script](https://script.google.com/))**:
    -   Sends OTP to the user's email for verification.

## Installation and Setup

### Prerequisites

Ensure you have the following installed:

-   Node.js (v14 or above)
-   MongoDB (local or cloud-based, e.g., MongoDB Atlas)

### Steps

1. **Clone the Repository**

    ```bash
    git clone https://github.com/your-username/demo-api.git ./demo-api
    cd demo-api
    ```

2. **Install Dependencies**

    ```bash
    pnpm install
    ```

3. **Environment Variables**

    Create a `.env` file in the root directory and add the following:

    ```env
    PORT=3001
    MONGO_URI=your-mongodb-connection-string
    JWT_SECRET=your-jwt-secret
    SESSION_SECRET=your-session-secret
    NODE_ENV=development
    ```

4. **Start the Server**

    ```bash
    pnpm start
    ```

    The server will start on `http://localhost:3001`.

---

## API Endpoints

### Base URL: `http://localhost:3001/api/auth`

| Method | Endpoint      | Description                                                  |
| ------ | ------------- | ------------------------------------------------------------ |
| POST   | `/signin`     | Sign in with email and password. Sends OTP for verification. |
| POST   | `/verify-otp` | Verify OTP and complete the sign-in process.                 |
| POST   | `/signup`     | Register a new user with email and password.                 |

---

### Example Payloads

#### **Sign-In**

```json
POST /api/auth/signin
Content-Type: application/json

{
    "email": "contact@devmahmoud.me",
    "password": "123456"
}
```

#### **Verify OTP**

```json
POST /api/auth/verify-otp
Content-Type: application/json

{
    "email": "contact@devmahmoud.me",
    "otp": "123456"
}
```

#### **Sign-Up**

```json
POST /api/auth/signup
Content-Type: application/json

{
    "name": "Dev Mahmoud",
    "email": "contact@devmahmoud.me",
    "password": "123456"
}
```

---

## Project Structure

```
.
├── db/
│   └── index.js         # MongoDB connection setup
├── models/
│   ├── User.js          # User schema
│   └── OTP.js           # OTP schema
├── routes/
│   └── auth.js          # Authentication routes
├── utils/
│   ├── email.js         # Email utility functions
│   ├── http.js          # HTTP status constants
├── .env                 # Environment variables
├── server.js            # Express server setup
├── package.json         # Project dependencies
└── README.md            # Documentation
```

---

## Contact

For issues or questions, contact [Mahmoud](mailto:contact@devmahmoud.me).
