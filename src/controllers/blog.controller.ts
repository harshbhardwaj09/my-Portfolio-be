import { Request, Response } from "express";
import jwt from "jsonwebtoken";
import Blog from "../models/blog";

const COUNTER_SEED = [3, 5, 4] as const;
const getRandomCounter = () =>
  COUNTER_SEED[Math.floor(Math.random() * COUNTER_SEED.length)];

const normalizeCount = (value: unknown) =>
  typeof value === "number" && Number.isFinite(value) ? value : getRandomCounter();

const ensureBlogCounters = async (blog: any) => {
  const hasLike = typeof blog.likeCount === "number" && Number.isFinite(blog.likeCount);
  const hasView = typeof blog.viewCount === "number" && Number.isFinite(blog.viewCount);

  const likeCount = hasLike ? blog.likeCount : normalizeCount(undefined);
  const viewCount = hasView ? blog.viewCount : likeCount + 1;

  if (blog.viewCount !== viewCount || blog.likeCount !== likeCount) {
    await blog.updateOne({ viewCount, likeCount });
    blog.viewCount = viewCount;
    blog.likeCount = likeCount;
  }

  return { viewCount, likeCount };
};

const normalizeTags = (value: unknown): string[] => {
  if (Array.isArray(value)) {
    return value
      .map((item) => String(item).trim())
      .filter(Boolean);
  }

  if (typeof value !== "string") {
    return [];
  }

  const trimmed = value.trim();
  if (!trimmed) return [];

  // Accept JSON-like array string, e.g. '["a","b"]' or '[a,b]'
  if (trimmed.startsWith("[") && trimmed.endsWith("]")) {
    const inner = trimmed.slice(1, -1).trim();
    if (!inner) return [];

    return inner
      .split(",")
      .map((tag) => tag.trim().replace(/^['\"]|['\"]$/g, ""))
      .filter(Boolean);
  }

  // Fallback: comma-separated string
  if (trimmed.includes(",")) {
    return trimmed
      .split(",")
      .map((tag) => tag.trim())
      .filter(Boolean);
  }

  return [trimmed];
};

/* CREATE BLOG */
import cloudinary from "../config/cloudinary";
import { UploadApiResponse } from "cloudinary";

export const generateBlogWriteToken = async (req: Request, res: Response) => {
  const issueKey = process.env.BLOG_TOKEN_ISSUE_KEY;
  const tokenSecret = process.env.BLOG_TOKEN_SECRET;
  const providedKey = req.headers["x-issue-key"] || req.body.issueKey;

  if (!issueKey || !tokenSecret) {
    return res.status(500).json({
      message: "Server configuration error: BLOG_TOKEN_ISSUE_KEY or BLOG_TOKEN_SECRET missing",
    });
  }

  if (providedKey !== issueKey) {
    return res.status(401).json({ message: "Unauthorized: invalid issue key" });
  }

  const token = jwt.sign({ scope: "blog:write" }, tokenSecret, {
    expiresIn: "30m",
  });

  return res.json({
    token,
    tokenType: "Bearer",
    expiresIn: 1800,
  });
};

export const createBlog = async (req: Request, res: Response) => {
  const { title, content, author, tags } = req.body;
  const normalizedTags = normalizeTags(tags);

  let coverImage = "";
  let imageUrls: string[] = [];

  const files = req.files as {
    [fieldname: string]: Express.Multer.File[];
  };

  // 🔥 Cover Image Upload
  if (files?.coverImage?.[0]) {
    const result = await new Promise<any>((resolve, reject) => {
      const stream = cloudinary.uploader.upload_stream(
        { folder: "blogs/covers" },
        (error, result) => {
          if (error) reject(error);
          else resolve(result);
        },
      );

      stream.end(files.coverImage[0].buffer);
    });

    coverImage = result.secure_url;
  }

  // 🔥 Multiple Images Upload
  if (files?.images?.length) {
    for (const file of files.images) {
      const result = await new Promise<any>((resolve, reject) => {
        const stream = cloudinary.uploader.upload_stream(
          { folder: "blogs/images" },
          (error, result) => {
            if (error) reject(error);
            else resolve(result);
          },
        );

        stream.end(file.buffer);
      });

      imageUrls.push(result.secure_url);
    }
  }

  const blog = await Blog.create({
    title,
    content,
    coverImage,
    images: imageUrls,
    author,
    tags: normalizedTags,
  });

  return res.status(201).json(blog);
};

export const getAllBlogs = async (req: Request, res: Response) => {
  const page = Number(req.query.page) || 1;
  const limit = Number(req.query.limit) || 10;

  const skip = (page - 1) * limit;

  const blogs = await Blog.find()
    .sort({ createdAt: -1 })
    .skip(skip)
    .limit(limit);

  await Promise.all(blogs.map((blog) => ensureBlogCounters(blog)));

  const blogsResult = { blogs, total: await Blog.countDocuments() };

  return res.json(blogsResult);
};
export const getBlogById = async (req: Request, res: Response) => {
  const blog = await Blog.findById(req.params.id);

  if (!blog) {
    return res.status(404).json({ message: "Blog not found" });
  }

  await ensureBlogCounters(blog);

  return res.json(blog);
};
export const updateBlog = async (req: Request, res: Response) => {
  const payload = { ...req.body };

  if (Object.prototype.hasOwnProperty.call(payload, "tags")) {
    payload.tags = normalizeTags(payload.tags);
  }

  const updatedBlog = await Blog.findByIdAndUpdate(
    req.params.id, // Which blog
    payload, // What to update
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

export const incrementBlogRead = async (req: Request, res: Response) => {
  const blog = await Blog.findById(req.params.id);

  if (!blog) {
    return res.status(404).json({ message: "Blog not found" });
  }

  const counters = await ensureBlogCounters(blog);

  const updated = await Blog.findByIdAndUpdate(
    req.params.id,
    { $set: { likeCount: counters.likeCount }, $inc: { viewCount: 1 } },
    { new: true },
  );

  return res.json({
    viewCount: updated?.viewCount ?? counters.viewCount + 1,
    likeCount: updated?.likeCount ?? counters.likeCount,
  });
};

export const likeBlog = async (req: Request, res: Response) => {
  const blog = await Blog.findById(req.params.id);

  if (!blog) {
    return res.status(404).json({ message: "Blog not found" });
  }

  const counters = await ensureBlogCounters(blog);

  const updated = await Blog.findByIdAndUpdate(
    req.params.id,
    { $set: { viewCount: counters.viewCount }, $inc: { likeCount: 1 } },
    { new: true },
  );

  return res.json({
    viewCount: updated?.viewCount ?? counters.viewCount,
    likeCount: updated?.likeCount ?? counters.likeCount + 1,
  });
};

export const unlikeBlog = async (req: Request, res: Response) => {
  const existing = await Blog.findById(req.params.id);

  if (!existing) {
    return res.status(404).json({ message: "Blog not found" });
  }

  const counters = await ensureBlogCounters(existing);

  const blog = await Blog.findByIdAndUpdate(
    req.params.id,
    {
      $set: { viewCount: counters.viewCount },
      $inc: { likeCount: counters.likeCount > 0 ? -1 : 0 },
    },
    { new: true },
  );

  return res.json({
    viewCount: blog?.viewCount ?? counters.viewCount,
    likeCount: blog?.likeCount ?? counters.likeCount,
  });
};
