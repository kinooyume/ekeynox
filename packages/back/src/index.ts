// https://faun.pub/best-practices-for-organizing-your-express-js-project-a-guide-to-folder-structure-f990db979ee7
import "dotenv/config";
import express from "express";
import cors from "cors";

console.log(process.env.DATABASE_URL);
import usersRouter from "./routes/usersRouter";
import authRouter from "./routes/authRouter";

const app = express();

app
  .use(cors({ origin: "http://localhost:3000" }))
  .use(express.urlencoded({ extended: true }))
  .use(express.json())
  .use("/user", usersRouter)
  .use("/", authRouter);

app.listen(5000, () =>
  console.log(`[bootup]: Server is running at port: 5000`),
);
