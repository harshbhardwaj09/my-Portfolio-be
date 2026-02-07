import mongoose from "mongoose";

// Function responsible for connecting MongoDB
const connectDB = async (): Promise<void> => {
  try {
    // MongoDB URI is read from environment variables
    await mongoose.connect(process.env.MONGO_URI as string);

    console.log("MongoDB Connected Successfully");
  } catch (error) {
    console.error("MongoDB Connection Failed", error);

    // Exit process if database connection fails
    process.exit(1);
  }
};

export default connectDB;
