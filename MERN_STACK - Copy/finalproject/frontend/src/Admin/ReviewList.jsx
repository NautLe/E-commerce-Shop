import React, { useEffect, useState } from 'react'
import '../AdminStyles/ReviewsList.css'
import Navbar from '../components/Navbar'
import Footer from '../components/Footer'
import PageTitle from '../components/PageTitle'
import { Delete } from '@mui/icons-material'
import { useDispatch, useSelector } from 'react-redux'
import { clearMessage, deleteReview, fetchAdminProducts, fetchProductReviews, removeErrors, removeSuccess } from '../features/admin/adminSlice'
import { showToast } from '../utils/showToast'
import Loader from '../components/Loader'
import { useNavigate } from 'react-router-dom'
const ReviewList = () => {
    const { products, loading, error, reviews, success, message } = useSelector(state => state.admin)
    const [selectedProduct, setSelectedProduct] = useState(null)
    const dispatch = useDispatch()
    const navigate = useNavigate()

    useEffect(() => {
        dispatch(fetchAdminProducts())
    }, [dispatch])

    const handleViewReviews = (productId) => {
        setSelectedProduct(productId)
        dispatch(fetchProductReviews({ productId }))
    }

    const handleDeleteReviews = (reviewId, productId) => {
        if (!reviewId || !productId) {
            showToast.error("Invalid review or product ID.")
            return
        }
        const confirm = window.confirm("Are you sure you want to delete this review?")
        if (confirm) {
            dispatch(deleteReview({ reviewId, productId }))
        }
    }

    useEffect(() => {
        if (error) {
            showToast.error(typeof error === 'string' ? error : error.message || 'An error occurred')
            dispatch(removeErrors())
        }
        if (success) {
            showToast.success(message || "Operation successful!")
            dispatch(removeSuccess())
            dispatch(clearMessage())
            if (selectedProduct) {
                dispatch(fetchProductReviews({ productId: selectedProduct }))
            }
            dispatch(fetchAdminProducts())
        }
    }, [dispatch, error, success, message, selectedProduct])

    if (!products || products.length === 0) {
        return (
            <>
                <Navbar />
                <PageTitle title="All Reviews" />
                <div className="reviews-list-container">
                    <h1 className="reviews-list-title">Admin Reviews</h1>
                    <p>No Product Found..</p>
                </div>
                <Footer />
            </>
        )
    }

    return (
        <>
            {loading && !products.length ? (<Loader />) : (<>
                <Navbar />
                <PageTitle title="All Reviews" />
                <div className="reviews-list-container">
                    <h1 className="reviews-list-title">All Products</h1>
                    <table className="reviews-table">
                        <thead>
                            <tr>
                                <th>No</th>
                                <th>Product Name</th>
                                <th>Product Image</th>
                                <th>Number of Reviews</th>
                                <th>Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {products.map((product, index) => (
                                <tr key={product._id}>
                                    <td>{index + 1}</td>
                                    <td>{product.name}</td>
                                    <td>
                                        <img src={product.image?.[0]?.url || ''} alt={product.name} className='product-image' />
                                    </td>
                                    <td>{product.numReviews}</td>
                                    <td>
                                        {product.numReviews > 0 ? (
                                            <button className="action-btn view-btn" onClick={() => handleViewReviews(product._id)} >View Reviews</button>
                                        ) : (
                                            <span style={{ color: '#888', fontSize: '0.9rem' }}>No Reviews</span>
                                        )}
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                    {selectedProduct && (
                        <div className="reviews-details">
                            <h2>Reviews for Product</h2>
                            {reviews && reviews.length > 0 ? (
                                <table className="reviews-table">
                                    <thead>
                                        <tr>
                                            <th>No</th>
                                            <th>Reviewer Name</th>
                                            <th>Rating</th>
                                            <th>Comment</th>
                                            <th>Action</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {reviews.map((review, index) => (
                                            <tr key={review._id || index}>
                                                <td>{index + 1}</td>
                                                <td>{review.name}</td>
                                                <td>{review.rating}</td>
                                                <td>{review.comment}</td>
                                                <td>
                                                    <button onClick={() => { handleDeleteReviews(review._id, selectedProduct) }} className="action-btn delete-btn"><Delete /></button>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            ) : (
                                <p style={{ marginTop: '15px', color: '#666' }}>No reviews found for this product.</p>
                            )}
                        </div>
                    )}
                </div>
                <Footer />
            </>)}
        </>
    )
}

export default ReviewList