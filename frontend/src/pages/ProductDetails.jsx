import React, { useEffect, useState } from 'react'
import '../pageStyles/ProductDetails.css'
import PageTitle from '../components/PageTitle'
import Navbar from '../components/Navbar'
import Footer from '../components/Footer'
import Rating from '../components/Rating'
import { useDispatch, useSelector } from 'react-redux'
import { getProductDetails, removeErrors } from '../features/products/productSlice'
import { useParams } from 'react-router-dom'
import Loader from '../components/Loader'
import { showToast } from '../utils/showToast'
const ProductDetails = () => {
    const [quantity, setQuantity] = useState(1)
    const [userRating, setUserRating] = useState(0)
    const handleRatingChange = (newRating) =>{
        setUserRating(newRating)
        
    }
    const {loading,error,product} = useSelector((state)=>state.product)
    const dispatch = useDispatch()
    const {id} = useParams();
    useEffect(()=>{
        if(id){
            dispatch(getProductDetails(id))
        }
        // clean up function
        return () =>{
            dispatch(removeErrors())
        }
    },[dispatch,id])
    useEffect(()=>{
        if(error){
            showToast.error(error.response?.data?.message || error.message)
        }        
    },[dispatch,error])
    if(loading){
        return (
            <>
            <Navbar/>
            <Loader/>
            <Footer/>
            </>
        )
    }
    function increaseQuantity() {
        if (product.stock <= quantity ) {
            showToast.error("Only " + product.stock + " items available.");
            dispatch(removeErrors())
            return;
    }
    setQuantity(qty=>qty+1)
}
 function decreaseQuantity(){
    if(quantity <= 1){
        showToast.error("Quantity cannot be less than 1");
        dispatch(removeErrors())
        return;
    }
    setQuantity(qty=>qty-1)
 }
    if(error || !product){
        return (
            <>
            <PageTitle title='Product details'/>

            <Navbar/>
            <Footer/>
            </>
        )
    }
  return (
    <>
    <PageTitle title={`${product.name} - ${product.title}`}/>
    <Navbar/>
    <div className="product-details-container">
        <div className="product-detail-container">
            <img src="{`${product.image[0].url.replace('./','/')}`}" alt={product.name} className='product-image' />

        <div className="product-info">
            <h2>{product.name}</h2>
            <p className="product-description">{product.description}</p>
            <p className="product-price">{product.price}</p>
            <div className="product-rating">
                <Rating 
                value={product.rating}
                disabled={true}
                />
                <div className="productCardSpan">({product.numOfReviews} {product.numOfReviews===1?"Review": "Reviews"})</div>
                
                 <div className="stock-status">
            <span className={product.stock>0? "in-stock":"out-of-stock"}>
                {product.stock>0?`In stock (${product.stock} available)`:'Out Of Stock'}
            </span>
            {product.stock>0 &&(<> 
            <div className="quantity-controls">
                <span className="quantity">Quantity:  </span>
                <button className="quantity-button" onClick={decreaseQuantity}>-</button>
                <input type="text" 
                value={quantity} 
                className='quantity-value' readOnly
                 />
                <button className="quantity-button"onClick={increaseQuantity}>+</button>
            </div>
            <button className="add-to-cart-btn">Add to Cart</button>
            </>
        )}

            <form className="review-form"></form>
            <h3>Write a Review</h3>
            <Rating
                value = {0}
                disabled = {false}
                onRatingChange={handleRatingChange}
            />
            <textarea 
            placeholder='Write something about this product here..'
            className="review-input"></textarea>
            <button className="submit-review-btn">Submit Review</button>
                </div>
            </div>
        </div>
        </div>
    <div className="reviews-container">
        <h3>Reviews</h3>
        {product.reviews && product.reviews.length>0 ? (<div className="reviews-section">
            {product.reviews.map((review,index)=>(
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
        </div>):(
            <p className="no-review">No reviews yet. Be the first one to review!</p>
        )}
    </div>
    </div>
    <Footer/>
    </>
  )
}

export default ProductDetails