import express from 'express';
import {
  searchProducts,
  getProductById
} from "../controllers/product.js";

const router = express.Router();

router.get("/", searchProducts);
router.get("/:id", getProductById);

export default router;