import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";

export const authMiddleware = (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  if (!process.env.JWT_SECRET) {
    throw new Error("Environment Variables not found!");
  }

  try {
    const accessToken = req.headers.authorization?.split("Bearer ")[1];

    if (!accessToken) {
      return res.status(401).send({
        message: "Unauthorized",
      });
    }

    // decoded - payload sem estar no formato de token gerado pelo jwt
    const payload = jwt.verify(accessToken, process.env.JWT_SECRET) as {
      userId: string;
    };

    req.user = payload;

    next();
  } catch (error) {
    console.error(error);
    return res.status(500).send({
      message: "Internal server error",
    });
  }
};
