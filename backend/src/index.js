import app from "./app.js";
import dotenv from "dotenv";
import connectDB from "./db/index.js";
import express from "express";
import cors from "cors";

dotenv.config();

const PORT = process.env.PORT || 8000;

// const allowedOrigins = [
//   /http:\/\/(localhost|127\.0\.0\.1)(:\\d+)?$/,
// ];

// const corsOptions = {
//   origin: (origin, callback) => {
//     // if (!origin) return callback(null, true); 
//     // const ok = allowedOrigins.some((o) => (o instanceof RegExp ? o.test(origin) : o === origin));
//     // callback(ok ? null : new Error("Not allowed by CORS"), ok);
//   },
//   methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
//   credentials: true,
// };

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
