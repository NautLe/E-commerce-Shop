import React, { useState, useRef, useEffect } from 'react'
import '../UserStyles/UserDashboard.css'
import { useNavigate } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import { showToast } from '../utils/showToast'
import { logout, removeSuccess } from '../features/users/userSlice'

const UserDashBoard = ({ user }) => {
  const { cartItems } = useSelector(state => state.cart)
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const [menuVisible, setMenuVisible] = useState(false)
  const menuRef = useRef(null)

  function toggleMenu() {
    setMenuVisible(!menuVisible)
  }

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setMenuVisible(false)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  const options = [
    { name: 'Profile Account', onClick: profile },
    { name: 'Saved Addresses', onClick: myAddresses },
    { name: 'My Orders', onClick: orders },
    { name: `Cart (${cartItems?.length || 0})`, onClick: myCart, isCart: true },
    { name: 'Logout', onClick: logoutUser }
  ]
  if (user?.role === 'admin') {
    options.unshift(
      { name: 'Admin Dashboard', onClick: dashboard },
    )
  }

  function myWishlist() {
    setMenuVisible(false)
    navigate("/wishlist")
  }
  function myAddresses() {
    setMenuVisible(false)
    navigate("/addresses")
  }
  function categories() {
    setMenuVisible(false)
    navigate("/admin/categories")
  }
  function myCart() {
    setMenuVisible(false)
    navigate("/cart")
  }
  function orders() {
    setMenuVisible(false)
    navigate("/orders")
  }
  function profile() {
    setMenuVisible(false)
    navigate("/profile")
  }
  function logoutUser() {
    setMenuVisible(false)
    dispatch(logout())
      .unwrap()
      .then(() => {
        showToast.success('Logout Successful.')
        dispatch(removeSuccess())
        navigate('/')
      })
      .catch((error) => {
        showToast.error(error.message || 'Logout Failed.')
      })
  }
  function dashboard() {
    setMenuVisible(false)
    navigate("/admin/dashboard")
  }

  const avatarUrl = user?.avatar?.url ? user.avatar.url : '/images/admin-logo.png'

  return (
    <div className="user-dashboard-wrapper" ref={menuRef}>
      {menuVisible && <div className="menu-backdrop-overlay" onClick={() => setMenuVisible(false)}></div>}
      <div className="profile-header" onClick={toggleMenu} title={user?.name || 'User Profile'}>
        <img src={avatarUrl} alt="Profile Avatar" className='profile-avatar' />
      </div>
      {menuVisible && (
        <div className="menu-options">
          <div className="menu-user-info">
            <span className="user-info-name">{user?.name || 'User'}</span>
            <span className="user-info-email">{user?.email || ''}</span>
          </div>
          <div className="menu-divider"></div>
          {options.map((items) => (
            <button
              className={`menu-option-btn ${items.isCart ? (cartItems?.length > 0 ? 'cart-not-empty' : '') : ''}`}
              onClick={items.onClick}
              key={items.name}
            >
              {items.name}
            </button>
          ))}
        </div>
      )}
    </div>
  )
}

export default UserDashBoard