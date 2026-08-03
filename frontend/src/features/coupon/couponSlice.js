import { createAsyncThunk, createSlice } from '@reduxjs/toolkit'
import axios from '../../utils/axiosInstance'

// Async Thunk to apply & validate coupon with backend MongoDB API
export const applyCoupon = createAsyncThunk(
  'coupon/applyCoupon',
  async ({ code, subTotal }, { rejectWithValue }) => {
    try {
      const { data } = await axios.post('/api/v1/coupon/apply', { code, subTotal })
      return data
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Invalid coupon code.')
    }
  }
)

const couponSlice = createSlice({
  name: 'coupon',
  initialState: {
    appliedCoupon: (() => {
      try {
        return JSON.parse(sessionStorage.getItem('appliedCoupon')) || null
      } catch (e) {
        return null
      }
    })(),
    loading: false,
    error: null,
    message: null
  },
  reducers: {
    removeCoupon: (state) => {
      state.appliedCoupon = null
      state.error = null
      state.message = 'Coupon removed.'
      sessionStorage.removeItem('appliedCoupon')
    },
    clearCouponErrors: (state) => {
      state.error = null
    },
    clearCouponMessage: (state) => {
      state.message = null
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(applyCoupon.pending, (state) => {
        state.loading = true
        state.error = null
      })
      .addCase(applyCoupon.fulfilled, (state, action) => {
        state.loading = false
        const couponData = {
          code: action.payload.coupon.code,
          type: action.payload.coupon.discountType,
          value: action.payload.coupon.value,
          calculatedDiscount: action.payload.coupon.calculatedDiscount,
          label: action.payload.coupon.label
        }
        state.appliedCoupon = couponData
        state.message = action.payload.message
        sessionStorage.setItem('appliedCoupon', JSON.stringify(couponData))
      })
      .addCase(applyCoupon.rejected, (state, action) => {
        state.loading = false
        state.error = action.payload
        state.appliedCoupon = null
        sessionStorage.removeItem('appliedCoupon')
      })
  }
})

export const { removeCoupon, clearCouponErrors, clearCouponMessage } = couponSlice.actions
export default couponSlice.reducer
