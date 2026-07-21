import multer from "multer";
import fs from "fs";
import path from "path";

//====================================================
// Upload Folder
//====================================================

const uploadPath = "D:\\RNAPlatform\\RNAUpload\\DriverDetails";

// Create folder if it doesn't exist

if (!fs.existsSync(uploadPath)) {
    fs.mkdirSync(uploadPath, { recursive: true });
}

//====================================================
// Storage
//====================================================

const storage = multer.diskStorage({

    destination: (req, file, cb) => {

        cb(null, uploadPath);

    },

    filename: (req, file, cb) => {

        const extension = path.extname(file.originalname);

        const uniqueFileName =
            `Driver_${Date.now()}_${Math.round(Math.random() * 100000)}${extension}`;

        cb(null, uniqueFileName);

    }

});

//====================================================
// File Filter
//====================================================

const fileFilter = (req, file, cb) => {

    const allowedExtensions = [
        ".jpg",
        ".jpeg",
        ".png",
        ".pdf"
    ];

    const extension = path
        .extname(file.originalname)
        .toLowerCase();

    if (!allowedExtensions.includes(extension)) {

        return cb(
            new Error("Only JPG, JPEG, PNG and PDF files are allowed."),
            false
        );

    }

    cb(null, true);

};

//====================================================
// Export
//====================================================

export const uploadDriverFiles = multer({

    storage,

    fileFilter,

    limits: {
        fileSize: 10 * 1024 * 1024 // 10 MB per file
    }

});