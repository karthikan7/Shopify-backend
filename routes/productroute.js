const express = require("express");
const router = express.Router();
const multer = require("multer");
const { getProducts, getProductById, createProduct, updateProduct, deleteProduct } = require("../controllers/productcontroller");
const { protect, admin } = require("../middleware/authmiddaleware");


const upload = multer({ storage: multer.memoryStorage() });


router.get("/", getProducts);
router.get("/:id", getProductById);


router.post("/", protect, admin, upload.single("image"), createProduct);
router.put("/:id", protect, admin, upload.single("image"), updateProduct);
router.delete("/:id", protect, admin, deleteProduct);

module.exports = router;