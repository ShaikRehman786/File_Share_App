import File from "../models/file.js";
import path from "path";
import fs from "fs";
import { fileURLToPath } from "url";

// Handle __dirname in ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export const uploadImage = async (req, res) => {
  if (!req.file) {
    return res.status(400).json({ error: "No file uploaded." });
  }

  const fileObj = {
    path: req.file.path,
    name: req.file.originalname,
  };

  try {
    const file = await File.create(fileObj);
    const baseURL = process.env.BASE_URL || "https://file-share-app-a9zd.onrender.com";

    return res.status(200).json({ path: `${baseURL}/file/${file._id}` });
  } catch (error) {
    console.error("Upload Error:", error.message);
    return res.status(500).json({ error: "Failed to upload file" });
  }
};

export const downloadImage = async (req, res) => {
  try {
    const file = await File.findById(req.params.fileId);
    if (!file) return res.status(404).json({ error: "File not found" });

    const fullPath = path.resolve(__dirname, "..", file.path);
    if (!fs.existsSync(fullPath)) {
      return res.status(404).json({ error: "File not found on server" });
    }

    file.downloadContent++;
    await file.save();

    return res.download(fullPath, file.name);
  } catch (error) {
    console.error("Download Error:", error.message);
    return res.status(500).json({ error: "Failed to download file" });
  }
};
