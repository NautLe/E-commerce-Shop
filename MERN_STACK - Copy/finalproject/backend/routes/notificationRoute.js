import express from "express"
import {
    getMyNotifications,
    markNotificationAsRead,
    deleteNotification
} from "../controller/notificationController.js"
import { verifyUserAuth } from "../middleware/verifyUserAuth.js"

const router = express.Router()

router.route("/notifications").get(verifyUserAuth, getMyNotifications)
router.route("/notification/:id/read").put(verifyUserAuth, markNotificationAsRead)
router.route("/notification/:id").delete(verifyUserAuth, deleteNotification)

export default router