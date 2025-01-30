import { Request, Response, NextFunction } from "express";
import { prisma } from "../../prisma";
import jwt from "jsonwebtoken";

// Extend the Request type to include the `user` property
declare module "express" {
  interface Request {
    user?: any; // Replace `any` with the actual type of your user object
  }
}

export const checkToken = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const token = req.cookies.jwt;

  // Handle missing token
  if (!token) {
    return res.status(401).json({ error: "No token provided" }); // Send response and stop execution
  }

  const secret = process.env.JWT_SECRET;

  // Handle missing JWT secret
  if (!secret) {
    return res.sendStatus(500); // Send response and stop execution
  }

  try {
    // Verify the token
    const payload = jwt.verify(token, secret) as { id: number }; // Explicitly type the payload

    // Find the user in the database
    const user = await prisma.user.findUnique({
      where: { id: payload.id },
    });

    // Handle invalid user
    if (!user) {
      return res.status(400).json({ error: "Invalid token" }); // Send response and stop execution
    }

    // Attach the user to the request object
    req.user = user; // This will be available in the next middleware

    next(); // Proceed to the next middleware
  } catch (err) {
    // Handle token verification errors
    return res.sendStatus(403); // Send response and stop execution
  }
};
