import React, { useEffect, useState } from 'react'
import '../AdminStyles/UpdateOrder.css'
import Navbar from '../components/Navbar'
import Footer from '../components/Footer'
import PageTitle from '../components/PageTitle'
import { useParams } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import { getOrderDetails } from '../features/order/orderSlice'
import Loader from '../components/Loader'
import { showToast } from '../utils/showToast'
import { removeErrors, removeSuccess, updateOrderStatus } from '../features/admin/adminSlice'
const UpdateOrderStatus = () => {
    const [status , setStatus] = useState('')
    const {orderId} = useParams()
    const {order,loading:orderLoading} = useSelector(state=>state.order)
    const {success,loading:adminLoading, error} = useSelector(state=>state.admin)
    const loading = orderLoading || adminLoading
    
    const dispatch = useDispatch()
    useEffect(()=>{
        if(orderId){
            dispatch(getOrderDetails(orderId))
        }
    },[dispatch,orderId])

    const {
        shippingInfo={},
        orderItems=[],
        paymentInfo={},
        orderStatus,
        totalPrice
    } = order

    const paymentStatus = paymentInfo.status==='succeeded'?'Paid':'Not Paid'
    const finalOrderStatus = paymentStatus==='Not Paid' ? 'Cancelled' : orderStatus;
    const handleStatusUpdate = () =>{
        if(!status){
            showToast.error('Please select a status')
            return
        }
        dispatch(updateOrderStatus({orderId,status}))
    }
    useEffect(() => {
        if (error) {
            showToast.error(error)
            dispatch(removeErrors())
        }
        if(success){
            showToast.success("Order status updated Successfully.")
            dispatch(removeSuccess())
            dispatch(getOrderDetails(orderId))
        }
    }, [dispatch, error, success, orderId])
  return (
    <>
    <Navbar/>
    <PageTitle title = 'Update Order'/>
    {loading ? (<Loader/>): (<div className="order-container">
        <h1 className="order-title">Update Order</h1>
        <div className="order-details">
            <h2>Order Information</h2>    
            <p>Order ID: {orderId}</p>
            <p><strong>Shipping Address: </strong>{shippingInfo.address}, {shippingInfo.city}, {shippingInfo.state}, {shippingInfo.country} - {shippingInfo.pinCode}</p>
            <p><strong>Phone:</strong> {shippingInfo.phoneNumber}</p>
            <p><strong>Order Status: </strong> {finalOrderStatus}</p>
            <p><strong>Payment Status: </strong> {paymentStatus}</p>
            <p><strong>Total Price: </strong>{totalPrice} $</p>
        </div> 
        <div className="order-items">
            <h2>Order Items</h2>
            <table className="order-table">
                <thead>
                    <tr>
                        <th>Image</th>
                        <th>Name</th>
                        <th>Quantity</th>
                        <th>Price</th>
                    </tr>
                </thead>
                <tbody>
                    {orderItems.map((item)=>(
                        <tr key={item._id}>
                            <td>
                                <img src={item.image}alt={item.name} className='order-item-image' />
                                </td>
                            <td>{item.name}</td>
                            <td>{item.quantity}</td>
                            <td>{item.price}</td>
                        </tr>
                    ))}
                </tbody>
            </table>
             <div className="order-status">
        <h2>Update Status</h2>
        <select className='status-select' disabled={loading || orderStatus==='Delivered'} value={status} onChange={(e)=>(setStatus(e.target.value))}>
            <option value="">Select Status</option>
            <option value="Shipped">Shipped</option>
            <option value="Delivering">Delivering</option>
            <option value="Delivered">Delivered</option>
        </select>
        <button className="update-button" onClick={handleStatusUpdate} disabled={loading || !status ||orderStatus==='Delivered'}>Update Status</button>
    </div>
        </div>
        
    </div>)}

   

    <Footer/>
    </>
  )
}

export default UpdateOrderStatus