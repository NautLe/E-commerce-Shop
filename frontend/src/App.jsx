import Home from './pages/Home'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import React, { useEffect, useState } from 'react'
import ProductDetails from './pages/ProductDetails'
import Products from './pages/Products'
import Register from './UserAuthentication/Register'
import Login from './UserAuthentication/Login'
import Profile from './UserAuthentication/Profile'

import { useDispatch } from 'react-redux'
import { loadUser } from './features/users/userSlice'
import ProtectedRoutes from './components/ProtectedRoutes'
import UpdateProfile from './UserAuthentication/UpdateProfile'
import UpdatePassword from './UserAuthentication/UpdatePassword'
import ForgotPassword from './UserAuthentication/ForgotPassword'
import ResetPassword from './UserAuthentication/ResetPassword'
import Shipping from './Cart/Shipping'
import Cart from './Cart/Cart'
import ConfirmOrder from './Cart/ConfirmOrder'
import Payment from './Cart/Payment'
import PaymentSuccess from './Cart/PaymentSuccess'
import MyOrders from './Order/MyOrders'
import OrderDetails from './Order/OrderDetails'
import AdminDashboard from './Admin/AdminDashboard'
import ProductList from './Admin/ProductList'
import CreateProduct from './Admin/CreateProduct'
import UpdateProduct from './Admin/UpdateProduct'
import UsersList from './Admin/UsersList'
import UpdateRole from './Admin/UpdateRole'
import OrdersList from './Admin/OrdersList'
import Loader from './components/Loader'
import UpdateOrderStatus from './Admin/UpdateOrderStatus'
import ReviewList from './Admin/ReviewList'
import VoucherList from './Admin/VoucherList'
import CreateVoucher from './Admin/CreateVoucher'
import Wishlist from './pages/Wishlist'
import Addresses from './UserAuthentication/Addresses'
import Contact from './pages/Contact'
import { fetchCart } from './features/cart/cartSlice'
const App = () => {
  const dispatch = useDispatch()
  const [authChecked, setAuthChecked] = useState(false)

  useEffect(() => {
    dispatch(fetchCart())
    dispatch(loadUser())
    .finally(() => setAuthChecked(true))
  }, [dispatch])

  if (!authChecked) {
    return <Loader />
  }

  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/contact" element={<Contact />} />
        <Route path="/product/:id" element={<ProductDetails />} />
        <Route path="/products" element={<Products />} />
        <Route path="/products/:keyword" element={<Products />} />

        {/* // Category Routes // */}
        <Route path="/women" element={<Products categoryProp="women" />} />
        <Route path="/men" element={<Products categoryProp="men" />} />
        <Route path="/unisex" element={<Products categoryProp="unisex" />} />
        <Route path="/essentials" element={<Products categoryProp="essentials" />} />
        <Route path="/category/:categoryName" element={<Products />} />

        {/* // auth routes */}
        <Route path="/register" element={<Register />} />
        <Route path="/login" element={<Login />} />
        <Route path="/password/forgot" element={<ForgotPassword />} />
        <Route path="/reset/:token" element={<ResetPassword />} />
        <Route path="/password/reset/:token" element={<ResetPassword />} />


        <Route path="/cart" element={<Cart/>} />
        <Route path="/wishlist" element={<ProtectedRoutes element={<Wishlist />} />} />
        <Route path="/addresses" element={<ProtectedRoutes element={<Addresses />} />} />
        <Route path="/profile" element={<ProtectedRoutes element={<Profile />} />} />
        <Route path="/profile/update" element={<ProtectedRoutes element={<UpdateProfile />} />} />
        <Route path="/password/update" element={<ProtectedRoutes element={<UpdatePassword />} />} />
        <Route path="/shipping" element={<ProtectedRoutes element={<Shipping />} />} />

        {/* // order routes */}
        <Route path="/order/confirm" element={<ProtectedRoutes element={<ConfirmOrder />} />} />
        <Route path="/order/payment" element={<ProtectedRoutes element={<Payment />} />} />
        <Route path="/orders" element={<ProtectedRoutes element={<MyOrders />} />} />
        <Route path="/paymentSuccess" element={<ProtectedRoutes element={<PaymentSuccess />} />} />
        <Route path="/order/:orderId" element={<ProtectedRoutes element={<OrderDetails />} />} />

        {/* // admin routes  */}
        <Route path="/admin/dashboard" element={<ProtectedRoutes element={<AdminDashboard />} adminOnly={true}/>} />
        <Route path="/admin/products" element={<ProtectedRoutes element={<ProductList />} adminOnly={true}/>} />
        <Route path="/admin/product/create" element={<ProtectedRoutes element={<CreateProduct />} adminOnly={true}/>} />
        <Route path="/admin/product/reviews" element={<ProtectedRoutes element={<ReviewList />} adminOnly={true}/>} />
        <Route path="/admin/product/:updateId" element={<ProtectedRoutes element={<UpdateProduct />} adminOnly={true}/>} />
        <Route path="/admin/users" element={<ProtectedRoutes element={<UsersList />} adminOnly={true}/>} />
        <Route path="/admin/user/:userId" element={<ProtectedRoutes element={<UpdateRole />} adminOnly={true}/>} />
        <Route path="/admin/orders" element={<ProtectedRoutes element={<OrdersList />} adminOnly={true}/>} />
        <Route path="/admin/order/:orderId" element={<ProtectedRoutes element={<UpdateOrderStatus />} adminOnly={true}/>} />
        <Route path="/admin/vouchers" element={<ProtectedRoutes element={<VoucherList />} adminOnly={true}/>} />
        <Route path="/admin/voucher/create" element={<ProtectedRoutes element={<CreateVoucher />} adminOnly={true}/>} />

      </Routes>
    </Router>
  )
}

export default App
