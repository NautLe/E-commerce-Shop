import mongoose from "mongoose"

const paymentSchema = new mongoose.Schema({
    order: {
        type: mongoose.Schema.ObjectId,
        ref: "Order",
        required: true
    },
    user: {
        type: mongoose.Schema.ObjectId,
        ref: "User",
        required: true
    },
    stripeSessionId: {
        type: String,
        required: true
    },
    paymentIntentId: {
        type: String,
        default: ""
    },
    amount: {
        type: Number,
        required: true
    },
    currency: {
        type: String,
        default: "usd"
    },
    status: {
        type: String,
        enum: ["pending", "succeeded", "failed", "refunded"],
        default: "pending"
    },
    paidAt: {
        type: Date
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
})

export default mongoose.model("Payment", paymentSchema)