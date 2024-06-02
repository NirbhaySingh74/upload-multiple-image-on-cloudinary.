import express from "express";
import { showProduct, uploadProduct } from "../controller/productController.js";

const router = express.Router();

// Route to upload product
router.post("/upload", uploadProduct);
router.get("/showProduct", showProduct);
export default router;
