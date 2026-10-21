import mongoose from "mongoose";

export default async function connectDB() {
    if (!process.env.MONGO_URI) {
        throw new Error("MONGO_URI is missing from server/.env");
    }

    const connection = await mongoose.connect(process.env.MONGO_URI, {
        serverSelectionTimeoutMS: 15000,
    });

    console.log(`✅ MongoDB Atlas connected: ${connection.connection.name}`);
}