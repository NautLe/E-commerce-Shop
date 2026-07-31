import React, { useState } from 'react'
import '../CartStyles/Shipping.css'
import PageTitle from '../components/PageTitle'
import Navbar from '../components/Navbar'
import Footer from '../components/Footer'
import CheckOut from './CheckOut'
import { useDispatch, useSelector } from 'react-redux'
import { Country, State, City }  from 'country-state-city';
import { showToast } from '../utils/showToast'
import { useNavigate } from 'react-router-dom'
import { saveShippingInfo } from '../features/cart/cartSlice'
const Shipping = () => {
    const {shippingInfo} = useSelector(state=>state.cart)
    const dispatch = useDispatch()
    const [address,setAddress] = useState(shippingInfo.address|| "")
    const [pinCode,setPinCode] = useState(shippingInfo.pinCode||"")
    const [phoneNumber,setPhoneNumber] = useState(shippingInfo.phoneNumber||"")
    const [country,setCountry] = useState(shippingInfo.country||"")
    const [city,setCity] = useState(shippingInfo.city||"")
    const [state,setState] = useState(shippingInfo.state||"")
    const navigate  = useNavigate()
    const shippingInfoSubmit = (e)=>{
        e.preventDefault()
        if(phoneNumber.length!==10){
            showToast.error("Phone number should be at least 10 digits")
            return;
        }
        dispatch(saveShippingInfo({address,phoneNumber,pinCode,country,state,city}))
        navigate('/order/confirm')
    }

  return (
    <>
    <PageTitle title = "Shipping Info"/>
    <Navbar/>
    <CheckOut activePath={0}/>
    <div className="shipping-form-container">
        <h1 className="shipping-form-header">Shipping details</h1>
        <form  className="shipping-form" onSubmit={shippingInfoSubmit}>
            <div className="shipping-section">
                <div className="shipping-form-group">
                    <label htmlFor="address">Address</label>
                    <input type="text" id="address" name = "address" placeholder='Enter your address' value={address} onChange={(e)=>{setAddress(e.target.value)}}/>
                </div>
                <div className="shipping-form-group">
                    <label htmlFor="pinCode">PinCode</label>
                    <input type="number" id="pinCode" name = "pinCode" placeholder='Enter your pinCode' value={pinCode} onChange={(e)=>{setPinCode(e.target.value)}}/>
                </div>
                <div className="shipping-form-group">
                    <label htmlFor="phoneNumber">Phone Number </label>
                    <input type="tel" id="phoneNumber" name = "phoneNumber" placeholder='Enter your phone number' value={phoneNumber}onChange={(e)=>{setPhoneNumber(e.target.value)}}/>
                </div>
            </div>
            <div className="shipping-section">
                <div className="shipping-form-group"  >
                    <label htmlFor="country">Country</label>
                    <select name="country" id="country" value={country} onChange={(e)=>{
                        setCountry(e.target.value)
                        setState("")
                        setCity("")
                        
                        }}>
                        <option value="">Select a Country</option>
                        {Country && Country.getAllCountries().map((item)=>(<option value={item.isoCode} key = {item.isoCode}>{item.name}</option>))}
                    </select>
                </div>
                {country && <div className="shipping-form-group">
                    <label htmlFor="state">State</label>
                    <select name="state" id="state" value={state} onChange={(e)=>{
                        setState(e.target.value)
                        setCity("")
                        
                        }}>
                        <option value="" >Select a State</option>
                        {State && State.getStatesOfCountry(country).map((item)=>(<option value={item.isoCode} key = {item.isoCode}>{item.name}</option>))}
                    </select>
                </div>}
                {state && <div className="shipping-form-group">
                    <label htmlFor="city">City</label>
                    <select name="city" id="city" value={city} onChange={(e)=>{setCity(e.target.value)}}>
                        <option value="">Select City</option>
                        {City && City.getCitiesOfState(country,state).map((item)=>(<option value={item.name} key = {item.name}>{item.name}</option>))}
                    </select>
            </div>}
        </div>
        <button className="shipping-submit-btn">Continue</button>
        </form>
    </div>
    <Footer/>
    </>
  )
}

export default Shipping