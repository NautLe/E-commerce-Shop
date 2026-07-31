import express from 'express';
import { roleBasedAuth, verifyUserAuth } from '../middleware/verifyUserAuth.js';
import { createNewOrder, deleteOrder, getAllOrder, getOrder, getUserOrder, updateOrderStatus } from '../controller/orderController.js';
const router = express.Router();

router.route('/new/order').post(verifyUserAuth, createNewOrder);

router.route('/admin/order/:id')
.put(verifyUserAuth,roleBasedAuth("admin"),updateOrderStatus)
.delete(verifyUserAuth,roleBasedAuth("admin"),deleteOrder)

router.route('/admin/orders').get(verifyUserAuth,roleBasedAuth("admin"),getAllOrder)

router.route('/orders').get(verifyUserAuth, getUserOrder )
router.route('/order/:id')
.get(verifyUserAuth,getOrder)
export default router