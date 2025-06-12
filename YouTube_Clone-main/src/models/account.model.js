import mongoose, { Schema } from "mongoose";
import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";


const userSignUp = new Schema(
    {
        name:{
            type:String,
            required:true,
            unique: true,
            trim: true,
            index: true
        },
        email:{
            type:String,
            required:true,
            unique: true,
            lowercase: true,
            trim: true 
        },
        password:{
            type:String,
            required:true
        },
        avatar:{
            type:String
        },
        watchHistory:[
            {
                type : Schema.Types.ObjectId,
                ref: "video"
            }
        ],
        refreshToken:{
            type: String
        }
    },
    {
        timestamps:true
    }
)


// Hash password before saving
userSignUp.pre("save", async function (next) {
    if (!this.isModified("password")) return next();
    this.password = await bcrypt.hash(this.password, 10);
    next();
});


// Method to compare the entered password with the stored hashed password
userSignUp.methods.isPasswordCorrect = async function (password) {
    return bcrypt.compare(password, this.password);
};

userSignUp.methods.generateAccessToken = function(){
    return jwt.sign(
        {
            _id: this._id,
            email: this.email,
            name: this.name
        },
        process.env.ACCESS_TOKEN_SECRET,
        {
            expiresIn: process.env.ACCESS_TOKEN_EXPIRY
        }
    )
}
userSignUp.methods.generateRefreshToken = function(){
    return jwt.sign(
        {
            _id: this._id,
            
        },
        process.env.REFRESH_TOKEN_SECRET,
        {
            expiresIn: process.env.REFRESH_TOKEN_EXPIRY
        }
    )
}


export const User = mongoose.model("User", userSignUp);