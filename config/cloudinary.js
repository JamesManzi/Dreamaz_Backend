const cloudinary = require("cloudinary").v2;
const { CloudinaryStorage } = require("multer-storage-cloudinary-v2");
const multer = require("multer");

// 1. Connect Cloudinary
cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
});

// 2. Tell Multer to store files in Cloudinary
const storage = new CloudinaryStorage({
    cloudinary,
    params: {
        folder: "Dreamaz",
        resource_type: "auto",
        quality: "auto",
        fetch_format: "auto",
    },
});

// 3. Allow only images and videos
const fileFilter = (req, file, cb) => {
    if (
        file.mimetype.startsWith("image/") ||
        file.mimetype.startsWith("video/")
    ) {
        cb(null, true);
    } else {
        cb(new Error("Only images and videos are allowed."), false);
    }
};

// 4. Security limits
const upload = multer({
    storage,
    fileFilter,
    limits: {
        fileSize: 30 * 1024 * 1024, // 30MB
        files: 15,                  // maximum 15 files
    },
});

module.exports = { cloudinary, upload };