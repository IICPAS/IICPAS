import jwt from "jsonwebtoken";

export const signJwt = (userId, email, name, image) =>
  jwt.sign(
    { _id: userId, email: email, name: name, image: image },
    process.env.JWT_SECRET,
    {
      expiresIn: process.env.JWT_EXPIRES_IN || "3d",
    }
  );

export const cookieOptions = {
  httpOnly: true,
  secure: process.env.NODE_ENV === "production",
  sameSite: process.env.NODE_ENV === "production" ? "None" : "Lax",
  maxAge: 3 * 24 * 60 * 60 * 1000,
};
