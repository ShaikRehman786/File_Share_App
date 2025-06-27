import File from "../models/file.js";
import path from "path";
import fs from "fs";
import { fileURLToPath } from 'url';

// Workaround for __dirname in ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export const uploadImage = async (request, response) => {
    const fileObj = {
        path: request.file.path,
        name: request.file.originalname
    };

    try {
        const file = await File.create(fileObj);

        const baseURL = process.env.BASE_URL || 'https://file-share-app-a9zd.onrender.com';

        response.status(200).json({ path: `${baseURL}/file/${file._id}` });
    } catch (error) {
        console.error("Upload Error:", error.message);
        response.status(500).json({ error: error.message });
    }
};

export const downloadImage = async (request, response) => {
    try {
        const file = await File.findById(request.params.fileId);

        if (!file) {
            return response.status(404).json({ error: "File not found in DB" });
        }

        file.downloadContent++;
        await file.save();

        const filePath = path.resolve(__dirname, '..', file.path);

        if (!fs.existsSync(filePath)) {
            return response.status(404).json({ error: "File missing on server" });
        }

        response.download(filePath, file.name);
    } catch (error) {
        console.error("Download Error:", error.message);
        response.status(500).json({ error: error.message });
    }
};
