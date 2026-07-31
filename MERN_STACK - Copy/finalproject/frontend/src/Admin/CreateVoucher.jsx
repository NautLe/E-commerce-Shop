import React, { useEffect, useState } from 'react'
import Navbar from '../components/Navbar'
import PageTitle from '../components/PageTitle'
import Footer from '../components/Footer'
import Loader from '../components/Loader'
import { showToast } from '../utils/showToast'
import { useDispatch, useSelector } from 'react-redux'
import { useNavigate } from 'react-router-dom'
import {
  createAdminCoupon,
  removeErrors,
  clearMessage,
  removeSuccess
} from '../features/admin/adminSlice'
import '../AdminStyles/CreateVoucher.css'

const CreateVoucher = () => {
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const { loading, error, message, success } = useSelector((state) => state.admin)

  // Form inputs
  const [code, setCode] = useState('')
  const [discount, setDiscount] = useState('')
  const [discountType, setDiscountType] = useState('percent')
  const [minAmount, setMinAmount] = useState('0')

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
      navigate('/admin/vouchers')
    }
  }, [error, message, success, dispatch, navigate])

  const handleCreateVoucher = (e) => {
    e.preventDefault()
    if (!code.trim() || !discount) {
      showToast.error('Please fill in voucher code and discount value.')
      return
    }

    const payload = {
      code: code.trim().toUpperCase(),
      discount: Number(discount),
      discountType,
      minAmount: Number(minAmount) || 0
    }
    dispatch(createAdminCoupon(payload))
  }

  return (
    <>
      <Navbar />
      <PageTitle title="Create Voucher" />
      <div className="create-voucher-container">
        <h1 className="create-voucher-title">Create New Voucher</h1>
        <form onSubmit={handleCreateVoucher} className="create-voucher-form">
          <div className="form-group-centered">
            <label>Voucher Code</label>
            <input
              type="text"
              placeholder="e.g. SUMMER30"
              value={code}
              onChange={(e) => setCode(e.target.value)}
              className="form-input-centered"
              required
            />
          </div>

          <div className="form-row-2col">
            <div className="form-group-centered">
              <label>Discount Value</label>
              <input
                type="number"
                placeholder="e.g. 30"
                value={discount}
                onChange={(e) => setDiscount(e.target.value)}
                className="form-input-centered"
                required
                min="0"
              />
            </div>

            <div className="form-group-centered">
              <label>Discount Type</label>
              <select
                value={discountType}
                onChange={(e) => setDiscountType(e.target.value)}
                className="form-select-centered"
              >
                <option value="percent">Percentage (% OFF)</option>
                <option value="fixed">Fixed Amount ($ OFF)</option>
                <option value="freeship">Free Shipping</option>
              </select>
            </div>
          </div>

          <div className="form-group-centered">
            <label>Min Order Subtotal ($)</label>
            <input
              type="number"
              placeholder="0"
              value={minAmount}
              onChange={(e) => setMinAmount(e.target.value)}
              className="form-input-centered"
              min="0"
            />
          </div>

          <button type="submit" className="submit-voucher-btn" disabled={loading}>
            {loading ? 'Creating Voucher...' : '+ Create Voucher'}
          </button>
        </form>
      </div>
      <Footer />
    </>
  )
}

export default CreateVoucher
