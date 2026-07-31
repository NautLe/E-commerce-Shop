import React, { useState, useEffect } from 'react';
import '../componentStyles/ImageSlider.css';

const ImageSlider = () => {
    const [currentIndex, setCurrentIndex] = useState(0)
    useEffect(()=>{
       const interval = setInterval(()=>{
            setCurrentIndex((prevIndex)=> (prevIndex+1) % images.length)
        },4000)
        return () => clearInterval(interval)
    },[])
  const images = [
    '/images/slider-1.png',
    '/images/slider-2.png',
    '/images/slider-3.png',
    '/images/slider-4.png'
  ];

  
  return (
    <div className="image-slider-container">
        <div className="slider-images" style={{transform:`translateX(-${currentIndex*100}%)`}}>
              {images.map((image,index)=>
              (<div className="slider-item" key={index} >
                <img src={image} alt={`Slide ${index+1}`} />
              </div>))
              } 
        </div>
        <div className="slider-dots">
        {images.map((_,index)=>(
            <span className={`dot ${index===currentIndex?'active':''}`}
            onClick={()=>setCurrentIndex(index)} key={index}
            />
        ))}
            
               
        </div>
    </div>
  );
};

export default ImageSlider;