import { Router } from "express";
import { prisma } from "../prisma"; // Pfad zur Prisma-Client-Instanz
import { comparePassword, hashPassword } from "../lib/crypto";
import { createJwt } from "../lib/jwt";

export const userRoute = Router();

// User erstellen
userRoute.post("/register", async (req, res) => {
  try {
    const plainPassword = req.body.password;
    console.log(plainPassword);
    req.body.password = await hashPassword(plainPassword);
    const user = await prisma.user.create({ data: req.body });
    res.json(user);
  } catch (error) {
    console.error("Fehlerdetails:", error); // 👈 Fehler ausgeben
    res.status(500).json({ error: "Fehler beim Erstellen des Users" });
  }
});

userRoute.post("/login", async (req, res) => {
  try {
    const user = await prisma.user.findUnique({
      where: { email: req.body.email },
    });
    if (!user) {
      throw new Error("user not found");
    }
    if (!(await comparePassword(req.body.password, user.password))) {
      throw new Error("wrong password");
    }

    const jwt = createJwt(user);
    res.cookie("jwt", jwt, {
      httpOnly: true,
      secure: true,
      sameSite: "lax",
      maxAge: 3600000,
    });
    res.send(user);
  } catch (error) {
    console.error("Fehlerdetails:", error); // 👈 Fehler ausgeben
    res.status(500).json({ error: "Fehler beim Login" });
  }
});

// Alle User abrufen
userRoute.get("/", async (req, res) => {
  const users = await prisma.user.findMany();
  res.json(users);
});
userRoute.post("/logout", async (req, res) => {
  res
    .clearCookie("jwt", {
      httpOnly: true,
      secure: false,
      sameSite: "lax",
    })
    .send("User logged out");
});
