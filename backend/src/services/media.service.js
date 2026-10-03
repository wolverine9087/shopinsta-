import cloudinary from "../config/cloudinary.js";
import streamifier from "streamifier";


// ==========================================
// Upload file to Cloudinary
// ==========================================
export const uploadToCloudinary = (buffer,options = {}) => {
  return new Promise((resolve, reject) => {
    if (!buffer) {
      return reject(new Error("File buffer is required"));
    }

    const uploadStream = cloudinary.uploader.upload_stream(
      {
        folder: options.folder || "reel-commerce",
        resource_type: options.resourceType || "auto",
      },
      (error, result) => {
        if (error) {
          return reject(error);
        }

        resolve(result);
      }
    );

    streamifier
      .createReadStream(buffer)
      .pipe(uploadStream);
  });
};


// ==========================================
// Upload image
// ==========================================
export const uploadImage = async (buffer,folder = "reel-commerce/images") => {
    const result = await uploadToCloudinary(buffer, {
    folder,
    resourceType: "image",
  });

  return {
    url: result.secure_url,
    publicId: result.public_id,
  };
};


// ==========================================
// Upload video
// ==========================================
export const uploadVideo = async (buffer,folder = "reel-commerce/videos") => {
  const result = await uploadToCloudinary(buffer, {
    folder,
    resourceType: "video",
  });

  return {
    url: result.secure_url,
    publicId: result.public_id,
  };
};


// ==========================================
// Delete file from Cloudinary
// ==========================================
export const deleteFromCloudinary = async (publicId,resourceType = "image") => {
  if (!publicId) {
    return;
  }

  const result = await cloudinary.uploader.destroy(
    publicId,
    {
      resource_type: resourceType,
    }
  );

  return result;
};
