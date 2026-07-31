import React, { useEffect } from 'react'
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

    const {orderId} = useParams()

    const handleDelete = (orderId) =>{
        const confirm = window.confirm('Are you sure you want to delete this order?')
        if(confirm){
            dispatch(deleteOrder(orderId))
        }
    }
    useEffect(() => {
    if (error) {
        showToast.error(error)
        dispatch(removeErrors())
    }
    if(success){
        showToast.success(message)
        dispatch(removeSuccess())
        dispatch(clearMessage())
        dispatch(fetchAllOrders())
    }
}, [dispatch, error, success , message])


    useEffect(() => {
        dispatch(fetchAllOrders())
    }, [dispatch])

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
            {loading ? (<Loader />) : (<>
                <Navbar />
                <PageTitle title="All Orders" />
                <div className="ordersList-container">
                    <h1 className="ordersList-title">All Orders</h1>
                    
                    {/* Orders Search and Filter Toolbar */}
                    <div style={{
                        display: 'flex',
                        flexWrap: 'wrap',
                        gap: '16px',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        marginBottom: '20px',
                        background: '#fff',
                        padding: '16px',
                        borderRadius: '8px',
                        boxShadow: '0 2px 4px rgba(0,0,0,0.05)'
                    }}>
                        <div style={{ flex: '1', minWidth: '240px' }}>
                            <input
                                type="text"
                                placeholder="Search by Order ID or Item Name..."
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
                            <label htmlFor="status-filter" style={{ fontWeight: 'bold', fontSize: '14px' }}>Status:</label>
                            <select
                                id="status-filter"
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
                                                    className="action-icon delete-icon" onClick={()=>handleDelete(order._id)}> <Delete />
                                                </button>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        ) : (
                            <div style={{ textAlign: 'center', padding: '40px', background: '#fff', borderRadius: '8px' }}>
                                <p style={{ fontSize: '18px', color: '#777' }}>No orders found matching your search criteria.</p>
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