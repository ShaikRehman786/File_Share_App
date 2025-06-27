import express from "express";
import router from "./routes/routes.js";
import cors from 'cors';
import DBConnection from "./database/db.js";
import dotenv from "dotenv";
import path from "path";

dotenv.config();

const app = express();

app.use(cors({
  origin: 'https://file-share-app-07dk.onrender.com',
  methods: ['GET', 'POST'],
}));

app.use((req, res, next) => {
  res.header("Access-Control-Allow-Origin", "https://file-share-app-07dk.onrender.com");
  res.header("Access-Control-Allow-Methods", "GET, POST");
  res.header("Access-Control-Allow-Headers", "Content-Type");
  next();
});

app.use(express.json());

// ✅ Serve static files from uploads directory
app.use('/uploads', express.static('uploads'));

app.use("/", router);

const PORT = process.env.PORT || 8000;

DBConnection();

app.listen(PORT, () => console.log(`Server is running on port ${PORT}`));
