export default function ServiceStrip() {
  return (
    <section className="serviceStrip">
      <div className="serviceItem">
        <span className="serviceIcon">
          <svg viewBox="0 0 24 24">
            <path d="M3 7h11v9H3z" />
            <path d="M14 10h4l3 3v3h-7z" />
            <circle cx="7" cy="18" r="2" />
            <circle cx="18" cy="18" r="2" />
            <path d="M3 11h6" />
          </svg>
        </span>

        <div>
          <strong>Free Shipping</strong>
          <p>On all orders over $100</p>
        </div>
      </div>

      <div className="serviceItem">
        <span className="serviceIcon">
          <svg viewBox="0 0 24 24">
            <path d="M9 7H4v5" />
            <path d="M4 12c1.8-4.2 5.8-6.4 10-5.2 4.1 1.2 6.5 5.4 5.3 9.5S14 22.7 9.8 21.5" />
          </svg>
        </span>

        <div>
          <strong>Easy Returns</strong>
          <p>30-day return policy</p>
        </div>
      </div>

      <div className="serviceItem">
        <span className="serviceIcon">
          <svg viewBox="0 0 24 24">
            <rect x="5" y="10" width="14" height="10" rx="2" />
            <path d="M8 10V7a4 4 0 0 1 8 0v3" />
            <path d="M12 14v2" />
          </svg>
        </span>

        <div>
          <strong>Secure Payment</strong>
          <p>Safe checkout experience</p>
        </div>
      </div>

      <div className="serviceItem">
        <span className="serviceIcon">
          <svg viewBox="0 0 24 24">
            <path d="M5 15v-3a7 7 0 0 1 14 0v3" />
            <path d="M5 15a2 2 0 0 0 2 2h1v-5H7a2 2 0 0 0-2 2v1z" />
            <path d="M19 15a2 2 0 0 1-2 2h-1v-5h1a2 2 0 0 1 2 2v1z" />
            <path d="M14 20h-2" />
          </svg>
        </span>

        <div>
          <strong>Customer Support</strong>
          <p>We are here to help</p>
        </div>
      </div>
    </section>
  );
}