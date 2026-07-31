import React, { useState, useEffect } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import '../componentStyles/Navbar.css'
import { Link, useLocation } from 'react-router-dom'
import AccountCircleOutlinedIcon from '@mui/icons-material/AccountCircleOutlined'
import ShoppingCartOutlinedIcon from '@mui/icons-material/ShoppingCartOutlined'
import CloseIcon from '@mui/icons-material/Close'
import MenuIcon from '@mui/icons-material/Menu'
import FavoriteBorderIcon from '@mui/icons-material/FavoriteBorder'
import NotificationMenu from './NotificationMenu'
import UserDashBoard from '../UserAuthentication/UserDashBoard'
import { fetchWishlist } from '../features/wishlist/wishlistSlice'

const Navbar = () => {
    const dispatch = useDispatch()
    const [isMenuOpen, setIsMenuOpen] = useState(false)

    const { isAuthenticated, user } = useSelector(state => state.user)
    const { cartItems } = useSelector(state => state.cart)
    const { wishlist } = useSelector(state => state.wishlist)

    useEffect(() => {
        if (isAuthenticated) {
            dispatch(fetchWishlist())
        }
    }, [dispatch, isAuthenticated])

    const location = useLocation()
    const searchParams = new URLSearchParams(location.search)
    const activeCategory = searchParams.get('category')?.toLowerCase() || ''

    const wishlistCount = wishlist?.products?.length || 0

    return (
        <header className="mocha-header navbar-fixed">
            <Link to="/" className="mocha-logo" onClick={() => setIsMenuOpen(false)}>
                MOCHA
            </Link>
            <nav className={`mocha-nav-links ${isMenuOpen ? 'active' : ''}`}>
                <Link
                    to="/products?category=women"
                    className={activeCategory === 'women' ? 'active' : ''}
                    onClick={() => setIsMenuOpen(false)}
                >
                    Women
                </Link>
                <Link
                    to="/products?category=men"
                    className={activeCategory === 'men' ? 'active' : ''}
                    onClick={() => setIsMenuOpen(false)}
                >
                    Men
                </Link>
                <Link
                    to="/products?category=unisex"
                    className={activeCategory === 'unisex' ? 'active' : ''}
                    onClick={() => setIsMenuOpen(false)}
                >
                    Unisex
                </Link>
                <Link
                    to="/products?category=essentials"
                    className={activeCategory === 'essentials' ? 'active' : ''}
                    onClick={() => setIsMenuOpen(false)}
                >
                    Essentials
                </Link>
            </nav>

            <div className="mocha-actions">
                {isAuthenticated && <NotificationMenu />}

                {isAuthenticated && (
                    <Link to="/wishlist" className="mocha-cart-btn" aria-label="Wishlist" title="Wishlist">
                        <FavoriteBorderIcon />
                        {wishlistCount > 0 && (
                            <span className="mocha-cart-badge">{wishlistCount}</span>
                        )}
                    </Link>
                )}

                <Link to="/cart" className="mocha-cart-btn" aria-label="Cart" title="Cart">
                    <ShoppingCartOutlinedIcon />
                    {cartItems && cartItems.length > 0 && (
                        <span className="mocha-cart-badge">{cartItems.length}</span>
                    )}
                </Link>

                {isAuthenticated && user ? (
                    <UserDashBoard user={user} />
                ) : (
                    <Link to="/login" aria-label="Log in">
                        <AccountCircleOutlinedIcon />
                    </Link>
                )}

                <button className="mocha-hamburger" onClick={() => setIsMenuOpen(!isMenuOpen)} aria-label="Toggle menu">
                    {isMenuOpen ? <CloseIcon /> : <MenuIcon />}
                </button>
            </div>
        </header>
    )
}

export default Navbar