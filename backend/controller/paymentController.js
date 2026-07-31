import stripe from "../utils/stripe.js"
import Order from "../models/orderModel.js"
import OrderDetail from "../models/orderDetailModel.js"
import Product from "../models/productModel.js"
import ErrorHandler from "../utils/handleError.js"
import handleAsyncError from "../middleware/handleAsyncError.js"
import { createNotification } from "./notificationController.js"


export const getPaymentStatus = handleAsyncError(async (req, res, next) => {
  const { sessionId } = req.params

  const session = await stripe.checkout.sessions.retrieve(sessionId)
  const orderId = session.metadata?.orderId

  if (!orderId) {
    return next(new ErrorHandler("Order reference not found.", 404))
  }

  const order = await Order.findById(orderId)
  if (!order) {
    return next(new ErrorHandler("Order not found.", 404))
  }

  if (session.payment_status === "paid" && order.paymentInfo?.status !== "succeeded") {
    order.paymentInfo = {
      id: session.payment_intent || session.id,
      status: "succeeded",
    }
    order.paidAt = Date.now()
    await order.save({ validateBeforeSave: false })

    // Deduct stock for each product in the order
    const orderItems = await OrderDetail.find({ order: order._id })
    for (const item of orderItems) {
      const product = await Product.findById(item.product)
      if (product) {
        product.stock = Math.max(0, product.stock - item.quantity)
        await product.save({ validateBeforeSave: false })
      }
    }

    // Create Notification for the user
    await createNotification({
      userId: order.user,
      title: "Order Placed Successfully 🎉",
      message: `Your order #${order._id.toString().slice(-6)} of $${order.totalPrice ? order.totalPrice.toFixed(2) : 0} has been confirmed.`,
      type: "order"
    })
  }

  res.status(200).json({
    success: true,
    order
  })
})
export const createCheckOutSession = handleAsyncError(async (req, res, next) => {
  const { orderItems, shippingInfo, shippingPrice, taxPrice, itemPrice, totalPrice } = req.body

  if (!orderItems || orderItems.length === 0) {
    return next(new ErrorHandler("No order items provided.", 400))
  }
  if (!shippingInfo) {
    return next(new ErrorHandler("Shipping info is required.", 400))
  }

  const order = await Order.create({
    shippingInfo,
    itemPrice,
    taxPrice,
    shippingPrice,
    totalPrice,
    orderStatus: "Processing",
    paymentInfo: { status: "Not Paid" },
    user: req.user._id
  })

  // Create Notification for the user
  await createNotification({
    userId: req.user._id,
    title: "Order Placed Successfully 🎉",
    message: `Your order #${order._id.toString().slice(-6)} of $${totalPrice ? totalPrice.toFixed(2) : 0} has been placed.`,
    type: "order"
  })

  // 
  const orderDetailsData = orderItems.map(item => ({
    order: order._id,
    product: item.product,
    name: item.name,
    price: item.price,
    quantity: item.quantity,
    image: item.image
  }))
  await OrderDetail.insertMany(orderDetailsData)

  const line_items = orderItems.map((item) => ({
    price_data: {
      currency: "usd",
      product_data: {
        name: item.name,
        images: item.image ? [item.image] : [],
      },
      unit_amount: Math.round(item.price * 100),
    },
    quantity: item.quantity,
  }))

  if (shippingPrice && shippingPrice > 0) {
    line_items.push({
      price_data: {
        currency: "usd",
        product_data: { name: "Shipping Fee" },
        unit_amount: Math.round(shippingPrice * 100),
      },
      quantity: 1,
    })
  }

  if (taxPrice && taxPrice > 0) {
    line_items.push({
      price_data: {
        currency: "usd",
        product_data: { name: "Tax" },
        unit_amount: Math.round(taxPrice * 100),
      },
      quantity: 1,
    })
  }

  const session = await stripe.checkout.sessions.create({
    payment_method_types: ["card"],
    line_items,
    mode: "payment",
    success_url: `${process.env.CLIENT_URL}/paymentSuccess?reference={CHECKOUT_SESSION_ID}`,
    cancel_url: `${process.env.CLIENT_URL}/order/confirm?payment=cancel`,
    metadata: {
      orderId: order._id.toString()   
    }
  })

  res.status(200).json({
    success: true,
    url: session.url,
  })
})