import cloudinary from "../config/cloudinary.config.js";
import { createError } from "../lib/createError.util.js";

export const uploadProductImages = async (req, res, next) => {
  try {
    if (!req.files || req.files.length === 0) {
      throw createError(400, "No files uploaded");
    }

    const uploadPromises = req.files.map((file) => {
      return new Promise((resolve, reject) => {
        const uploadStream = cloudinary.uploader.upload_stream(
          {
            folder: "products",
            resource_type: "image",
          },
          (error, result) => {
            if (error) reject(error);
            else resolve(result.secure_url);
          }
        );
        uploadStream.end(file.buffer);
      });
    });

    const imageUrls = await Promise.all(uploadPromises);

    res.status(200).json({
      success: true,
      message: "Images uploaded successfully",
      data: imageUrls,
    });
  } catch (error) {
    next(error);
  }
};
