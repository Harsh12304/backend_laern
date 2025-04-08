// Importing required modules
import express from "express";
import cookieParser from "cookie-parser";
import cors from "cors";

// Creating an instance of Express app
const app = express();

// Enable CORS so frontend apps can access this API
// CORS is like a security gate that decides which sites can talk to your backend
app.use(cors({
    origin: process.env.CORS_ORIGIN, // allowed origin(s) (e.g., frontend URL)
    credentials: true               // allow cookies to be sent with requests
}));

// Parse incoming JSON requests with a body limit of 16kb
app.use(express.json({ limit: "16kb" }));

// Parse incoming URL-encoded form data (like from HTML forms)
app.use(express.urlencoded({ limit: "16kb", extended: true }));

// Serve static files from the "public" folder (images, CSS, JS files, etc.)
app.use(express.static("public"));

// Parse cookies from the request headers
app.use(cookieParser());

// Exporting the Express app to use it in other files (like index.js)
export { app };
