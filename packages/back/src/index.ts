import express from "express";
import { PrismaClient } from "@prisma/client";

import userRouter from "./routes/user";
const app = express();
const prisma = new PrismaClient();

app.use(express.urlencoded({ extended: true }));
app.use(express.json());

app.use("/user", userRouter);

app.listen(5000, () =>
  console.log(`[bootup]: Server is running at port: 5000`),
);
