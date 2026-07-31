import Notification from "../models/notificationModel.js"
import ErrorHandler from "../utils/handleError.js"
import handleAsyncError from "../middleware/handleAsyncError.js"

// Get logged-in user's notifications
export const getMyNotifications = handleAsyncError(async (req, res, next) => {
    const notifications = await Notification.find({ user: req.user.id }).sort({ createdAt: -1 })
    res.status(200).json({
        success: true,
        notifications
    })
})

// Mark a notification as read
export const markNotificationAsRead = handleAsyncError(async (req, res, next) => {
    const notification = await Notification.findById(req.params.id)
    if (!notification) {
        return next(new ErrorHandler("Notification not found", 404))
    }
    if (notification.user.toString() !== req.user.id.toString()) {
        return next(new ErrorHandler("Not authorized", 403))
    }

    notification.isRead = true
    await notification.save()

    res.status(200).json({
        success: true,
        notification
    })
})

// Delete a notification
export const deleteNotification = handleAsyncError(async (req, res, next) => {
    const notification = await Notification.findById(req.params.id)
    if (!notification) {
        return next(new ErrorHandler("Notification not found", 404))
    }
    if (notification.user.toString() !== req.user.id.toString()) {
        return next(new ErrorHandler("Not authorized", 403))
    }

    await Notification.findByIdAndDelete(req.params.id)

    res.status(200).json({
        success: true,
        message: "Notification deleted successfully"
    })
})

// Helper (used internally by other controllers e.g. orderController)
export const createNotification = async ({ userId, title, message, type = "system", link = "" }) => {
    await Notification.create({ user: userId, title, message, type, link })
}