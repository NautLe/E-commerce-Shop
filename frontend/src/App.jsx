import Home from './pages/Home'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import React, { useEffect } from 'react'
import ProductDetails from './pages/ProductDetails'
import Products from './pages/Products'
import Register from './UserAuthentication/Register'
import Login from './UserAuthentication/Login'
import Profile from './UserAuthentication/Profile'

import UserDashBoard from './UserAuthentication/UserDashBoard'
import { useDispatch, useSelector } from 'react-redux'
import { loadUser } from './features/users/userSlice'
import ProtectedRoutes from './components/ProtectedRoutes'
import UpdateProfile from './UserAuthentication/UpdateProfile'
import UpdatePassword from './UserAuthentication/UpdatePassword'
import ForgotPassword from './UserAuthentication/ForgotPassword'
import ResetPassword from './UserAuthentication/ResetPassword'

const App = () => {
  const { isAuthenticated, user } = useSelector(state => state.user)
  const dispatch = useDispatch()
  useEffect(() => {
    dispatch(loadUser())
  }, [dispatch])
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/product/:id" element={<ProductDetails />} />
        <Route path="/products" element={<Products />} />
        <Route path="/products/:keyword" element={<Products />} />
        <Route path="/register" element={<Register />} />
        <Route path="/login" element={<Login />} />
        <Route path="/password/forgot" element={<ForgotPassword />} />

        <Route path="/profile" element={<ProtectedRoutes element={<Profile />} />} />
        <Route path="/profile/update" element={<ProtectedRoutes element={<UpdateProfile />} />} />
        <Route path="/password/update" element={<ProtectedRoutes element={<UpdatePassword />} />} />
        <Route path="/password/forgot" element={<ForgotPassword />} />
        <Route path="/reset/:token" element={<ResetPassword />} />







      </Routes>
      {isAuthenticated && <UserDashBoard user={user} />}
    </Router>
  )
}

export default App

