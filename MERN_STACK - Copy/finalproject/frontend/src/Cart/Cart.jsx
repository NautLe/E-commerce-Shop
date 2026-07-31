import React, { useState } from 'react'
import '../CartStyles/Cart.css'
import PageTitle from '../components/PageTitle'
import Navbar from '../components/Navbar'
import Footer from '../components/Footer'
import CartItem from './CartItem'
import { useDispatch, useSelector } from 'react-redux'
import { Link, useNavigate } from 'react-router-dom'
import { useEffect } from 'react'
import { fetchCart } from '../features/cart/cartSlice'
import { applyCoupon, removeCoupon, clearCouponErrors, clearCouponMessage } from '../features/coupon/couponSlice'
import { showToast } from '../utils/showToast'

const Cart = () => {
  const dispatch = useDispatch()
  const { cartItems } = useSelector(state => state.cart)
  const { appliedCoupon, loading: couponLoading, error: couponError, message: couponMessage } = useSelector(state => state.coupon)
  const navigate = useNavigate()

  const [couponCode, setCouponCode] = useState('')

  useEffect(() => {
    dispatch(fetchCart())
  }, [dispatch])

  useEffect(() => {
    if (couponError) {
      showToast.error(couponError)
      dispatch(clearCouponErrors())
    }
    if (couponMessage) {
      showToast.success(couponMessage)
      dispatch(clearCouponMessage())
    }
  }, [couponError, couponMessage, dispatch])

  const subTotal = cartItems.reduce((acc, item) => (acc + item.price * item.quantity), 0)

  let discount = 0
  let shipping = subTotal > 50 ? 0 : 20

  if (appliedCoupon) {
    if (appliedCoupon.type === 'percent') {
      discount = (subTotal * appliedCoupon.value) / 100
    } else if (appliedCoupon.type === 'freeship') {
      shipping = 0
    }
  }

  const tax = Math.max(0, subTotal - discount) * 0.1
  const total = Math.max(0, subTotal - discount) + tax + shipping

  const handleApplyCoupon = (e) => {
    e.preventDefault()
    const code = couponCode.trim().toUpperCase()
    if (!code) {
      showToast.error('Please enter a coupon code.')
      return
    }
    dispatch(applyCoupon({ code, subTotal }))
    setCouponCode('')
  }

  const handleRemoveCoupon = () => {
    dispatch(removeCoupon())
  }

  const checkOutHandler = () => {
    navigate('/shipping')
  }

  return (
    <>
      <Navbar />

      {cartItems.length === 0 ? (
        <div className="empty-cart-container">
          <p className="empty-cart-message">Your cart is empty.. </p>
          <Link to="/products" className='viewProducts'>View Products</Link>
        </div>
      ) : (<>
        <PageTitle title="My Cart" />

        <div className="cart-page">

          <div className="cart-items">

            <div className="cart-items-heading">
              My Cart
            </div>

            <div className="cart-table">

              <div className="cart-table-header">
                <div className="header-product">Product</div>
                <div className="header-quantity">Quantity</div>
                <div className="header-total item-total-heading">Item Total</div>
                <div className="header-action item-total-heading">Actions</div>
              </div>

              {/* Cart item */}
              {cartItems && cartItems.map((item) => (<CartItem item={item} key={item.productId} />))}

            </div>
          </div>

          {/* Price summary */}
          <div className="price-summary">
            <h3 className="price-summary-heading">Price Summary</h3>

            <div className="summary-item">
              <p className="summary-label">Subtotal:</p>
              <p className="summary-value">$ {subTotal.toFixed(2)} </p>
            </div>

            {discount > 0 && (
              <div className="summary-item" style={{ color: '#2e7d32', fontWeight: 'bold' }}>
                <p className="summary-label">Discount ({appliedCoupon?.label}):</p>
                <p className="summary-value">-$ {discount.toFixed(2)}</p>
              </div>
            )}

            <div className="summary-item">
              <p className="summary-label">Tax (10%):</p>
              <p className="summary-value">$ {tax.toFixed(2)} </p>
            </div>

            <div className="summary-item">
              <p className="summary-label">Shipping:</p>
              <p className="summary-value">
                {shipping === 0 ? <span style={{ color: '#2e7d32', fontWeight: 'bold' }}>FREE</span> : `$ ${shipping}`}
              </p>
            </div>

            {/* Promo Code Input Box */}
            <div className="coupon-container" style={{ margin: '1rem 0', padding: '10px 0', borderTop: '1px solid #eee' }}>
              <label style={{ fontSize: '13px', fontWeight: '600', color: '#444', display: 'block', marginBottom: '6px' }}>
                Promo Code
              </label>
              {appliedCoupon ? (
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', background: '#e8f5e9', padding: '8px 12px', borderRadius: '6px', border: '1px solid #c8e6c9' }}>
                  <span style={{ fontSize: '13px', fontWeight: 'bold', color: '#2e7d32' }}>
                    {appliedCoupon.code} ({appliedCoupon.label})
                  </span>
                  <button onClick={handleRemoveCoupon} style={{ background: 'none', border: 'none', color: '#d32f2f', cursor: 'pointer', fontWeight: 'bold', fontSize: '13px' }}>
                    Remove
                  </button>
                </div>
              ) : (
                <form onSubmit={handleApplyCoupon} style={{ display: 'flex', gap: '6px' }}>
                  <input
                    type="text"
                    placeholder="Enterr promo code"
                    value={couponCode}
                    onChange={(e) => setCouponCode(e.target.value)}
                    style={{ flex: 1, padding: '8px 10px', fontSize: '13px', border: '1px solid #ccc', borderRadius: '6px', outline: 'none' }}
                  />
                  <button type="submit" style={{ padding: '8px 14px', background: '#111', color: '#fff', border: 'none', borderRadius: '6px', cursor: 'pointer', fontWeight: 'bold', fontSize: '13px' }}>
                    Apply
                  </button>
                </form>
              )}
            </div>

            <div className="summary-total">
              <p className="total-label">Total</p>
              <p className="total-value">$ {total.toFixed(2)} </p>
            </div>

            <button className="checkout-btn" onClick={checkOutHandler}>
              Proceed to Checkout
            </button>
          </div>

        </div>

      </>)}
      <Footer />

    </>
  )
}

export default Cart