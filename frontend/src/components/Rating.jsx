import React, { useEffect, useState } from 'react'
import '../componentStyles/Rating.css'

const Rating = ({ value, onRatingChange, disabled = false }) => {
    const [hoverRating, setHoverRating] = useState(0)
    const [selectedRating, setSelectedRating] = useState(value || 0)

    useEffect(() => {
        setSelectedRating(value || 0)
    }, [value])

    const handleMouseEnter = (rating) => {
        if (!disabled) {
            setHoverRating(rating)
        }
    }

    const handleMouseLeave = () => {
        if (!disabled) {
            setHoverRating(0)
        }
    }

    const handleClick = (rating) => {
        if (!disabled) {
            setSelectedRating(rating)
            if (onRatingChange) {
                onRatingChange(rating)
            }
        }
    }

    const generateStars = () => {
        const stars = []
        const currentRating = hoverRating || selectedRating

        for (let i = 1; i <= 5; i++) {
            const isFilled = i <= Math.round(currentRating)
            stars.push(
                <span
                    key={i}
                    className={`star ${isFilled ? 'filled' : 'empty'} ${!disabled ? 'clickable' : ''}`}
                    onMouseEnter={() => handleMouseEnter(i)}
                    onMouseLeave={handleMouseLeave}
                    onClick={() => handleClick(i)}
                    style={{ pointerEvents: disabled ? 'none' : 'auto' }}
                >
                    ★
                </span>
            )
        }
        return stars
    }

    return (
        <div className="rating" onMouseLeave={handleMouseLeave}>
            {generateStars()}
        </div>
    )
}

export default Rating