import React, { useState, useEffect } from 'react'
import Navbar from '../components/Navbar'
import Footer from '../components/Footer'
import PageTitle from '../components/PageTitle'
import LocationOnIcon from '@mui/icons-material/LocationOn'
import PhoneIphoneIcon from '@mui/icons-material/PhoneIphone'
import EmailIcon from '@mui/icons-material/Email'
import '../pageStyles/Contact.css'
import { useDispatch, useSelector } from 'react-redux'
import { createContact, clearContactErrors, clearContactMessage } from '../features/contact/contactSlice'
import { showToast } from '../utils/showToast'

const Contact = () => {
  const dispatch = useDispatch()
  const { loading, error, successMessage } = useSelector((state) => state.contact)

  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [message, setMessage] = useState('')

  useEffect(() => {
    if (error) {
      showToast.error(error)
      dispatch(clearContactErrors())
    }
    if (successMessage) {
      showToast.success(successMessage)
      dispatch(clearContactMessage())
      setName('')
      setEmail('')
      setMessage('')
    }
  }, [dispatch, error, successMessage])

  const handleSubmit = (e) => {
    e.preventDefault()
    dispatch(createContact({ name, email, message }))
  }

  return (
    <div className="contact-page-layout">
      <PageTitle title="Contact | MOCHA" />
      <Navbar />
      
      <main className="contact-main-hero">
        <div className="contact-page-wrapper">
          <div className="contact-section-header">
            <h2 className="contact-main-title">CONTACT</h2>
            <p className="contact-sub-title">Need support? Contact Us!</p>
          </div>

          <div className="contact-content-grid">
            {/* Left Column: Contact Info */}
            <div className="contact-info-list">
              <div className="contact-info-item">
                <LocationOnIcon className="contact-icon" />
                <span>Chicago, US</span>
              </div>
              <div className="contact-info-item">
                <PhoneIphoneIcon className="contact-icon" />
                <span>Phone: +00 151515</span>
              </div>
              <div className="contact-info-item">
                <EmailIcon className="contact-icon" />
                <span>Email: mail@mail.com</span>
              </div>
            </div>

            {/* Right Column: Contact Form */}
            <div className="contact-form-wrapper">
              <form onSubmit={handleSubmit} className="contact-w3-form">
                <div className="contact-row-two-inputs">
                  <input
                    type="text"
                    className="contact-w3-input"
                    placeholder="Name"
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                  />
                  <input
                    type="email"
                    className="contact-w3-input"
                    placeholder="Email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                  />
                </div>

                <div className="contact-row-single-input">
                  <textarea
                    className="contact-w3-input contact-w3-textarea"
                    placeholder="Message"
                    required
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                  />
                </div>

                <div className="contact-button-row">
                  <button type="submit" className="contact-send-btn" disabled={loading}>
                    {loading ? 'SENDING...' : 'SEND'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  )
}

export default Contact
