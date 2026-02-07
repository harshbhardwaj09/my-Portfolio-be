import mongoose, { Schema, Document } from "mongoose";

export interface IBlog extends Document {
  title: string;
  content: string;
  author: string;
}

const blogSchema: Schema<IBlog> = new Schema(
  {
    title: { type: String, required: true, trim: true },
    content: { type: String, required: true },
    author: { type: String, default: "Admin" }
  },
  { timestamps: true }
);

const Blog = mongoose.model<IBlog>("Blog", blogSchema);

export default Blog;
