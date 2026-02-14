import { Request, Response } from "express";
import Blog from "../models/blog";

/* CREATE BLOG */
export const createBlog = async (req: Request, res: Response) => {
  // req.body = data sent by client
  const blog = await Blog.create(req.body);

  // Send created blog back
  return res.status(201).json(blog);
};
export const getAllBlogs = async (req: Request, res: Response) => {
  const page = Number(req.query.page) || 1;
  const limit = Number(req.query.limit) || 10;

  const skip = (page - 1) * limit;

  const blogs = await Blog.find().skip(skip).limit(limit);
  const blogsResult = { blogs, total: await Blog.countDocuments() };

  return res.json(blogsResult);
};
export const getBlogById = async (req: Request, res: Response) => {
  const blog = await Blog.findById(req.params.id);

  if (!blog) {
    return res.status(404).json({ message: "Blog not found" });
  }

  return res.json(blog);
};
export const updateBlog = async (req: Request, res: Response) => {
  const updatedBlog = await Blog.findByIdAndUpdate(
    req.params.id, // Which blog
    req.body, // What to update
    {
      new: true, // return updated data
      runValidators: true, // apply schema rules
    },
  );

  return res.json(updatedBlog);
};
export const deleteBlog = async (req: Request, res: Response) => {
  await Blog.findByIdAndDelete(req.params.id);
  return res.status(204).send();
};
