import React, { useEffect, useState } from 'react'
import '../AdminStyles/OrdersList.css'
import Footer from '../components/Footer'
import Navbar from '../components/Navbar'
import PageTitle from '../components/PageTitle'
import { Delete, Edit } from '@mui/icons-material'
import Loader from '../components/Loader'
import { useDispatch, useSelector } from 'react-redux'
import { clearMessage, deleteOrder, fetchAllOrders, removeErrors, removeSuccess } from '../features/admin/adminSlice'
import { Link, useParams } from 'react-router-dom'
import { showToast } from '../utils/showToast'
const OrdersList = () => {
    const { orders, loading, error, success, message } = useSelector(state => state.admin)
    const [searchQuery, setSearchQuery] = useState('')
    const [statusFilter, setStatusFilter] = useState('All')

    const dispatch = useDispatch()


    const handleDelete = (orderId) => {
        const confirm = window.confirm('Are you sure you want to delete this order?')
        if (confirm) {
            dispatch(deleteOrder(orderId))
        }
    }
    useEffect(() => {
        if (error) {
            showToast.error(error)
            dispatch(removeErrors())
        }
        if (success) {
            showToast.success(message)
            dispatch(removeSuccess())
            dispatch(clearMessage())
            dispatch(fetchAllOrders())
        }
    }, [dispatch, error, success, message])


    useEffect(() => {
        dispatch(fetchAllOrders())
    }, [dispatch])

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
            {loading ? (<Loader />) : (<>
                <Navbar />
                <PageTitle title="All Orders" />
                <div className="ordersList-container">
                    <h1 className="ordersList-title">All Orders</h1>

                    {/* Orders Search and Filter Toolbar */}
                    <div className="admin-orders-toolbar">
                        <div className="admin-orders-search-box">
                            <input
                                type="text"
                                className="admin-orders-search-input"
                                placeholder="Search by Order ID or Item Name..."
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                            />
                        </div>

                        <div className="admin-orders-filter-group">
                            <label htmlFor="status-filter" className="admin-orders-filter-label">Status:</label>
                            <select
                                id="status-filter"
                                className="admin-orders-filter-select"
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

                    <div className="ordersList-table-container">
                        {filteredOrders && filteredOrders.length > 0 ? (
                            <table className="ordersList-table">
                                <thead>
                                    <tr>
                                        <th>No</th>
                                        <th>Order Id</th>
                                        <th>Status</th>
                                        <th>Total Price ($)</th>
                                        <th>Number Of Items</th>
                                        <th>Actions</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {filteredOrders.map((order, index) => (
                                        <tr key={order._id}>
                                            <td>{index + 1}</td>
                                            <td>{order._id}</td>
                                            <td className={`order-status ${order.orderStatus.toLowerCase()}`}>{order.orderStatus}</td>
                                            <td>{order.totalPrice ? order.totalPrice.toFixed(2) : '0.00'} $</td>
                                            <td>{order.orderItems?.length || 0}</td>
                                            <td>
                                                <Link to={`/admin/order/${order._id}`} className='action-icon edit-icon'><Edit /></Link>
                                                <button
                                                    className="action-icon delete-icon" onClick={() => handleDelete(order._id)}> <Delete />
                                                </button>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        ) : (
                            <div className="admin-no-orders-box">
                                <p className="admin-no-orders-text">No orders found matching your search criteria.</p>
                            </div>
                        )}
                    </div>
                </div>
                <Footer />
            </>)}
        </>
    )
}

export default OrdersList