import express, { Application } from "express";
import connectDB from "./config/db";
import blogRoutes from "./routes/blog.routes";
import contactRoutes from "./routes/contact.routes";
import analyticsRoutes from "./routes/analytics.routes";
import cors from "cors";

// Loads environment variables from .env file
// Creates an Express application instance
const app: Application = express();

/* ================= MIDDLEWARE ================= */

// Parses incoming JSON requests
// Required for req.body to work
app.use(express.json());

// Allow requests from local frontend and deployed frontend.
const allowedOrigins = [
  process.env.CLIENT_URL,
  "http://localhost:3000",
  "https://my-portfolio-harsh-bhardwaj.vercel.app",
].filter(Boolean) as string[];

const corsOptions: cors.CorsOptions = {
  origin: (origin, callback) => {
    // Allow server-to-server or non-browser requests.
    if (!origin) {
      return callback(null, true);
    }

    if (allowedOrigins.includes(origin)) {
      return callback(null, true);
    }

    return callback(new Error("Not allowed by CORS"));
  },
  methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization"],
  credentials: true,
};

app.use(cors(corsOptions));
app.options("*", cors(corsOptions));

/* ================= DATABASE ================= */

// Connects MongoDB when application starts
connectDB();

/* ================= ROUTES ================= */

// All blog-related routes start with /api/blogs
app.use("/api/blogs", blogRoutes);
app.use("/api/contact", contactRoutes);
app.use("/api/analytics", analyticsRoutes);

export default app;
