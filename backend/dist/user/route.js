"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.userRoute = void 0;
const express_1 = require("express");
const prisma_1 = require("../prisma"); // Pfad zur Prisma-Client-Instanz
exports.userRoute = (0, express_1.Router)();
// User erstellen
exports.userRoute.post("/", async (req, res) => {
    try {
        const user = await prisma_1.prisma.user.create({ data: req.body });
        res.json(user);
    }
    catch (error) {
        console.error("Fehlerdetails:", error); // 👈 Fehler ausgeben
        res.status(500).json({ error: "Fehler beim Erstellen des Users" });
    }
});
// Alle User abrufen
exports.userRoute.get("/", async (req, res) => {
    const users = await prisma_1.prisma.user.findMany();
    res.json(users);
});
