import React from 'react'
import '../componentStyles/Pagination.css'
import { useSelector } from 'react-redux'

const Pagination = ({
    currentPage,
    onPageChange,
    activeClass='active',
    nextPage="Next",
    previousPage="Previous",
    firstPage='First',
    lastPage='Last'}) => {
    const {totalPages,products} = useSelector((state)=>state.product)
    if(products.length===0 || totalPages<=1) return null
    
    //Generate Page Number
    const getPageNumbers = () =>{
        const pageNumbers =[]
        const pageWindow=2
        // sliding window
        for (
            let i=Math.max(1,currentPage-pageWindow);
            i<=Math.min(totalPages,currentPage+pageWindow);
            i++
        ){
            pageNumbers.push(i)
        }
        return pageNumbers
    }

  return (
    <div className='pagination'>

        {/* first and previous btn */}
        {
            currentPage > 1 && (
                <>
                    <button className="pagination-btn" onClick={() => onPageChange(1)} >{firstPage}</button>
                    <button className="pagination-btn" onClick={() => onPageChange(currentPage - 1)} >{previousPage}</button>
                </>
            )
        }

        {/* display number */}
        {
            getPageNumbers().map((number)=>(
                <button 
                    className={`pagination-btn ${currentPage===number?activeClass:''}`} 
                    key={number}
                    onClick={() => onPageChange(number)}
                >{number}</button>
            ))
        }

        {/* next and last button */}
        {
            currentPage < totalPages && (
                <>
                    <button className="pagination-btn" onClick={() => onPageChange(currentPage + 1)} >{nextPage}</button>
                    <button className="pagination-btn" onClick={() => onPageChange(totalPages)} >{lastPage}</button>
                </>
            )
        }

    </div>
  )
}

export default Pagination