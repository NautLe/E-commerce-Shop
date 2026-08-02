import React, { useEffect, useState } from 'react'
import '../UserStyles/Form.css'
import Navbar from '../components/Navbar'
import Footer from '../components/Footer'
import PageTitle from '../components/PageTitle'
import { Link, useNavigate } from 'react-router-dom'
import { showToast } from '../utils/showToast'
import { useDispatch, useSelector } from 'react-redux'
import { register, verifyOTP, removeErrors, removeSuccess } from '../features/users/userSlice'
import Visibility from '@mui/icons-material/Visibility'
import VisibilityOff from '@mui/icons-material/VisibilityOff'
import { Clear, Done } from '@mui/icons-material'

const Register = () => {
    const [user, setUser] = useState({
        name: '',
        email: '',
        password: '',
        confirmPassword: ''
    })
    const { name, email, password, confirmPassword } = user
    const { success, loading, error } = useSelector(state => state.user)
    const dispatch = useDispatch()
    const [avatar, setAvatar] = useState("")
    const [avatarPreview, setAvatarPreview] = useState('/images/admin-logo.png')
    const [showPassword, setShowPassword] = useState(false)
    const [showConfirmPassword, setShowConfirmPassword] = useState(false)
    
    // OTP step states
    const [showOtpStep, setShowOtpStep] = useState(false)
    const [otpCode, setOtpCode] = useState('')
    const [registeredEmail, setRegisteredEmail] = useState('')
    
    const navigate = useNavigate()

    const userInput = (e) => {
        if (e.target.name === 'avatar') {
            const file = e.target.files[0]
            if (!file) return
            const reader = new FileReader()
            reader.onload = () => {
                if (reader.readyState === 2) {
                    setAvatarPreview(reader.result)
                    setAvatar(reader.result)
                }
            }
            reader.readAsDataURL(file)
        } else {
            setUser({ ...user, [e.target.name]: e.target.value })
        }
    }

    const isStrongPassword = (pass) => {
        const hasMinLength = pass.length >= 8;
        const hasUpperCase = /[A-Z]/.test(pass);
        const hasLowerCase = /[a-z]/.test(pass);
        const hasNumber = /[0-9]/.test(pass);
        const hasSpecialChar = /[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(pass);

        return hasMinLength && hasUpperCase && hasLowerCase && hasNumber && hasSpecialChar;
    }

    const registerSubmit = (e) => {
        e.preventDefault()

        if (!name || !email || !password || !confirmPassword) {
            showToast.error("Please fill in all required fields.")
            return;
        }

        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
            showToast.error("Please enter a valid email address.")
            return;
        }

        if (!isStrongPassword(password)) {
            showToast.error("Password must be at least 8 characters long and contain at least 1 uppercase letter, 1 lowercase letter, 1 number, and 1 special character.")
            return;
        }

        if (password !== confirmPassword) {
            showToast.error("Passwords do not match.")
            return;
        }

        setRegisteredEmail(email)
        const myForm = new FormData();
        myForm.set("name", name);
        myForm.set("email", email);
        myForm.set("password", password);
        myForm.set("confirmPassword", confirmPassword);
        myForm.set("avatar", avatar);
        dispatch(register(myForm))
    }

    const handleVerifyOtp = (e) => {
        e.preventDefault()
        if (!otpCode || otpCode.length !== 6) {
            showToast.error("Please enter a valid 6-digit OTP code.")
            return;
        }
        dispatch(verifyOTP({ email: registeredEmail, otp: otpCode })).then((res) => {
            if (res.meta.requestStatus === 'fulfilled') {
                showToast.success("Email verified successfully! Please log in.")
                dispatch(removeSuccess())
                navigate('/login')
            }
        })
    }

    useEffect(() => {
        if (error) {
            showToast.error(error)
            dispatch(removeErrors())
        }
    }, [dispatch, error])

    useEffect(() => {
        if (success && !showOtpStep && registeredEmail) {
            showToast.success("A 6-digit OTP code has been sent to your email!")
            setShowOtpStep(true)
            dispatch(removeSuccess())
        }
    }, [dispatch, success, showOtpStep, registeredEmail])

    const passwordCriteria = {
        hasMinLength: password.length >= 8,
        hasUpperCase: /[A-Z]/.test(password),
        hasLowerCase: /[a-z]/.test(password),
        hasNumber: /[0-9]/.test(password),
        hasSpecialChar: /[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(password)
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const isEmailValid = emailRegex.test(email);

    return (
        <>
            <PageTitle title="Sign Up - MOCHA" />
            <Navbar />
            <div className="form-container">
                <div className="form-content">
                    {showOtpStep ? (
                        <form className="form" onSubmit={handleVerifyOtp}>
                            <h2>Verify Your Email</h2>
                            <p style={{ textAlign: 'center', color: '#555', marginBottom: '20px', fontSize: '14px' }}>
                                We sent a 6-digit OTP code to <strong>{registeredEmail}</strong>. Please enter it below to complete registration.
                            </p>
                            <div className="input-group">
                                <input
                                    type="text"
                                    maxLength="6"
                                    placeholder="Enter 6-Digit OTP"
                                    value={otpCode}
                                    onChange={(e) => setOtpCode(e.target.value)}
                                    style={{ textAlign: 'center', letterSpacing: '4px', fontSize: '18px', fontWeight: 'bold' }}
                                    required
                                />
                            </div>
                            <button className="authBtn" disabled={loading}>
                                {loading ? "Verifying..." : "Verify & Complete"}
                            </button>
                        </form>
                    ) : (
                        <form className='form' onSubmit={registerSubmit} encType='multipart/form-data'>
                            <h2>Sign up</h2>
                            <div className="input-group">
                                <input onChange={userInput} type="text" placeholder='Enter your name' name="name" value={name} required />
                            </div>
                            <div className="input-group">
                                <input onChange={userInput} type="email" placeholder='Enter your Email' name="email" value={email} required />
                                {email && !isEmailValid && (
                                    <span className="validation-hint invalid">Please enter a valid email address</span>
                                )}
                            </div>
                            <div className="input-group">
                                <div className="password-input-container">
                                    <input onChange={userInput} type={showPassword ? "text" : "password"} placeholder='Enter your password' name="password" value={password} autoComplete="new-password" required />
                                    <span className="password-toggle-icon" onClick={() => setShowPassword(!showPassword)}>
                                        {showPassword ? <VisibilityOff /> : <Visibility />}
                                    </span>
                                </div>
                                {password && (
                                    <ul className="password-checklist">
                                        <li className={passwordCriteria.hasMinLength ? "valid" : "invalid"}>
                                            {passwordCriteria.hasMinLength ? <Done/> : <Clear/> }At least 8 characters
                                        </li>
                                        <li className={passwordCriteria.hasUpperCase ? "valid" : "invalid"}>
                                            {passwordCriteria.hasUpperCase ? <Done/> : <Clear/>} At least 1 uppercase letter (A-Z)
                                        </li>
                                        <li className={passwordCriteria.hasLowerCase ? "valid" : "invalid"}>
                                            {passwordCriteria.hasLowerCase ? <Done/> : <Clear/>} At least 1 lowercase letter (a-z)
                                        </li>
                                        <li className={passwordCriteria.hasNumber ? "valid" : "invalid"}>
                                            {passwordCriteria.hasNumber ? <Done/> : <Clear/>} At least 1 number (0-9)
                                        </li>
                                        <li className={passwordCriteria.hasSpecialChar ? "valid" : "invalid"}>
                                            {passwordCriteria.hasSpecialChar ? <Done/> : <Clear/>} At least 1 special character (!@#$)
                                        </li>
                                    </ul>
                                )}
                            </div>
                            <div className="input-group">
                                <div className="password-input-container">
                                    <input onChange={userInput} type={showConfirmPassword ? "text" : "password"} placeholder='Enter your confirm password' name="confirmPassword" value={confirmPassword} autoComplete="new-password" required />
                                    <span className="password-toggle-icon" onClick={() => setShowConfirmPassword(!showConfirmPassword)}>
                                        {showConfirmPassword ? <VisibilityOff /> : <Visibility />}
                                    </span>
                                </div>
                                {confirmPassword && (
                                    <span className={`validation-hint ${password === confirmPassword ? "valid" : "invalid"}`}>
                                        {password === confirmPassword ? <Done/> : <Clear/>} Passwords {password === confirmPassword ? "match" : "do not match"}
                                    </span>
                                )}
                            </div>
                            <div className="input-group avatar-group">
                                <input onChange={userInput} type="file" name="avatar" className='file-input' accept='image/*' />
                                <img src={avatarPreview} alt="Avatar Preview" className='avatar' />
                            </div>
                            <button className="authBtn" disabled={loading}>{loading ? "Signing up..." : "Sign Up"}</button>
                            <p className="form-links">
                                Already Have an account? <Link to="/login">Sign in here</Link>
                            </p>
                        </form>
                    )}
                </div>
            </div>
            <Footer />
        </>
    )
}

export default Register