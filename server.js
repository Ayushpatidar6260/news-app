import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import jwt from "jsonwebtoken";
import router from "./routes/route.js";

const app = express();
const port = 3000;

app.use(express.json());
app.use(cors());
app.use("/", router);

mongoose
  .connect("mongodb://127.0.0.1:27017/Android")
  .then(() => {
    console.log("MongoDb is connected");
  })
  .catch((error) => {
    console.log("connection failed", error);
  });

app.listen(port, () => {
  console.log(`server is started on http://localhost:${port}`);
});
