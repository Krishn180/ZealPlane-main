const path = require("path");
const fs = require("fs");
const { PdfConverter } = require("pdf-poppler");
const { v4: uuidv4 } = require("uuid");

const convertPdfToImages = async (pdfPath, cloudinary) => {
  const outputDir = path.join(__dirname, "../tmp", uuidv4());
  fs.mkdirSync(outputDir, { recursive: true });

  const opts = {
    format: "jpeg",
    out_dir: outputDir,
    out_prefix: "page",
    page: null,
    dpi: 150,
  };

  try {
    await PdfConverter.convert(pdfPath, opts);

    const imagePaths = fs.readdirSync(outputDir).filter(f => f.endsWith(".jpg"));
    const uploadedImages = [];

    for (const imgName of imagePaths) {
      const localImagePath = path.join(outputDir, imgName);
      const result = await cloudinary.uploader.upload(localImagePath, {
        folder: "pdf_pages",
        resource_type: "image",
      });
      uploadedImages.push(result.secure_url);
      fs.unlinkSync(localImagePath);
    }

    fs.rmdirSync(outputDir, { recursive: true });
    return uploadedImages;
  } catch (err) {
    console.error("Error during PDF to image conversion:", err);
    throw err;
  }
};

module.exports = convertPdfToImages;
