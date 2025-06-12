import { Router } from "express";
import { publishAVideo, getAllVideos, getAllUserVideos, deleteVideoById, VideoDataById, viewsIncrement, searchVideos } from "../controllers/video.controller.js";
import { upload } from "../middlewares/multer.middleware.js";
import { verifyJWT } from "../middlewares/auth.middleware.js";

const router = Router();

const videoUpload = upload.fields([
    { name: 'thumbnail', maxCount: 1 },
    { name: 'videoFile', maxCount: 1 },
]);

// Public routes
router.route("/allVideo").get(getAllVideos);
router.route("/search").get(searchVideos);
router.route("/videoData/:id").get(VideoDataById);

// Protected routes
router.post("/publish", verifyJWT, videoUpload, publishAVideo);
router.get("/allUserVideo/:owner", verifyJWT, getAllUserVideos);
router.delete("/delete/:id", verifyJWT, deleteVideoById);
router.put("/incrementView/:id", verifyJWT, viewsIncrement);

export default router;