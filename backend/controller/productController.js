import Product from "../models/productModel.js";
import ErrorHandler from "../utils/handleError.js"
import handleAsyncError from "../middleware/handleAsyncError.js"
import ApiFunctionality from "../utils/handleApiFunctionality.js"



//  Creating Products

export const createProducts = handleAsyncError(async (req, res, next) => {

    req.body.user = req.user.id

    const product = await Product.create(req.body)
    res.status(201).json({
        success: true,
        product
    })

})


// Get all products
export const getAllProducts = handleAsyncError(async (req, res, next) => {

    const resultPerPage = 4;
    const apiFeature = new ApiFunctionality(Product.find(), req.query).search().filter()

    // Getting filtered query count before pagination is applied
    const filteredProductsCount = await apiFeature.query.clone().countDocuments()
    const productsCount = await Product.countDocuments()

    // Calculate total pages based on filtered products count and results per page
    const totalPages = Math.ceil(filteredProductsCount / resultPerPage);
    const page = Number(req.query.page) || 1

    if (page > totalPages && filteredProductsCount > 0) {
        return next(new ErrorHandler("Page not found", 404))
    }

    // Apply pagination after counting, then execute the query
    apiFeature.pagination(resultPerPage)
    const products = await apiFeature.query

    if(!products || products.length ===0){
        return next(new ErrorHandler("No Product Found.",404))
    }



    res.status(200).json(
        {
            success: true,
            products,
            productsCount,
            filteredProductsCount,
            resultPerPage,
            totalPages,
            currentPage: page
        }
    )
})

// Update products

export const updateProducts = handleAsyncError(async (req, res, next) => {

    const product = await Product.findByIdAndUpdate(req.params.id, req.body, {

        returnDocument: 'after',
        runValidators: true
    })
    if (!product) {
        return next(new ErrorHandler("Product Not Found!", 404))
    }
    res.status(200).json({
        success: true,
        product
    })

})

// Delete products


export const deleteProducts = handleAsyncError(async (req, res, next) => {
    const product = await Product.findByIdAndDelete(req.params.id)
    if (!product) {
        return next(new ErrorHandler("Product Not Found!", 404))
    }
    res.status(200).json({
        success: true,
        message: "Product Deleted Successfully!"
    })

})


// Access single product

export const getSingleProduct = handleAsyncError(async (req, res, next) => {
    const product = await Product.findById(req.params.id)
    if (!product) {
        return next(new ErrorHandler("Product Not Found!.", 404))
    }
    res.status(200).json({
        success: true,
        product
    })

})

// Admin - Getting All Products

export const getAdminProducts = handleAsyncError(async(req,res,next)=>{
    const products = await Product.find()
    res.status(200).json({
        success: true,
        products
    })
    
})

// Admin - Creating and Updating review

export const createReview = handleAsyncError(async(req,res , next)=>{
    const {rating, comment} = req.body
    const review = {
        user: req.user._id,
        name: req.user.name,
        rating: Number(rating),
        comment
    }
    const productId = req.params.id
    const product = await Product.findById(productId)
    if (!product) {
    return next(new ErrorHandler("Product not found.", 404))
}
    const reviewExists = product.reviews.find(review => review.user.toString()=== req.user.id.toString())
    if (reviewExists){
        product.reviews.forEach(review=>{
            if(review.user.toString() === req.user.id.toString()){
                review.rating = Number(rating)
                review.comment = comment

            }
        })  

    }else{
        product.reviews.push(review)
    }
        product.numReviews = product.reviews.length

    let sum = 0
    product.reviews.forEach(review => {
        sum+= review.rating
    })
    product.ratings = product.reviews.length >0 ? sum/product.reviews.length : 0
    await product.save({validateBeforeSave:false})
res.status(200).json({
    success: true,
    product
})

})

// Delete review
export const deleteReview= handleAsyncError(async(req , res , next)=>{
    const product = await Product.findById(req.params.productId)
    if(!product){
        return next(new ErrorHandler("Product not found.", 404))
    }
    const reviews = product.reviews.filter(review => review._id.toString() !== req.query.reviewId.toString())
    let sum = 0
    reviews.forEach(review => {
        sum+= review.rating
    })
    const ratings = reviews.length>0?sum/reviews.length:0
    const numOfReviews = reviews.length
    await Product.findByIdAndUpdate(req.params.productId,{
        reviews,
        ratings,
        numOfReviews    
    },{
        returnDocument: 'after',
        runValidators: true
    }) 
    res.status(200).json({
        success: true,
        message: "Review Delete Successfully!"
    })
})

// Get All product reviews

export const getProductReview= handleAsyncError(async(req , res , next)=>{
    const product = await Product.findById(req.params.id)
    if(!product){
        return next(new ErrorHandler("Product not found.", 404))
    }
    res.status(200).json({
        success: true,
        reviews: product.reviews
    })
})