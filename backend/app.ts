import express from "express";
import { userRoute } from "./user/route.js";
import { dataRoute } from "./data/route.js";
import cors from "cors";
const PORT = 9001;

const app = express();

app.use(cors());
app.use(express.json());

app.use("/user", userRoute);
app.use("/data", dataRoute);

app.listen(PORT, () => {
  console.log(`server listens at port:${PORT}`);
});
