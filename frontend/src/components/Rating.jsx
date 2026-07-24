import React, { useState } from 'react'
import '../componentStyles/Rating.css'
const Rating = ({value, onRatingChange, disabled}) => {
    const [hoverRating, setHoverRating] = useState(0)
    const [selectedRating, setSelectedRating] = useState(value || 0)

    // Handle star hover
    const handleMouseEnter = (rating)=>{
        if(!disabled){
            setHoverRating(rating)
        }
    }

    // handle mouse leave
    const handleMouseLeave = () =>{
        if(!disabled){
            setHoverRating(0)
        }
    }

    // Handle click
    const handleClick = (rating) =>{
        if(!disabled){
            setSelectedRating(rating)
            if(onRatingChange){
                onRatingChange(rating)
            }
        }
    }
    // Function to create stars based on the rating
    const generateStar = ()=>{
        const stars = []
        for(let i =1;i<=5;i++){
            const isFilled = i <= (hoverRating || selectedRating)
            stars.push(
                <span 
                key={i} 
                className={`star ${isFilled?'filled':'empty'}`}
                onMouseEnter={()=>handleMouseEnter(i)}
                onMouseLeave={()=>handleMouseLeave(i)}
                onClick={()=>handleClick(i)}
                style={{pointerEvents:disabled?'none':'auto'}}
                
                >★</span>
            )
        }
        return stars
    }
    
  return (
    <div>
        <div className="rating"> {generateStar()}</div>
    </div>
  )
}

export default Rating