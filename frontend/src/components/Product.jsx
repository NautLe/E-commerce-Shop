import React, { useState } from 'react'
import '../componentStyles/Product.css'
import { Link } from 'react-router-dom'
import Rating from '../components/Rating'
import FavoriteIcon from '@mui/icons-material/Favorite'
import FavoriteBorderIcon from '@mui/icons-material/FavoriteBorder'
import { useDispatch, useSelector } from 'react-redux'
import { addToWishlist, removeFromWishlist } from '../features/wishlist/wishlistSlice'
import { showToast } from '../utils/showToast'

const Product = ({ product }) => {
  const dispatch = useDispatch()
  const { isAuthenticated } = useSelector((state) => state.user)
  const { wishlist } = useSelector((state) => state.wishlist)

  const isWishlisted = Boolean(
    wishlist?.products?.some((item) => {
      const pId = item.product?._id || item.product || item._id || item
      return pId?.toString() === product?._id?.toString()
    })
  )

  const handleWishlistToggle = (e) => {
    e.preventDefault()
    e.stopPropagation()
    if (!isAuthenticated) {
      showToast.error('Please login to add items to wishlist')
      return
    }
    if (isWishlisted) {
      dispatch(removeFromWishlist(product._id))
        .unwrap()
        .then(() => showToast.success('Removed from wishlist'))
        .catch((err) => showToast.error(err || 'Failed to remove from wishlist'))
    } else {
      dispatch(addToWishlist(product._id))
        .unwrap()
        .then(() => showToast.success('Added to wishlist'))
        .catch((err) => showToast.error(err || 'Failed to add to wishlist'))
    }
  }

  const [rating, setRating] = useState(0)
  const handleRatingChange = (newRating) => {
    setRating(newRating)
  }

  return (
    <Link to={`/product/${product._id}`} className='product_id'>
      <div className="product-card">
        <button
          type="button"
          className={`product-wishlist-btn ${isWishlisted ? 'active' : ''}`}
          onClick={handleWishlistToggle}
          title={isWishlisted ? "Remove from wishlist" : "Add to wishlist"}
          aria-label="Wishlist"
        >
          {isWishlisted ? (
            <FavoriteIcon className="wishlist-card-icon-filled" />
          ) : (
            <FavoriteBorderIcon className="wishlist-card-icon-empty" />
          )}
        </button>

        <img
          src={product.image?.[0]?.url || '/images/tshirt-white.jpg'}
          alt={product.name}
          className='product-image-card'
        />
        <div className="product-details">
          <h3 className="product-title">{product.name}</h3>
          {product.subcategory && (
            <p className="product-subcategory">{product.subcategory}</p>
          )}
          <p className="product-price">${Number(product.price).toFixed(2)}</p>
          <div className="rating_container">
            <Rating
              value={product.ratings || 0}
              onRatingChange={handleRatingChange}
              disabled={true}
            />
          </div>
          <span className="productCardSpan">
            ({product.numOfReviews || product.numReviews || 0}{' '}
            {(product.numOfReviews || product.numReviews) === 1
              ? 'Review'
              : 'Reviews'}
            )
          </span>

          <button className="add-to-cart">View Details</button>
        </div>
      </div>
    </Link>
  )
}

export default Product
