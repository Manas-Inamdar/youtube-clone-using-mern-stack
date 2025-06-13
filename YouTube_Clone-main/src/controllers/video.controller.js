import mongoose from "mongoose";
import { Video } from "../models/video.model.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { ApiError } from "../utils/ApiError.js";
import { uploadOnCloudinary } from "../utils/cloudinary.js";


// ********------------------video upload-------------------********

const publishAVideo = asyncHandler(async (req, res) => {
  const { title, description } = req.body;
  const thumbnailFile = req.files?.thumbnail?.[0];
  const videoFile = req.files?.videoFile?.[0];

  if (!title || !description || !thumbnailFile || !videoFile) {
    throw new ApiError(400, "All fields are required, including thumbnail and video files");
  }

  const thumbnailFilePath = await uploadOnCloudinary(thumbnailFile.path);
  const videoFilePath = await uploadOnCloudinary(videoFile.path);

  if (!thumbnailFilePath || !videoFilePath) {
    throw new ApiError(400, "File upload problem");
  }

  const video = await Video.create({
    title,
    description,
    thumbnail: thumbnailFilePath.url,
    videoFile: videoFilePath.url,
    owner: req.user._id,
    views: 0 // Initialize views to 0
  });

  return res.status(201).json(new ApiResponse(201, video, "Video published successfully"));
});

// ********------------------all video find-------------------********

const getAllVideos = asyncHandler(async (req, res) => {
  const videos = await Video.find();
  return res.status(200).json(new ApiResponse(200, videos, "Videos fetched successfully"));
});

// ********------------------all User video find-------------------********

const getAllUserVideos = asyncHandler(async (req, res) => {
  const { owner } = req.params;

  if (!owner || !mongoose.Types.ObjectId.isValid(owner)) {
    throw new ApiError(400, "Valid owner ID is required");
  }

  const userVideos = await Video.find({ owner });

  if (!userVideos.length) {
    return res.status(404).json(new ApiResponse(404, [], "No videos found for this user"));
  }

  return res.status(200).json(new ApiResponse(200, userVideos, "User videos fetched successfully"));
});

// ********------------------delete video by id-------------------********

const deleteVideoById = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const userId = req.user._id;

  if (!mongoose.Types.ObjectId.isValid(id)) {
    throw new ApiError(400, "Invalid video ID");
  }

  const video = await Video.findById(id);

  if (!video) {
    throw new ApiError(404, "Video not found");
  }

  if (video.owner.toString() !== userId.toString()) {
    throw new ApiError(403, "You are not authorized to delete this video");
  }

  await Video.findByIdAndDelete(id);

  return res.status(200).json(new ApiResponse(200, {}, "Video deleted successfully"));
});

// ********------------------video data by id-------------------********

const VideoDataById = asyncHandler(async (req, res) => {
  const { id } = req.params;

  if (!mongoose.Types.ObjectId.isValid(id)) {
    throw new ApiError(400, "Invalid video ID");
  }

  const video = await Video.findById(id);

  if (!video) {
    throw new ApiError(404, "Video not found");
  }

  return res.status(200).json(new ApiResponse(200, video, "Video fetched successfully"));
});

// -------------------------views increment---------------------------

const viewsIncrement = asyncHandler(async(req , res)=>{
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      throw new ApiError(400, "Invalid video ID");
    }

    const video = await Video.findById(id);

    if (!video) {
      throw new ApiError(404, "Video not found");
    }

    // If incrementViews is not defined, use this:
    video.views += 1;
    await video.save();

    return res.status(200).json(new ApiResponse(200, video, "Video Views Updated"));
})

// ********------------------search videos-------------------********

const searchVideos = asyncHandler(async (req, res) => {
    const q = req.query.q || "";
    // Search in title or description (case-insensitive)
    const videos = await Video.find({
        $or: [
            { title: { $regex: q, $options: "i" } },
            { description: { $regex: q, $options: "i" } }
        ]
    });
    res.status(200).json(new ApiResponse(200, videos, "Search results"));
});

// ********------------------like and unlike video-------------------********

const likeVideo = asyncHandler(async (req, res) => {
  try {
    const videoId = req.params.id;
    const userId = req.user._id;

    const video = await Video.findById(videoId);
    if (!video) return res.status(404).json({ message: "Video not found" });

    const alreadyLiked = video.likes.includes(userId);
    if (alreadyLiked) {
      video.likes.pull(userId);
    } else {
      video.likes.push(userId);
    }
    await video.save();

    res.json({ likes: video.likes.length, liked: !alreadyLiked });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// ********------------------get liked videos-------------------********

const getLikedVideos = asyncHandler(async (req, res) => {
  try {
    const userId = req.user._id;
    const likedVideos = await Video.find({ likes: userId });
    res.json({ videos: likedVideos });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

export {
  publishAVideo,
  getAllVideos,
  getAllUserVideos,
  deleteVideoById,
  VideoDataById,
  viewsIncrement,
  searchVideos,
  likeVideo,
  getLikedVideos
};
