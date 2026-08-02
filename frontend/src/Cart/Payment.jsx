import React, { useState, useRef } from 'react'
import '../CartStyles/Payment.css'
import PageTitle from '../components/PageTitle'
import Navbar from '../components/Navbar'
import Footer from '../components/Footer'
import CheckOut from './CheckOut'
import { Link } from 'react-router-dom'
import { useSelector } from 'react-redux'
import axios from '../utils/axiosInstance'

const Payment = () => {
    const orderItem = JSON.parse(sessionStorage.getItem('orderItem')) || {}
    const { shippingInfo, cartItems } = useSelector(state => state.cart)
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState(null)
    const isSubmitting = useRef(false)

    const handlePayment = async () => {
        if (isSubmitting.current) return
        isSubmitting.current = true

        try {
            setLoading(true)
            setError(null)

            const checkoutData = {
                orderItems: cartItems.map(item => ({
                    name: item.name,
                    price: item.price,
                    quantity: item.quantity,
                    image: item.image,
                    product: item.productId,
                    stock: item.stock,
                })),
                shippingInfo, 
                shippingPrice: orderItem.shipping,
                taxPrice: orderItem.tax,
                itemPrice: orderItem.subTotal,
                totalPrice: orderItem.total 
            }

            const { data: paymentRes } = await axios.post('/api/v1/payment/checkout', checkoutData, {
                headers: { 'Content-Type': 'application/json' }
            })

            if (paymentRes?.url) {
                window.location.href = paymentRes.url
                return
            }
        } catch (err) {
            setError(err.response?.data?.message || 'Payment processing failed. Please try again.')
            setLoading(false)
            isSubmitting.current = false
        }
    }

    return (
        <>
            <PageTitle title="Payment" />
            <Navbar />
            <CheckOut activePath={2} />
            <div className="payment-container">
                <Link to="/order/confirm" className='payment-go-back'>Go Back</Link>
                {error && <div style={{ color: 'red', marginTop: '10px' }}>{error}</div>}
                <button
                    className="payment-btn"
                    onClick={handlePayment}
                    disabled={loading || !orderItem.total}
                >
                    {loading ? 'Processing...' : `Pay ${orderItem.total || 0}$`}
                </button>
            </div>
            <Footer />
        </>
    )
}

export default Payment