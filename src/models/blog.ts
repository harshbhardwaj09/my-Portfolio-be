import mongoose, { Schema, Document } from "mongoose";

// TypeScript interface defining Blog document structure
export interface IBlog extends Document {
  title: string;
  content: string;
  author: string;
}

// MongoDB schema defining document blueprint
const blogSchema: Schema<IBlog> = new Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true // removes extra spaces
    },
    content: {
      type: String,
      required: true
    },
    author: {
      type: String,
      default: "Admin"
    }
  },
  {
    timestamps: true // adds createdAt and updatedAt automatically
  }
);

// Mongoose model used to interact with the database
const Blog = mongoose.model<IBlog>("Blog", blogSchema);

export default Blog;
