import express from 'express'
import { getCart, addToCart, updateCartItem, removeFromCart, clearCart } from '../controller/cartController.js'

const router = express.Router()

router.route('/cart').get(getCart)
router.route('/cart/add').post(addToCart)
router.route('/cart/update').put(updateCartItem)
router.route('/cart/remove/:productId').delete(removeFromCart)
router.route('/cart/clear').delete(clearCart)

export default router