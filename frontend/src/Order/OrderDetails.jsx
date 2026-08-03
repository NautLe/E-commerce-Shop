import React, { useEffect } from 'react'
import '../OrderStyles/OrderDetails.css'
import PageTitle from '../components/PageTitle'
import Navbar from '../components/Navbar'
import Footer from '../components/Footer'
import { useDispatch, useSelector } from 'react-redux'
import { cancelUserOrder, getOrderDetails, removeErrors, removeSuccess } from '../features/order/orderSlice'
import { useParams } from 'react-router-dom'
import { showToast } from '../utils/showToast'
import Loader from '../components/Loader'

const OrderDetails = () => {
    const { orderId } = useParams();

    const { order, loading, error, success, message } = useSelector(state => state.order)
    const dispatch = useDispatch()

    useEffect(() => {
        dispatch(getOrderDetails(orderId))
    }, [dispatch, orderId])

    useEffect(() => {
        if (error) {
            showToast.error(error)
            dispatch(removeErrors())
        }
        if (success && message) {
            showToast.success(message)
            dispatch(removeSuccess())
        }
    }, [dispatch, error, success, message])

    const handleCancelOrder = () => {
        if (window.confirm("Are you sure you want to cancel this order?")) {
            dispatch(cancelUserOrder(orderId))
        }
    }

    const {
        shippingInfo = {},
        orderItems = [],
        paymentInfo = {},
        orderStatus,
        totalPrice,
        taxPrice,
        shippingPrice,
        itemPrice,
        paidAt,
        createdAt
    } = order || {}

    const paymentStatus = paymentInfo?.status === 'succeeded' ? 'Paid' : 'Not Paid'
    const finalOrderStatus = (orderStatus === 'Cancelled' || paymentStatus === 'Not Paid') ? 'Cancelled' : orderStatus
    const orderStatusClass = finalOrderStatus === 'Delivered' ? 'status-tag delivered' : `${finalOrderStatus?.toLowerCase()}`
    const paymentStatusClass = `pay-tag ${paymentStatus === 'Paid' ? 'paid' : 'not-paid'}`
    const canCancel = finalOrderStatus !== 'Delivered' && finalOrderStatus !== 'Cancelled'

    return (
        <>
        <PageTitle title={orderId} />
        <Navbar />
        {loading ? (<Loader />) : (
        <div className="order-box">
            {/* Order items table */}
            <div className="table-block">
                <h2 className="table-title">Order Items</h2>
                <table className="table-main">
                    <thead>
                        <tr>
                            <th className="head-cell">Image</th>
                            <th className="head-cell">Name</th>
                            <th className="head-cell">Quantity</th>
                            <th className="head-cell">Price</th>
                        </tr>
                    </thead>
                    <tbody>
                        {orderItems.map((item) => (
                            <tr className="table-row" key={item.product}>
                                <td className="table-cell">
                                    <img src={item.image} alt={item.name} className='item-img' />
                                </td>
                                <td className="table-cell">{item.name}</td>
                                <td className="table-cell">{item.quantity}</td>
                                <td className="table-cell">{item.price}$</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            {/* Shipping info table */}
            <div className="table-block">
                <h2 className="table-title">Shipping Info</h2>
                <table className="table-main">
                    <tbody>
                        <tr className="table-row">
                            <th className="table-cell">Address</th>
                            <td className="table-cell">{shippingInfo.address},{shippingInfo.city},{shippingInfo.state},{shippingInfo.country}-{shippingInfo.pinCode}</td>
                        </tr>
                        <tr className="table-row">
                            <th className="table-cell">Phone</th>
                            <td className="table-cell">{shippingInfo.phoneNumber}</td>
                        </tr>
                    </tbody>
                </table>
            </div>

            {/* Order Summary */}
            <div className="table-block">
                <h2 className="table-title">Order Summary</h2>
                <table className="table-main">
                    <tbody>
                        <tr className="table-row">
                            <th className="table-cell">Order Status</th>
                            <td className="table-cell">
                                <span className={orderStatusClass}>{finalOrderStatus}</span>
                            </td>
                        </tr>
                        <tr className="table-row">
                            <th className="table-cell">Payment</th>
                            <td className="table-cell">
                                <span className={paymentStatusClass}>{paymentStatus}</span>
                            </td>
                        </tr>
                        {(paidAt || paymentStatus === 'Paid') && (
                            <tr className="table-row">
                                <th className="table-cell">Paid At</th>
                                <td className="table-cell">
                                    {paidAt
                                        ? new Date(paidAt).toLocaleString()
                                        : createdAt
                                            ? new Date(createdAt).toLocaleString()
                                            : 'N/A'}
                                </td>
                            </tr>
                        )}
                        <tr className="table-row">
                            <th className="table-cell">Items Price</th>
                            <td className="table-cell">{itemPrice}$</td>
                        </tr>
                        <tr className="table-row">
                            <th className="table-cell">Tax Price</th>
                            <td className="table-cell">{taxPrice}$</td>
                        </tr>
                        <tr className="table-row">
                            <th className="table-cell">Shipping Price</th>
                            <td className="table-cell">{shippingPrice}$</td>
                        </tr>
                        <tr className="table-row">
                            <th className="table-cell">Total Price</th>
                            <td className="table-cell">{totalPrice}$</td>
                        </tr>
                    </tbody>
                </table>

                {canCancel && (
                    <div style={{ marginTop: '1.5rem', textAlign: 'right' }}>
                        <button 
                            onClick={handleCancelOrder}
                            className="cancel-order-btn"
                            disabled={loading}
                        >
                            Cancel Order
                        </button>
                    </div>
                )}
            </div>
        </div>
        )}
        <Footer />
        </>
    )
}

export default OrderDetails