import React from 'react'
import { Link } from 'react-router-dom'
import EmailOutlinedIcon from '@mui/icons-material/EmailOutlined'
import PhoneOutlinedIcon from '@mui/icons-material/PhoneOutlined'
import LocationOnOutlinedIcon from '@mui/icons-material/LocationOnOutlined'
import '../componentStyles/Footer.css'

const Footer = () => {
  return (
    <footer className="mocha-footer">
      <div className="mocha-footer-main">
        <section>
          <strong>MOCHA</strong>
          <p>
            Minimal clothing and everyday essentials designed for effortless,
            modern living.
          </p>
        </section>
        <section>
          <h3>Shop</h3>
          <Link to="/products?category=women">Women</Link>
          <Link to="/products?category=men">Men</Link>
          <Link to="/products?category=unisex">Unisex</Link>
          <Link to="/products?category=essentials">Essentials</Link>
        </section>
        <section>
          <h3>Customer care</h3>
          <Link to="/orders">My Orders</Link>
          <Link to="/products">Shipping & Delivery</Link>
          <Link to="/products">Returns & Exchanges</Link>
          <Link to="/products">FAQ</Link>
        </section>
        <section>
          <h3>Contact</h3>
          <p>
            <EmailOutlinedIcon /> hello@mocha.store
          </p>
          <p>
            <PhoneOutlinedIcon /> 0900 000 000
          </p>
          <p>
            <LocationOnOutlinedIcon /> Ho Chi Minh City, Vietnam
          </p>
        </section>
      </div>
      <div className="mocha-footer-bottom">
        <span>© 2026 MOCHA. All rights reserved.</span>
        <div>
          <Link to="/products">Privacy Policy</Link>
          <Link to="/products">Terms & Conditions</Link>
          <Link to="/products">Contact Us</Link>
        </div>
      </div>
    </footer>
  )
}

export default Footer