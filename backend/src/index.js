import app from "./app.js";
import dotenv from "dotenv";
import connectDB from "./db/index.js";
import express from "express";
import cors from "cors";

dotenv.config();

const PORT = process.env.PORT || 8000;

app.use(cors());
app.use(express.json());

connectDB()
  .then(() => {
    app.listen(PORT, () => console.log(`Server is running on port: ${PORT}`));
  })
  .catch((err) => {
    console.error("Mongodb connection error", err);
    process.exit(1);
  });
