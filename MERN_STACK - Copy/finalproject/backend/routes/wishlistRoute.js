import express from "express"
import {
    getWishlist,
    addToWishlist,
    removeFromWishlist
} from "../controller/wishlistController.js"
import { verifyUserAuth } from "../middleware/verifyUserAuth.js"

const router = express.Router()

router.route("/wishlist").get(verifyUserAuth, getWishlist)
router.route("/wishlist/add").post(verifyUserAuth, addToWishlist)
router.route("/wishlist/remove/:productId").delete(verifyUserAuth, removeFromWishlist)

export default router