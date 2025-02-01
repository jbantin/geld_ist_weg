"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.checkToken = void 0;
const prisma_1 = require("../../prisma");
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const checkToken = async (req, res, next) => {
    const token = req.cookies.jwt || req.body.token;
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
        const payload = jsonwebtoken_1.default.verify(token, secret); // Explicitly type the payload
        // Find the user in the database
        const user = await prisma_1.prisma.user.findUnique({
            where: { id: payload.id },
        });
        // Handle invalid user
        if (!user) {
            return res.status(400).json({ error: "Invalid token" }); // Send response and stop execution
        }
        // Attach the user to the request object
        req.user = user; // This will be available in the next middleware
        next(); // Proceed to the next middleware
    }
    catch (err) {
        // Handle token verification errors
        return res.sendStatus(403); // Send response and stop execution
    }
};
exports.checkToken = checkToken;
