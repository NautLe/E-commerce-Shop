import React, { useRef, useState } from "react";
import "../CartStyles/Cart.css";
import PageTitle from "../components/PageTitle";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import CartItem from "./CartItem";
import { useDispatch, useSelector } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import { useEffect } from "react";
import { fetchCart } from "../features/cart/cartSlice";
import {
  applyCoupon,
  removeCoupon,
  clearCouponErrors,
  clearCouponMessage,
} from "../features/coupon/couponSlice";
import { showToast } from "../utils/showToast";

import ShoppingBagOutlinedIcon from "@mui/icons-material/ShoppingBagOutlined";
import ArrowForwardIcon from "@mui/icons-material/ArrowForward";

const Cart = () => {
  const dispatch = useDispatch();
  const { cartItems } = useSelector((state) => state.cart);
  const {
    appliedCoupon,
    loading: couponLoading,
    error: couponError,
    message: couponMessage,
  } = useSelector((state) => state.coupon);
  const navigate = useNavigate();

  const [couponCode, setCouponCode] = useState("");
  const isManualApply = useRef(false);  
  useEffect(() => {
    dispatch(fetchCart());
  }, [dispatch]);

  useEffect(() => {
    if (couponError) {
      showToast.error(couponError);
      dispatch(clearCouponErrors());
    }
    if (couponMessage) {
      showToast.success(couponMessage);
       isManualApply.current = false;
      dispatch(clearCouponMessage());
    }
  }, [couponError, couponMessage, dispatch]);

  const subTotal = cartItems.reduce(
    (acc, item) => acc + item.price * item.quantity,0,);

  let discount = 0;
  let shipping = subTotal > 50 ? 0 : 20;

useEffect(() => {
  if (appliedCoupon?.code && subTotal > 0) {
    dispatch(applyCoupon({ code: appliedCoupon.code, subTotal }));
  }

}, [subTotal]);
  if (appliedCoupon) {
    discount = appliedCoupon.calculatedDiscount || 0;
    if (appliedCoupon.type === "freeship") {
      shipping = 0;
    }
  }

  const tax = Math.max(0, subTotal - discount) * 0.1;
  const total = Math.max(0, subTotal - discount) + tax + shipping;

  const handleApplyCoupon = (e) => {
    e.preventDefault();
    const code = couponCode.trim().toUpperCase();
    if (!code) {
      showToast.error("Please enter a coupon code.");
      return;
    }
    isManualApply.current = true;
    dispatch(applyCoupon({ code, subTotal }));
    setCouponCode("");
  };

  const handleRemoveCoupon = () => {
    dispatch(removeCoupon());
  };

  const checkOutHandler = () => {
    navigate("/shipping");
  };

  return (
    <>
      <Navbar />

      {cartItems.length === 0 ? (
        <div className="empty-cart-container">
          <div className="empty-cart-icon-wrapper">
            <ShoppingBagOutlinedIcon className="empty-cart-icon" />
          </div>
          <h2 className="empty-cart-message">Your Cart is Empty</h2>
          <p className="empty-cart-subtitle">
            Looks like you haven't added anything to your cart yet. Explore our
            collection to find your next favorite items!
          </p>
          <Link to="/products" className="viewProducts">
            View Products <ArrowForwardIcon className="arrow-icon-sm" />
          </Link>
        </div>
      ) : (
        <>
          <PageTitle title="My Cart" />

          <div className="cart-page">
            <div className="cart-items">
              <div className="cart-items-heading">My Cart</div>

              <div className="cart-table">
                <div className="cart-table-header">
                  <div className="header-product">Product</div>
                  <div className="header-quantity">Quantity</div>
                  <div className="header-total item-total-heading">
                    Item Total
                  </div>
                  <div className="header-action item-total-heading">
                    Actions
                  </div>
                  
                </div>

                {/* Cart item */}
                {cartItems &&
                  cartItems.map((item, index) => (
                    <CartItem item={item} key={`${item.productId}-${item.size || ''}-${index}`} />
                  ))}
                  
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
                <div className="summary-item discount">
                  <p className="summary-label">
                    Discount ({appliedCoupon?.label}):
                  </p>
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
                  {shipping === 0 ? (
                    <span className="free-shipping-badge">
                      FREE
                    </span>
                  ) : (
                    `$ ${shipping}`
                  )}
                </p>
              </div>

              {/* Promo Code Input Box */}
              <div className="coupon-container">
                <label className="coupon-label">
                  Promo Code
                </label>
                {appliedCoupon ? (
                  <div className="coupon-applied-box">
                    <span className="coupon-applied-code">
                      {appliedCoupon.code} ({appliedCoupon.label})
                    </span>
                    <button
                      onClick={handleRemoveCoupon}
                      className="coupon-remove-btn"
                    >
                      Remove
                    </button>
                  </div>
                ) : (
                  <form
                    onSubmit={handleApplyCoupon}
                    className="coupon-form"
                  >
                    <input
                      type="text"
                      placeholder="Enter promo code"
                      value={couponCode}
                      onChange={(e) => setCouponCode(e.target.value)}
                      className="coupon-input"
                    />
                    <button
                      type="submit"
                      className="coupon-apply-btn"
                    >
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
        </>
      )}
      <Footer />
    </>
  );
};

export default Cart;
