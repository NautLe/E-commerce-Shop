import React, { useState, useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useNavigate } from 'react-router-dom'
import { Country, State, City } from 'country-state-city'
import PageTitle from '../components/PageTitle'
import Navbar from '../components/Navbar'
import Footer from '../components/Footer'
import CheckOut from './CheckOut'
import { saveShippingInfo } from '../features/cart/cartSlice'
import { fetchAddresses } from '../features/address/addressSlice'
import { showToast } from '../utils/showToast'
import '../CartStyles/Shipping.css'

const Shipping = () => {
    const { shippingInfo } = useSelector(state => state.cart)
    const { addresses } = useSelector(state => state.address)
    const { isAuthenticated } = useSelector(state => state.user)
    const dispatch = useDispatch()
    const navigate = useNavigate()

    const [address, setAddress] = useState(shippingInfo.address || '')
    const [pinCode, setPinCode] = useState(shippingInfo.pinCode || '')
    const [phoneNumber, setPhoneNumber] = useState(shippingInfo.phoneNumber || '')
    const [country, setCountry] = useState(shippingInfo.country || '')
    const [state, setState] = useState(shippingInfo.state || '')
    const [city, setCity] = useState(shippingInfo.city || '')
    const [selectedAddressId, setSelectedAddressId] = useState(null)

    useEffect(() => {
        if (isAuthenticated) dispatch(fetchAddresses())
    }, [dispatch, isAuthenticated])

    const handleSelectSavedAddress = (addr) => {
        setSelectedAddressId(addr._id)
        setAddress(addr.addressLine || addr.address || '')
        setPhoneNumber(addr.phoneNumber || addr.phone || '')
        setPinCode(addr.postalCode || addr.pinCode || '')

        const rawCountry = addr.country || 'Vietnam'
        const cMatch = Country.getAllCountries().find(
            c => c.isoCode.toLowerCase() === rawCountry.toLowerCase() || c.name.toLowerCase() === rawCountry.toLowerCase()
        )
        const cCode = cMatch ? cMatch.isoCode : rawCountry

        const rawState = addr.state || ''
        const sMatch = State.getStatesOfCountry(cCode).find(
            s => s.isoCode.toLowerCase() === rawState.toLowerCase() || s.name.toLowerCase() === rawState.toLowerCase()
        )
        const sCode = sMatch ? sMatch.isoCode : rawState

        setCountry(cCode)
        setState(sCode)
        setCity(addr.city || '')
        showToast.success(`Selected address: ${addr.fullName || addr.name}`)
    }

    const handleSubmit = (e) => {
        e.preventDefault()
        if (phoneNumber.length < 9) {
            showToast.error("Phone number should be at least 9 digits")
            return
        }
        dispatch(saveShippingInfo({ address, phoneNumber, pinCode, country, state, city }))
        navigate('/order/confirm')
    }

    return (
        <>
            <PageTitle title="Shipping Info" />
            <Navbar />
            <CheckOut activePath={0} />

            <div className="shipping-form-container">
                <h1 className="shipping-form-header">Shipping details</h1>

                {addresses && addresses.length > 0 && (
                    <div style={{ marginBottom: '20px' }}>
                        <h3 style={{ fontSize: '14px', fontWeight: '600', marginBottom: '8px' }}>Saved Addresses:</h3>
                        <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
                            {addresses.map((addr) => (
                                <div
                                    key={addr._id}
                                    onClick={() => handleSelectSavedAddress(addr)}
                                    style={{
                                        border: selectedAddressId === addr._id ? '2px solid #111' : '1px solid #ccc',
                                        borderRadius: '8px',
                                        padding: '10px 14px',
                                        cursor: 'pointer',
                                        background: selectedAddressId === addr._id ? '#f5f5f5' : '#fff',
                                        fontSize: '13px'
                                    }}
                                >
                                    <strong>{addr.fullName || addr.name}</strong> ({addr.phoneNumber || addr.phone})<br/>
                                    <span style={{ color: '#666' }}>{addr.addressLine || addr.address}, {addr.city}</span>
                                </div>
                            ))}
                        </div>
                    </div>
                )}

                <form className="shipping-form" onSubmit={handleSubmit}>
                    <div className="shipping-section">
                        <div className="shipping-form-group">
                            <label>Address</label>
                            <input type="text" placeholder="Address" value={address} onChange={(e) => setAddress(e.target.value)} required />
                        </div>
                        <div className="shipping-form-group">
                            <label>PinCode</label>
                            <input type="number" placeholder="PinCode" value={pinCode} onChange={(e) => setPinCode(e.target.value)} required />
                        </div>
                        <div className="shipping-form-group">
                            <label>Phone Number</label>
                            <input type="tel" placeholder="Phone Number" value={phoneNumber} onChange={(e) => setPhoneNumber(e.target.value)} required />
                        </div>
                    </div>

                    <div className="shipping-section">
                        <div className="shipping-form-group">
                            <label>Country</label>
                            <select value={country} onChange={(e) => { setCountry(e.target.value); setState(''); setCity(''); }} required>
                                <option value="">Select Country</option>
                                {Country.getAllCountries().map((c) => (
                                    <option key={c.isoCode} value={c.isoCode}>{c.name}</option>
                                ))}
                                {country && !Country.getAllCountries().some(c => c.isoCode === country) && (
                                    <option value={country}>{country}</option>
                                )}
                            </select>
                        </div>

                        <div className="shipping-form-group">
                            <label>State</label>
                            <select value={state} onChange={(e) => { setState(e.target.value); setCity(''); }}>
                                <option value="">Select State</option>
                                {country && State.getStatesOfCountry(country).map((s) => (
                                    <option key={s.isoCode} value={s.isoCode}>{s.name}</option>
                                ))}
                                {state && (!country || !State.getStatesOfCountry(country).some(s => s.isoCode === state)) && (
                                    <option value={state}>{state}</option>
                                )}
                            </select>
                        </div>

                        <div className="shipping-form-group">
                            <label>City</label>
                            <select value={city} onChange={(e) => setCity(e.target.value)}>
                                <option value="">Select City</option>
                                {country && state && City.getCitiesOfState(country, state).map((ct) => (
                                    <option key={ct.name} value={ct.name}>{ct.name}</option>
                                ))}
                                {city && (!country || !state || !City.getCitiesOfState(country, state).some(ct => ct.name === city)) && (
                                    <option value={city}>{city}</option>
                                )}
                            </select>
                        </div>
                    </div>

                    <button type="submit" className="shipping-submit-btn">Continue</button>
                </form>
            </div>
            <Footer />
        </>
    )
}

export default Shipping