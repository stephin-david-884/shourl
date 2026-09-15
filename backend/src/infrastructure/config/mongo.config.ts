import mongoose from "mongoose";

export const connectDB = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI as string);
        console.log("MongoDB connected")
    } catch (error) {
        const message =
        error instanceof Error ? error.message : "Unknown error";

        console.error(`Database connection failed: ${message}`);
        process.exit(1);
    }
};