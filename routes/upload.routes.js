import express from "express";
import { uploadProductImages } from "../controllers/upload.controller.js";
import { upload } from "../middleware/upload.middleware.js";
import {
  authenticateUser,
  authenticateAdmin,
} from "../middleware/auth.middleware.js";

const router = express.Router();

router.post(
  "/products",
  authenticateUser,
  authenticateAdmin,
  upload.array("images", 5),
  uploadProductImages
);

export default router;
