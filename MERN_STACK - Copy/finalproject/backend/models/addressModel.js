import mongoose from "mongoose"

const addressSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.ObjectId,
        ref: "User",
        required: true
    },
    fullName: {
        type: String,
        trim: true,
        required: [true, "Please enter recipient name"]
    },
    phoneNumber: {
        type: String,
        trim: true,
        required: [true, "Please enter phone number"]
    },
    addressLine: {
        type: String,
        trim: true,
        required: [true, "Please enter address"]
    },
    city: {
        type: String,
        trim: true,
        required: [true, "Please enter city"]
    },
    state: {
        type: String,
        trim: true,
        default: ""
    },
    postalCode: {
        type: String,
        trim: true,
        default: ""
    },
    country: {
        type: String,
        trim: true,
        default: "Vietnam"
    },
    isDefault: {
        type: Boolean,
        default: false
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
})

export default mongoose.model("Address", addressSchema)