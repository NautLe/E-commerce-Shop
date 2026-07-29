import { Link } from "react-router-dom";

function MailIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <rect
        x="3"
        y="5"
        width="18"
        height="14"
        rx="1.5"
        stroke="currentColor"
        strokeWidth="1.6"
      />
      <path
        d="M4 7L12 13L20 7"
        stroke="currentColor"
        strokeWidth="1.6"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function PhoneIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path
        d="M7.5 4.5H5.8C5.2 4.5 4.7 4.9 4.6 5.5C4.2 7.8 4.8 10.5 6.4 13.3C8.1 16.2 10.4 18.6 13.3 20.3C16.1 21.9 18.8 22.5 21.1 22.1C21.7 22 22.1 21.5 22.1 20.9V19.2C22.1 18.7 21.8 18.3 21.3 18.1L17.9 16.8C17.5 16.7 17.1 16.8 16.8 17.1L15.3 18.6C13 17.5 11.1 15.6 10 13.3L11.5 11.8C11.8 11.5 11.9 11.1 11.8 10.7L10.5 7.3C10.3 6.8 9.9 6.5 9.4 6.5H7.5"
        stroke="currentColor"
        strokeWidth="1.6"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function LocationIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path
        d="M12 21C12 21 18 15.6 18 10.5C18 7.2 15.3 4.5 12 4.5C8.7 4.5 6 7.2 6 10.5C6 15.6 12 21 12 21Z"
        stroke="currentColor"
        strokeWidth="1.6"
      />
      <circle cx="12" cy="10.5" r="2.2" stroke="currentColor" strokeWidth="1.6" />
    </svg>
  );
}

export default function SiteFooter() {
  return (
    <footer className="mochaInfoFooter">
      <div className="mochaInfoFooterTop">
        <div className="mochaInfoFooterBrand">
          <Link to="/" className="mochaInfoFooterLogo">
            MOCHA
          </Link>

          <p>
            Minimal clothing and everyday essentials designed for effortless,
            modern living.
          </p>
        </div>

       <nav
  className="mochaInfoFooterColumn"
  aria-label="Shop links"
>
  <h3>Shop</h3>

  <Link to="/women">Women</Link>
  <Link to="/men">Men</Link>
  <Link to="/unisex">Unisex</Link>
  <Link to="/essentials">Essentials</Link>
</nav>

<nav
  className="mochaInfoFooterColumn"
  aria-label="Customer care links"
>
  <h3>Customer Care</h3>

  <Link to="/orders">My Orders</Link>
  <a href="#shipping">Shipping & Delivery</a>
  <a href="#returns">Returns & Exchanges</a>
  <a href="#faq">FAQ</a>
</nav>

        <div className="mochaInfoFooterCol">
          <h4>Contact</h4>

          <a href="mailto:hello@mocha.store" className="mochaInfoFooterContact">
            <MailIcon />
            <span>hello@mocha.store</span>
          </a>

          <a href="tel:+840900000000" className="mochaInfoFooterContact">
            <PhoneIcon />
            <span>0900 000 000</span>
          </a>

          <div className="mochaInfoFooterContact">
            <LocationIcon />
            <span>Ho Chi Minh City, Vietnam</span>
          </div>
        </div>
      </div>

      <div className="mochaInfoFooterBottom">
        <span>© 2026 MOCHA. All rights reserved.</span>

        <div className="mochaInfoFooterBottomLinks">
          <a href="#privacy">Privacy Policy</a>
          <a href="#terms">Terms & Conditions</a>
          <a href="#contact">Contact Us</a>
        </div>
      </div>
    </footer>
  );
}