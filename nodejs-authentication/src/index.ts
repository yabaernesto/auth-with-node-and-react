import "dotenv/config";
import express from "express";
import bcrypt from "bcryptjs";
import jwt, { JsonWebTokenError } from "jsonwebtoken";
import cors from "cors";

import "./database";
import { UserModel } from "./database";
import { generateTokens, isEmailValid, isPasswordValid } from "./helpers";
import { authMiddleware } from "./middlewares";

const app = express();

app.use(express.json());
app.use(cors());

app.get("/profile", authMiddleware, async (req, res) => {
  const user = await UserModel.findOne({
    _id: req.user.userId,
  });

  return res.json({ user });
});

app.post("/register", async (req, res) => {
  try {
    const { firstName, lastName, age, email, password } = req.body;

    if (!isEmailValid(email)) {
      return res.status(404).send({
        message: "Invalid email",
      });
    }

    if (!isPasswordValid(password)) {
      return res.status(404).send({
        message: "Invalid password",
      });
    }

    const userAlreadyExists = await UserModel.findOne({
      email,
    });

    const hashedPassword = bcrypt.hashSync(password, 10);

    if (userAlreadyExists) {
      throw new Error("User already exists.");
    }

    const user = await UserModel.create({
      email,
      password: hashedPassword,
      firstName,
      lastName,
      age,
    });

    return res.status(201).send({
      email,
      tokens: generateTokens(user._id.toString()),
    });
  } catch (error) {
    console.error(error);
    return res.status(500).send({
      message: "Internal server error",
    });
  }
});

app.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await UserModel.findOne({
      email,
    });

    if (!user) {
      return res.status(400).json({
        message: "Invalid email or password",
      });
    }

    const isPasswordValid = bcrypt.compare(password, user.password!);

    if (!isPasswordValid) {
      return res.status(400).json({
        message: "Invalid email or password",
      });
    }

    return res.status(200).json({
      email,
      tokens: generateTokens(user._id.toString()),
    });
  } catch (error) {
    console.error(error);
    return res.status(500).send({
      message: "Internal server error",
    });
  }
});

app.post("/refresh-token", (req, res) => {
  try {
    if (!process.env.JWT_SECRET_REFRESH) {
      throw new Error("Environment Variables not found!");
    }

    const { refreshToken } = req.body;

    const tokenPayload = jwt.verify(
      refreshToken,
      process.env.JWT_SECRET_REFRESH,
    ) as { userId: string };

    const tokens = generateTokens(tokenPayload.userId);

    return res.status(200).json(tokens);
  } catch (error) {
    console.error(error);
    if (error instanceof JsonWebTokenError) {
      return res.status(401).json({
        message: "Unauthorized",
      });
    }

    return res.status(500).json({
      message: "Internal server error",
    });
  }
});

app.listen(8080, () => {
  console.log("Server is running on http://localhost:8080");
});
