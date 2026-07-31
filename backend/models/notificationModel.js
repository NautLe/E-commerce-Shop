import mongoose from "mongoose"

const notificationSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.ObjectId,
        ref: "User",
        required: true
    },
    title: {
        type: String,
        trim: true,
        required: [true, "Please enter notification title"]
    },
    message: {
        type: String,
        trim: true,
        required: [true, "Please enter notification message"]
    },
    type: {
        type: String,
        enum: ["order", "promotion", "system"],
        default: "system"
    },
    isRead: {
        type: Boolean,
        default: false
    },
    link: {
        type: String,
        default: ""
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
})

export default mongoose.model("Notification", notificationSchema)