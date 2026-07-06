"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Header from "@/components/Header";
import { formatPrice } from "@/lib/storage";

export default function SuccessPage() {
  const router = useRouter();
  const [order, setOrder] = useState(null);

  useEffect(() => {
    const latestOrder = JSON.parse(localStorage.getItem("latestOrder") || "null");
    setOrder(latestOrder);
  }, []);

  if (!order) {
    return (
      <main>
        <Header />

        <section className="page center">
          <h1>No order found.</h1>

          <button className="btn black" onClick={() => router.push("/")}>
            Back Home
          </button>
        </section>
      </main>
    );
  }

  return (
    <main>
      <Header />

      <section className="successPage">
        <div className="checkIcon">✓</div>

        <h1>Thank you for your order!</h1>

        <p>Your order has been placed successfully.</p>

        <div className="orderBox">
          <div>
            <span>Order Number</span>
            <strong>{order.orderNumber}</strong>
          </div>

          <div>
            <span>Date</span>
            <strong>{order.date}</strong>
          </div>

          <div>
            <span>Payment</span>
            <strong>{order.payment}</strong>
          </div>

          <div>
            <span>Total</span>
            <strong>{formatPrice(order.total)}</strong>
          </div>
        </div>

        <div className="actions">
          <button
            className="btn black"
            onClick={() => router.push(`/order/${order.id}`)}
          >
            View Order
          </button>

          <button className="btn white" onClick={() => router.push("/")}>
            Continue Shopping
          </button>
        </div>
      </section>
    </main>
  );
}