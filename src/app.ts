import express, { Application } from "express";
import dotenv from "dotenv";
import connectDB from "./config/db";
import blogRoutes from "./routes/blog.routes";

// Loads environment variables from .env file
dotenv.config();

// Creates an Express application instance
const app: Application = express();

/* ================= MIDDLEWARE ================= */

// Parses incoming JSON requests
// Required for req.body to work
app.use(express.json());

/* ================= DATABASE ================= */

// Connects MongoDB when application starts
connectDB();

/* ================= ROUTES ================= */

// All blog-related routes start with /api/blogs
app.use("/api/blogs", blogRoutes);

export default app;
