import mongoose from "mongoose";

const contactSchema = new mongoose.Schema(
    {
        name: {
            type: String,
            required: [true, "Please enter your name"],
            trim: true
        },
        email: {
            type: String,
            required: [true, "Please enter your email"],
            trim: true
        },
        subject: {
            type: String,
            default: "General Inquiry",
            trim: true
        },
        message: {
            type: String,
            required: [true, "Please enter message"],
            trim: true
        },
        status: {
            type: String,
            default: "Pending",
            enum: ["Pending", "Read", "Responded"]
        }
    },
    {
        timestamps: true
    }
);

export default mongoose.model("Contact", contactSchema);
