import { Router, Request } from "express";
import { prisma } from "../prisma"; // Pfad zur Prisma-Client-Instanz
import { comparePassword, hashPassword } from "../lib/crypto";
import { createJwt } from "../lib/jwt";
import { checkToken } from "../lib/middleware/checkToken";
import { sendEmail } from "../lib/sendEmail";

export const userRoute = Router();

// User erstellen
userRoute.post("/register", async (req, res) => {
  try {
    const plainPassword = req.body.password;
    req.body.password = await hashPassword(plainPassword);
    const user = await prisma.user.create({ data: req.body });
    const token = createJwt(user);
    sendEmail(user, token);
    res.json("verify your email");
  } catch (error) {
    console.error("Fehlerdetails:", error); // 👈 Fehler ausgeben
    res.status(500).json({ error: "Fehler beim Erstellen des Users" });
  }
});

userRoute.post(
  "/verify_email",
  (req, res, next) => {
    checkToken(req, res, next);
  },
  async (req: Request & { user?: any }, res) => {
    const updateUser = await prisma.user.update({
      where: { email: req.user.email },
      data: { verified: true },
    });

    res.json("verified");
  }
);

userRoute.post("/login", async (req, res) => {
  try {
    const user = await prisma.user.findUnique({
      where: { email: req.body.email },
    });
    if (!user?.verified) {
      throw new Error("user not verified");
    }
    if (!user) {
      throw new Error("user not found");
    }
    if (!(await comparePassword(req.body.password, user.password))) {
      throw new Error("wrong password");
    }

    const jwt = createJwt(user);
    res.cookie("jwt", jwt, {
      httpOnly: true,
      secure: false, // Setze dies auf true, wenn du HTTPS verwendest
      sameSite: "lax",
      maxAge: 3600000,
    });
    res.send(user);
  } catch (error) {
    console.error("Fehlerdetails:", error); // 👈 Fehler ausgeben
    res.status(500).json({ error });
  }
});

// Alle User abrufen
userRoute.get(
  "/",
  (req, res, next) => {
    checkToken(req, res, next);
  },
  async (req, res) => {
    const users = await prisma.user.findMany();

    res.json(users);
  }
);
userRoute.post("/logout", async (req, res) => {
  res
    .clearCookie("jwt", {
      httpOnly: true,
      secure: false,
      sameSite: "lax",
    })
    .send("User logged out");
});
