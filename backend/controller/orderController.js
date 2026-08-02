import Order from "../models/orderModel.js";
import OrderDetail from "../models/orderDetailModel.js";
import Product from "../models/productModel.js";
import User from "../models/userModel.js";
import ErrorHandler from "../utils/handleError.js"
import handleAsyncError from "../middleware/handleAsyncError.js"
import { createNotification } from "./notificationController.js"

// Create new order
export const createNewOrder = handleAsyncError(async (req, res, next) => {
    const {
        shippingInfo,
        orderItems,
        paymentInfo,
        itemPrice,
        taxPrice,
        shippingPrice,
        totalPrice,
    } = req.body;

    const order = await Order.create({
        shippingInfo,
        itemPrice,
        taxPrice,
        shippingPrice,
        totalPrice,
        paymentInfo,
        paidAt: Date.now(),
        user: req.user._id,
    });

    if (orderItems && orderItems.length > 0) {
        const orderDetailsData = orderItems.map((item) => ({
            order: order._id,
            product: item.product,
            name: item.name,
            price: item.price,
            quantity: item.quantity,
            image: item.image,
            stock: item.stock
        }));
        await OrderDetail.insertMany(orderDetailsData);

        for (const item of orderItems) {
            await updateQuantity(item.product, item.quantity);
        }
    }

    // Send order confirmation notification
    await createNotification({
        userId: req.user._id,
        title: "Order Placed Successfully 🎉",
        message: `Your order #${order._id.toString().slice(-6)} of $${totalPrice ? totalPrice.toFixed(2) : 0} has been placed.`,
        type: "order"
    })

    res.status(201).json({
        success: true,
        order,
    });
});

// admin - get single order
export const getOrder = handleAsyncError(async (req, res, next) => {
    const order = await Order.findById(req.params.id).populate("user", "name email")
    if (!order) {
        return next(new ErrorHandler("Order not found.", 404))
    }

    const orderItems = await OrderDetail.find({ order: order._id })

    res.status(200).json({
        success: true,
        order: {
            ...order.toObject(),
            orderItems
        }
    })
})

// Get all user orders
export const getUserOrder = handleAsyncError(async (req, res, next) => {
    const orders = await Order.find({ user: req.user._id }).lean()

    const ordersWithItems = await Promise.all(
        orders.map(async (order) => {
            const orderItems = await OrderDetail.find({ order: order._id })
            return { ...order, orderItems }
        })
    )

    res.status(200).json({
        success: true,
        orders: ordersWithItems
    })
})


// admin - get all order
export const getAllOrder = handleAsyncError(async (req, res, next) => {
    const orders = await Order.find().lean()

    const ordersWithItems = await Promise.all(
        orders.map(async (order) => {
            const orderItems = await OrderDetail.find({ order: order._id })
            return { ...order, orderItems }
        })
    )

    let totalAmount = 0
    ordersWithItems.forEach(order => {
        totalAmount += order.totalPrice
    })

    res.status(200).json({
        success: true,
        orders: ordersWithItems,
        totalAmount
    })
})

// Order Status
export const updateOrderStatus = handleAsyncError(async (req, res, next) => {
    const order = await Order.findById(req.params.id)
    if (!order) {
        return next(new ErrorHandler("Order not found.", 404))
    }
    if (order.orderStatus === 'Delivered') {
        return next(new ErrorHandler("This order is already been delivered.", 400))
    }

    const orderItems = await OrderDetail.find({ order: order._id })


    order.orderStatus = req.body.status
    if (order.orderStatus === 'Delivered') {
        order.deliveredAt = Date.now()
    }
    await order.save({ validateBeforeSave: false })

    // Send order status update notification
    await createNotification({
        userId: order.user,
        title: `Order Status: ${req.body.status}`,
        message: `Your order #${order._id.toString().slice(-6)} status has been updated to "${req.body.status}".`,
        type: "order"
    })

    res.status(200).json({
        success: true,
        order: {
            ...order.toObject(),
            orderItems
        }
    })
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
export const deleteOrder = handleAsyncError(async (req, res, next) => {
    const order = await Order.findById(req.params.id)
    if (!order) {
        return next(new ErrorHandler("Order not found.", 404))
    }
    if (order.orderStatus !== 'Delivered')
        return next(new ErrorHandler("This order is on delivering and cannot be deleted.", 400))

    await OrderDetail.deleteMany({ order: order._id })
    await Order.deleteOne({ _id: req.params.id })

    res.status(200).json({
        success: true,
        message: "Order deleted successfully",
        order
    })
})