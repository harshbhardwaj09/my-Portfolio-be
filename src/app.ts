import express, { Application } from "express";
import dotenv from "dotenv";
import connectDB from "./config/db";
import blogRoutes from "./routes/blog.routes";
import cors from "cors";

// Loads environment variables from .env file
dotenv.config();

// Creates an Express application instance
const app: Application = express();

/* ================= MIDDLEWARE ================= */

// Parses incoming JSON requests
// Required for req.body to work
app.use(express.json());

// to aloow cross-origin requests from the frontend (next.js) to the backend (express   )
app.use(cors({
  origin: process.env.CLIENT_URL,
   credentials: true,
}));


/* ================= DATABASE ================= */

// Connects MongoDB when application starts
connectDB();

/* ================= ROUTES ================= */

// All blog-related routes start with /api/blogs
app.use("/api/blogs", blogRoutes);

export default app;
