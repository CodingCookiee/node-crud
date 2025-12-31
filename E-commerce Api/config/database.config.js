import mongoose from "mongoose";
import dotenv from "dotenv";

dotenv.config();

export const connectToDatabase = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_CONNECT_URL);
    console.log("Connected to Mongodb");
  } catch (error) {
    console.error(" Mongodb Connection error", error);
    process.exit(1);
  }
};
