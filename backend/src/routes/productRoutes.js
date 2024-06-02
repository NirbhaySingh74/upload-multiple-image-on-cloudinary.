import express from "express";
import { uploadProduct } from "../controller/productController.js";

const router = express.Router();

// Route to upload product
router.post("/upload", uploadProduct);

export default router;
