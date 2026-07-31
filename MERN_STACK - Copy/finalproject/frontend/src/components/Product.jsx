import React, { useState } from 'react'
import '../componentStyles/Product.css'
import { Link } from 'react-router-dom'
import Rating from '../components/Rating'

const Product = ({ product }) => {
  const [rating, setRating] = useState(0)
  const handleRatingChange = (newRating) => {
    setRating(newRating)
    console.log(`Rating changed to ${newRating}`)
  }

  return (
    <Link to={`/product/${product._id}`} className='product_id'>
      <div className="product-card">
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
