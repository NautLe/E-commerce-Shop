import React, { act } from 'react'
import '../CartStyles/CheckoutPath.css'
import { AccountBalance, LibraryAddCheck, LocalShipping } from '@mui/icons-material'
const CheckOut = ({activePath}) => {
    const path=[
        {
            label: 'Shipping Details',
            icon: <LocalShipping/>
        },
        {
            label: 'Confirm Order',
            icon: <LibraryAddCheck/>
        },
        {
            label: 'Payment',
            icon: <AccountBalance/>
        }
    ]
  return (
    <div className="checkoutPath">
        {path.map((state,index)=>(
        <div className="checkoutPath-step" key={index} 
        active={activePath===index?'true':'false'}
        completed={activePath>=index?'true':'false'}
        
        >
            <p className="checkoutPath-icon">{state.icon}</p>
            <p className="checkoutPath-label">{state.label}</p>
            
        </div>
    ))}
    </div>
  )
}

export default CheckOut