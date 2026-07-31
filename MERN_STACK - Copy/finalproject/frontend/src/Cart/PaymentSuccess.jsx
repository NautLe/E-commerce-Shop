import React, { useEffect, useState } from 'react'
import '../CartStyles/PaymentSuccess.css'
import { useNavigate, useSearchParams, useParams, Link } from 'react-router-dom'
import { useDispatch } from 'react-redux'
import { clearCart } from '../features/cart/cartSlice'
import PageTitle from '../components/PageTitle'
import Navbar from '../components/Navbar'
import Footer from '../components/Footer'
import { showToast } from '../utils/showToast'
import Loader from '../components/Loader'
import axios from 'axios'

const PaymentSuccess = () => {
  const [searchParams] = useSearchParams()
  const { id } = useParams()
  const navigate = useNavigate()
  const dispatch = useDispatch()

  const referenceId = searchParams.get('reference') || id
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const verifyPayment = async () => {
      if (!referenceId) {
        setLoading(false)
        return
      }

      try {
        await axios.get(`/api/v1/payment/status/${referenceId}`)
        showToast.success('Order Placed Successfully!')
        dispatch(clearCart())
        sessionStorage.removeItem('orderItem')
      } catch (error) {
        console.error('Payment verification error:', error)
        showToast.error(error.response?.data?.message || 'Failed to verify payment status')
      } finally {
        setLoading(false)
      }
    }

    verifyPayment()
  }, [referenceId, dispatch])

  return (
    <>
      {loading ? (<Loader />) : (
        <>
          <PageTitle title="Payment Status" />
          <Navbar />
          <div className="payment-success-container">
            <div className="success-content">
              <div className="success-icon">
                <div className="checkmark"></div>
              </div>
              <h1>Order Confirmed!</h1>
              <p className="success-para">
                Your payment was successful. Reference ID: <strong>{referenceId}</strong>
              </p>
              <Link className='explore-btn' to="/orders">View Orders</Link>
            </div>
          </div>
          <Footer />
        </>)}
    </>
  )
}

export default PaymentSuccess

