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

export {
  publishAVideo,
  getAllVideos,
  getAllUserVideos,
  deleteVideoById,
  VideoDataById,
  viewsIncrement
};
