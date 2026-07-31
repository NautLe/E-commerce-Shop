import { useEffect, useState } from 'react'
import CloseIcon from '@mui/icons-material/Close'
import '../PromoStyles/PromoStyles.css'

const OFFER_CODE = 'MOCHA30'

const CopyIcon = () => (
  <svg viewBox="0 0 24 24" aria-hidden="true" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2">
    <path d="M9 8.5V5.75A1.75 1.75 0 0 1 10.75 4h7.5A1.75 1.75 0 0 1 20 5.75v9.5A1.75 1.75 0 0 1 18.25 17H15" />
    <rect x="4" y="8" width="11" height="12" rx="1.75" />
  </svg>
)

const PromoModal = ({ onClose }) => {
  const [copied, setCopied] = useState(false)

  useEffect(() => {
    const closeOnEscape = (event) => event.key === 'Escape' && onClose()
    document.addEventListener('keydown', closeOnEscape)
    return () => document.removeEventListener('keydown', closeOnEscape)
  }, [onClose])

  const copyCode = async () => {
    try {
      await navigator.clipboard.writeText(OFFER_CODE)
      setCopied(true)
      window.setTimeout(() => setCopied(false), 1800)
    } catch {
      setCopied(false)
    }
  }

  const shopNow = () => {
    onClose()
    document.querySelector('.home-product-container')?.scrollIntoView({ behavior: 'smooth', block: 'start' })
  }

  return (
    <div
      className="promo-overlay"
      role="presentation"
      onMouseDown={(event) => event.target === event.currentTarget && onClose()}
    >
      <section className="promo-modal" role="dialog" aria-modal="true" aria-labelledby="promo-title">
        <div className="promo-hot-tag">HOT</div>
        <button className="promo-close" type="button" onClick={onClose} aria-label="Close offer">
          <CloseIcon style={{ fontSize: '20px' }} />
        </button>
        <p className="promo-eyebrow">EXCLUSIVE OFFER</p>
        <h2 className="promo-title" id="promo-title">
          <span>✧</span> MID-SEASON SALE <span>✧</span>
        </h2>
        <p className="promo-subtitle">Selected essentials available now.</p>
        <div className="promo-details">
          <div className="promo-discount">
            <p className="promo-label">UP TO</p>
            <p className="promo-percent">
              30<span>%</span>
            </p>
            <p className="promo-off">OFF</p>
          </div>
          <div className="promo-divider" aria-hidden="true" />
          <div className="promo-code-section">
            <p className="promo-label">USE CODE</p>
            <div className="promo-code">{OFFER_CODE}</div>
            <button className="promo-copy-btn" type="button" onClick={copyCode}>
              <CopyIcon /> {copied ? 'COPIED!' : 'COPY CODE'}
            </button>
          </div>
        </div>
        <button className="promo-cta" type="button" onClick={shopNow}>
          SHOP NOW!
        </button>
        <p className="promo-footnote">Valid on selected products. Maximum discount applies at checkout.</p>
      </section>
    </div>
  )
}

export default PromoModal
