import express from "express";
import { userRoute } from "./user/route.js";
import { dataRoute } from "./data/route.js";
import cors from "cors";
import { prisma } from "./prisma.js";
import cookieParser from "cookie-parser";
const PORT = 9001;
const app = express();

app.use(cors());
app.use(express.json());
app.use(cookieParser());

app.use("/user", userRoute);
app.use("/data", dataRoute);
app.use("*", (req, res, next) => {
  res.send("page not found !");
});
prisma
  .$connect()
  .then(() => console.log("Datenbank verbunden!"))
  .catch((error: any) => console.error("Verbindungsfehler:", error));

app.listen(PORT, () => {
  console.log(`server listens at port:${PORT}`);
});
