import mongoose from "mongoose";
import validator from "validator";
import bcryptjs from "bcryptjs";
import jwt from "jsonwebtoken";
import crypto from "crypto";

const userSchema = new mongoose.Schema({
    name:{
        type: String,
        required: [true, "Please enter your name"],
        maxLength: [25, "Name cannot exceed 25 characters"],
        minLength: [3, "Name should have more than 3 characters"]
    },
    email:{
        type: String,
        required: [true, "Please enter your email"],
        unique: true,
        validate: [validator.isEmail, "Please enter a valid email"]
    },
    password: {
        type: String,
        required: [true, "Please enter your password"],
        validate: [
            validator.isStrongPassword,
            "Password must be at least 8 characters long and include an uppercase letter, lowercase letter, number, and special character"
        ],
        select: false
    },
    avatar:{
        public_id: {
            type: String,
            required: true
        },
        url: {
            type: String,
            required: true
        }
    },
    role: {
        type: String,
        default: "user",
        enum: ["user", "admin"],
    },
    isVerified: {
        type: Boolean,
        default: false
    },
    otpCode: String,
    otpExpire: Date,
    resetPasswordToken: String,
    resetPasswordExpire: Date,
}, {
    timestamps: true
});

// Hashing password before saving user
userSchema.pre("save", async function(){
    if(!this.isModified("password")){
        return;
    }
    this.password = await bcryptjs.hash(this.password, 10);
});

userSchema.methods.getJWTToken = function(){
    return jwt.sign({id: this._id}, process.env.JWT_SECRET_KEY, {
        expiresIn: process.env.JWT_EXPIRE
    });
};

userSchema.methods.verifyPassword = async function (enteredPassword){
    return await bcryptjs.compare(enteredPassword, this.password);
};

// Generating Reset Token (Link-based)
userSchema.methods.generateResetPasswordToken = function(){
    const resetToken = crypto.randomBytes(20).toString("hex");
    this.resetPasswordToken = crypto.createHash("sha256").update(resetToken).digest("hex");
    this.resetPasswordExpire = Date.now() + 15 * 60 * 1000;
    return resetToken;
};

// Generating 6-Digit OTP Code
userSchema.methods.generateOTPCode = function(){
    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    this.otpCode = crypto.createHash("sha256").update(otp).digest("hex");
    this.otpExpire = Date.now() + 10 * 60 * 1000; // 10 minutes
    return otp;
};

export default mongoose.model("User", userSchema);
