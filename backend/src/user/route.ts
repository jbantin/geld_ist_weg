import { Router } from "express";
import { prisma } from "../prisma"; // Pfad zur Prisma-Client-Instanz

export const userRoute = Router();

// User erstellen
userRoute.post("/", async (req, res) => {
  try {
    const user = await prisma.user.create({ data: req.body });
    res.json(user);
  } catch (error) {
    console.error("Fehlerdetails:", error); // 👈 Fehler ausgeben
    res.status(500).json({ error: "Fehler beim Erstellen des Users" });
  }
});

// Alle User abrufen
userRoute.get("/", async (req, res) => {
  const users = await prisma.user.findMany();
  res.json(users);
});
