import { Router } from "express";
import { upload } from "../middlewares/upload";
import {
  createBlog,
  getAllBlogs,
  getBlogById,
  updateBlog,
  deleteBlog,
  incrementBlogRead,
  likeBlog,
} from "../controllers/blog.controller";

const router = Router();

// Create
router.post(
  "/",
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

// Update
router.put("/:id", updateBlog);

// Delete
router.delete("/:id", deleteBlog);

export default router;
