import { Request, Response } from "express";
import Blog from "../models/blog";

/* CREATE BLOG */
import cloudinary from "../config/cloudinary";

export const createBlog = async (req: Request, res: Response) => {
  const { title, content } = req.body;

  let coverImage = "";

  if (req.file) {
    const result = await new Promise<any>((resolve, reject) => {
      const stream = cloudinary.uploader.upload_stream(
        { folder: "blogs" },
        (error, result) => {
          if (error) reject(error);
          else resolve(result);
        },
      );

      stream.end(req.file?.buffer);
    });

    coverImage = result.secure_url;
  }

  const blog = await Blog.create({
    title,
    content,
    coverImage,
  });

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
