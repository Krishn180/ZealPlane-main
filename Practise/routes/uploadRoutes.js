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

// ----------------------
// Cloudinary Config
// ----------------------
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

// ----------------------
// Multer Setup
// ----------------------
const storage = multer.diskStorage({
  destination: "uploads/",
  filename: (req, file, cb) => cb(null, Date.now() + "-" + file.originalname),
});
const upload = multer({ storage });

// ----------------------
// ROUTE: Upload File
// ----------------------
router.post("/", ValidateToken, upload.single("file"), async (req, res) => {
  try {
    const { projectId, type } = req.body;

    if (!projectId) {
      return res
        .status(400)
        .json({ success: false, error: "Project ID is required." });
    }

    const filePath = req.file.path;
    const ext = path.extname(filePath).toLowerCase();
    const folderPath = `comics/${projectId}`;

    // ------------------------------------------------
    // 🖼️ NON-PDF Upload → Direct Cloudinary Upload
    // ------------------------------------------------
    if (ext !== ".pdf") {
      const uploadResult = await cloudinary.uploader.upload(filePath, {
        folder: folderPath,
      });

      fs.unlinkSync(filePath);

      const url = uploadResult.secure_url;
      const fieldToUpdate = type === "comic" ? "comicPages" : "thumbnailImages";

      await Project.findOneAndUpdate(
        { projectId },
        { $push: { [fieldToUpdate]: url } },
        { new: true }
      );

      return res.json({
        success: true,
        projectId,
        url,
        field: fieldToUpdate,
      });
    }

    // ------------------------------------------------
    // 📘 PDF → Convert to JPG pages using Poppler
    // ------------------------------------------------
const outputDir = "uploads/pdf_images";
if (!fs.existsSync(outputDir)) fs.mkdirSync(outputDir, { recursive: true });

const baseName = path.basename(filePath, ".pdf");
const outputPrefix = path.join(outputDir, baseName);

// Windows Poppler path (your existing one)
const pdftoppmPath =
  '"C:\\Users\\Krishna Kumar\\Downloads\\Release-25.07.0-0\\poppler-25.07.0\\Library\\bin\\pdftoppm.exe"';

// ✅ Auto Switch: If running on Linux (VPS), use global pdftoppm
let finalPdftoppmPath = pdftoppmPath;
if (process.platform !== "win32") {
  finalPdftoppmPath = "/usr/bin/pdftoppm"; // Linux path
}

// ⭐ FIX: Use finalPdftoppmPath, not the Windows hardcoded one
const cmd = `${finalPdftoppmPath} -jpeg "${filePath}" "${outputPrefix}-%d"`;

console.log("Running Poppler:", cmd);

await execPromise(cmd);

// ⭐ FIX: Filter correctly for numbered images
const imageFiles = fs
  .readdirSync(outputDir)
  .filter((f) => f.startsWith(baseName + "-"));

    // Upload each image to Cloudinary
    const uploads = await Promise.all(
      imageFiles.map((img) =>
        cloudinary.uploader.upload(path.join(outputDir, img), {
          folder: folderPath,
        })
      )
    );

    const urls = uploads.map((u) => u.secure_url);

    // Save to DB
    await Project.findOneAndUpdate(
      { projectId },
      { $push: { comicPages: { $each: urls } } },
      { new: true }
    );

    // Cleanup local files
    fs.unlinkSync(filePath);
    imageFiles.forEach((f) => fs.unlinkSync(path.join(outputDir, f)));

    // Done
    res.json({
      success: true,
      projectId,
      urls,
      field: "comicPages",
    });
  } catch (err) {
    console.error("Comic upload error:", err);
    res.status(500).json({ success: false, error: err.message });
  }
});

module.exports = router;
