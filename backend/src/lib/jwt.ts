import jsonwebtoken from "jsonwebtoken";
import { User } from "@prisma/client";
export const createJwt = (user: User) => {
  const payload = { id: user.id };
  const secret = process.env.JWT_SECRET;
  if (!secret) {
    throw new Error("JWT_SECRET is not defined");
  }
  return jsonwebtoken.sign(payload, secret);
};
