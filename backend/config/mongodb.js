import mongoose from "mongoose";

const connectDB = async () => {
  const isProduction = process.env.NODE_ENV === "production";

  console.log(
    `Connecting to MongoDB (${isProduction ? "PRODUCTION" : "LOCAL"})...`
  );

  const mongoURI = isProduction
    ? `${process.env.MONGODB_URI}/MERN` // Production
    : process.env.MONGODB_URI; // Local

  mongoose.connection.on("connected", () => {
    console.log(
      `MongoDB Connected Successfully (${
        isProduction ? "PRODUCTION" : "LOCAL"
      })`
    );
  });

  await mongoose.connect(mongoURI);
};

export default connectDB;
