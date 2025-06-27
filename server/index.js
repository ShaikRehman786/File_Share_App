import express from "express";
import router from "./routes/routes.js";
import cors from "cors";
import DBConnection from "./database/db.js";
import dotenv from "dotenv";
import path from "path";
import fs from "fs";
import { fileURLToPath } from "url";

dotenv.config();

// Setup __dirname for ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();

// Ensure uploads directory exists
const uploadDir = path.join(__dirname, "uploads");
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir);
}

// CORS for Render frontend
app.use(cors({
  origin: 'https://file-share-app-07dk.onrender.com',
  methods: ['GET', 'POST'],
}));

// Extra headers for strict CORS control
app.use((req, res, next) => {
  res.header("Access-Control-Allow-Origin", "https://file-share-app-07dk.onrender.com");
  res.header("Access-Control-Allow-Methods", "GET, POST");
  res.header("Access-Control-Allow-Headers", "Content-Type");
  next();
});

app.use(express.json());

// Serve uploaded files
app.use("/uploads", express.static(uploadDir));

app.use("/", router);

const PORT = process.env.PORT || 8000;
DBConnection();

app.listen(PORT, () => console.log(`✅ Server running on port ${PORT}`));
