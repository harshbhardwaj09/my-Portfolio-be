import { Router } from "express";
import {
  createBlog,
  getAllBlogs,
  getBlogById,
  updateBlog,
  deleteBlog,
} from "../controllers/blog.controller";

const router = Router();

// Create
router.post("/", createBlog);

// Read all
router.get("/", getAllBlogs);

// Read one
router.get("/:id", getBlogById);

// Update
router.put("/:id", updateBlog);

// Delete
router.delete("/:id", deleteBlog);

export default router;
