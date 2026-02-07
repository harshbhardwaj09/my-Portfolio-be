import express, { Application } from "express";
import connectDB from "./config/db";
import blogRoutes from "./routes/blog.routes";
import dotenv from "dotenv";

dotenv.config();
const app: Application = express();

/* -------------------- MIDDLEWARES -------------------- */
app.use(express.json());

/* -------------------- DATABASE -------------------- */
connectDB();

/* -------------------- ROUTES -------------------- */
app.use("/api/blogs", blogRoutes);

export default app;
