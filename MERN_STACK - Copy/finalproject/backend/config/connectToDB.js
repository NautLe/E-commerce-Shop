import mongoose from "mongoose"
import Coupon from "../models/couponModel.js"

export const connectToDB = async() =>{
    try{
        const data = await mongoose.connect(process.env.DB_URL);
        console.log(`MongoDB Connected: ${data.connection.host}`);

        
    } catch (error) {
        console.log(error.message);
    }
}