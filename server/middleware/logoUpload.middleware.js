import multer from "multer";
import path from "path";
import fs from "fs";

const logoPath = "uploads/companyLogo";

if (!fs.existsSync(logoPath)) {
    fs.mkdirSync(logoPath, { recursive: true });
}

const storage = multer.diskStorage({

    destination: (req, file, cb) => {
        cb(null, logoPath);
    },

    filename: (req, file, cb) => {
        cb(
            null,
            Date.now() +
            "-" +
            Math.round(Math.random() * 1E9) +
            path.extname(file.originalname)
        );
    }

});

const fileFilter = (req, file, cb) => {

    if (
        file.mimetype === "image/png" ||
        file.mimetype === "image/jpeg" ||
        file.mimetype === "image/jpg" ||
        file.mimetype === "image/webp"
    ) {

        cb(null, true);

    } else {

        cb(new Error("Only Image files are allowed"), false);

    }

};

export const logoUpload = multer({

    storage,

    fileFilter,

    limits: {

        fileSize: 2 * 1024 * 1024

    }

});