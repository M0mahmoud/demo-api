// server.js
const express = require("express");
const authRoutes = require("./routes/auth");
const connectDB = require("./db/index");
const session = require("express-session");

require("dotenv").config();

// Middleware
const app = express();
app.use(express.json());

//CORS
app.use((_req, res, next) => {
    res.setHeader(
        "Access-Control-Allow-Origin",
        "*" || "http://localhost:3000",
    );
    res.setHeader(
        "Access-Control-Allow-Methods",
        "OPTIONS, GET, POST, PUT, PATCH, DELETE",
    );
    res.setHeader(
        "Access-Control-Allow-Headers",
        "Content-Type, Authorization",
    );
    next();
});

// Session - TODO
app.use(
    session({
        secret: process.env.SESSION_SECRET,
        resave: false,
        saveUninitialized: true,
        cookie: {
            maxAge: 60 * 60 * 1000, // 1 hour
            httpOnly: true,
            secure: process.env.NODE_ENV === "production", // Set to true in production
        },
    }),
);

// Mount routes
app.use("/api/auth", authRoutes);

app.get("/", (_req, res) => {
    res.json({
        status: "success",
        message: "API is working",
        timestamp: new Date().toISOString(),
    });
});

// Error Handling Middleware
app.use((err, req, res, next) => {
    console.error("Unhandled Error:", err.message);
    res.status(err.statusCode || 500).json({
        status: "error",
        message: err.message || "Internal Server Error",
    });
});

// Database Connection and Server Start
const PORT = process.env.PORT || 3001;

connectDB()
    .then(() => {
        app.listen(PORT, () => {
            console.log(`Server is running on port ${PORT}`);
        });
    })
    .catch((err) => console.error("Database connection failed:", err));

// Graceful Shutdown
process.on("SIGINT", async () => {
    console.log("Shutting down gracefully...");
    // Add database disconnection logic if applicable
    process.exit(0);
});
