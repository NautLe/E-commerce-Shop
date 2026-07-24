import Order from "../models/orderModel.js";  
import Product from "../models/productModel.js";  
import User from "../models/userModel.js";  
import ErrorHandler from "../utils/handleError.js"
import handleAsyncError from "../middleware/handleAsyncError.js"


// Create new order

export const createOrder = handleAsyncError(async(req,res,next)=>{
    const {shippingInfo,orderItems,paymentInfo,itemPrice,taxPrice,shippingPrice,totalPrice} = req.body
    const order = await Order.create({
        shippingInfo,
        orderItems,
        paymentInfo,
        itemPrice,
        taxPrice,
        shippingPrice,
        totalPrice,
        paidAt: Date.now(),
        orderStatus: "Processing",
        user: req.user._id
    })
    res.status(201).json({
        success: true,
        order
    })
})  


// admin - get single order
export const getOrder = handleAsyncError(async(req,res,next)=>{
    const order = await Order.findById(req.params.id).populate("user", "name email")
    if(!order){
        return next(new ErrorHandler("Order not found.", 404))
    }
    res.status(200).json({
        success:true,
        order
    })
})

// Get all user orders
export const getUserOrder = handleAsyncError(async(req,res,next)=>{
    const orders = await Order.find({user:req.user._id})
    if(orders.length === 0){
        return next(new ErrorHandler("You have no orders yet.", 404))
    }
    res.status(200).json({
        success: true,
        orders
    })
    })

// amin - get all order
export const getAllOrder = handleAsyncError(async(req,res,next)=>{
    const orders = await Order.find()
    let totalAmount = 0
    orders.forEach(order => {
        totalAmount+= order.totalPrice
    })
    res.status(200).json({
        success: true,
        orders,
        totalAmount
    })
})

// Order Status
export const updateOrderStatus = handleAsyncError(async(req,res,next)=>{
    const order = await Order.findById(req.params.id)
    if(!order){
        return next(new ErrorHandler("Order not found.", 404))
    }
    if(order.orderStatus === 'Delivered'){
        return next(new ErrorHandler("This order is already been delivered.", 400))
    }

    if(req.body.status === 'Shipped'){
    await Promise.all(order.orderItems.map(item=>updateQuantity(item.product, item.quantity)))

    }
    order.orderStatus = req.body.status
    if(order.orderStatus=== 'Delivered'){
        order.deliveredAt=Date.now()
    }

    await order.save({validateBeforeSave: false})
    res.status(200).json({
        success: true,
        order
    })
   //
})

 // Helper 
    async function updateQuantity(productId, quantity) {
        const product = await Product.findById(productId)
        if (!product) {
            throw new ErrorHandler("Product not found.", 404)
        }

        product.stock -= quantity
        
        await product.save({ validateBeforeSave: false })
    }

    // Delete order

    export const deleteOrder = handleAsyncError(async(req,res,next)=>{
        const order = await Order.findById(req.params.id)
        if(!order){
        return next(new ErrorHandler("Order not found.", 404))
    }
    if(order.orderStatus!== 'Delivered')
        return next(new ErrorHandler("This order is on delivering and cannot be deleted.", 400))

        await Order.deleteOne({_id:req.params.id})
        res.status(200).json({
            success: true,
            order
        })
    })
