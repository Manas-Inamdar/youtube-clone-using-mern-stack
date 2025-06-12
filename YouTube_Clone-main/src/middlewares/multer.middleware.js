import multer from "multer";
import path from "path";

// Define storage configuration
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "./public/temp"); // Specify the destination directory for uploaded files
  },
  filename: function (req, file, cb) {
    // Generate a unique filename for uploaded files
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    const extension = path.extname(file.originalname); // Extract file extension
    cb(null, file.fieldname + '-' + uniqueSuffix + extension); // Construct filename
  }
});

// Optional: Only allow images and videos
const fileFilter = (req, file, cb) => {
  const allowedTypes = /jpeg|jpg|png|gif|mp4|mov|avi|mkv/;
  const ext = path.extname(file.originalname).toLowerCase();
  if (allowedTypes.test(ext)) {
    cb(null, true);
  } else {
    cb(new Error("Only image and video files are allowed!"), false);
  }
};

// Initialize Multer with the storage configuration
export const upload = multer({ 
  storage: storage,
  limits: { fileSize: 10 * 1024 * 1024 }, // Optional: Limit file size to 10MB
  fileFilter // <-- add this line if you want to restrict file types
});
