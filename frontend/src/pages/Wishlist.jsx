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
        if (!product.stock || product.stock <= 0) {
            showToast.error('Product is out of stock!')
            return
        }
        dispatch(addItemsToCart({ id: product._id, quantity: 1 }))
            .unwrap()
            .then(() => {
                showToast.success('Moved product to cart!')
            })
            .catch((err) => {
                showToast.error(err.message || err || 'Could not add to cart')
            })
    }

    const validProducts = (wishlist?.products || []).filter(
        (item) => item.product && typeof item.product === 'object' && item.product._id && item.product.name
    )

    return (
        <>
            <PageTitle title="My Wishlist - MOCHA" />
            <Navbar />

            <div className="wishlist-container">
                <h1 className="wishlist-title">My Wishlist</h1>

                {loading && validProducts.length === 0 ? (
                    <Loader />
                ) : validProducts.length === 0 ? (
                    <div className="empty-wishlist">
                        <div className="empty-wishlist-icon">
                            <FavoriteBorder className="empty-wishlist-heart-icon" />
                        </div>
                        <h3>Your wishlist is empty</h3>
                        <p>Explore our products and tap the heart icon to save your favorites!</p>
                        <Link to="/products" className="wishlist-shop-btn">
                            Discover Products
                        </Link>
                    </div>
                ) : (
                    <div className="wishlist-grid">
                        {validProducts.map((item) => {
                            const p = item.product
                            const isOutOfStock = !p.stock || p.stock <= 0
                            return (
                                <div className="wishlist-card" key={p._id}>
                                    <div className="wishlist-image-wrapper">
                                        <img src={p.image?.[0]?.url || '/images/product-placeholder.png'} alt={p.name} />
                                        <button
                                            className="wishlist-remove-btn"
                                            onClick={() => handleRemove(p._id)}
                                            title="Remove item"
                                        >
                                            <Delete className="wishlist-remove-icon" />
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
                                                disabled={isOutOfStock}
                                            >
                                                <ShoppingCart className="wishlist-cart-icon" /> {isOutOfStock ? 'Out of Stock' : 'Add to Cart'}
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
