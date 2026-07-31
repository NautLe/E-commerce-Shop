import express from "express"
import { createCheckOutSession, getPaymentStatus } from "../controller/paymentController.js"
import { stripeWebhook } from "../controller/webhookController.js"
import { verifyUserAuth } from "../middleware/verifyUserAuth.js"

const router = express.Router()

router.route("/payment/checkout").post(verifyUserAuth, createCheckOutSession)
router.route('/payment/status/:sessionId').get(getPaymentStatus)
export default router
export { stripeWebhook }