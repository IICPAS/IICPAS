import jwt from "jsonwebtoken";

export const generateToken = (college) => {
  return jwt.sign(
    {
      id: college._id,
      role: "college",
      name: college.name,
      email: college.email,
      status: college.status,
    },
    process.env.JWT_SECRET,
    { expiresIn: "7d" }
  );
};
