import { Request, Response } from "express";
import Blog from "../models/blog";

/* CREATE BLOG */
export const createBlog = async (
  req: Request,
  res: Response
): Promise<Response> => {
  const blog = await Blog.create(req.body);
  return res.status(201).json(blog);
};

/* GET ALL BLOGS */
export const getAllBlogs = async (
  req: Request,
  res: Response
): Promise<Response> => {
  const blogs = await Blog.find();
  return res.json(blogs);
};
