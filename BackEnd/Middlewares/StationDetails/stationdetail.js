import multer from "multer";
import fs from "fs";
import path from "path";

const uploadPath = "D:/RNAPlatform/RNAUpload/StationDetails";

//==================================================
// Create Folder if not Exists
//==================================================

if (!fs.existsSync(uploadPath)) {
    fs.mkdirSync(uploadPath, { recursive: true });
}

//==================================================
// Storage
//==================================================

const storage = multer.diskStorage({

    destination: (req, file, cb) => {

        cb(null, uploadPath);

    },

    filename: (req, file, cb) => {

        const uniqueName =
            `${Date.now()}-${Math.round(Math.random() * 100000)}${path.extname(file.originalname)}`;

        cb(null, uniqueName);

    }

});

//==================================================
// Allowed File Types
//==================================================

const allowedExtensions = /jpg|jpeg|png|pdf/i;

const fileFilter = (req, file, cb) => {

    const extension = path.extname(file.originalname).toLowerCase();

    const mimeType =
        /image\/jpeg|image\/jpg|image\/png|application\/pdf/i.test(file.mimetype);

    if (allowedExtensions.test(extension) && mimeType) {

        cb(null, true);

    } else {

        cb(
            new Error(
                "Only JPG, JPEG, PNG and PDF files are allowed."
            ),
            false
        );

    }

};

//==================================================
// Multer
//==================================================

export const stationUpload = multer({

    storage,

    fileFilter,

    limits: {

        fileSize: 10 * 1024 * 1024 // 10 MB

    }

});