import stripe from "../utils/stripe.js"
import Order from "../models/orderModel.js"

export const stripeWebhook = async (req, res) => {
  const sig = req.headers["stripe-signature"]
  let event

  try {
    event = stripe.webhooks.constructEvent(
      req.body,
      sig,
      process.env.STRIPE_WEBHOOK_SECRET
    )
  } catch (err) {
    console.log("Webhook signature verification failed:", err.message)
    return res.status(400).send(`Webhook Error: ${err.message}`)
  }

  if (event.type === "checkout.session.completed") {
    const session = event.data.object
    const orderId = session.metadata.orderId

    await Order.findByIdAndUpdate(orderId, {
      paidAt: Date.now(),
      "paymentInfo.id": session.payment_intent,
      "paymentInfo.status": "succeeded",
    })

    console.log(`Order ${orderId} has successfully paid.`)
  }

  res.status(200).json({ received: true })
}