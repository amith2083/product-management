import express from "express";
import {
  createProduct,
  deleteProduct,
  getAllProducts,
  getProduct,
  updateProduct,
} from "../controllers/productController.js";
import { upload } from "../middlewares/upload.js";
import { adminAuth } from "../middlewares/adminAuth.js";

const router = express.Router();

router.post("/", adminAuth, upload.single("image"), createProduct);
router.get("/", getAllProducts);
router.get("/:id", getProduct);
router.put("/:id", adminAuth, upload.single("image"), updateProduct);
router.delete("/:id", adminAuth, deleteProduct);

export default router;
