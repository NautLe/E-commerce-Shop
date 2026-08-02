import React, { useEffect, useState } from 'react'
import '../pageStyles/ProductDetails.css'
import PageTitle from '../components/PageTitle'
import Navbar from '../components/Navbar'
import Footer from '../components/Footer'
import Rating from '../components/Rating'
import FavoriteIcon from '@mui/icons-material/Favorite'
import FavoriteBorderIcon from '@mui/icons-material/FavoriteBorder'
import { useDispatch, useSelector } from 'react-redux'
import { getProductDetails, removeErrors, createReview, removeReviewSuccess, removeReviewError } from '../features/products/productSlice'
import { useParams } from 'react-router-dom'
import Loader from '../components/Loader'
import { showToast } from '../utils/showToast'
import { addItemsToCart, removeMessage, removeErrors as removeCartErrors } from '../features/cart/cartSlice'
import { addToWishlist, removeFromWishlist } from '../features/wishlist/wishlistSlice'

const ProductDetails = () => {
    const [quantity, setQuantity] = useState(1)
    const [userRating, setUserRating] = useState(0)
    const [comment, setComment] = useState('')
    const [selectedImage, setSelectedImage] = useState(null)
    const [selectedSize, setSelectedSize] = useState('')
    const handleRatingChange = (newRating) => {
        setUserRating(newRating)
    }

    const { loading, error, product, reviewSuccess, reviewError, reviewLoading } = useSelector((state) => state.product)
    const { loading: cartLoading, error: cartError, success, message } = useSelector((state) => state.cart)
    const { isAuthenticated } = useSelector((state) => state.user)
    const { wishlist } = useSelector((state) => state.wishlist)
    const dispatch = useDispatch()
    const { id } = useParams()

    const isWishlisted = Boolean(
        wishlist?.products?.some((item) => {
            const pId = item.product?._id || item.product || item._id || item
            return pId?.toString() === id?.toString()
        })
    )

    const handleWishlistToggle = () => {
        if (!isAuthenticated) {
            showToast.error('Please login to add items to wishlist')
            return
        }
        if (isWishlisted) {
            dispatch(removeFromWishlist(id))
                .unwrap()
                .then(() => showToast.success(`The {item.name} was removed from wishlist`))
                .catch((err) => showToast.error(err || 'Failed to remove from wishlist'))
        } else {
            dispatch(addToWishlist(id))
                .unwrap()
                .then(() => showToast.success('Added to wishlist'))
                .catch((err) => showToast.error(err || 'Failed to add to wishlist'))
        }
    }

    useEffect(() => {
        if (id) {
            dispatch(getProductDetails(id))
        }
        return () => {
            dispatch(removeErrors())
        }
    }, [dispatch, id])

    useEffect(() => {
        if (error) {
            showToast.error(typeof error === 'string' ? error : error.response?.data?.message || error.message)
            dispatch(removeErrors())
        }
        if (cartError) {
            showToast.error(cartError)
            dispatch(removeCartErrors())
        }
        if (reviewError) {
            showToast.error(reviewError)
            dispatch(removeReviewError())
        }
    }, [dispatch, error, cartError, reviewError])

    useEffect(() => {
        if (success) {
            showToast.success(message)
            dispatch(removeMessage())
        }
        if (reviewSuccess) {
            showToast.success('Review submitted successfully!')
            dispatch(removeReviewSuccess())
            setUserRating(0)
            setComment('')
            dispatch(getProductDetails(id))
        }
    }, [dispatch, success, message, reviewSuccess, id])

    useEffect(() => {
        if (product && product.image && product.image.length > 0) {
            setSelectedImage(product.image[0].url)
        }
        if (product) {
            const isEssential = product.category?.toLowerCase() === 'essentials'
            const defaultSize = isEssential ? 'OS' : (product.sizes?.[0] || 'S')
            setSelectedSize(defaultSize)
        }
    }, [product])

    if (loading) {
        return (
            <>
                <Navbar />
                <Loader />
                <Footer />
            </>
        )
    }

    const increaseQuantity = ()=> {
        if (product.stock <= quantity) {
            showToast.error("Only " + product.stock + " items available.");
            return;
        }
        setQuantity(qty => qty + 1)
    }

    const decreaseQuantity = () =>{
        if (quantity <= 1) {
            showToast.error("Quantity cannot be less than 1");
            return;
        }
        setQuantity(qty => qty - 1)
    }

    const isEssential = product?.category?.toLowerCase() === 'essentials'
    const availableSizes = isEssential ? ['OS'] : (product?.sizes?.length ? product.sizes : ['S', 'M', 'L', 'XL'])

    const addToCart = () => {
        const finalSize = selectedSize || (isEssential ? 'OS' : 'S')
        dispatch(
          addItemsToCart({
            id,
            quantity,
            size: finalSize,
            stock: product.stock,
            image: selectedImage || (product.image[0]?.url || ''),
          })
        )
    }

    const handleReviewSubmit = (e) => {
        e.preventDefault()
        if (!isAuthenticated) {
            showToast.error('Please login to submit a review')
            return
        }
        if (userRating === 0) {
            showToast.error('Please select a rating')
            return
        }
        if (!comment.trim()) {
            showToast.error('Please write a review comment.')
            return
        }
        dispatch(createReview({ productId: id, rating: userRating, comment }))
    }

    if (error || !product) {
        return (
            <>
                <PageTitle title='Product details' />
                <Navbar />
                <Footer />
            </>
        )
    }

    return (
        <>
            <PageTitle title={`${product.name} - ${product.title || ''}`} />
            <Navbar />
            <div className="product-details-container">
                <div className="product-detail-container">
                    <div className="product-image-container">
                    <img src={selectedImage || (product.image[0]?.url || null)} 
                    alt={product.name} className='product-detail-image' />
                    {product.image.length > 1 && (
                        <div className="product-thumbnails">
                                {product.image.map((img, index) => (
                                    <img
                                        src={img.url}
                                        alt={`Thumbnail${index + 1}`}
                                        className={`thumbnail-image ${selectedImage === img.url ? 'selected' : ''}`}
                                        key={index}
                                        onClick={() => setSelectedImage(img.url)}
                                    />
                                ))}
                        </div>
                    )}
</div>

                    <div className="product-info">
                        <h2>{product.name}</h2>
                        {(product.category || product.subcategory) && (
                          <p style={{ fontSize: '13px', color: '#777', textTransform: 'uppercase', letterSpacing: '0.8px', margin: '4px 0 12px 0' }}>
                            {product.category}{product.subcategory ? ` / ${product.subcategory}` : ''}
                          </p>
                        )}
                        <p className="product-description">{product.description}</p>
                        <p className="product-price">${product.price}</p>
                        <div className="product-rating">
                            <Rating
                                value={product.ratings || 0}
                                disabled={true}
                            />
                            <div className="productCardSpan">({product.numReviews || 0} {product.numReviews === 1 ? "Review" : "Reviews"})</div>

                            <div className="stock-status">
                                <span className={product.stock > 0 ? "in-stock" : "out-of-stock"}>
                                    {product.stock > 0 ? `In stock (${product.stock} available)` : 'Out Of Stock'}
                                </span>
                                {product.stock > 0 && (<>
                                    <div className="product-size-container">
                                        <label className="size-label">
                                            Size: <strong style={{ color: '#111', textTransform: 'uppercase' }}>{selectedSize || (isEssential ? 'OS' : 'S')}</strong>
                                        </label>
                                        <div className="size-buttons-group">
                                            {availableSizes.map((sz) => (
                                                <button
                                                    key={sz}
                                                    type="button"
                                                    className={`size-btn ${selectedSize === sz ? 'active' : ''}`}
                                                    onClick={() => setSelectedSize(sz)}
                                                >
                                                    {sz}
                                                </button>
                                            ))}
                                        </div>
                                    </div>
                                    <div className="quantity-controls">
                                        <span className="quantity">Quantity:  </span>
                                        <button className="quantity-button" onClick={decreaseQuantity}>-</button>
                                        <input type="text"
                                            value={quantity}
                                            className='quantity-value' readOnly
                                        />
                                        <button className="quantity-button" onClick={increaseQuantity}>+</button>
                                    </div>
                                    <div style={{ display: 'flex', gap: '12px', alignItems: 'center', marginTop: '15px' }}>
                                        <button className="add-to-cart-btn" disabled={cartLoading} onClick={addToCart} style={{ margin: 0, flex: 1 }}>{cartLoading ? 'Adding...' : 'Add to Cart'} </button>
                                        <button
                                            type="button"
                                            className={`details-wishlist-btn ${isWishlisted ? 'active' : ''}`}
                                            onClick={handleWishlistToggle}
                                            title={isWishlisted ? "Remove from Wishlist" : "Add to Wishlist"}
                                            aria-label="Wishlist"
                                            style={{
                                                background: isWishlisted ? '#fff0f3' : '#ffffff',
                                                border: isWishlisted ? '1px solid #ff4d4f' : '1px solid #ddd',
                                                borderRadius: '6px',
                                                padding: '10px 16px',
                                                cursor: 'pointer',
                                                display: 'flex',
                                                alignItems: 'center',
                                                justifyContent: 'center',
                                                transition: 'all 0.2s ease',
                                                height: '46px'
                                            }}
                                        >
                                            {isWishlisted ? (
                                                <FavoriteIcon style={{ color: '#e63946', fontSize: '22px' }} />
                                            ) : (
                                                <FavoriteBorderIcon style={{ color: '#555', fontSize: '22px' }} />
                                            )}
                                        </button>
                                    </div>
                                </>
                                )}

                                <form className="review-form" onSubmit={handleReviewSubmit}>
                                    <h3>Write a Review</h3>
                                    <Rating
                                        value={userRating}
                                        disabled={false}
                                        onRatingChange={handleRatingChange}
                                    />
                                    <textarea
                                        placeholder='Write something about this product here..'
                                        className="review-input"
                                        value={comment}
                                        onChange={(e) => setComment(e.target.value)}
                                    ></textarea>
                                    <button className="submit-review-btn" type="submit" disabled={reviewLoading}>
                                        {reviewLoading ? 'Submitting...' : 'Submit Review'}
                                    </button>
                                </form>
                            </div>
                        </div>
                    </div>
                </div>
                <div className="reviews-container">
                    <h3>Reviews</h3>
                    {product.reviews && product.reviews.length > 0 ? (<div className="reviews-section">
                        {product.reviews.map((review, index) => (
                            <div className="review-item" key={index}>
                                <div className="review-header">
                                    <Rating
                                        value={review.rating}
                                        disabled={true}
                                    />
                                    <p className="review-comment">{review.comment}</p>
                                    <p className="review-name">By {review.name} </p>
                                    <p className="review-createdAt">{review.createdAt} </p>

                                </div>
                            </div>
                        ))
                        }
                    </div>) : (
                        <p className="no-review">No reviews yet. Be the first one to review!</p>
                    )}
                </div>
            </div>
            <Footer />
        </>
    )
}

export default ProductDetails