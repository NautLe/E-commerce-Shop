import React, { useEffect, useState } from 'react'
import '../OrderStyles/MyOrders.css'
import Navbar from '../components/Navbar'
import Footer from '../components/Footer'
import { LaunchOutlined } from '@mui/icons-material'
import PageTitle from '../components/PageTitle'
import { Link } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import { getAllMyOrders, removeErrors } from '../features/order/orderSlice'
import { showToast } from '../utils/showToast'
import Loader from '../components/Loader'
const MyOrders = () => {
  const {orders,loading,error} = useSelector(state=>state.order)
  const [searchQuery, setSearchQuery] = useState('')
  const [statusFilter, setStatusFilter] = useState('All')

  const dispatch = useDispatch()
  useEffect(()=>{
    dispatch(getAllMyOrders())
  },[dispatch])
    useEffect(()=>{
    if(error){
      showToast.error(error)
      dispatch(removeErrors())
    }
},[dispatch, error])

  const filteredOrders = React.useMemo(() => {
    if (!orders) return [];
    return orders.filter(order => {
      const matchesSearch = order._id.toLowerCase().includes(searchQuery.toLowerCase()) ||
        order.orderItems?.some(item => item.name?.toLowerCase().includes(searchQuery.toLowerCase()))
      const matchesStatus = statusFilter === 'All' || 
        (statusFilter.toLowerCase() === 'delivering' || statusFilter.toLowerCase() === 'shipping'
          ? (order.orderStatus?.toLowerCase() === 'delivering' || order.orderStatus?.toLowerCase() === 'shipping')
          : order.orderStatus?.toLowerCase() === statusFilter.toLowerCase())
      return matchesSearch && matchesStatus
    })
  }, [orders, searchQuery, statusFilter])

  return (
    <>
    <Navbar/>
    <PageTitle title="User Order"/>
    {loading?(<Loader/>):(
      <div className="my-orders-container">
        <h1>My Orders</h1>

        {/* Filter & Search Bar for User Orders */}
        <div className="orders-filter-container">
          <div className="orders-search-box">
            <input
              type="text"
              className="orders-search-input"
              placeholder="Search by Order ID or Product Name..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>

          <div className="orders-status-filter">
            <label htmlFor="user-order-status" className="orders-status-label">Status:</label>
            <select
              id="user-order-status"
              className="orders-status-select"
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
            >
              <option value="All">All Statuses</option>
              <option value="Processing">Processing</option>
              <option value="Delivering">Delivering</option>
              <option value="Delivered">Delivered</option>
              <option value="Cancelled">Cancelled</option>
            </select>
          </div>
        </div>

        {filteredOrders && filteredOrders.length > 0 ? (
          <div className="table-responsive"> 
            <table className="orders-table">
              <thead>
                <tr>
                  <th>Order ID</th>
                  <th>Order Name</th>
                  <th>Items Count</th>
                  <th>Status</th>
                  <th>Total Price ($)</th>
                  <th>View Order</th>
                </tr>
              </thead>
              <tbody>
                { filteredOrders.map((order)=>(
                <tr key={order._id}>
                  <td>{order._id}</td>
                  <td>
                    {order.orderItems[0]?.name}
                    {order.orderItems.length>1 &&` +${order.orderItems.length-1} more`}
                  </td>
                  <td>{order.orderItems.length}</td>
                  <td>{order.orderStatus}</td>
                  <td>{order.totalPrice ? order.totalPrice.toFixed(2) : '0.00'} $ </td>
                  <td><Link to={`/order/${order._id}`} className='order-link'><LaunchOutlined/></Link></td>
                </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="no-orders">
            <p className="no-order-message">No orders found.</p>
          </div>
        )}
      </div>
    )}
    <Footer/>
    </>
  )
}

export default MyOrders