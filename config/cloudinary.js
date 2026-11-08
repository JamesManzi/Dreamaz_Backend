
import { v2 as cloudinary } from 'cloudinary';
import dotenv from 'dotenv';
import multer from 'multer';

dotenv.config();

// 1. Configure Cloudinary
cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
    secure: true
});

const upload = multer({
    storage: multer.memoryStorage(),

    limits: {
        fileSize: 30 * 1024 * 1024 // 30MB
    },

    fileFilter: (req, file, cb) => {

        if (
            file.mimetype.startsWith("image/") ||
            file.mimetype.startsWith("video/")
        ) {
            cb(null, true);
        } else {
            cb(new Error("Only images and videos are allowed!"), false);
        }
    }
});

export { cloudinary, upload };
