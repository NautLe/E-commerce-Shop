import Product from "../models/productModel.js";
import ErrorHandler from "../utils/errorHandler.js"
import handleAsyncError from "../middleware/handleAsyncError.js"
import ApiFunctionality from "../utils/apiFunctionality.js"



//  Creating Products

export const createProducts =  handleAsyncError(async (req,res, next) =>{

        const product = await Product.create(req.body)
        res.status(201).json({
            success: true,
            product  
    })
   
})


// Get all products
export const getAllProducts = handleAsyncError(async (req,res, next)=>{
    const apiFeature = new ApiFunctionality(Product.find(), req.query).search()
        const products = await apiFeature.query
        res.status(200).json(
            {
                success: true,
                products
            }
        )
    })

// Update products

export const updateProducts = handleAsyncError(async (req,res, next) =>{

           const product = await Product.findByIdAndUpdate(req.params.id, req.body, {
            
            new:true,
            runValidators: true
           })
           if(!product) {
             return next(new ErrorHandler("Product Not Found!",404))
           }
           res.status(200).json({
               success: true,
               product
            }) 
    
    })

// Delete products


export const deleteProducts  =  handleAsyncError(async (req,res, next) => {
            const product = await Product.findByIdAndDelete(req.params.id)
           if(!product){
            return next(new ErrorHandler("Product Not Found!",404))
           }
            res.status(200).json({
                success: true,
                message: "Product Deleted Successfully!"
            })
    
    })


// Access single product

export const getSingleProduct = handleAsyncError(async (req, res, next) => {
        const product = await Product.findById(req.params.id)
        if (!product) 
        {
            return next(new ErrorHandler("Product Not Found!.", 404))
        }            
        res.status(200).json({
            success: true,
            product
        })
   
    })