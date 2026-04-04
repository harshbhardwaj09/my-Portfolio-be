import { Router } from "express";
import { upload } from "../middlewares/upload";
import { requireBlogWriteToken } from "../middlewares/auth";
import {
  generateBlogWriteToken,
  createBlog,
  getAllBlogs,
  getBlogById,
  updateBlog,
  deleteBlog,
  incrementBlogRead,
  likeBlog,
  unlikeBlog,
} from "../controllers/blog.controller";

const router = Router();

// Generate write token (30 minutes)
router.post("/token", generateBlogWriteToken);

// Create
router.post(
  "/",
  requireBlogWriteToken,
  upload.fields([
    { name: "coverImage", maxCount: 1 },
    { name: "images", maxCount: 10 },
  ]),
  createBlog,
);
// router.post("/", upload.single("coverImage"), createBlog);
// Read all
router.get("/", getAllBlogs);

// Read one
router.get("/:id", getBlogById);

// Engagement
router.post("/:id/read", incrementBlogRead);
router.post("/:id/like", likeBlog);
router.post("/:id/unlike", unlikeBlog);

// Update
router.put("/:id", requireBlogWriteToken, updateBlog);

// Delete
router.delete("/:id", requireBlogWriteToken, deleteBlog);

export default router;
