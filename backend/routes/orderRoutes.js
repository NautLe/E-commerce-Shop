import express from 'express';
import { createOrder, deleteOrder, getAllOrder, getOrder, getUserOrder, updateOrderStatus } from '../controller/orderController.js';
import { roleBasedAuth, verifyUserAuth } from '../middleware/verifyUserAuth.js';
const router = express.Router();

router.route('/new/order').post(verifyUserAuth,createOrder)
router.route('/admin/order/:id')
.get(verifyUserAuth,roleBasedAuth("admin"),getOrder)
.put(verifyUserAuth,roleBasedAuth("admin"),updateOrderStatus)
.delete(verifyUserAuth,roleBasedAuth("admin"),deleteOrder)

router.route('/admin/orders').get(verifyUserAuth,roleBasedAuth("admin"),getAllOrder)

router.route('/orders/user').get(verifyUserAuth, getUserOrder )

export default router