import mongoose from "mongoose"

const productSchema = new mongoose.Schema({
    name: {
        type: String,
        trim: true,
        required: [true , "Please enter Product name"]
    },
    description: {
        type: String,
        trim: true,
        required: [true , "Please enter Product description"]
    }, 
    price: {
        type: Number,
        trim: true,
        required: [true , "Please enter Product price"],
        maxLength: [7,"Price cannot exceed 7 digits"]
    },
    ratings: {
        type: Number,
        default: 0
    },
    image: [
        {
            public_id:{
            type: String,
            required: true
        },
            url:{
                type: String,
                required: true
            }
    }
    ],
    category:{
        type: String,
        required: [true, "Please Enter Product Category"]
    },
    stock:{
        type: Number,
        required: [true, "Please Enter Product Stock"],
        maxLength: [5,"Stock cannot exceed 5 digits"],
        default: 1
    },
    numbReviews:{
        type: Number,
        default: 0
    },
    reviews:[
        {
            name:{ 
                type: String,
                required: true
            },
            rating:{
                type: Number,
                required: true
            },
            comment:{
                type: String,
                required: true
            }
            
        }
    ],
    createdAt:{
        type: Date, 
        default: Date.now
    }
        
        
})

export default mongoose.model("Product", productSchema)