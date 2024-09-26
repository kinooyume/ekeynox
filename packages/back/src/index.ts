import { type Night, oea } from "common/index"

import express from "express";
const app = express();

const test : Night = true;
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

app.get("/", (req, res) => res.send(oea));

app.listen(5000, () =>
  console.log(`[bootup]: Server is running at port: 5000`),
);

