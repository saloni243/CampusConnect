import multer from "multer";
import path from "path";
import fs from "fs";

const resumePath = "uploads/resumes";

if (!fs.existsSync(resumePath)) {
    fs.mkdirSync(resumePath, { recursive: true });
}

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, resumePath);
    },

    filename: (req, file, cb) => {
        cb(
            null,
            Date.now() + "-" + Math.round(Math.random() * 1E9) + path.extname(file.originalname)
        );
    }
});

const fileFilter = (req, file, cb) => {
    if (file.mimetype === "application/pdf") {
        cb(null, true);
    } else {
        cb(new Error("Only PDF files are allowed"), false);
    }
};

export const upload = multer({
    storage,
    fileFilter,
    limits: {
        fileSize: 5 * 1024 * 1024
    }
});

