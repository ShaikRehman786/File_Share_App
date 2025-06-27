import express from "express";
import router from "./routes/routes.js";
import cors from 'cors';
import DBConnection from "./database/db.js";

const app = express();

app.use(cors({
  origin: 'https://file-share-app-07dk.onrender.com', // Your frontend URL
  methods: ['GET', 'POST'],
}));

app.use(express.json());
app.use("/", router);

const PORT = process.env.PORT || 8000;


DBConnection();

app.listen(PORT, () => console.log(`Server is running on port ${PORT}`));
