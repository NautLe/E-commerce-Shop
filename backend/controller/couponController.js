import Coupon from '../models/couponModel.js'
import ErrorHandler from '../utils/handleError.js'
import handleAsyncError from '../middleware/handleAsyncError.js'

// Apply and validate coupon 
export const applyCoupon = handleAsyncError(async (req, res, next) => {
  const { code, subTotal = 0 } = req.body

  if (!code) {
    return next(new ErrorHandler("Please provide a coupon code.", 400))
  }

  const normalizedCode = code.trim().toUpperCase()
  const coupon = await Coupon.findOne({ code: normalizedCode })

  if (!coupon) {
    return next(new ErrorHandler("Invalid coupon code.", 404))
  }

  if (!coupon.isActive) {
    return next(new ErrorHandler("This coupon is no longer active.", 400))
  }

  if (coupon.expiresAt && new Date(coupon.expiresAt) < new Date()) {
    return next(new ErrorHandler("This coupon has expired.", 400))
  }

  if (coupon.minAmount > 0 && subTotal < coupon.minAmount) {
    return next(new ErrorHandler(`Minimum order amount of $${coupon.minAmount} is required for this coupon.`, 400))
  }

  let calculatedDiscount = 0
  let label = ''

  if (coupon.discountType === 'percent') {
    calculatedDiscount = Number(((subTotal * coupon.discount) / 100).toFixed(2))
    label = `${coupon.discount}% OFF`
  } else if (coupon.discountType === 'fixed') {
    calculatedDiscount = Math.min(subTotal, coupon.discount)
    label = `$${coupon.discount} OFF`
  } else if (coupon.discountType === 'freeship') {
    calculatedDiscount = 0
    label = 'FREE SHIPPING'
  }
 
  res.status(200).json({
    success: true,
    message: `Coupon "${coupon.code}" applied! (${label})`,
    coupon: {
      code: coupon.code,
      discountType: coupon.discountType,
      value: coupon.discount,
      calculatedDiscount,
      label
    }
  })
})

// Create Coupon (Admin)
export const createCoupon = handleAsyncError(async (req, res, next) => {
  const { code, discount, discountType, minAmount, expiresAt } = req.body

  if (!code || discount === undefined) {
    return next(new ErrorHandler("Coupon code and discount are required.", 400))
  }

  const existingCoupon = await Coupon.findOne({ code: code.trim().toUpperCase() })
  if (existingCoupon) {
    return next(new ErrorHandler("A coupon with this code already exists.", 400))
  }

  const coupon = await Coupon.create({
    code: code.trim().toUpperCase(),
    discount,
    discountType: discountType || 'percent',
    minAmount: minAmount || 0,
    expiresAt: expiresAt || null
  })

  res.status(201).json({
    success: true,
    coupon
  })
})

// Get All Coupons (Admin)
export const getAllCoupons = handleAsyncError(async (req, res, next) => {
  const coupons = await Coupon.find().sort({ createdAt: -1 })
  res.status(200).json({
    success: true,
    coupons
  })
})

// Delete Coupon (Admin)
export const deleteCoupon = handleAsyncError(async (req, res, next) => {
  const coupon = await Coupon.findById(req.params.id)
  if (!coupon) {
    return next(new ErrorHandler("Coupon not found.", 404))
  }

  await coupon.deleteOne()

  res.status(200).json({
    success: true,
    message: "Coupon deleted successfully."
  })
})
