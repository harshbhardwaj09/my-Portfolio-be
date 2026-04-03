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
      default: undefined,
    },
    likeCount: {
      type: Number,
      default: undefined,
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

  // Seed counters if not present: default views should be likes + 1.
  const hasLike = typeof this.likeCount === "number" && Number.isFinite(this.likeCount);
  const hasView = typeof this.viewCount === "number" && Number.isFinite(this.viewCount);

  if (!hasLike && !hasView) {
    const seed = getRandomSeed();
    this.likeCount = seed;
    this.viewCount = seed + 1;
  } else if (!hasLike && hasView) {
    this.likeCount = Math.max(0, this.viewCount - 1);
  } else if (hasLike && !hasView) {
    this.viewCount = this.likeCount + 1;
  }

  // Tell MongoDB: continue saving
  next();
});

// Create model
const Blog = mongoose.model<IBlog>("Blog", blogSchema);

export default Blog;
