import mongoose, { Schema, Document } from "mongoose";

// Shape of blog document
export interface IBlog extends Document {
  title: string;
  content: string;
  author: string;
  isPublished: boolean;
  tags: string[];
}

// Schema = rules for data
const blogSchema: Schema<IBlog> = new Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true,
      minlength: 5
    },
    content: {
      type: String,
      required: true
    },
    author: {
      type: String,
      default: "Admin"
    },
    isPublished: {
      type: Boolean,
      default: false
    },
    tags: {
      type: [String],
      default: []
    }
  },
  {
    timestamps: true,
    versionKey: false
  }
);

/* Runs BEFORE saving document */
blogSchema.pre("save", function (next) {
  // Remove extra spaces from title
  this.title = this.title.trim();

  // Tell MongoDB: continue saving
  next();
});

// Create model
const Blog = mongoose.model<IBlog>("Blog", blogSchema);

export default Blog;
