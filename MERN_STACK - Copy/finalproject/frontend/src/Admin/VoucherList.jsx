import React, { useEffect } from 'react'
import Navbar from '../components/Navbar'
import PageTitle from '../components/PageTitle'
import Footer from '../components/Footer'
import Loader from '../components/Loader'
import { showToast } from '../utils/showToast'
import { useDispatch, useSelector } from 'react-redux'
import { Link } from 'react-router-dom'
import {
  fetchAdminCoupons,
  deleteAdminCoupon,
  removeErrors,
  clearMessage,
  removeSuccess
} from '../features/admin/adminSlice'
import { Delete, ConfirmationNumber, AddBox } from '@mui/icons-material'
import '../AdminStyles/VoucherList.css'

const VoucherList = () => {
  const dispatch = useDispatch()
  const { coupons, loading, error, message, success, deleting } = useSelector((state) => state.admin)

  useEffect(() => {
    dispatch(fetchAdminCoupons())
  }, [dispatch])

  useEffect(() => {
    if (error) {
      showToast.error(error)
      dispatch(removeErrors())
    }
    if (message) {
      showToast.success(message)
      dispatch(clearMessage())
    }
    if (success) {
      dispatch(removeSuccess())
    }
  }, [error, message, success, dispatch])

  const handleDeleteVoucher = (id, voucherCode) => {
    if (window.confirm(`Are you sure you want to delete voucher "${voucherCode}"?`)) {
      dispatch(deleteAdminCoupon(id))
    }
  }

  return (
    <>
      <Navbar />
      <PageTitle title="All Vouchers" />
      {loading && (!coupons || coupons.length === 0) ? (
        <Loader />
      ) : (
        <div className="voucher-container">
          <div className="voucher-header-bar">
            <div className="voucher-header-title">
              <ConfirmationNumber className="voucher-header-icon" />
              <h1 className="voucher-title">All Vouchers</h1>
            </div>
            <Link to="/admin/voucher/create" className="create-voucher-nav-btn">
              <AddBox style={{ fontSize: '18px', marginRight: '6px' }} />
              Create Voucher
            </Link>
          </div>

          {/* Table of active vouchers */}
          <div className="voucher-table-card">
            <div className="voucher-table-container">
              <table className="voucher-table">
                <thead>
                  <tr>
                    <th>No</th>
                    <th>Voucher Code</th>
                    <th>Discount</th>
                    <th>Discount Type</th>
                    <th>Min Order Spend</th>
                    <th>Created Date</th>
                    <th>Action</th>
                  </tr>
                </thead>
                <tbody>
                  {!coupons || coupons.length === 0 ? (
                    <tr>
                      <td colSpan="7" style={{ textAlign: 'center', padding: '35px', color: '#666' }}>
                        No vouchers found. Click "Create Voucher" to add one!
                      </td>
                    </tr>
                  ) : (
                    coupons.map((coupon, index) => (
                      <tr key={coupon._id}>
                        <td>{index + 1}</td>
                        <td>
                          <span className="voucher-code-badge">{coupon.code}</span>
                        </td>
                        <td>
                          {coupon.discountType === 'percent' && `${coupon.discount}% OFF`}
                          {coupon.discountType === 'fixed' && `$${coupon.discount} OFF`}
                          {coupon.discountType === 'freeship' && 'FREE SHIPPING'}
                        </td>
                        <td style={{ textTransform: 'capitalize' }}>{coupon.discountType}</td>
                        <td>${coupon.minAmount || 0}</td>
                        <td>{new Date(coupon.createdAt).toLocaleDateString()}</td>
                        <td>
                          <button
                            className="delete-voucher-btn"
                            disabled={deleting && deleting[coupon._id]}
                            onClick={() => handleDeleteVoucher(coupon._id, coupon.code)}
                          >
                            <Delete style={{ fontSize: '16px', verticalAlign: 'middle', marginRight: '4px' }} />
                            {deleting && deleting[coupon._id] ? 'Deleting...' : 'Delete'}
                          </button>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}
      <Footer />
    </>
  )
}

export default VoucherList
