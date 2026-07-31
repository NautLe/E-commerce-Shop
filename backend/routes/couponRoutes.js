import express from 'express'
import { verifyUserAuth, roleBasedAuth } from '../middleware/verifyUserAuth.js'
import { applyCoupon, createCoupon, getAllCoupons, deleteCoupon } from '../controller/couponController.js'

const router = express.Router()

router.route('/coupon/apply').post(applyCoupon)

router.route('/admin/coupon/new').post(verifyUserAuth, roleBasedAuth('admin'), createCoupon)
router.route('/admin/coupons').get(verifyUserAuth, roleBasedAuth('admin'), getAllCoupons)
router.route('/admin/coupon/:id').delete(verifyUserAuth, roleBasedAuth('admin'), deleteCoupon)

export default router
