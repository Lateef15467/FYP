import mongoose from "mongoose";

const connectDB = async () => {
  mongoose.connection.on("connected", () => {
    console.log("DB connected");
  });

  // for production
  await mongoose.connect(`${process.env.MONGODB_URI}/MERN`);
};
export default connectDB;
