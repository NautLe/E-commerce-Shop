import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { Country, State, City } from 'country-state-city'
import { fetchAddresses, createAddress, updateAddress, deleteAddress, clearAddressErrors, clearAddressMessage } from '../features/address/addressSlice'
import { showToast } from '../utils/showToast'
import Navbar from '../components/Navbar'
import Footer from '../components/Footer'
import PageTitle from '../components/PageTitle'
import Loader from '../components/Loader'
import { LocationOn, Add, Edit, Delete, CheckCircle } from '@mui/icons-material'
import '../UserStyles/Addresses.css'

const Addresses = () => {
    const dispatch = useDispatch()
    const { addresses, loading, error, message } = useSelector(state => state.address)

    const [showModal, setShowModal] = useState(false)
    const [editId, setEditId] = useState(null)

    const [formData, setFormData] = useState({
        fullName: '',
        phoneNumber: '',
        addressLine: '',
        city: '',
        state: '',
        postalCode: '',
        country: 'VN',
        isDefault: false
    })

    useEffect(() => {
        dispatch(fetchAddresses())
    }, [dispatch])

    useEffect(() => {
        if (error) {
            showToast.error(error)
            dispatch(clearAddressErrors())
        }
        if (message) {
            showToast.success(message)
            dispatch(clearAddressMessage())
            setShowModal(false)
            resetForm()
        }
    }, [dispatch, error, message])

    const resetForm = () => {
        setEditId(null)
        setFormData({
            fullName: '',
            phoneNumber: '',
            addressLine: '',
            city: '',
            state: '',
            postalCode: '',
            country: 'VN',
            isDefault: false
        })
    }

    const handleOpenCreate = () => {
        resetForm()
        setShowModal(true)
    }

    const handleOpenEdit = (addr) => {
        setEditId(addr._id)

        // Convert stored country/state name or code to library ISO code if matching
        const rawCountry = addr.country || 'VN'
        const cMatch = Country.getAllCountries().find(
            c => c.isoCode.toLowerCase() === rawCountry.toLowerCase() || c.name.toLowerCase() === rawCountry.toLowerCase()
        )
        const cCode = cMatch ? cMatch.isoCode : rawCountry

        const rawState = addr.state || ''
        const sMatch = State.getStatesOfCountry(cCode).find(
            s => s.isoCode.toLowerCase() === rawState.toLowerCase() || s.name.toLowerCase() === rawState.toLowerCase()
        )
        const sCode = sMatch ? sMatch.isoCode : rawState

        setFormData({
            fullName: addr.fullName || addr.name || '',
            phoneNumber: addr.phoneNumber || addr.phone || '',
            addressLine: addr.addressLine || addr.address || '',
            city: addr.city || '',
            state: sCode,
            postalCode: addr.postalCode || addr.pinCode || '',
            country: cCode,
            isDefault: addr.isDefault || false
        })
        setShowModal(true)
    }

    const handleDelete = (id) => {
        if (window.confirm("Are you sure you want to delete this address?")) {
            dispatch(deleteAddress(id))
        }
    }

    const handleSubmit = (e) => {
        e.preventDefault()
        if (!formData.fullName || !formData.phoneNumber || !formData.addressLine || !formData.city) {
            showToast.error("Please fill in required fields")
            return
        }

        const payload = {
            fullName: formData.fullName,
            phoneNumber: formData.phoneNumber,
            addressLine: formData.addressLine,
            city: formData.city,
            state: formData.state,
            postalCode: formData.postalCode,
            country: formData.country,
            isDefault: formData.isDefault,
            name: formData.fullName,
            phone: formData.phoneNumber,
            address: formData.addressLine,
            pinCode: formData.postalCode
        }

        if (editId) {
            dispatch(updateAddress({ id: editId, addressData: payload }))
        } else {
            dispatch(createAddress(payload))
        }
    }

    return (
        <>
            <PageTitle title="My Saved Addresses - MOCHA" />
            <Navbar />

            <div className="addresses-container">
                <div className="addresses-header">
                    <div>
                        <h1 className="addresses-title">Saved Addresses</h1>
                        <p className="addresses-subtitle">Manage your shipping addresses for faster checkout</p>
                    </div>
                    <button className="add-address-btn" onClick={handleOpenCreate}>
                        <Add className="icon-add" /> Add New Address
                    </button>
                </div>

                {loading && addresses.length === 0 ? (
                    <Loader />
                ) : addresses.length === 0 ? (
                    <div className="empty-addresses">
                        <LocationOn className="empty-addresses-icon" />
                        <h3>No addresses saved yet</h3>
                        <p>Add your shipping address to make your next purchase seamless!</p>
                        <button className="add-address-btn" onClick={handleOpenCreate}>
                            Add Address
                        </button>
                    </div>
                ) : (
                    <div className="addresses-grid">
                        {addresses.map((addr) => (
                            <div className={`address-card ${addr.isDefault ? 'default-card' : ''}`} key={addr._id}>
                                {addr.isDefault && (
                                    <div className="default-badge">
                                        <CheckCircle className="default-badge-icon" /> Default Address
                                    </div>
                                )}
                                <h3 className="addr-name">{addr.fullName || addr.name}</h3>
                                <p className="addr-phone">📞 {addr.phoneNumber || addr.phone}</p>
                                <p className="addr-text">{addr.addressLine || addr.address}, {addr.city}{addr.state ? `, ${addr.state}` : ''} {addr.postalCode || addr.pinCode}</p>
                                <p className="addr-country">{addr.country}</p>

                                <div className="address-actions">
                                    <button className="addr-edit-btn" onClick={() => handleOpenEdit(addr)}>
                                        <Edit className="addr-edit-btn-icon" /> Edit
                                    </button>
                                    <button className="addr-delete-btn" onClick={() => handleDelete(addr._id)}>
                                        <Delete className="addr-delete-btn-icon" /> Delete
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>
                )}

                {/* Modal Form */}
                {showModal && (
                    <div className="address-modal-overlay" onClick={() => setShowModal(false)}>
                        <div className="address-modal-content" onClick={(e) => e.stopPropagation()}>
                            <h2>{editId ? 'Edit Address' : 'Add New Address'}</h2>
                            <form onSubmit={handleSubmit} className="address-form">
                                <div className="form-group">
                                    <label>Full Name *</label>
                                    <input
                                        type="text"
                                        placeholder="Recipient Name"
                                        value={formData.fullName}
                                        onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                                        required
                                    />
                                </div>

                                <div className="form-group">
                                    <label>Phone Number *</label>
                                    <input
                                        type="text"
                                        placeholder="Phone number"
                                        value={formData.phoneNumber}
                                        onChange={(e) => setFormData({ ...formData, phoneNumber: e.target.value })}
                                        required
                                    />
                                </div>

                                <div className="form-group">
                                    <label>Street Address *</label>
                                    <input
                                        type="text"
                                        placeholder="House number, street name, apartment..."
                                        value={formData.addressLine}
                                        onChange={(e) => setFormData({ ...formData, addressLine: e.target.value })}
                                        required
                                    />
                                </div>

                                <div className="form-group">
                                    <label>Country *</label>
                                    <select
                                        value={formData.country}
                                        onChange={(e) => setFormData({ ...formData, country: e.target.value, state: '', city: '' })}
                                        required
                                    >
                                        <option value="">Select Country</option>
                                        {Country.getAllCountries().map((c) => (
                                            <option key={c.isoCode} value={c.isoCode}>{c.name}</option>
                                        ))}
                                        {formData.country && !Country.getAllCountries().some(c => c.isoCode === formData.country) && (
                                            <option value={formData.country}>{formData.country}</option>
                                        )}
                                    </select>
                                </div>

                                <div className="form-row">
                                    <div className="form-group">
                                        <label>State / Province</label>
                                        <select
                                            value={formData.state}
                                            onChange={(e) => setFormData({ ...formData, state: e.target.value, city: '' })}
                                        >
                                            <option value="">Select State</option>
                                            {formData.country && State.getStatesOfCountry(formData.country).map((s) => (
                                                <option key={s.isoCode} value={s.isoCode}>{s.name}</option>
                                            ))}
                                            {formData.state && (!formData.country || !State.getStatesOfCountry(formData.country).some(s => s.isoCode === formData.state)) && (
                                                <option value={formData.state}>{formData.state}</option>
                                            )}
                                        </select>
                                    </div>

                                    <div className="form-group">
                                        <label>City *</label>
                                        <select
                                            value={formData.city}
                                            onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                                            required
                                        >
                                            <option value="">Select City</option>
                                            {formData.country && formData.state && City.getCitiesOfState(formData.country, formData.state).map((ct) => (
                                                <option key={ct.name} value={ct.name}>{ct.name}</option>
                                            ))}
                                            {formData.city && (!formData.country || !formData.state || !City.getCitiesOfState(formData.country, formData.state).some(ct => ct.name === formData.city)) && (
                                                <option value={formData.city}>{formData.city}</option>
                                            )}
                                        </select>
                                    </div>
                                </div>

                                <div className="form-group">
                                    <label>Postal / Pin Code</label>
                                    <input
                                        type="text"
                                        placeholder="Pin Code"
                                        value={formData.postalCode}
                                        onChange={(e) => setFormData({ ...formData, postalCode: e.target.value })}
                                    />
                                </div>

                                <div className="checkbox-group">
                                    <label>
                                        <input
                                            type="checkbox"
                                            checked={formData.isDefault}
                                            onChange={(e) => setFormData({ ...formData, isDefault: e.target.checked })}
                                        />
                                        Set as default shipping address
                                    </label>
                                </div>

                                <div className="modal-buttons">
                                    <button type="button" className="cancel-btn" onClick={() => setShowModal(false)}>
                                        Cancel
                                    </button>
                                    <button type="submit" className="save-btn" disabled={loading}>
                                        {loading ? 'Saving...' : 'Save Address'}
                                    </button>
                                </div>
                            </form>
                        </div>
                    </div>
                )}
            </div>

            <Footer />
        </>
    )
}

export default Addresses
