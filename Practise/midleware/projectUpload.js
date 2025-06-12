const cloudinary = require("cloudinary").v2;
const { CloudinaryStorage } = require("multer-storage-cloudinary");
const multer = require("multer");

// Cloudinary config
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

// Create Cloudinary storage with dynamic behavior
const dynamicStorage = new CloudinaryStorage({
  cloudinary,
  params: async (req, file) => {
    const isPdf = file.mimetype === "application/pdf";
    const filename = file.originalname.split('.')[0].replace(/\s+/g, "-").replace(/[^\w-]/g, "");
    return {
      folder: isPdf ? "project_pdfs" : "project_images",
      public_id: `${Date.now()}-${filename}`,
      resource_type: "auto", // allows both images and PDFs
      format: isPdf ? "pdf" : undefined,
    };
  },
});

// File filter: allow images + PDF
const fileFilter = (req, file, cb) => {
  const allowedTypes = [
    "image/jpeg", "image/png", "image/gif", "image/webp",
    "image/bmp", "image/tiff", "image/svg+xml", "image/x-icon",
    "image/heif", "image/heic", "image/avif", "application/pdf"
  ];
  if (allowedTypes.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(new Error("Only image or PDF files are allowed."));
  }
};

// Upload limits
const upload = multer({
  storage: dynamicStorage,
  fileFilter,
  limits: { fileSize: 10 * 1024 * 1024 }, // 10MB per file
});

// Original variable names retained
const projectUpload = {
  singleThumbnail: upload.single("thumbnailImage"),     // 1 image
  multipleImages: upload.array("additionalImages", 10), // up to 10 images
  singleThumbnailOrPdf: upload.single("file"),          // 1 image or pdf
};

module.exports = projectUpload;
