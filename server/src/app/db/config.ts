import mongoose from "mongoose";

const connectDB = async () => {
    try {
        // connect to local db if in dev environment
      const uri = process.env.NODE_ENVIRONMENT == "development" ? "mongodb://127.0.0.1:27017/google_oauth_app" : process.env.MONGODB_URI
      if (!uri) {
        throw new Error("MONGODB_URI is not defined");
      }
      const conn = await mongoose.connect(uri);
      console.log(`Connected to MongoDB successfully ${conn.connection.host}`);
    } catch (error) {
      console.log(error);
    }
  };
  
export default connectDB;

// Example for server.ts
// await connectDB();