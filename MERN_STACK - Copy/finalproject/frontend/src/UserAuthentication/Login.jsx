import React, { useEffect, useState } from 'react'
import '../UserStyles/Form.css'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import { login, removeErrors, removeSuccess } from '../features/users/userSlice'
import { showToast } from '../utils/showToast'
import Visibility from '@mui/icons-material/Visibility'
import VisibilityOff from '@mui/icons-material/VisibilityOff'


const Login = () => {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const { loading, error, success, isAuthenticated } = useSelector(state => state.user)
  const navigate = useNavigate()
  const dispatch = useDispatch()
  const location = useLocation()
  const redirect = new URLSearchParams(location.search).get("redirect") || "/"
  const LoginSubmit = (e) => {
    e.preventDefault()
    if (!email || !password) {
      showToast.error("Please enter both email and password.")
      return;
    }
    dispatch(login({ email: email, password: password }))
  }
  useEffect(() => {
    if (error) {
      showToast.error(error)
      dispatch(removeErrors())
    }
  }, [dispatch, error])

  useEffect(() => {
    if (success) {
      showToast.success('Login Successful')
      dispatch(removeSuccess())
    }
  }, [dispatch, success])

  useEffect(() => {
    if (isAuthenticated) {
      navigate(redirect)
    }
  }, [isAuthenticated])


  return (
    <div className="form-container">
      <div className="form-content">
        <form className="form" onSubmit={LoginSubmit}>
          <h2>Sign In</h2>
          <div className="input-group">
            <input type="email" placeholder='Email' value={email} onChange={(e) => setEmail(e.target.value)} required />
          </div>
          <div className="input-group">
            <div className="password-input-container">
              <input type={showPassword ? "text" : "password"} placeholder='Password' value={password} onChange={(e) => setPassword(e.target.value)} required />
              <span className="password-toggle-icon" onClick={() => setShowPassword(!showPassword)}>
                {showPassword ? <VisibilityOff /> : <Visibility />}
              </span>
            </div>
          </div>
          <button className="authBtn">Sign In</button>
          <p className="form-links">Forgot your Password?<Link to="/password/forgot">Click Here</Link></p>
          <p className="form-links">Don't have an account Yet?<Link to="/register"> Sign Up Here</Link></p>

        </form>
      </div>
    </div>
  )
}

export default Login