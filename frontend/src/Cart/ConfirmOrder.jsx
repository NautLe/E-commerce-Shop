import React, { useEffect } from 'react'
import '../CartStyles/OrderConfirm.css'
import PageTitle from '../components/PageTitle'
import Navbar from '../components/Navbar'
import { useSelector } from 'react-redux'
import CheckOut from './CheckOut'
import Footer from '../components/Footer'
import { useNavigate } from 'react-router-dom'

const ConfirmOrder = () => {
    const { shippingInfo, cartItems } = useSelector(state => state.cart)
    const { user } = useSelector(state => state.user)
    const navigate = useNavigate()

    const savedCouponRaw = sessionStorage.getItem('appliedCoupon')
    let appliedCoupon = null
    if (savedCouponRaw) {
        try { appliedCoupon = JSON.parse(savedCouponRaw) } catch (e) {}
    }

    const subTotal = Number(cartItems.reduce((acc, item) => (acc + item.price * item.quantity), 0).toFixed(2))
    
    let discount = 0
    let shipping = subTotal > 50 ? 0 : 20

    if (appliedCoupon) {
        if (appliedCoupon.type === 'percent') {
            discount = Number(((subTotal * appliedCoupon.value) / 100).toFixed(2))
        } else if (appliedCoupon.type === 'freeship') {
            shipping = 0
        }
    }

    const tax = Number((Math.max(0, subTotal - discount) * 0.1).toFixed(2))
    const total = Number((Math.max(0, subTotal - discount) + tax + shipping).toFixed(2))
    
    useEffect(() => {
        if (cartItems.length === 0) {
            navigate('/cart')
        }
    }, [cartItems, navigate])

    const proceedToPayment = () => {
        const data = {
            subTotal,
            discount,
            tax,
            shipping,
            total
        }
        sessionStorage.setItem('orderItem', JSON.stringify(data))
        navigate('/order/payment')
    }

    return (
        <div>
            <PageTitle title="Order Confirmation" />
            <Navbar />
            <CheckOut activePath={1} />
            <div className="confirm-container">
                <div className="confirm-header">Order Confirmation</div>
                <div className="confirm-table-container">
                    <table className="confirm-table">
                        <caption>Shipping Details</caption>
                        <thead>
                            <tr>
                                <th>Name</th>
                                <th>Phone</th>
                                <th>Address</th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr>
                                <td>{user.name}</td>
                                <td>{shippingInfo.phoneNumber}</td>
                                <td>{shippingInfo.address}, {shippingInfo.city}, {shippingInfo.state}, {shippingInfo.country} - {shippingInfo.pinCode}</td>
                            </tr>
                        </tbody>
                    </table>
                    <table className="confirm-table cart-table">
                        <caption>Cart Items</caption>
                        <thead>
                            <tr>
                                <th>Image</th>
                                <th>Product Name </th>
                                <th>Price</th>
                                <th>Quantity</th>
                                <th>Total Price</th>
                            </tr>
                        </thead>
                        <tbody>
                            {cartItems.map((item, index) => (
                                <tr key={`${item.productId}-${item.size || ''}-${index}`}>
                                    <td><img src={item.image} alt={item.name} className='product-image' /></td>
                                    <td>{item.name}</td>
                                    <td>{item.price} $</td>
                                    <td>{item.quantity}</td>
                                    <td>{(item.quantity * item.price).toFixed(2)} $</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                    <table className="confirm-table">
                        <caption>Order Summary</caption>
                        <thead>
                            <tr>
                                <th>Subtotal</th>
                                {discount > 0 && <th>Discount</th>}
                                <th>Shipping Charges</th>
                                <th>Tax</th>
                                <th>Total</th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr>
                                <td> {subTotal} $</td>
                                {discount > 0 && <td style={{ color: '#2e7d32', fontWeight: 'bold' }}>-{discount} $</td>}
                                <td>{shipping === 0 ? 'FREE' : `${shipping} $`}</td>
                                <td>{tax} $</td>
                                <td> {total} $ </td>
                            </tr>
                        </tbody>
                    </table>
                </div>
                <button onClick={proceedToPayment} className="proceed-button">Proceed to Payment</button>
            </div>
            <Footer />
        </div>
    )
}

export default ConfirmOrder