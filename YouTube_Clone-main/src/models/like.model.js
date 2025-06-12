import mongoose, {Schema} from "mongoose";


const likeSchema = new Schema({
    video: {
        type: Schema.Types.ObjectId,
        ref: "Video"
    },
    likedBy: {
        type: Schema.Types.ObjectId,
        ref: "newUser" // Use your actual user model name
    }
}, {timestamps: true})

export const Like = mongoose.model("Like", likeSchema)