import React from 'react'
import { Phone, Email, Place, GitHub, Facebook, Instagram } from '@mui/icons-material'
import '../componentStyles/Footer.css'

const Footer = () => {
  return (
    <footer className='footer'>
      <div className="footer-container">
        {/* Section 1: Contact Section */}
        <div className='footer-section contact'>
          <h3>Contact Us</h3>
          <p><Place fontSize='small'/>Chicago, US</p>
          <p><Phone fontSize='small'/>Phone: +00 151515</p>
          <p><Email fontSize='small'/>Email: mail@mail.com</p>
        </div>
        {/* End: contact section */}
        {/* Section 2: Social media Section */}
        <div className="footer-section social">
            <h3>Follow me</h3>
          <div className="social-links">
            <a href="https://github.com/NautLe" target="_blank">
              <GitHub className='social-icon' />
            </a>
            <a href="https://www.facebook.com/Nautifood/" target="_blank">
              <Facebook className='social-icon' />
            </a>
            <a href="https://www.instagram.com/tunleiuanu/" target="_blank">
              <Instagram className='social-icon' />
            </a>
            </div>
            {/* End: Social media section */}

        {/* Section 3: About Section */}
        <div className="footer-section about">
              <h3>About</h3>
              <p>An Ecommerce website clothing for everyone!</p>

        </div>


        </div>

      </div>
      <div className="footer-bottom">
        <p>&copy; 2026 Mocha Store, ALL RIGHTS RESERVED</p>
      </div>
    </footer>
  )
}

export default Footer