import mongoose from "mongoose";

const connectDB = async () => {
  mongoose.connection.on("connected", () => {
    console.log("DB connected");
  });

  // Automatically choose which DB to use
  const mongoURI =
    process.env.NODE_ENV === "production"
      ? `${process.env.MONGODB_URI}/MERN` // Production DB
      : process.env.MONGODB_URI; // Local DB

  await mongoose.connect(mongoURI);
};

export default connectDB;
