import {
  useMemo,
  useState,
} from "react";
import {
  Link,
  useNavigate,
} from "react-router-dom";

import Header from "@/components/Header";
import ServiceStrip from "@/components/ServiceStrip";

import { products } from "@/lib/products";
import { formatPrice } from "@/lib/storage";

/* =========================
   STORAGE KEYS
========================= */

const CART_STORAGE_KEYS = [
  "cart",
  "mocha_cart",
  "cartItems",
  "shopping_cart",
];

const SHIPPING_STORAGE_KEYS = [
  "shippingInfo",
  "shipping",
  "mocha_shipping",
  "checkout_shipping",
];

/* =========================
   HELPERS
========================= */

function safeParse(value) {
  if (!value) {
    return null;
  }

  try {
    return JSON.parse(value);
  } catch {
    return null;
  }
}

function getStoredArray(keys) {
  for (const key of keys) {
    const parsed = safeParse(
      localStorage.getItem(key)
    );

    if (Array.isArray(parsed)) {
      return parsed;
    }

    if (Array.isArray(parsed?.items)) {
      return parsed.items;
    }

    if (Array.isArray(parsed?.cart)) {
      return parsed.cart;
    }
  }

  return [];
}

function getStoredObject(keys) {
  for (const key of keys) {
    const parsed = safeParse(
      localStorage.getItem(key)
    );

    if (
      parsed &&
      typeof parsed === "object" &&
      !Array.isArray(parsed)
    ) {
      return parsed;
    }
  }

  return {};
}

function resolveProduct(item) {
  const productId =
    item?.productId ||
    item?.id ||
    item?.product?.id;

  return (
    products.find(
      (product) =>
        product.id === productId
    ) || null
  );
}

function normalizeCartItem(item, index) {
  const product = resolveProduct(item);

  const color =
    item?.selectedColor ||
    item?.color ||
    "White";

  const size =
    item?.selectedSize ||
    item?.size ||
    (product?.category === "Essentials"
      ? "OS"
      : "M");

  const quantity = Math.max(
    1,
    Number(
      item?.quantity ||
        item?.qty ||
        1
    )
  );

  const price = Math.max(
    0,
    Number(
      item?.price ||
        item?.unitPrice ||
        product?.price ||
        0
    )
  );

  return {
    cartKey:
      item?.cartKey ||
      `${product?.id || item?.id || index}-${color}-${size}`,

    id:
      product?.id ||
      item?.id ||
      `cart-item-${index}`,

    productId:
      product?.id ||
      item?.productId ||
      item?.id ||
      "",

    name:
      item?.name ||
      product?.name ||
      "MOCHA Product",

    category:
      item?.category ||
      product?.category ||
      "",

    color,
    size,
    quantity,
    price,

    image:
      item?.image ||
      product?.images?.[color] ||
      product?.image ||
      "",
  };
}

function readCart() {
  return getStoredArray(
    CART_STORAGE_KEYS
  ).map(normalizeCartItem);
}

function readShippingInformation() {
  const storedShipping =
    getStoredObject(
      SHIPPING_STORAGE_KEYS
    );

  const addressParts = [
    storedShipping.address,
    storedShipping.street,
    storedShipping.ward,
    storedShipping.district,
    storedShipping.city,
    storedShipping.province,
    storedShipping.country,
  ].filter(Boolean);

  return {
    fullName:
      storedShipping.fullName ||
      storedShipping.name ||
      storedShipping.customerName ||
      "MOCHA Customer",

    phone:
      storedShipping.phone ||
      storedShipping.phoneNumber ||
      "",

    email:
      storedShipping.email || "",

    address:
      storedShipping.fullAddress ||
      addressParts.join(", "),
  };
}

function generateOrderNumber() {
  return String(
    Math.floor(
      10000 + Math.random() * 90000
    )
  );
}

function formatCardNumberInput(value) {
  const numbersOnly = value
    .replace(/\D/g, "")
    .slice(0, 16);

  return numbersOnly
    .replace(/(.{4})/g, "$1 ")
    .trim();
}

function formatExpiryInput(value) {
  const numbersOnly = value
    .replace(/\D/g, "")
    .slice(0, 4);

  if (numbersOnly.length <= 2) {
    return numbersOnly;
  }

  return `${numbersOnly.slice(
    0,
    2
  )}/${numbersOnly.slice(2)}`;
}

function validateExpiry(value) {
  const match = value.match(
    /^(\d{2})\/(\d{2})$/
  );

  if (!match) {
    return false;
  }

  const month = Number(match[1]);
  const year =
    2000 + Number(match[2]);

  if (month < 1 || month > 12) {
    return false;
  }

  const expiryDate = new Date(
    year,
    month,
    0,
    23,
    59,
    59
  );

  return (
    expiryDate.getTime() >=
    Date.now()
  );
}

function maskCardNumber(value) {
  const numbers = value.replace(
    /\D/g,
    ""
  );

  if (!numbers) {
    return "•••• •••• •••• 3456";
  }

  const padded = numbers.padEnd(
    16,
    "•"
  );

  return padded
    .match(/.{1,4}/g)
    .join(" ");
}

/* =========================
   ICONS
========================= */

function CardIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      aria-hidden="true"
    >
      <rect
        x="3"
        y="5"
        width="18"
        height="14"
        rx="2"
        stroke="currentColor"
        strokeWidth="1.6"
      />

      <path
        d="M3 9H21M7 15H11"
        stroke="currentColor"
        strokeWidth="1.6"
        strokeLinecap="round"
      />
    </svg>
  );
}

function PhoneIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      aria-hidden="true"
    >
      <rect
        x="7"
        y="2.5"
        width="10"
        height="19"
        rx="2"
        stroke="currentColor"
        strokeWidth="1.6"
      />

      <path
        d="M10 5H14M11 18.5H13"
        stroke="currentColor"
        strokeWidth="1.6"
        strokeLinecap="round"
      />
    </svg>
  );
}

function BankIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      aria-hidden="true"
    >
      <path
        d="M3 9L12 3L21 9H3Z"
        stroke="currentColor"
        strokeWidth="1.6"
        strokeLinejoin="round"
      />

      <path
        d="M5 9V18M9.5 9V18M14.5 9V18M19 9V18"
        stroke="currentColor"
        strokeWidth="1.6"
      />

      <path
        d="M3 18H21M2 21H22"
        stroke="currentColor"
        strokeWidth="1.6"
        strokeLinecap="round"
      />
    </svg>
  );
}

function ChevronIcon({
  open = false,
}) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      aria-hidden="true"
      className={
        open
          ? "checkoutV2Chevron open"
          : "checkoutV2Chevron"
      }
    >
      <path
        d="M6 9L12 15L18 9"
        stroke="currentColor"
        strokeWidth="1.7"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function LockIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      aria-hidden="true"
    >
      <rect
        x="5"
        y="10"
        width="14"
        height="11"
        rx="2"
        stroke="currentColor"
        strokeWidth="1.6"
      />

      <path
        d="M8 10V7C8 4.79 9.79 3 12 3C14.21 3 16 4.79 16 7V10"
        stroke="currentColor"
        strokeWidth="1.6"
      />
    </svg>
  );
}

function TruckIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      aria-hidden="true"
    >
      <path
        d="M3 6H14V17H3V6Z"
        stroke="currentColor"
        strokeWidth="1.6"
      />

      <path
        d="M14 10H18L21 13V17H14V10Z"
        stroke="currentColor"
        strokeWidth="1.6"
      />

      <circle
        cx="7"
        cy="18"
        r="2"
        stroke="currentColor"
        strokeWidth="1.6"
      />

      <circle
        cx="18"
        cy="18"
        r="2"
        stroke="currentColor"
        strokeWidth="1.6"
      />
    </svg>
  );
}

/* =========================
   COMPONENT
========================= */

export default function Checkout() {
  const navigate = useNavigate();

  const [cartItems] = useState(
    () => readCart()
  );

  const [shippingInformation] =
    useState(() =>
      readShippingInformation()
    );

  const [
    paymentMethod,
    setPaymentMethod,
  ] = useState("card");

  const [
    cardholderName,
    setCardholderName,
  ] = useState("");

  const [cardNumber, setCardNumber] =
    useState("");

  const [expiryDate, setExpiryDate] =
    useState("");

  const [cvv, setCvv] =
    useState("");

  const [saveCard, setSaveCard] =
    useState(false);

  const [momoPhone, setMomoPhone] =
    useState("");

  const [
    bankSenderName,
    setBankSenderName,
  ] = useState("");

  const [
    transferReference,
    setTransferReference,
  ] = useState("");

  const [promoCode, setPromoCode] =
    useState("");

  const [
    appliedPromoCode,
    setAppliedPromoCode,
  ] = useState("");

  const [promoMessage, setPromoMessage] =
    useState("");

  const [formError, setFormError] =
    useState("");

  const [placingOrder, setPlacingOrder] =
    useState(false);

  const subtotal = useMemo(() => {
    return cartItems.reduce(
      (total, item) =>
        total +
        item.price * item.quantity,
      0
    );
  }, [cartItems]);

  const shippingFee =
    subtotal >= 60 || subtotal === 0
      ? 0
      : 4;

  const discount = useMemo(() => {
    if (
      appliedPromoCode === "MOCHA30"
    ) {
      return Math.min(
        subtotal * 0.3,
        20
      );
    }

    return 0;
  }, [
    appliedPromoCode,
    subtotal,
  ]);

  const total = Math.max(
    0,
    subtotal +
      shippingFee -
      discount
  );

  const paymentLabel = {
    card: "Credit / Debit Card",
    momo: "MoMo e-Wallet",
    bank: "Bank Transfer",
  }[paymentMethod];

  function selectPaymentMethod(method) {
    setPaymentMethod(method);
    setFormError("");
  }

  function applyPromoCode() {
    const normalizedCode = promoCode
      .trim()
      .toUpperCase();

    if (!normalizedCode) {
      setAppliedPromoCode("");
      setPromoMessage(
        "Enter a promo code."
      );

      return;
    }

    if (
      normalizedCode !== "MOCHA30"
    ) {
      setAppliedPromoCode("");
      setPromoMessage(
        "This promo code is not valid."
      );

      return;
    }

    setAppliedPromoCode(
      normalizedCode
    );

    setPromoMessage(
      "MOCHA30 applied successfully."
    );
  }

  function validatePaymentInformation() {
    if (cartItems.length === 0) {
      return "Your cart is empty.";
    }

    if (paymentMethod === "card") {
      if (
        cardholderName.trim().length <
        2
      ) {
        return "Enter the cardholder name.";
      }

      if (
        cardNumber.replace(/\D/g, "")
          .length !== 16
      ) {
        return "Enter a valid 16-digit card number.";
      }

      if (
        !validateExpiry(expiryDate)
      ) {
        return "Enter a valid card expiry date.";
      }

      if (
        !/^\d{3,4}$/.test(cvv)
      ) {
        return "Enter a valid CVV.";
      }
    }

    if (paymentMethod === "momo") {
      if (
        !/^0\d{9}$/.test(momoPhone)
      ) {
        return "Enter a valid MoMo phone number.";
      }
    }

    if (paymentMethod === "bank") {
      if (
        bankSenderName.trim().length <
        2
      ) {
        return "Enter the bank account holder name.";
      }

      if (
        transferReference.trim()
          .length < 3
      ) {
        return "Enter your transfer reference.";
      }
    }

    return "";
  }

  function saveOrder(order) {
    const currentOrders = safeParse(
      localStorage.getItem("orders")
    );

    const normalizedOrders =
      Array.isArray(currentOrders)
        ? currentOrders
        : [];

    localStorage.setItem(
      "orders",
      JSON.stringify([
        order,
        ...normalizedOrders,
      ])
    );

    localStorage.setItem(
      "lastOrder",
      JSON.stringify(order)
    );

    window.dispatchEvent(
      new Event(
        "mocha:orders-updated"
      )
    );
  }

  function clearCart() {
    CART_STORAGE_KEYS.forEach(
      (key) => {
        localStorage.removeItem(key);
      }
    );

    window.dispatchEvent(
      new Event(
        "mocha:cart-updated"
      )
    );
  }

  function handlePlaceOrder() {
    const validationError =
      validatePaymentInformation();

    if (validationError) {
      setFormError(validationError);
      return;
    }

    setFormError("");
    setPlacingOrder(true);

    const orderNumber =
      generateOrderNumber();

    const newOrder = {
      orderNumber,
      number: orderNumber,
      status: "Processing",
      orderStatus: "Processing",
      createdAt:
        new Date().toISOString(),

      paymentMethod: paymentLabel,

      paymentStatus:
        paymentMethod === "bank"
          ? "Pending Bank Transfer"
          : "Payment Confirmed",

      shippingMethod:
        "Standard Shipping",

      shippingAddress: {
        fullName:
          shippingInformation.fullName,
        name:
          shippingInformation.fullName,
        phone:
          shippingInformation.phone,
        email:
          shippingInformation.email,
        address:
          shippingInformation.address,
        fullAddress:
          shippingInformation.address,
      },

      items: cartItems.map(
        (item) => ({
          id: item.productId,
          productId:
            item.productId,
          name: item.name,
          productName: item.name,
          category:
            item.category,
          price: item.price,
          unitPrice: item.price,
          quantity:
            item.quantity,
          qty: item.quantity,
          color: item.color,
          selectedColor:
            item.color,
          size: item.size,
          selectedSize:
            item.size,
          image: item.image,
          sku:
            item.productId,
        })
      ),

      subtotal,
      shippingFee,
      shippingCost:
        shippingFee,
      discount,
      discountAmount:
        discount,
      tax: 0,
      total,
      totalAmount: total,

      promoCode:
        appliedPromoCode || null,

      paymentDetails:
        paymentMethod === "card"
          ? {
              type: "card",
              cardholderName,
              lastFourDigits:
                cardNumber
                  .replace(/\D/g, "")
                  .slice(-4),
              saveCard,
            }
          : paymentMethod ===
              "momo"
            ? {
                type: "momo",
                phone:
                  momoPhone,
              }
            : {
                type: "bank",
                senderName:
                  bankSenderName,
                reference:
                  transferReference,
              },
    };

    saveOrder(newOrder);
    clearCart();

    window.setTimeout(() => {
      setPlacingOrder(false);

      navigate("/success", {
        state: {
          order: newOrder,
        },
      });
    }, 550);
  }

  return (
    <main>
      <Header />

      <section className="checkoutV2Page">
        <div className="checkoutV2Shell">
          <div className="checkoutV2Heading">
            <div>
              <span>Secure Checkout</span>

              <h1>Checkout</h1>
            </div>

            <Link to="/cart">
              ← Back to Cart
            </Link>
          </div>

          <div className="checkoutV2Layout">
            {/* Payment column */}

            <section className="checkoutV2PaymentPanel">
              <div className="checkoutV2SectionTitle">
                <span>Step 2 of 2</span>

                <h2>Payment Method</h2>
              </div>

              {/* Card */}

              <article
                className={
                  paymentMethod === "card"
                    ? "checkoutV2Method active"
                    : "checkoutV2Method"
                }
              >
                <button
                  type="button"
                  className="checkoutV2MethodHeader"
                  onClick={() =>
                    selectPaymentMethod(
                      "card"
                    )
                  }
                >
                  <span
                    className={
                      paymentMethod ===
                      "card"
                        ? "checkoutV2Radio active"
                        : "checkoutV2Radio"
                    }
                  />

                  <div className="checkoutV2MethodIcon">
                    <CardIcon />
                  </div>

                  <strong>
                    Credit / Debit Card
                  </strong>

                  <ChevronIcon
                    open={
                      paymentMethod ===
                      "card"
                    }
                  />
                </button>

                {paymentMethod === "card" && (
                  <div className="checkoutV2MethodBody checkoutV2CardBody">
                    <div className="checkoutV2CardForm">
                      <label>
                        <span>
                          Cardholder Name
                        </span>

                        <input
                          type="text"
                          value={
                            cardholderName
                          }
                          placeholder="Enter name as it appears on card"
                          autoComplete="cc-name"
                          onChange={(
                            event
                          ) =>
                            setCardholderName(
                              event.target
                                .value
                            )
                          }
                        />
                      </label>

                      <label>
                        <span>
                          Card Number
                        </span>

                        <div className="checkoutV2InputWithIcon">
                          <input
                            type="text"
                            inputMode="numeric"
                            value={
                              cardNumber
                            }
                            placeholder="1234 5678 9012 3456"
                            autoComplete="cc-number"
                            onChange={(
                              event
                            ) =>
                              setCardNumber(
                                formatCardNumberInput(
                                  event
                                    .target
                                    .value
                                )
                              )
                            }
                          />

                          <CardIcon />
                        </div>
                      </label>

                      <div className="checkoutV2FieldRow">
                        <label>
                          <span>
                            Expiry Date
                          </span>

                          <input
                            type="text"
                            inputMode="numeric"
                            value={
                              expiryDate
                            }
                            placeholder="MM / YY"
                            autoComplete="cc-exp"
                            onChange={(
                              event
                            ) =>
                              setExpiryDate(
                                formatExpiryInput(
                                  event
                                    .target
                                    .value
                                )
                              )
                            }
                          />
                        </label>

                        <label>
                          <span>CVV</span>

                          <input
                            type="password"
                            inputMode="numeric"
                            value={cvv}
                            maxLength={4}
                            placeholder="123"
                            autoComplete="cc-csc"
                            onChange={(
                              event
                            ) =>
                              setCvv(
                                event.target.value
                                  .replace(
                                    /\D/g,
                                    ""
                                  )
                                  .slice(
                                    0,
                                    4
                                  )
                              )
                            }
                          />
                        </label>
                      </div>

                      <label className="checkoutV2Checkbox">
                        <input
                          type="checkbox"
                          checked={
                            saveCard
                          }
                          onChange={(
                            event
                          ) =>
                            setSaveCard(
                              event.target
                                .checked
                            )
                          }
                        />

                        <span>
                          Save card for
                          faster checkout
                        </span>
                      </label>

                      <div className="checkoutV2SecureNote">
                        <LockIcon />

                        <span>
                          Your payment is
                          encrypted and
                          secure.
                        </span>
                      </div>
                    </div>

                    <div className="checkoutV2CardPreviewWrap">
                      <div className="checkoutV2CardPreview">
                        <div className="checkoutV2CardBrand">
                          MOCHA
                        </div>

                        <div className="checkoutV2CardChip" />

                        <div className="checkoutV2CardNumber">
                          {maskCardNumber(
                            cardNumber
                          )}
                        </div>

                        <div className="checkoutV2CardBottom">
                          <div>
                            <span>
                              Cardholder
                            </span>

                            <strong>
                              {cardholderName
                                .trim()
                                .toUpperCase() ||
                                "JANE DOE"}
                            </strong>
                          </div>

                          <div>
                            <span>
                              Expires
                            </span>

                            <strong>
                              {expiryDate ||
                                "MM/YY"}
                            </strong>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </article>

              {/* MoMo */}

              <article
                className={
                  paymentMethod === "momo"
                    ? "checkoutV2Method active"
                    : "checkoutV2Method"
                }
              >
                <button
                  type="button"
                  className="checkoutV2MethodHeader"
                  onClick={() =>
                    selectPaymentMethod(
                      "momo"
                    )
                  }
                >
                  <span
                    className={
                      paymentMethod ===
                      "momo"
                        ? "checkoutV2Radio active"
                        : "checkoutV2Radio"
                    }
                  />

                  <div className="checkoutV2MethodIcon">
                    <PhoneIcon />
                  </div>

                  <strong>
                    MoMo e-Wallet
                  </strong>

                  <ChevronIcon
                    open={
                      paymentMethod ===
                      "momo"
                    }
                  />
                </button>

                {paymentMethod === "momo" && (
                  <div className="checkoutV2MethodBody checkoutV2WalletBody">
                    <div>
                      <h3>
                        Pay with MoMo
                      </h3>

                      <p>
                        Enter the phone
                        number registered
                        with your MoMo
                        account.
                      </p>

                      <label>
                        <span>
                          MoMo Phone Number
                        </span>

                        <input
                          type="tel"
                          inputMode="numeric"
                          value={
                            momoPhone
                          }
                          placeholder="09xxxxxxxx"
                          onChange={(
                            event
                          ) =>
                            setMomoPhone(
                              event.target.value
                                .replace(
                                  /\D/g,
                                  ""
                                )
                                .slice(
                                  0,
                                  10
                                )
                            )
                          }
                        />
                      </label>
                    </div>

                    <div className="checkoutV2MomoVisual">
                      <PhoneIcon />

                      <strong>MoMo</strong>

                      <span>
                        Secure e-Wallet
                        Payment
                      </span>
                    </div>
                  </div>
                )}
              </article>

              {/* Bank */}

              <article
                className={
                  paymentMethod === "bank"
                    ? "checkoutV2Method active"
                    : "checkoutV2Method"
                }
              >
                <button
                  type="button"
                  className="checkoutV2MethodHeader"
                  onClick={() =>
                    selectPaymentMethod(
                      "bank"
                    )
                  }
                >
                  <span
                    className={
                      paymentMethod ===
                      "bank"
                        ? "checkoutV2Radio active"
                        : "checkoutV2Radio"
                    }
                  />

                  <div className="checkoutV2MethodIcon">
                    <BankIcon />
                  </div>

                  <strong>
                    Bank Transfer
                  </strong>

                  <ChevronIcon
                    open={
                      paymentMethod ===
                      "bank"
                    }
                  />
                </button>

                {paymentMethod === "bank" && (
                  <div className="checkoutV2MethodBody checkoutV2BankBody">
                    <div className="checkoutV2BankAccount">
                      <span>
                        Transfer to
                      </span>

                      <h3>
                        MOCHA STORE
                      </h3>

                      <dl>
                        <div>
                          <dt>Bank</dt>
                          <dd>
                            Vietcombank
                          </dd>
                        </div>

                        <div>
                          <dt>
                            Account Number
                          </dt>
                          <dd>
                            0123 456 789
                          </dd>
                        </div>

                        <div>
                          <dt>
                            Account Name
                          </dt>
                          <dd>
                            MOCHA STORE
                            COMPANY
                          </dd>
                        </div>

                        <div>
                          <dt>Branch</dt>
                          <dd>
                            Ho Chi Minh City
                          </dd>
                        </div>
                      </dl>
                    </div>

                    <div className="checkoutV2BankForm">
                      <label>
                        <span>
                          Sender Account Name
                        </span>

                        <input
                          type="text"
                          value={
                            bankSenderName
                          }
                          placeholder="Name shown on your bank account"
                          onChange={(
                            event
                          ) =>
                            setBankSenderName(
                              event.target
                                .value
                            )
                          }
                        />
                      </label>

                      <label>
                        <span>
                          Transfer Reference
                        </span>

                        <input
                          type="text"
                          value={
                            transferReference
                          }
                          placeholder="Example: MOCHA ORDER"
                          onChange={(
                            event
                          ) =>
                            setTransferReference(
                              event.target
                                .value
                            )
                          }
                        />
                      </label>

                      <p>
                        Your order will be
                        processed after the
                        transfer is confirmed.
                      </p>
                    </div>
                  </div>
                )}
              </article>
            </section>

            {/* Summary */}

            <aside className="checkoutV2Summary">
              <div className="checkoutV2SectionTitle">
                <span>Your Bag</span>

                <h2>Order Summary</h2>
              </div>

              {cartItems.length > 0 ? (
                <div className="checkoutV2SummaryItems">
                  {cartItems.map(
                    (item) => (
                      <article
                        key={
                          item.cartKey
                        }
                        className="checkoutV2SummaryItem"
                      >
                        <div className="checkoutV2SummaryImage">
                          {item.image ? (
                            <img
                              src={
                                item.image
                              }
                              alt={
                                item.name
                              }
                            />
                          ) : (
                            <span>
                              MOCHA
                            </span>
                          )}
                        </div>

                        <div className="checkoutV2SummaryInfo">
                          <strong>
                            {item.name}
                          </strong>

                          <span>
                            {item.color} ·{" "}
                            {item.size}
                          </span>

                          <span>
                            Qty:{" "}
                            {item.quantity}
                          </span>
                        </div>

                        <strong className="checkoutV2SummaryPrice">
                          {formatPrice(
                            item.price *
                              item.quantity
                          )}
                        </strong>
                      </article>
                    )
                  )}
                </div>
              ) : (
                <div className="checkoutV2EmptyCart">
                  Your cart is empty.
                </div>
              )}

              <div className="checkoutV2Totals">
                <div>
                  <span>Subtotal</span>

                  <strong>
                    {formatPrice(
                      subtotal
                    )}
                  </strong>
                </div>

                <div>
                  <span>Shipping</span>

                  <strong>
                    {shippingFee > 0
                      ? formatPrice(
                          shippingFee
                        )
                      : "Free"}
                  </strong>
                </div>

                {discount > 0 && (
                  <div className="checkoutV2Discount">
                    <span>Discount</span>

                    <strong>
                      -
                      {formatPrice(
                        discount
                      )}
                    </strong>
                  </div>
                )}

                <div className="checkoutV2GrandTotal">
                  <span>Total</span>

                  <strong>
                    {formatPrice(total)}
                  </strong>
                </div>
              </div>

              <div className="checkoutV2ShippingNotice">
                <TruckIcon />

                <span>
                  {subtotal >= 60
                    ? "You unlocked free shipping."
                    : `Free shipping on orders over ${formatPrice(
                        60
                      )}`}
                </span>
              </div>

              <div className="checkoutV2Promo">
                <input
                  type="text"
                  value={promoCode}
                  placeholder="Enter promo code"
                  onChange={(event) =>
                    setPromoCode(
                      event.target.value
                    )
                  }
                />

                <button
                  type="button"
                  onClick={applyPromoCode}
                >
                  Apply
                </button>
              </div>

              {promoMessage && (
                <p
                  className={
                    appliedPromoCode
                      ? "checkoutV2PromoMessage success"
                      : "checkoutV2PromoMessage"
                  }
                >
                  {promoMessage}
                </p>
              )}

              {formError && (
                <p className="checkoutV2FormError">
                  {formError}
                </p>
              )}

              <button
                type="button"
                className="checkoutV2PlaceOrder"
                disabled={
                  placingOrder ||
                  cartItems.length === 0
                }
                onClick={
                  handlePlaceOrder
                }
              >
                {placingOrder
                  ? "Processing..."
                  : "Place Order"}
              </button>

              <div className="checkoutV2Terms">
                <LockIcon />

                <span>
                  By placing your order,
                  you agree to our{" "}
                  <a href="#terms">
                    Terms & Conditions
                  </a>
                </span>
              </div>
            </aside>
          </div>
        </div>
      </section>

      <ServiceStrip />
    </main>
  );
}