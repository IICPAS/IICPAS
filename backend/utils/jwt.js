// utils/jwt.js
import jwt from "jsonwebtoken";

export function signJwt(id) {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN || "3d",
  });
}

export function verifyJwt(token) {
  return jwt.verify(token, process.env.JWT_SECRET);
}
