import {
  useEffect,
  useState,
} from "react";

import { useNavigate } from "react-router-dom";

const VOUCHER_CODE = "MOCHA30";

const INITIAL_SECONDS =
  2 * 60 * 60 + 14 * 60 + 28;

function CloseIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      aria-hidden="true"
    >
      <path
        d="M6 6L18 18"
        stroke="currentColor"
        strokeWidth="1.7"
        strokeLinecap="round"
      />

      <path
        d="M18 6L6 18"
        stroke="currentColor"
        strokeWidth="1.7"
        strokeLinecap="round"
      />
    </svg>
  );
}

function CopyIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      aria-hidden="true"
    >
      <rect
        x="8"
        y="8"
        width="11"
        height="12"
        rx="1"
        stroke="currentColor"
        strokeWidth="1.6"
      />

      <path
        d="M16 8V5C16 4.45 15.55 4 15 4H6C5.45 4 5 4.45 5 5V16C5 16.55 5.45 17 6 17H8"
        stroke="currentColor"
        strokeWidth="1.6"
      />
    </svg>
  );
}

function ClockIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      aria-hidden="true"
    >
      <circle
        cx="12"
        cy="12"
        r="9"
        stroke="currentColor"
        strokeWidth="1.6"
      />

      <path
        d="M12 7V12L15.5 14"
        stroke="currentColor"
        strokeWidth="1.6"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function SparkIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      aria-hidden="true"
    >
      <path
        d="M12 2C12.8 7.8 16.2 11.2 22 12C16.2 12.8 12.8 16.2 12 22C11.2 16.2 7.8 12.8 2 12C7.8 11.2 11.2 7.8 12 2Z"
        stroke="currentColor"
        strokeWidth="1.4"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function formatCountdown(totalSeconds) {
  const hours = Math.floor(
    totalSeconds / 3600
  );

  const minutes = Math.floor(
    (totalSeconds % 3600) / 60
  );

  const seconds = totalSeconds % 60;

  return [hours, minutes, seconds]
    .map((value) =>
      String(value).padStart(2, "0")
    )
    .join(" : ");
}

export default function VoucherPopup({
  open,
  onClose,
}) {
  const navigate = useNavigate();

  const [copied, setCopied] =
    useState(false);

  const [
    remainingSeconds,
    setRemainingSeconds,
  ] = useState(INITIAL_SECONDS);

  useEffect(() => {
    if (!open) {
      return undefined;
    }

    setCopied(false);
    setRemainingSeconds(
      INITIAL_SECONDS
    );

    const previousOverflow =
      document.body.style.overflow;

    document.body.style.overflow =
      "hidden";

    function handleKeyDown(event) {
      if (event.key === "Escape") {
        onClose();
      }
    }

    window.addEventListener(
      "keydown",
      handleKeyDown
    );

    return () => {
      document.body.style.overflow =
        previousOverflow;

      window.removeEventListener(
        "keydown",
        handleKeyDown
      );
    };
  }, [open, onClose]);

  useEffect(() => {
    if (!open) {
      return undefined;
    }

    const timer = window.setInterval(
      () => {
        setRemainingSeconds(
          (currentValue) =>
            Math.max(
              0,
              currentValue - 1
            )
        );
      },
      1000
    );

    return () => {
      window.clearInterval(timer);
    };
  }, [open]);

  async function handleCopyCode() {
    try {
      await navigator.clipboard.writeText(
        VOUCHER_CODE
      );
    } catch {
      const temporaryTextarea =
        document.createElement(
          "textarea"
        );

      temporaryTextarea.value =
        VOUCHER_CODE;

      temporaryTextarea.style.position =
        "fixed";

      temporaryTextarea.style.opacity =
        "0";

      document.body.appendChild(
        temporaryTextarea
      );

      temporaryTextarea.select();

      document.execCommand("copy");

      temporaryTextarea.remove();
    }

    setCopied(true);

    window.setTimeout(() => {
      setCopied(false);
    }, 1800);
  }

  function handleShopNow() {
    onClose();
    navigate("/essentials");
  }

  if (!open) {
    return null;
  }

  return (
    <div
      className="mochaVoucherOverlay"
      role="presentation"
      onMouseDown={onClose}
    >
      <section
        className="mochaVoucherPopup"
        role="dialog"
        aria-modal="true"
        aria-labelledby="mocha-voucher-title"
        onMouseDown={(event) =>
          event.stopPropagation()
        }
      >
        <div className="mochaVoucherHot">
          HOT
        </div>

        <button
          type="button"
          className="mochaVoucherClose"
          aria-label="Close voucher"
          onClick={onClose}
        >
          <CloseIcon />
        </button>

        <div className="mochaVoucherSpark mochaVoucherSparkLeft">
          <SparkIcon />
        </div>

        <div className="mochaVoucherSpark mochaVoucherSparkRight">
          <SparkIcon />
        </div>

        <header className="mochaVoucherHeader">
          <span>Exclusive offer</span>

          <h2 id="mocha-voucher-title">
            MID-SEASON SALE
          </h2>

          <p>
            Selected essentials for a
            limited time only.
          </p>
        </header>

        <div className="mochaVoucherBody">
          <div className="mochaVoucherDiscount">
            <span>Up to</span>

            <strong>30%</strong>

            <em>Off</em>
          </div>

          <div className="mochaVoucherCodeArea">
            <span>Use code</span>

            <div className="mochaVoucherCode">
              {VOUCHER_CODE}
            </div>

            <button
              type="button"
              className={
                copied
                  ? "mochaVoucherCopy copied"
                  : "mochaVoucherCopy"
              }
              onClick={handleCopyCode}
            >
              <CopyIcon />

              {copied
                ? "Copied!"
                : "Copy code"}
            </button>

            <div className="mochaVoucherCountdown">
              <ClockIcon />

              <span>
                Ends in{" "}
                <strong>
                  {formatCountdown(
                    remainingSeconds
                  )}
                </strong>
              </span>
            </div>
          </div>
        </div>

        <button
          type="button"
          className="mochaVoucherShop"
          onClick={handleShopNow}
        >
          Shop Essentials
        </button>

        <p className="mochaVoucherTerms">
          Valid on selected products.
          Maximum discount applies at
          checkout.
        </p>
      </section>
    </div>
  );
}