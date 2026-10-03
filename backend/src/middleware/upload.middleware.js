import multer from "multer";

const storage = multer.memoryStorage();

const imageUpload = multer({
  storage,
  limits: { fileSize: 5 * 1024 * 1024, files: 5 },
  fileFilter: (req, file, cb) => {
    if (!file.mimetype.startsWith("image/")) {
      return cb(new Error("Product photos must be image files"));
    }
    cb(null, true);
  },
});

const reelUpload = multer({
  storage,
  limits: { fileSize: 50 * 1024 * 1024, files: 2 },
  fileFilter: (req, file, cb) => {
    const isVideo = file.fieldname === "video" && file.mimetype.startsWith("video/");
    const isThumbnail = file.fieldname === "thumbnail" && file.mimetype.startsWith("image/");
    if (!isVideo && !isThumbnail) {
      return cb(new Error("Upload a video file and an optional image thumbnail"));
    }
    cb(null, true);
  },
});

export const uploadProductImages = imageUpload.array("images", 5);
const parseReelMedia = reelUpload.fields([
  { name: "video", maxCount: 1 },
  { name: "thumbnail", maxCount: 1 },
]);

export const uploadReelMedia = (req, res, next) => {
  parseReelMedia(req, res, (error) => {
    if (error) return next(error);
    if (req.files?.thumbnail?.[0]?.size > 5 * 1024 * 1024) {
      return res.status(400).json({ success: false, message: "Thumbnail image cannot exceed 5 MB" });
    }
    next();
  });
};
