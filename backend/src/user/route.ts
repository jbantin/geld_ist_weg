import { Router } from "express";
import { prisma } from "../prisma"; // Pfad zur Prisma-Client-Instanz
import { comparePassword, hashPassword } from "../lib/crypto";

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
    //  todo
    //   jwt zurueck geben
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
