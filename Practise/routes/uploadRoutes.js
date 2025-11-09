const express = require("express");
const multer = require("multer");
const fs = require("fs");
const path = require("path");
const cloudinary = require("cloudinary").v2;
const { exec } = require("child_process");
const util = require("util");
const execPromise = util.promisify(exec);
const ValidateToken = require("../midleware/validateTokenHandler");
const Project = require("../models/projectModel");
const router = express.Router();

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

const storage = multer.diskStorage({
  destination: "uploads/",
  filename: (req, file, cb) => cb(null, Date.now() + "-" + file.originalname),
});
const upload = multer({ storage });

router.post("/", ValidateToken, upload.single("file"), async (req, res) => {
  try {
    const { projectId, type } = req.body; 
    // 👆 optional "type" field to distinguish if upload is 'comic' or 'image'

    if (!projectId) {
      return res.status(400).json({ success: false, error: "Project ID is required." });
    }

    const filePath = req.file.path;
    const ext = path.extname(filePath).toLowerCase();
    const folderPath = `comics/${projectId}`;

    // 🖼️ Non-PDF → Upload directly
    if (ext !== ".pdf") {
      const result = await cloudinary.uploader.upload(filePath, { folder: folderPath });
      fs.unlinkSync(filePath);

      // ✅ Upload to correct field based on type
      const fieldToUpdate = type === "comic" ? "comicPages" : "thumbnailImages";

   await Project.findOneAndUpdate(
  { projectId }, // find by projectId field
  { $push: { comicPages: { $each: urls } } },
  { new: true }
);

      return res.json({ success: true, projectId, urls: [result.secure_url], field: fieldToUpdate });
    }

    // 📘 PDF → Convert to JPG pages, then upload
// 📘 PDF → Convert to JPG pages, then upload
const outputDir = "uploads/pdf_images";
if (!fs.existsSync(outputDir)) fs.mkdirSync(outputDir, { recursive: true });

const outputPrefix = path.join(outputDir, path.basename(filePath, ".pdf"));
const pdftoppmPath = `"C:\\Users\\Krishna Kumar\\Downloads\\Release-25.07.0-0\\poppler-25.07.0\\Library\\bin\\pdftoppm.exe"`;
const cmd = `${pdftoppmPath} -jpeg "${filePath}" "${outputPrefix}"`;

console.log("Running:", cmd);

// ✅ Properly await conversion
await execPromise(cmd);

// After conversion finishes:
const imageFiles = fs
  .readdirSync(outputDir)
  .filter((f) => f.startsWith(path.basename(filePath, ".pdf")));

const uploads = await Promise.all(
  imageFiles.map((img) =>
    cloudinary.uploader.upload(path.join(outputDir, img), { folder: folderPath })
  )
);

// 🧹 Cleanup
fs.unlinkSync(filePath);
imageFiles.forEach((f) => fs.unlinkSync(path.join(outputDir, f)));

const urls = uploads.map(u => u.secure_url);

await Project.findOneAndUpdate(
  { projectId }, // query by your custom field
  { $push: { comicPages: { $each: urls } } },
  { new: true }
);

res.json({ success: true, projectId, urls, field: "comicPages" });


  } catch (err) {
    console.error("Comic upload error:", err);
    res.status(500).json({ success: false, error: err.message });
  }
});

module.exports = router;
