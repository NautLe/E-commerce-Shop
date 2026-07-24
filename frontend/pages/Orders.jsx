import {
  useEffect,
  useMemo,
  useState,
} from "react";
import { Link } from "react-router-dom";

import Header from "@/components/Header";
import ServiceStrip from "@/components/ServiceStrip";

import { formatPrice } from "@/lib/storage";
import {
  formatOrderDate,
  formatOrderTime,
  getNormalizedOrders,
} from "@/lib/orderView";

const pageSize = 5;

const statusFilters = [
  "All",
  "Processing",
  "Shipped",
  "Delivered",
  "Cancelled",
];

function SearchIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      aria-hidden="true"
    >
      <circle
        cx="11"
        cy="11"
        r="6.5"
        stroke="currentColor"
        strokeWidth="1.7"
      />
      <path
        d="M16 16L21 21"
        stroke="currentColor"
        strokeWidth="1.7"
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
        d="M5 8H19L18 21H6L5 8Z"
        stroke="currentColor"
        strokeWidth="1.6"
      />
      <path
        d="M9 9V6.5C9 4.57 10.34 3 12 3C13.66 3 15 4.57 15 6.5V9"
        stroke="currentColor"
        strokeWidth="1.6"
      />
    </svg>
  );
}

function PackageIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      aria-hidden="true"
    >
      <path
        d="M4 7L12 3L20 7L12 11L4 7Z"
        stroke="currentColor"
        strokeWidth="1.6"
      />
      <path
        d="M4 7V17L12 21L20 17V7"
        stroke="currentColor"
        strokeWidth="1.6"
      />
      <path
        d="M12 11V21"
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

function MoneyIcon() {
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
        d="M15 9.5C14.4 8.6 13.4 8 12 8C10.35 8 9 8.9 9 10C9 11.2 10.1 11.75 12 12.15C13.9 12.55 15 13.1 15 14.3C15 15.45 13.65 16.3 12 16.3C10.6 16.3 9.5 15.75 8.8 14.8"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
      />
      <path
        d="M12 6.5V17.5"
        stroke="currentColor"
        strokeWidth="1.5"
      />
    </svg>
  );
}

export default function Orders() {
  const [orders, setOrders] = useState([]);
  const [query, setQuery] = useState("");
  const [statusFilter, setStatusFilter] =
    useState("All");
  const [period, setPeriod] =
    useState("All time");
  const [page, setPage] = useState(1);

  useEffect(() => {
    function loadOrders() {
      setOrders(getNormalizedOrders());
    }

    loadOrders();

    window.addEventListener(
      "storage",
      loadOrders
    );

    return () => {
      window.removeEventListener(
        "storage",
        loadOrders
      );
    };
  }, []);

  useEffect(() => {
    setPage(1);
  }, [query, statusFilter, period]);

  const summary = useMemo(() => {
    return {
      total: orders.length,
      processing: orders.filter(
        (order) =>
          order.status === "processing"
      ).length,
      shipped: orders.filter(
        (order) => order.status === "shipped"
      ).length,
      delivered: orders.filter(
        (order) =>
          order.status === "delivered"
      ).length,
      spent: orders
        .filter(
          (order) =>
            order.status !== "cancelled"
        )
        .reduce(
          (total, order) =>
            total + order.total,
          0
        ),
    };
  }, [orders]);

  const filteredOrders = useMemo(() => {
    const normalizedQuery = query
      .trim()
      .toLowerCase();

    const now = new Date();

    return orders.filter((order) => {
      const matchesStatus =
        statusFilter === "All" ||
        order.status ===
          statusFilter.toLowerCase();

      let matchesPeriod = true;

      if (
        period !== "All time" &&
        order.dateValue
      ) {
        const days =
          period === "Last 30 days"
            ? 30
            : 90;

        const difference =
          now.getTime() -
          order.dateValue.getTime();

        matchesPeriod =
          difference <=
          days * 24 * 60 * 60 * 1000;
      }

      const searchable = [
        order.number,
        order.statusLabel,
        order.paymentMethod,
        ...order.items.map(
          (item) => item.name
        ),
      ]
        .join(" ")
        .toLowerCase();

      const matchesQuery =
        !normalizedQuery ||
        searchable.includes(
          normalizedQuery
        );

      return (
        matchesStatus &&
        matchesPeriod &&
        matchesQuery
      );
    });
  }, [
    orders,
    query,
    statusFilter,
    period,
  ]);

  const totalPages = Math.max(
    1,
    Math.ceil(
      filteredOrders.length / pageSize
    )
  );

  const currentOrders =
    filteredOrders.slice(
      (page - 1) * pageSize,
      page * pageSize
    );

  return (
    <main>
      <Header />

      <section className="ordersV2Page">
        <div className="ordersV2Shell">
          <div className="ordersV2Heading">
            <div>
              <span>My Account</span>

              <h1>My Orders</h1>

              <p>
                Track, review, and manage every
                MOCHA order in one place.
              </p>
            </div>

            <div className="ordersV2Tools">
              <div className="ordersV2Search">
                <SearchIcon />

                <input
                  type="search"
                  value={query}
                  placeholder="Search order or product..."
                  onChange={(event) =>
                    setQuery(event.target.value)
                  }
                />
              </div>

              <select
                value={statusFilter}
                onChange={(event) =>
                  setStatusFilter(
                    event.target.value
                  )
                }
              >
                {statusFilters.map(
                  (status) => (
                    <option
                      key={status}
                      value={status}
                    >
                      {status === "All"
                        ? "All Orders"
                        : status}
                    </option>
                  )
                )}
              </select>

              <select
                value={period}
                onChange={(event) =>
                  setPeriod(event.target.value)
                }
              >
                <option>All time</option>
                <option>Last 30 days</option>
                <option>Last 90 days</option>
              </select>
            </div>
          </div>

          <div className="ordersV2Stats">
            <article>
              <div className="ordersV2StatIcon">
                <BagIcon />
              </div>

              <div>
                <strong>{summary.total}</strong>
                <span>Total Orders</span>
              </div>
            </article>

            <article>
              <div className="ordersV2StatIcon">
                <PackageIcon />
              </div>

              <div>
                <strong>
                  {summary.processing}
                </strong>
                <span>Processing</span>
              </div>
            </article>

            <article>
              <div className="ordersV2StatIcon">
                <TruckIcon />
              </div>

              <div>
                <strong>{summary.shipped}</strong>
                <span>Shipped</span>
              </div>
            </article>

            <article>
              <div className="ordersV2StatIcon">
                <CheckIcon />
              </div>

              <div>
                <strong>
                  {summary.delivered}
                </strong>
                <span>Delivered</span>
              </div>
            </article>

            <article>
              <div className="ordersV2StatIcon">
                <MoneyIcon />
              </div>

              <div>
                <strong>
                  {formatPrice(summary.spent)}
                </strong>
                <span>Total Spent</span>
              </div>
            </article>
          </div>

          {currentOrders.length > 0 ? (
            <div className="ordersV2Table">
              <div className="ordersV2TableHead">
                <span>Order</span>
                <span>Date</span>
                <span>Status</span>
                <span>Items</span>
                <span>Total</span>
                <span>Action</span>
              </div>

              {currentOrders.map((order) => {
                const firstItem =
                  order.items[0];

                return (
                  <article
                    key={order.number}
                    className="ordersV2Row"
                  >
                    <div className="ordersV2OrderNumber">
                      <strong>
                        #{order.number}
                      </strong>

                      <span>
                        {order.items.length}{" "}
                        {order.items.length === 1
                          ? "item"
                          : "items"}
                      </span>
                    </div>

                    <div className="ordersV2Date">
                      <strong>
                        {formatOrderDate(
                          order.createdAt
                        )}
                      </strong>

                      <span>
                        {formatOrderTime(
                          order.createdAt
                        )}
                      </span>
                    </div>

                    <div>
                      <span
                        className={`ordersV2Status ${order.status}`}
                      >
                        <i />
                        {order.statusLabel}
                      </span>

                      <small>
                        {order.paymentStatus}
                      </small>
                    </div>

                    <div className="ordersV2Product">
                      {firstItem?.image ? (
                        <img
                          src={firstItem.image}
                          alt={firstItem.name}
                        />
                      ) : (
                        <div className="ordersV2ProductFallback">
                          MOCHA
                        </div>
                      )}

                      <div>
                        <strong>
                          {firstItem?.name ??
                            "MOCHA Order"}
                        </strong>

                        <span>
                          {firstItem
                            ? `${firstItem.color} / ${firstItem.size} / Qty: ${firstItem.quantity}`
                            : "Order items"}
                        </span>

                        {order.items.length >
                          1 && (
                          <small>
                            +
                            {order.items.length -
                              1}{" "}
                            more item
                          </small>
                        )}
                      </div>
                    </div>

                    <strong className="ordersV2Total">
                      {formatPrice(order.total)}
                    </strong>

                    <Link
                      to={`/orders/${order.number}`}
                      state={{
                        order: order.raw,
                      }}
                      className="ordersV2View"
                    >
                      View Details
                      <span>→</span>
                    </Link>
                  </article>
                );
              })}
            </div>
          ) : (
            <div className="ordersV2Empty">
              <PackageIcon />

              <h2>No orders found</h2>

              <p>
                Try another search term or
                status filter.
              </p>

              <button
                type="button"
                onClick={() => {
                  setQuery("");
                  setStatusFilter("All");
                  setPeriod("All time");
                }}
              >
                Reset Filters
              </button>
            </div>
          )}

          {totalPages > 1 && (
            <div className="ordersV2Pagination">
              <button
                type="button"
                disabled={page === 1}
                onClick={() =>
                  setPage((current) =>
                    Math.max(1, current - 1)
                  )
                }
              >
                ‹
              </button>

              {Array.from({
                length: totalPages,
              }).map((_, index) => {
                const pageNumber = index + 1;

                return (
                  <button
                    key={pageNumber}
                    type="button"
                    className={
                      page === pageNumber
                        ? "active"
                        : ""
                    }
                    onClick={() =>
                      setPage(pageNumber)
                    }
                  >
                    {pageNumber}
                  </button>
                );
              })}

              <button
                type="button"
                disabled={
                  page === totalPages
                }
                onClick={() =>
                  setPage((current) =>
                    Math.min(
                      totalPages,
                      current + 1
                    )
                  )
                }
              >
                ›
              </button>
            </div>
          )}
        </div>
      </section>

      <ServiceStrip />
    </main>
  );
}