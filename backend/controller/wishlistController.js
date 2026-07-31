import Wishlist from "../models/wishlistModel.js"
import ErrorHandler from "../utils/handleError.js"
import handleAsyncError from "../middleware/handleAsyncError.js"

// Get user's wishlist
export const getWishlist = handleAsyncError(async (req, res, next) => {
    let wishlist = await Wishlist.findOne({ user: req.user.id }).populate("products.product")
    if (!wishlist) {
        wishlist = await Wishlist.create({ user: req.user.id, products: [] })
    }
    res.status(200).json({
        success: true,
        wishlist
    })
})

// Add product to wishlist
export const addToWishlist = handleAsyncError(async (req, res, next) => {
    const { productId } = req.body
    if (!productId) {
        return next(new ErrorHandler("Please provide a product id", 400))
    }

    let wishlist = await Wishlist.findOne({ user: req.user.id })
    if (!wishlist) {
        wishlist = await Wishlist.create({ user: req.user.id, products: [] })
    }

    const alreadyExists = wishlist.products.find(
        (item) => item.product.toString() === productId
    )
    if (alreadyExists) {
        return next(new ErrorHandler("Product already in wishlist", 400))
    }

    wishlist.products.push({ product: productId })
    await wishlist.save()

    res.status(200).json({
        success: true,
        wishlist
    })
})

// Remove product from wishlist
export const removeFromWishlist = handleAsyncError(async (req, res, next) => {
    const { productId } = req.params
    const wishlist = await Wishlist.findOne({ user: req.user.id })
    if (!wishlist) {
        return next(new ErrorHandler("Wishlist not found", 404))
    }

    wishlist.products = wishlist.products.filter(
        (item) => item.product.toString() !== productId
    )
    await wishlist.save()

    res.status(200).json({
        success: true,
        wishlist
    })
})