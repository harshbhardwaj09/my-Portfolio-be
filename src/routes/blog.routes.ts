import { Router } from "express";
import { createBlog, getAllBlogs } from "../controllers/blog.controller";

const router = Router();

router.post("/", createBlog);
router.get("/", getAllBlogs);

export default router;
