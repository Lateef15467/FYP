import mongoose from "mongoose";

const connectDB = async () => {
  mongoose.connection.on("connected", () => {
    console.log("DB connected");
  });

  // for production
  await mongoose.connect(`${process.env.MONGODB_URI}/MERN`);
<<<<<<< HEAD
=======
  // for local development
  // await mongoose.connect(process.env.MONGODB_URI);
>>>>>>> ffcdbbe3ca25adc56f3e78c8501fe6f9ac7d14e0
};
export default connectDB;
