import { Router } from "express";
import { createBlog, getAllBlogs } from "../controllers/blog.controller";

// Router is a mini Express application
const router = Router();

// POST /api/blogs
router.post("/", createBlog);

// GET /api/blogs
router.get("/", getAllBlogs);

export default router;
