import { useState } from "react";
import { Link } from "react-router-dom";

function SparkIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      aria-hidden="true"
    >
      <path
        d="M12 2.5L14.2 8.2L20 10.5L14.2 12.8L12 18.5L9.8 12.8L4 10.5L9.8 8.2L12 2.5Z"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinejoin="round"
      />

      <path
        d="M19 3V7"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
      />

      <path
        d="M17 5H21"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
      />
    </svg>
  );
}

function BagIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      aria-hidden="true"
    >
      <path
        d="M5.5 8.5H18.5L19.5 21H4.5L5.5 8.5Z"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinejoin="round"
      />

      <path
        d="M9 9V6.5C9 4.57 10.34 3 12 3C13.66 3 15 4.57 15 6.5V9"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
      />
    </svg>
  );
}

export default function ServiceStrip() {
  const [copied, setCopied] = useState(false);

  async function handleCopyCode() {
    try {
      await navigator.clipboard.writeText("MOCHA30");
      setCopied(true);

      window.setTimeout(() => {
        setCopied(false);
      }, 1800);
    } catch {
      setCopied(false);
    }
  }

  return (
    <section
      className="salePromoBar"
      aria-label="Mid-season sale promotion"
    >
      <div className="salePromoDecor salePromoDecorLeft" />
      <div className="salePromoDecor salePromoDecorRight" />

      <div className="salePromoItem salePromoIntro">
        <div className="salePromoSpark">
          <SparkIcon />
        </div>

        <div>
          <span className="salePromoLabel">
            Mid-Season Sale
          </span>

          <p>Selected pieces for a limited time.</p>
        </div>
      </div>

      <div className="salePromoItem salePromoDiscount">
        <span>Up to</span>

        <strong>30%</strong>

        <span className="salePromoOff">Off</span>
      </div>

      <div className="salePromoItem salePromoCode">
        <span>Use code:</span>

        <button
          type="button"
          className={copied ? "copied" : ""}
          onClick={handleCopyCode}
          aria-label="Copy discount code MOCHA30"
        >
          {copied ? "Copied!" : "MOCHA30"}
        </button>
      </div>

      <Link
        to="/essentials"
        className="salePromoItem salePromoAction"
      >
        <div>
          <strong>Limited time</strong>
          <span>On selected essentials</span>
        </div>

        <div className="salePromoBag">
          <BagIcon />
        </div>
      </Link>
    </section>
  );
}