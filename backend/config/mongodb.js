import mongoose from "mongoose";

const connectDB = async () => {
  mongoose.connection.on("connected", () => {
    console.log("DB connected");
  });

  // Use production DB by default
  // await mongoose.connect(`${process.env.MONGODB_URI}/MERN`);

  // If you want to use local DB during development,

  await mongoose.connect(process.env.MONGODB_URI);
};

export default connectDB;
