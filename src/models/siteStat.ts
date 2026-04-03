import mongoose, { Document, Schema } from "mongoose";

export interface ISiteStat extends Document {
  key: string;
  count: number;
}

const siteStatSchema: Schema<ISiteStat> = new Schema(
  {
    key: {
      type: String,
      required: true,
      unique: true,
      trim: true,
    },
    count: {
      type: Number,
      default: 0,
    },
  },
  {
    timestamps: true,
    versionKey: false,
  },
);

const SiteStat = mongoose.model<ISiteStat>("SiteStat", siteStatSchema);

export default SiteStat;
