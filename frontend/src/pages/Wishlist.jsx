import React, { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { fetchWishlist, removeFromWishlist, clearWishlistErrors, clearWishlistMessage } from '../features/wishlist/wishlistSlice'
import { addItemsToCart } from '../features/cart/cartSlice'
import { showToast } from '../utils/showToast'
import Navbar from '../components/Navbar'
import Footer from '../components/Footer'
import PageTitle from '../components/PageTitle'
import Loader from '../components/Loader'
import { Link } from 'react-router-dom'
import { Delete, ShoppingCart, FavoriteBorder } from '@mui/icons-material'
import '../pageStyles/Wishlist.css'

const Wishlist = () => {
    const dispatch = useDispatch()
    const { wishlist, loading, error, message } = useSelector(state => state.wishlist)

    useEffect(() => {
        dispatch(fetchWishlist())
    }, [dispatch])

    useEffect(() => {
        if (error) {
            showToast.error(error)
            dispatch(clearWishlistErrors())
        }
        if (message) {
            showToast.success(message)
            dispatch(clearWishlistMessage())
        }
    }, [dispatch, error, message])

    const handleRemove = (productId) => {
        dispatch(removeFromWishlist(productId))
    }

    const handleAddToCart = (product) => {
        dispatch(addItemsToCart({ id: product._id, quantity: 1 }))
            .unwrap()
            .then(() => {
                showToast.success('Moved product to cart!')
            })
            .catch((err) => {
                showToast.error(err.message || 'Could not add to cart')
            })
    }

    const products = wishlist?.products || []

    return (
        <>
            <PageTitle title="My Wishlist - MOCHA" />
            <Navbar />

            <div className="wishlist-container">
                <h1 className="wishlist-title">My Wishlist</h1>

                {loading && products.length === 0 ? (
                    <Loader />
                ) : products.length === 0 ? (
                    <div className="empty-wishlist">
                        <div className="empty-wishlist-icon">
                            <FavoriteBorder style={{ fontSize: '48px', color: '#999' }} />
                        </div>
                        <h3>Your wishlist is empty</h3>
                        <p>Explore our products and tap the heart icon to save your favorites!</p>
                        <Link to="/products" className="wishlist-shop-btn">
                            Discover Products
                        </Link>
                    </div>
                ) : (
                    <div className="wishlist-grid">
                        {products.map((item) => {
                            const p = item.product
                            if (!p) return null
                            return (
                                <div className="wishlist-card" key={p._id}>
                                    <div className="wishlist-image-wrapper">
                                        <img src={p.image?.[0]?.url || '/images/product-placeholder.png'} alt={p.name} />
                                        <button
                                            className="wishlist-remove-btn"
                                            onClick={() => handleRemove(p._id)}
                                            title="Remove item"
                                        >
                                            <Delete style={{ fontSize: '18px' }} />
                                        </button>
                                    </div>
                                    <div className="wishlist-card-content">
                                        <h3 className="wishlist-card-name">
                                            <Link to={`/product/${p._id}`}>{p.name}</Link>
                                        </h3>
                                        <p className="wishlist-card-category">{p.category}</p>
                                        <div className="wishlist-card-footer">
                                            <span className="wishlist-card-price">${p.price?.toFixed(2)}</span>
                                            <button
                                                className="wishlist-cart-btn"
                                                onClick={() => handleAddToCart(p)}
                                            >
                                                <ShoppingCart style={{ fontSize: '16px' }} /> Add to Cart
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            )
                        })}
                    </div>
                )}
            </div>

            <Footer />
        </>
    )
}

export default Wishlist
