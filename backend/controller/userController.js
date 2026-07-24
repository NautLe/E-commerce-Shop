import handleAsyncError from "../middleware/handleAsyncError.js";
import User from "../models/userModel.js";
import ErrorHandler from "../utils/handleError.js";
import { sendToken } from "../utils/handleJwtToken.js";
import { sendEmail } from "../utils/sendEmail.js";
import crypto from "crypto"
import {v2 as cloudinary} from 'cloudinary'

// register user
export const userRegister = handleAsyncError(async(req, res, next) => {         
    const { name, email, password, avatar} = req.body
    const uploadResult = await cloudinary.uploader.upload(avatar,{
        folder: 'avatar',
        width: 150,
        crop: 'scale'
    })

    const user = await User.create({
        name,
        email,
        password,
        avatar: {
            public_id: uploadResult.public_id,
            url: uploadResult.secure_url
        }
    })
    res.status(201).json({
        success: true,
        message: "Registration successful. Please log in.",
        user
    })
})

// Login User

export const userLogin = handleAsyncError(async(req,res,next) => {
    const { email, password } = req.body
    if(!email || !password){
        return next(new ErrorHandler("Please enter email and password", 400))

}
const user = await User.findOne({email}).select("+password")

if (!user){
    return next(new ErrorHandler("Invalid email or password.", 401))
}
 const isPasswordMatched = await user.verifyPassword(password)
    if (!isPasswordMatched){
        return next(new ErrorHandler("Invalid email or password.", 401))
    }

    sendToken(user, 200, res)

})

// Logout User

export const userLogout = handleAsyncError(async(req,res,next) => 
    {
        res.cookie("token", null, {
            expires: new Date(Date.now())
        })  
        res.status(200).json({
            success: true,
            message: "Logged out successfully"
        })
    })

    // reset password link
export const requestPasswordReset = handleAsyncError(async(req,res,next) => {

    const {email} = req.body
    const user = await User.findOne({email})    
    if (!user){
        return next(new ErrorHandler("User not found with this email", 404))
    }
    
    let resetToken 
    try{
        resetToken = user.generateResetPasswordToken()
        await user.save({validateBeforeSave: false})
    }
    catch(error){
        return next(new ErrorHandler(`Error occurred while saving reset token: ${error.message}`, 500))
    }
    
    const resetPasswordUrl = `${req.protocol}://${req.get('host')}/reset/${resetToken}`

    const message = `Your password reset token is as follows:\n\n${resetPasswordUrl}\n\n This Link will expire in 15 mins. If you have not requested this email, please ignore this.`
    try{
        // sendEmail
        await sendEmail({
            email: user.email,
            subject: "Password Recovery Request",
            message 
        })
        res.status(200).json({
            success: true,
            message: `We have sent an Email to ${user.email} successfully. Please check your email.`
        })
    } catch (error){
        user.resetPasswordToken = undefined
        user.resetPasswordExpire = undefined
        await user.save({validateBeforeSave: false})
        return next(new ErrorHandler("Email could not be sent. Please try again later", 500))
    }

})  

    //Reset Password
export const resetPassword = handleAsyncError(async(req,res,next)=>{
    const resetPasswordToken = crypto.createHash("sha256").update(req.params.token).digest("hex")
    const user  = await User.findOne({
        resetPasswordToken,
        resetPasswordExpire: {$gt: Date.now()}
    })
    if(!user){
        return next(new ErrorHandler("Token is incorrect or has been expired. Please try again.", 400))
    }
    const {password, confirmPassword} = req.body
    if (!password || !confirmPassword){
        return next(new ErrorHandler("Please enter password and confirm Password.", 400))
    }
    if (password !== confirmPassword){
        return next(new ErrorHandler("Password does not match.", 400))

    }
    user.password = password
    user.resetPasswordToken = undefined
    user.resetPasswordExpire = undefined
    await user.save()
    sendToken (user,200,res)

   
})

    // Get user detail
    export const getUserDetail = handleAsyncError(async(req,res, next)=>{
        const user = await User.findById(req.user.id)
        res.status(200).json({
            success: true,
            user
        })        
    })


    // Update Password

export const updatePassword = handleAsyncError(async(req,res, next)=>{
    const {oldPassword, newPassword , confirmPassword} = req.body

    if(newPassword !== confirmPassword){
        return next(new ErrorHandler("Password doesn't match ", 400))
    }
    const user = await User.findById(req.user.id).select('+password')

    const checkPasswordMatched= await user.verifyPassword(oldPassword)

    if(!checkPasswordMatched){
        return next(new ErrorHandler("Old password is incorrect. Try Again", 400))
    }
    
    user.password = newPassword
    await user.save()
    sendToken(user,200,res)

})

//Update Profile user 

export const updateProfile = handleAsyncError(async(req,res, next)=>{
    const {name, email, avatar} = req.body
    const updateUserProfile={
        name, email,
    }
    if( avatar && avatar!==''){
        const user = await User.findById(req.user.id)
        const imageId = user.avatar.public_id
        await cloudinary.uploader.destroy(imageId)
        const uploadResult = await cloudinary.uploader.upload(avatar,{
            folder:'avatar',
            width: 150,
            crop: 'scale'
        })
        updateUserProfile.avatar={
            public_id: uploadResult.public_id,
            url:uploadResult.secure_url
        }
    }
    //findByIdAndUpdate(id, updateData, options)
    const user = await User.findByIdAndUpdate(req.user.id, updateUserProfile, {
        returnDocument: 'after',
        runValidators: true
    })
    res.status(200).json({
        success:true,
        message: "Profile is updated successfully.",
        user
    })
})

// Admin - get user information

export const getUserProfile = handleAsyncError(async(req,res, next)=>{
    const users = await User.find()
    res.status(200).json({
        success: true,
        users
    })
})

// Admin - get single user information

export const getSingleUser = handleAsyncError(async(req,res, next)=>{
    const user = await User.findById(req.params.id)
    if(!user){
        return next(new ErrorHandler(`User doesn't exist with this id : ${req.params.id}`,400   ))
    }
    res.status(200).json({
        success: true,
        user
    })
})

// Admin - update user role

export const updateUserRole = handleAsyncError(async(req,res, next)=>{
    const {role} = req.body
    const newUserData = {
        role
    }
    const user= await User.findByIdAndUpdate(req.params.id, newUserData,{
        returnDocument: 'after',
        runValidators: true
    })
    if(!user){
        return next(new ErrorHandler("User with this id doesn't exist", 400))
    }
    res.status(200).json({
        success: true,  
        user

    })
})


// Admin delete - user

export const deleteUser = handleAsyncError(async(req,res,next)=>{
        const user = await User.findByIdAndDelete(req.params.id)

    if(!user){
        return next(new ErrorHandler("User doesn't exist", 400))
    }
        res.status(200).json({
            success: true,
            message: "User deleted successfully"
        })
    })
