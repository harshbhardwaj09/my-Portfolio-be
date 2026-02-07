import { Request, Response } from "express";
import Blog from "../models/blog";

// CREATE BLOG API LOGIC
export const createBlog = async (
  req: Request,
  res: Response
): Promise<Response> => {

  // Inserts blog data into the database
  const blog = await Blog.create(req.body);

  // Sends created blog as response
  return res.status(201).json(blog);
};

// GET ALL BLOGS API LOGIC
export const getAllBlogs = async (
  req: Request,
  res: Response
): Promise<Response> => {

  // Fetches all blogs from the database
  const blogs = await Blog.find();

  return res.json(blogs);
};
