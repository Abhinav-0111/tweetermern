import express from "express";
import dotenv from "dotenv";
import Connection from "./config/database.js";
import route from "./route/route.js";
import cors from "cors";
import bodyParser from "body-parser";
import path from "path";

const __dirname = path.resolve();
const app = express();
dotenv.config();
app.use(cors());
app.use(bodyParser.json({ extended: true }));
app.use(bodyParser.urlencoded({ extended: true }));
app.use("/", route);
app.get("/", (req, res) => {
    app.use(express.static(path.resolve(__dirname, "frontend", "build")));
    res.sendFile(path.resolve(__dirname, "frontend", "build", "index.html"));
});

Connection();
const port = process.env.PORT || 9000;

app.listen(port, () => {
    console.log(`Server running Successfully on port ${process.env.PORT}`);
});
