import express from "express";

const app = express();

app.use(express.json())
app.use(express.urlencoded({extended:true}))

import router from "./routes/index.js"

app.use("/api/v1", router);


export default app;
