"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.createJwt = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const createJwt = (user) => {
    const payload = { id: user.id };
    const secret = process.env.JWT_SECRET;
    if (!secret) {
        throw new Error("JWT_SECRET is not defined");
    }
    return jsonwebtoken_1.default.sign(payload, secret);
};
exports.createJwt = createJwt;
