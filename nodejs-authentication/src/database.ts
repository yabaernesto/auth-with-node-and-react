import mongoose from "mongoose";

const connect = async () => {
  if (!process.env.MONGODB_URL) {
    throw new Error("MONGODB_URL is not set!");
  }

  try {
    await mongoose.connect(process.env.MONGODB_URL as string);
    console.log("Connected MongoDB!");
  } catch (error) {
    console.error(error);
  }
};

export const userSchema = new mongoose.Schema({
  email: {
    type: String,
    require: true,
    unique: true,
  },
  password: {
    type: String,
    require: true,
  },
  firstName: {
    type: String,
    require: true,
  },
  lastName: {
    type: String,
    require: true,
  },
  age: {
    type: Number,
    require: true,
  },
});

export const UserModel = mongoose.model("Use", userSchema);

connect();
