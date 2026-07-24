import React, { useEffect, useState } from 'react'
import '../UserStyles/Form.css'
import { Link, useNavigate } from 'react-router-dom'
import { showToast } from '../utils/showToast'
import { useDispatch, useSelector } from 'react-redux'
import { register, removeErrors, removeSuccess } from '../features/users/userSlice'
import Visibility from '@mui/icons-material/Visibility'
import VisibilityOff from '@mui/icons-material/VisibilityOff'

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

    // Helper function to check if a password meets strength requirements
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

        // Check if all required fields are filled
        if (!name || !email || !password || !confirmPassword) {
            showToast.error("Please fill in all required fields.")
            return;
        }

        // Validate email format
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
            showToast.error("Please enter a valid email address.")
            return;
        }

        // Validate password strength
        if (!isStrongPassword(password)) {
            showToast.error("Password must be at least 8 characters long and contain at least 1 uppercase letter, 1 lowercase letter, 1 number, and 1 special character.")
            return;
        }

        // Check if password and confirm password match
        if (password !== confirmPassword) {
            showToast.error("Passwords do not match.")
            return;
        }

        const myForm = new FormData();
        myForm.set("name", name);
        myForm.set("email", email);
        myForm.set("password", password);
        myForm.set("confirmPassword", confirmPassword);
        myForm.set("avatar", avatar);

        dispatch(register(myForm))
    }

    useEffect(() => {
        if (error) {
            showToast.error(error)
            dispatch(removeErrors())
        }
    }, [dispatch, error])

    useEffect(() => {
        if (success) {
            showToast.success("Registration Successful. Please log in.")
            dispatch(removeSuccess())
            navigate('/login')
        }
    }, [dispatch, success, navigate])

    // Real-time password criteria check
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
        <div className="form-container container">
            <div className="form-content">
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
                                    {passwordCriteria.hasMinLength ? "✔️" : "❌"} At least 8 characters
                                </li>
                                <li className={passwordCriteria.hasUpperCase ? "valid" : "invalid"}>
                                    {passwordCriteria.hasUpperCase ? "✔️" : "❌"} At least 1 uppercase letter (A-Z)
                                </li>
                                <li className={passwordCriteria.hasLowerCase ? "valid" : "invalid"}>
                                    {passwordCriteria.hasLowerCase ? "✔️" : "❌"} At least 1 lowercase letter (a-z)
                                </li>
                                <li className={passwordCriteria.hasNumber ? "valid" : "invalid"}>
                                    {passwordCriteria.hasNumber ? "✔️" : "❌"} At least 1 number (0-9)
                                </li>
                                <li className={passwordCriteria.hasSpecialChar ? "valid" : "invalid"}>
                                    {passwordCriteria.hasSpecialChar ? "✔️" : "❌"} At least 1 special character (!@#$)
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
                                {password === confirmPassword ? "✔️ Passwords match" : "❌ Passwords do not match"}
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
            </div>
        </div>
    )
}

export default Register