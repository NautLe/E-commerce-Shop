import express from 'express';
import { roleBasedAuth, verifyUserAuth } from '../middleware/verifyUserAuth.js';
import { cancelOrder, createNewOrder, deleteOrder, getAllOrder, getOrder, getUserOrder, updateOrderStatus, refundOrder } from '../controller/orderController.js';
const router = express.Router();

router.route('/new/order').post(verifyUserAuth, createNewOrder);

router.route('/admin/order/:id')
.put(verifyUserAuth,roleBasedAuth("admin"),updateOrderStatus)
.delete(verifyUserAuth,roleBasedAuth("admin"),deleteOrder)

router.route('/admin/orders').get(verifyUserAuth,roleBasedAuth("admin"),getAllOrder)

router.route('/orders').get(verifyUserAuth, getUserOrder )
router.route('/order/:id')
.get(verifyUserAuth,getOrder)
router.route('/order/cancel/:id').put(verifyUserAuth, cancelOrder)
router.route('/admin/order/refund/:id').put(verifyUserAuth, roleBasedAuth("admin"), refundOrder)
export default router