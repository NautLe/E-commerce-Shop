import {
  useEffect,
  useMemo,
  useState,
} from "react";
import {
  Link,
  useLocation,
  useNavigate,
  useParams,
} from "react-router-dom";

import Header from "@/components/Header";

import { formatPrice } from "@/lib/storage";
import {
  findOrderByNumber,
  formatOrderDate,
  formatOrderTime,
  normalizeOrder,
  updateStoredOrderStatus,
} from "@/lib/orderView";

/* =========================
   ORDER TIMELINE
========================= */

const progressSteps = [
  "Order Placed",
  "Payment Confirmed",
  "Processing",
  "Shipped",
  "Delivered",
];

function getProgressIndex(status) {
  const indexes = {
    processing: 2,
    shipped: 3,
    delivered: 4,
    returned: 4,
    cancelled: 1,
  };

  return indexes[status] ?? 2;
}

/* =========================
   ICONS
========================= */

function CalendarIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      aria-hidden="true"
    >
      <rect
        x="4"
        y="6"
        width="16"
        height="14"
        rx="1"
        stroke="currentColor"
        strokeWidth="1.6"
      />

      <path
        d="M8 3V8M16 3V8M4 10H20"
        stroke="currentColor"
        strokeWidth="1.6"
        strokeLinecap="round"
      />
    </svg>
  );
}

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
        strokeLinejoin="round"
      />

      <path
        d="M14 10H18L21 13V17H14V10Z"
        stroke="currentColor"
        strokeWidth="1.6"
        strokeLinejoin="round"
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

function CheckIcon() {
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
        d="M8 12L11 15L16 9"
        stroke="currentColor"
        strokeWidth="1.7"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function DownloadIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      aria-hidden="true"
    >
      <path
        d="M12 3V15"
        stroke="currentColor"
        strokeWidth="1.7"
        strokeLinecap="round"
      />

      <path
        d="M7.5 10.5L12 15L16.5 10.5"
        stroke="currentColor"
        strokeWidth="1.7"
        strokeLinecap="round"
        strokeLinejoin="round"
      />

      <path
        d="M5 20H19"
        stroke="currentColor"
        strokeWidth="1.7"
        strokeLinecap="round"
      />
    </svg>
  );
}

function SupportIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      aria-hidden="true"
    >
      <path
        d="M4 13V11C4 6.58 7.58 3 12 3C16.42 3 20 6.58 20 11V13"
        stroke="currentColor"
        strokeWidth="1.6"
        strokeLinecap="round"
      />

      <path
        d="M4 12H7V18H5C4.45 18 4 17.55 4 17V12Z"
        stroke="currentColor"
        strokeWidth="1.6"
        strokeLinejoin="round"
      />

      <path
        d="M20 12H17V18H19C19.55 18 20 17.55 20 17V12Z"
        stroke="currentColor"
        strokeWidth="1.6"
        strokeLinejoin="round"
      />

      <path
        d="M17 18C17 20 15.5 21 13 21"
        stroke="currentColor"
        strokeWidth="1.6"
        strokeLinecap="round"
      />
    </svg>
  );
}

function LocationIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      aria-hidden="true"
    >
      <path
        d="M12 21C12 21 19 15.2 19 9C19 5.13 15.87 2 12 2C8.13 2 5 5.13 5 9C5 15.2 12 21 12 21Z"
        stroke="currentColor"
        strokeWidth="1.6"
        strokeLinejoin="round"
      />

      <circle
        cx="12"
        cy="9"
        r="2.5"
        stroke="currentColor"
        strokeWidth="1.6"
      />
    </svg>
  );
}

/* =========================
   COMPONENT
========================= */

export default function OrderDetail() {
  const { orderId } = useParams();
  const location = useLocation();
  const navigate = useNavigate();

  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const orderFromState = location.state?.order
      ? normalizeOrder(location.state.order)
      : null;

    const storedOrder =
      findOrderByNumber(orderId);

    setOrder(orderFromState || storedOrder);
    setLoading(false);
  }, [location.state, orderId]);

  const orderItems = useMemo(() => {
    return Array.isArray(order?.items)
      ? order.items
      : [];
  }, [order]);

  const progressIndex = useMemo(() => {
    return order
      ? getProgressIndex(order.status)
      : 0;
  }, [order]);

  const firstProductId =
    orderItems[0]?.productId;

  const canCancel =
    order?.status === "processing";

  function handleDownloadInvoice() {
    window.print();
  }

  function handleCancelOrder() {
    if (!order) {
      return;
    }

    const accepted = window.confirm(
      `Are you sure you want to cancel order #${order.number}?`
    );

    if (!accepted) {
      return;
    }

    const updated =
      updateStoredOrderStatus(
        order.number,
        "Cancelled"
      );

    if (!updated) {
      window.alert(
        "The order could not be updated in storage."
      );

      return;
    }

    setOrder((currentOrder) => ({
      ...currentOrder,
      status: "cancelled",
      statusLabel: "Cancelled",
    }));
  }

  /* =========================
     LOADING STATE
  ========================= */

  if (loading) {
    return (
      <main>
        <Header />

        <section className="orderDetailV2Page">
          <div className="orderDetailV2Missing">
            <h1>Loading order...</h1>

            <p>
              Please wait while we retrieve your
              order information.
            </p>
          </div>
        </section>

      </main>
    );
  }

  /* =========================
     ORDER NOT FOUND
  ========================= */

  if (!order) {
    return (
      <main>
        <Header />

        <section className="orderDetailV2Page">
          <div className="orderDetailV2Missing">
            <h1>Order not found</h1>

            <p>
              This order may have been removed or
              the order link is incorrect.
            </p>

            <button
              type="button"
              onClick={() =>
                navigate("/orders")
              }
            >
              Back to My Orders
            </button>
          </div>
        </section>

      </main>
    );
  }

  return (
    <main>
      <Header />

      <section className="orderDetailV2Page">
        <div className="orderDetailV2Shell">
          {/* Breadcrumb */}

          <nav
            className="orderDetailV2Breadcrumb"
            aria-label="Breadcrumb"
          >
            <Link to="/">Home</Link>

            <span>/</span>

            <Link to="/orders">
              My Orders
            </Link>

            <span>/</span>

            <span>#{order.number}</span>
          </nav>

          {/* Heading */}

          <div className="orderDetailV2Heading">
            <div>
              <div className="orderDetailV2TitleLine">
                <h1>Order Detail</h1>

                <span
                  className={`ordersV2Status ${order.status}`}
                >
                  <i />

                  {order.statusLabel}
                </span>
              </div>

              <p>
                Review and manage order #
                {order.number}.
              </p>
            </div>

            <div className="orderDetailV2Actions">
              <button
                type="button"
                onClick={handleDownloadInvoice}
              >
                <DownloadIcon />

                <span>Download Invoice</span>
              </button>

              <a
                href={`mailto:support@mocha.com?subject=Support for order %23${order.number}`}
              >
                <SupportIcon />

                <span>Need Help?</span>
              </a>
            </div>
          </div>

          {/* Main layout */}

          <div className="orderDetailV2Layout">
            <div className="orderDetailV2Main">
              {/* Order information */}

              <section className="orderDetailV2Meta">
                <article>
                  <div>
                    <CalendarIcon />
                  </div>

                  <span>Order Date</span>

                  <strong>
                    {formatOrderDate(
                      order.createdAt
                    )}
                  </strong>

                  <small>
                    {formatOrderTime(
                      order.createdAt
                    )}
                  </small>
                </article>

                <article>
                  <div>
                    <CardIcon />
                  </div>

                  <span>Payment Method</span>

                  <strong>
                    {order.paymentMethod ||
                      "Credit / Debit Card"}
                  </strong>

                  <small>Secure payment</small>
                </article>

                <article>
                  <div>
                    <TruckIcon />
                  </div>

                  <span>Shipping Method</span>

                  <strong>
                    {order.shippingMethod ||
                      "Standard Shipping"}
                  </strong>

                  <small>
                    Estimated 2{"\u2013"}4 business days
                  </small>
                </article>

                <article>
                  <div>
                    <CheckIcon />
                  </div>

                  <span>Payment Status</span>

                  <strong>
                    {order.paymentStatus ||
                      "Payment Confirmed"}
                  </strong>

                  <small>
                    {formatPrice(order.total)}
                  </small>
                </article>
              </section>

              {/* Order items */}

              <section className="orderDetailV2Items">
                <div className="orderDetailV2SectionHead">
                  <div>
                    <span>Order Items</span>

                    <h2>
                      Items ({orderItems.length})
                    </h2>
                  </div>

                  {order.trackingNumber && (
                    <p>
                      Tracking:{" "}
                      <strong>
                        {order.trackingNumber}
                      </strong>
                    </p>
                  )}
                </div>

                <div className="orderDetailV2ItemHead">
                  <span>Product</span>
                  <span>Unit Price</span>
                  <span>Quantity</span>
                  <span>Total</span>
                </div>

                {orderItems.length > 0 ? (
                  orderItems.map(
                    (item, index) => {
                      const itemKey =
                        item.id ||
                        item.productId ||
                        `item-${index}`;

                      return (
                        <article
                          key={itemKey}
                          className="orderDetailV2Item"
                        >
                          <div className="orderDetailV2ItemProduct">
                            <div className="orderDetailV2ItemImage">
                              {item.image ? (
                                <img
                                  src={item.image}
                                  alt={item.name}
                                />
                              ) : (
                                <span>MOCHA</span>
                              )}
                            </div>

                            <div>
                              {item.productId ? (
                                <Link
                                  to={`/item/${item.productId}`}
                                >
                                  {item.name}
                                </Link>
                              ) : (
                                <strong>
                                  {item.name ||
                                    "MOCHA Product"}
                                </strong>
                              )}

                              <p>
                                {item.color ||
                                  "White"}{" "}
                                /{" "}
                                {item.size ||
                                  "OS"}
                              </p>

                              <small>
                                SKU:{" "}
                                {item.sku ||
                                  item.productId ||
                                  "MOCHA"}
                              </small>
                            </div>
                          </div>

                          <strong>
                            {formatPrice(
                              item.unitPrice
                            )}
                          </strong>

                          <strong>
                            {item.quantity}
                          </strong>

                          <strong>
                            {formatPrice(
                              item.unitPrice *
                                item.quantity
                            )}
                          </strong>
                        </article>
                      );
                    }
                  )
                ) : (
                  <div className="orderDetailV2NoItems">
                    No product information is
                    available for this order.
                  </div>
                )}

                {canCancel && (
                  <div className="orderDetailV2Cancel">
                    <p>
                      This order can still be
                      cancelled before it is
                      shipped.
                    </p>

                    <button
                      type="button"
                      onClick={
                        handleCancelOrder
                      }
                    >
                      Cancel Order
                    </button>
                  </div>
                )}
              </section>

              {/* Order timeline */}

              <section className="orderDetailV2Timeline">
                <div className="orderDetailV2SectionHead">
                  <div>
                    <span>Tracking</span>

                    <h2>Order Timeline</h2>
                  </div>
                </div>

                {order.status ===
                "cancelled" ? (
                  <div className="orderDetailV2Cancelled">
                    This order has been cancelled.
                  </div>
                ) : (
                  <div className="orderDetailV2Steps">
                    {progressSteps.map(
                      (step, index) => {
                        const completed =
                          index <=
                          progressIndex;

                        const current =
                          index ===
                          progressIndex;

                        return (
                          <div
                            key={step}
                            className={[
                              completed
                                ? "completed"
                                : "",
                              current
                                ? "current"
                                : "",
                            ]
                              .filter(Boolean)
                              .join(" ")}
                          >
                            <i>
                              {completed
                                ? "\u2713"
                                : index + 1}
                            </i>

                            <strong>
                              {step}
                            </strong>

                            <span>
                              {current
                                ? "Current status"
                                : completed
                                  ? "Completed"
                                  : "Pending"}
                            </span>
                          </div>
                        );
                      }
                    )}
                  </div>
                )}
              </section>
            </div>

            {/* Sidebar */}

            <aside className="orderDetailV2Sidebar">
              {/* Order summary */}

              <section className="orderDetailV2Summary">
                <span>Payment</span>

                <h2>Order Summary</h2>

                <div>
                  <span>Subtotal</span>

                  <strong>
                    {formatPrice(
                      order.subtotal
                    )}
                  </strong>
                </div>

                <div>
                  <span>Shipping</span>

                  <strong>
                    {order.shipping > 0
                      ? formatPrice(
                          order.shipping
                        )
                      : "Free"}
                  </strong>
                </div>

                {order.discount > 0 && (
                  <div className="orderDetailV2Discount">
                    <span>Discount</span>

                    <strong>
                      -
                      {formatPrice(
                        order.discount
                      )}
                    </strong>
                  </div>
                )}

                {order.tax > 0 && (
                  <div>
                    <span>Tax</span>

                    <strong>
                      {formatPrice(order.tax)}
                    </strong>
                  </div>
                )}

                <div className="orderDetailV2GrandTotal">
                  <span>Total</span>

                  <strong>
                    {formatPrice(order.total)}
                  </strong>
                </div>
              </section>

              {/* Shipping address */}

              <section className="orderDetailV2Shipping">
                <div className="orderDetailV2ShippingIcon">
                  <LocationIcon />
                </div>

                <span>Delivery</span>

                <h2>Shipping Address</h2>

                <strong>
                  {order.shippingAddress?.name ||
                    "MOCHA Customer"}
                </strong>

                {order.shippingAddress?.phone && (
                  <p>
                    {
                      order.shippingAddress
                        .phone
                    }
                  </p>
                )}

                <p>
                  {order.shippingAddress
                    ?.address ||
                    "Shipping address not available"}
                </p>
              </section>

              {/* Thank-you card */}

              <section className="orderDetailV2Thanks">
                <strong>
                  Thanks for shopping with
                  MOCHA!
                </strong>

                <p>
                  Discover more minimal pieces,
                  everyday essentials, and new
                  seasonal arrivals.
                </p>

                {firstProductId ? (
                  <Link
                    to={`/item/${firstProductId}`}
                  >
                    Buy Again
                  </Link>
                ) : (
                  <Link to="/essentials">
                    Continue Shopping
                  </Link>
                )}
              </section>
            </aside>
          </div>
        </div>
      </section>

    
    </main>
  );
}