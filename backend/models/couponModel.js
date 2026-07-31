import mongoose from 'mongoose'

const couponSchema = new mongoose.Schema({
  code: {
    type: String,
    required: [true, 'Please enter a coupon code.'],
    unique: true,
    uppercase: true,
    trim: true
  },
  discount: {
    type: Number,
    required: [false, 'Please enter a discount value.'],
    min: [0, 'Discount cannot be negative.']
  },
  discountType: {
    type: String,
    enum: ['percent', 'fixed', 'freeship'],
    default: 'percent'
  },
  minAmount: {
    type: Number,
    default: 0
  },
  expiresAt: {
    type: Date,
    default: null
  },
  isActive: {
    type: Boolean,
    default: true
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
})

const Coupon = mongoose.model('Coupon', couponSchema)
export default Coupon
