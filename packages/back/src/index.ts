import express from "express";

import userRouter from "./routes/userRouter";
const app = express();

app.use(express.urlencoded({ extended: true }));
app.use(express.json());

app.use("/user", userRouter);

app.listen(5000, () =>
  console.log(`[bootup]: Server is running at port: 5000`),
);
