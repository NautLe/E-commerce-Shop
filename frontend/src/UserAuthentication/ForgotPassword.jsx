import React, { useEffect, useState } from 'react'
import '../UserStyles/Form.css'
import Navbar from '../components/Navbar'
import Footer from '../components/Footer'
import PageTitle from '../components/PageTitle'
import { Link } from 'react-router-dom'
import { showToast } from '../utils/showToast'
import { removeErrors, removeSuccess, forgotPassword } from '../features/users/userSlice'
import { useDispatch, useSelector } from 'react-redux'
import ArrowBackIcon from '@mui/icons-material/ArrowBack'

const ForgotPassword = () => {
    const { loading, error, success, message } = useSelector(state => state.user)
    const dispatch = useDispatch()
    const [email, setEmail] = useState('')

    const handleForgotPasswordSubmit = (e) => {
        e.preventDefault()
        if (!email) {
            showToast.error("Please enter your email.")
            return
        }
        dispatch(forgotPassword({ email }))
    }

    useEffect(() => {
        if (error) {
            showToast.error(error)
            dispatch(removeErrors())
        }
    }, [dispatch, error])

    useEffect(() => {
        if (success) {
            showToast.success(message || "Password reset link sent to your email!")
            dispatch(removeSuccess())
        }
    }, [dispatch, success, message])

    return (
        <>
            <PageTitle title='Forgot Password - MOCHA' />
            <Navbar />

            <div className='form-container'>
                <div className='form-content'>
                    <form className="form" onSubmit={handleForgotPasswordSubmit}>
                        <Link to="/login" className="back-link">
                            <ArrowBackIcon style={{ fontSize: '18px' }} /> Back to Sign In
                        </Link>
                        <h2>Forgot Password</h2>

                        <p style={{ textAlign: 'center', color: '#666', fontSize: '13.5px', marginBottom: '20px', lineHeight: '1.4' }}>
                            Enter your registered email address and we will send you instructions to reset your password.
                        </p>

                        <div className="input-group">
                            <input
                                type="email"
                                placeholder='Enter your registered email'
                                name='email'
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                required
                            />
                        </div>

                        <button className='authBtn' disabled={loading}>
                            {loading ? "Sending Link..." : "Send Reset Link"}
                        </button>

                        <p className="form-links">
                            Remember your password? <Link to="/login">Sign In</Link>
                        </p>
                    </form>
                </div>
            </div>

            <Footer />
        </>
    )
}

export default ForgotPassword