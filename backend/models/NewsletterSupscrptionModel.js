import mongoose from "mongoose";

const subscriptionSchema = new mongoose.Schema(
    {
       
        email: {
            type: String,
            required: [true, "Please enter your email"],
            trim: true
        
        }
    })

export default mongoose.model("NewsletterSubscription", subscriptionSchema);
