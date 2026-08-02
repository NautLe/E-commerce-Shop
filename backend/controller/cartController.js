import handleAsyncError from "../middleware/handleAsyncError.js"

// 
export const getCart = handleAsyncError(async (req, res, next) => {
    if (!req.session.cart) {
        req.session.cart = []
    }
    res.status(200).json({
        success: true,
        cartItems: req.session.cart
    })
})

// 
export const addToCart = handleAsyncError(async (req, res, next) => {
    const { productId, name, price, image, quantity, size, stock} = req.body

    if (!req.session.cart) {
        req.session.cart = []
    }

    const existingItem = req.session.cart.find(item => item.productId === productId && (item.size === size || (!item.size && !size)))

    if (existingItem) {
        existingItem.quantity += quantity
        existingItem.stock = stock 
        if (image) {
            existingItem.image = image
        }
    } else {
        req.session.cart.push({ productId, name, price, image, quantity, size: size || 'S', stock })
    }

    res.status(200).json({
        success: true,
        cartItems: req.session.cart
    })
})

// 
export const updateCartItem = handleAsyncError(async (req, res, next) => {
    const { productId, quantity } = req.body

    if (!req.session.cart) {
        req.session.cart = []
    }

    const item = req.session.cart.find(item => item.productId === productId)
    if (item) {
        item.quantity = quantity
    }

    res.status(200).json({
        success: true,
        cartItems: req.session.cart
    })
})

// remove from cart
export const removeFromCart = handleAsyncError(async (req, res, next) => {
    const { productId } = req.params

    if (!req.session.cart) {
        req.session.cart = []
    }

    req.session.cart = req.session.cart.filter(item => item.productId !== productId)

    res.status(200).json({
        success: true,
        cartItems: req.session.cart
    })
})

// clean cart after placed order
export const clearCart = handleAsyncError(async (req, res, next) => {
    req.session.cart = []
    res.status(200).json({
        success: true,
        cartItems: []
    })
})