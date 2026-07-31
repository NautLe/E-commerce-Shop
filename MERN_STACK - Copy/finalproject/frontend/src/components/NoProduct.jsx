import React from 'react'
import '../componentStyles/NoProducts.css'
const NoProduct = ({keyword}) => {
  return (
    <>
    <div className="no-products-content">
        <div className="no-products-icon">⚠️</div>
        <h3 className="no-products-title">No Product found.</h3>
        <p className="no-products-message">
            {keyword?`We couldn't find any products matching "${keyword}". 
            Try using different keywords and try again.`: 'We cannot find anything here. Please check back later.'}
        </p>

    </div>
    </>
  )
}

export default NoProduct