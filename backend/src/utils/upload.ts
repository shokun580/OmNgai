import multer from "multer";
import path from "path";
import { fileURLToPath } from "url";
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const storageConfig = multer.diskStorage({
    destination: (req, file, cb) => {
        console.log(__dirname);
        cb(null, path.join(__dirname, "../uploads"))
    },
    filename: (req, file, cb) => {
        const uniqueName = Date.now() + "-" + file.originalname;
        cb(null, uniqueName);
    },
})

export const upload = multer({ storage: storageConfig });