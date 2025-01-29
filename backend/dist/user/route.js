"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.userRoute = void 0;
const express_1 = require("express");
const prisma_1 = require("../prisma"); // Pfad zur Prisma-Client-Instanz
const crypto_1 = require("../lib/crypto");
exports.userRoute = (0, express_1.Router)();
// User erstellen
exports.userRoute.post("/register", async (req, res) => {
    try {
        const plainPassword = req.body.password;
        console.log(plainPassword);
        req.body.password = await (0, crypto_1.hashPassword)(plainPassword);
        const user = await prisma_1.prisma.user.create({ data: req.body });
        res.json(user);
    }
    catch (error) {
        console.error("Fehlerdetails:", error); // 👈 Fehler ausgeben
        res.status(500).json({ error: "Fehler beim Erstellen des Users" });
    }
});
exports.userRoute.post("/login", async (req, res) => {
    try {
        const user = await prisma_1.prisma.user.findUnique({
            where: { email: req.body.email },
        });
        if (!user) {
            throw new Error("user not found");
        }
        if (!(await (0, crypto_1.comparePassword)(req.body.password, user.password))) {
            throw new Error("wrong password");
        }
        //  todo
        //   jwt zurueck geben
        res.send(user);
    }
    catch (error) {
        console.error("Fehlerdetails:", error); // 👈 Fehler ausgeben
        res.status(500).json({ error: "Fehler beim Login" });
    }
});
// Alle User abrufen
exports.userRoute.get("/", async (req, res) => {
    const users = await prisma_1.prisma.user.findMany();
    res.json(users);
});
