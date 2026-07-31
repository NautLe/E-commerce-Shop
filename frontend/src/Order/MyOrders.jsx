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
      const matchesStatus = statusFilter === 'All' || order.orderStatus.toLowerCase() === statusFilter.toLowerCase()
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
        <div style={{
          display: 'flex',
          flexWrap: 'wrap',
          gap: '16px',
          alignItems: 'center',
          justifyContent: 'space-between',
          marginBottom: '20px',
          background: '#f8f8f8',
          padding: '16px',
          borderRadius: '8px'
        }}>
          <div style={{ flex: '1', minWidth: '240px' }}>
            <input
              type="text"
              placeholder="Search by Order ID or Product Name..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              style={{
                width: '100%',
                padding: '10px 14px',
                borderRadius: '6px',
                border: '1px solid #ccc',
                fontSize: '14px'
              }}
            />
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <label htmlFor="user-order-status" style={{ fontWeight: 'bold', fontSize: '14px', color: '#333' }}>Status:</label>
            <select
              id="user-order-status"
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              style={{
                padding: '10px 14px',
                borderRadius: '6px',
                border: '1px solid #ccc',
                fontSize: '14px',
                background: '#fff'
              }}
            >
              <option value="All">All Statuses</option>
              <option value="Processing">Processing</option>
              <option value="Shipped">Shipped</option>
              <option value="Delivered">Delivered</option>
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
          <div className="no-orders" style={{ minHeight: '300px' }}>
            <p className="no-order-message" style={{ fontSize: '20px' }}>No orders found.</p>
          </div>
        )}
      </div>
    )}
    <Footer/>
    </>
  )
}

export default MyOrders