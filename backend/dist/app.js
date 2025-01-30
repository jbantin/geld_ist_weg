"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const route_js_1 = require("./user/route.js");
const route_js_2 = require("./data/route.js");
const cors_1 = __importDefault(require("cors"));
const prisma_js_1 = require("./prisma.js"); // 1. Prisma-Client importieren
const PORT = 9001;
const app = (0, express_1.default)();
app.use((0, cors_1.default)());
app.use(express_1.default.json());
app.use("/user", route_js_1.userRoute);
app.use("/data", route_js_2.dataRoute);
app.use("*", (req, res, next) => {
    res.send("page not found !");
});
prisma_js_1.prisma
    .$connect()
    .then(() => console.log("Datenbank verbunden!"))
    .catch((error) => console.error("Verbindungsfehler:", error));
app.listen(PORT, () => {
    console.log(`server listens at port:${PORT}`);
});
