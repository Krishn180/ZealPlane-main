const express = require("express");
const router = express.Router();
const productController = require("../../controllers/E-commerce controller/productcontroller");
const ValidateToken = require("../../midleware/validateTokenHandler");
const projectUpload = require("../../midleware/projectUpload");

router.post("/", ValidateToken, projectUpload.singleThumbnail, productController.createProduct);
router.get("/", productController.getAllProducts);
router.get("/:id", productController.getProductById);
router.put("/:id", productController.updateProduct);
router.delete("/:id", productController.deleteProduct);

module.exports = router;
