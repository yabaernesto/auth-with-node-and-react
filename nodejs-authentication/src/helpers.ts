import jwt from "jsonwebtoken";

const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export const isEmailValid = (email: string) => emailRegex.test(email);
export const isPasswordValid = (password: string) => password.length >= 6;

export const generateTokens = (userId: string) => {
  if (!process.env.JWT_SECRET || !process.env.JWT_SECRET_REFRESH) {
    throw new Error("Environment Variables not found!");
  }

  const accessToken = jwt.sign(
    {
      userId,
    },
    process.env.JWT_SECRET,
    {
      expiresIn: "15m",
    },
  );

  const refreshToken = jwt.sign({ userId }, process.env.JWT_SECRET_REFRESH, {
    expiresIn: "30d",
  });

  return {
    accessToken,
    refreshToken,
  };
};
