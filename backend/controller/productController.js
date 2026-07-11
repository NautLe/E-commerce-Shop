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

    const resultPerPage = 3;
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

    if (!products || products.length === 0) {
        return next(new ErrorHandler("No products found", 404));
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

        new: true,
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