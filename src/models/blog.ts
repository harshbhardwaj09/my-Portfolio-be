import mongoose, { Schema, Document } from "mongoose";

const DEFAULT_COUNTER_SEED = [3, 5, 4] as const;

const getRandomSeed = () =>
  DEFAULT_COUNTER_SEED[Math.floor(Math.random() * DEFAULT_COUNTER_SEED.length)];

// Shape of blog document
export interface IBlog extends Document {
  title: string;
  content: string;
  coverImage: string;
  images: string[];
  author: string;
  isPublished: boolean;
  tags: string[];
  viewCount: number;
  likeCount: number;
}

// Schema = rules for data
const blogSchema: Schema<IBlog> = new Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true,
      minlength: 5,
    },
    coverImage: {
      type: String,
      default: "",
    },
    images: {
      type: [String],
      default: [],
    },
    content: {
      type: String,
      required: true,
    },
    author: {
      type: String,
      default: "Admin",
    },
    isPublished: {
      type: Boolean,
      default: false,
    },
    tags: {
      type: [String],
      default: [],
    },
    viewCount: {
      type: Number,
      default: getRandomSeed,
    },
    likeCount: {
      type: Number,
      default: getRandomSeed,
    },
  },
  {
    timestamps: true,
    versionKey: false,
  },
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
