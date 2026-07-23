import multer from "multer";
import fs from "fs";
import path from "path";

const uploadPath = "E:\\RNAPlatform\\RNAUpload\\excelUpload";

// Create folder if it doesn't exist
if (!fs.existsSync(uploadPath)) {
    fs.mkdirSync(uploadPath, { recursive: true });
}

const storage = multer.diskStorage({

    destination: (req, file, cb) => {
        cb(null, uploadPath);
    },

    filename: (req, file, cb) => {

        const extension = path.extname(file.originalname);

        const fileName =
            `RouteExcel_${Date.now()}${extension}`;

        cb(null, fileName);
    }

});

export const upload = multer({

    storage,

    fileFilter: (req, file, cb) => {

        const allowedExtensions = [".xlsx", ".xls"];

        const extension = path.extname(file.originalname).toLowerCase();

        if (!allowedExtensions.includes(extension)) {

            return cb(
                new Error("Only Excel (.xlsx, .xls) files are allowed."),
                false
            );

        }

        cb(null, true);

    },

    limits: {
        fileSize: 10 * 1024 * 1024 // 10 MB
    }

});