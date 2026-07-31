import React, { useEffect, useState } from 'react'
import '../UserStyles/Form.css'
import Navbar from '../components/Navbar'
import Footer from '../components/Footer'
import PageTitle from '../components/PageTitle'
import { Link, useNavigate, useParams } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import { removeErrors, removeSuccess, resetPassword } from '../features/users/userSlice'
import { showToast } from '../utils/showToast'
import ArrowBackIcon from '@mui/icons-material/ArrowBack'

const ResetPassword = () => {
    const { success, loading, error } = useSelector(state => state.user)
    const dispatch = useDispatch()
    const navigate = useNavigate()
    const [password, setPassword] = useState('')
    const [confirmPassword, setConfirmPassword] = useState('')
    const { token } = useParams()

    const resetPasswordSubmit = (e) => {
        e.preventDefault()
        if (password !== confirmPassword) {
            showToast.error("Passwords do not match")
            return
        }
        const data = {
            password,
            confirmPassword
        }
        dispatch(resetPassword({ token: token, userData: data }))
    }

    useEffect(() => {
        if (error) {
            showToast.error(error)
            dispatch(removeErrors())
        }
    }, [dispatch, error])

    useEffect(() => {
        if (success) {
            showToast.success("Password Reset Successful.")
            dispatch(removeSuccess())
            navigate('/login')
        }
    }, [dispatch, success, navigate])

    return (
        <>
            <PageTitle title='Reset Password - MOCHA' />
            <Navbar />

            <div className="form-container">
                <div className="form-content">
                    <form className='form' onSubmit={resetPasswordSubmit}>
                        <Link to="/login" className="back-link">
                            <ArrowBackIcon style={{ fontSize: '18px' }} /> Back to Sign In
                        </Link>

                        <h2>Reset Password</h2>

                        <div className="input-group">
                            <input
                                type="password"
                                name="Password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                placeholder='Enter your new Password'
                                required
                            />
                        </div>
                        <div className="input-group">
                            <input
                                type="password"
                                name="confirmPassword"
                                value={confirmPassword}
                                onChange={(e) => setConfirmPassword(e.target.value)}
                                placeholder='Confirm Password'
                                required
                            />
                        </div>
                        <button className="authBtn" disabled={loading}>
                            {loading ? "Updating..." : "Update Password"}
                        </button>
                    </form>
                </div>
            </div>

            <Footer />
        </>
    )
}

export default ResetPassword