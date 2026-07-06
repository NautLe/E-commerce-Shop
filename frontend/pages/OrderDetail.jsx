import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import Header from "@/components/Header";
import { formatPrice, getOrders } from "@/lib/storage";

export default function OrderDetail() {
  const params = useParams();
  const [order, setOrder] = useState(null);

  useEffect(() => {
    const orders = getOrders();
    const foundOrder = orders.find((item) => item.id === params.id);
    setOrder(foundOrder);
  }, [params.id]);

  if (!order) {
    return (
      <main>
        <Header />

        <section className="page">
          <h1>Order not found.</h1>
        </section>
      </main>
    );
  }

  return (
    <main>
      <Header />

      <section className="page">
        <h1>Order Detail</h1>

        <div className="checkoutLayout">
          <div className="panel">
            <h2>{order.orderNumber}</h2>

            <p>Status: {order.status}</p>
            <p>Date: {order.date}</p>
            <p>Payment: {order.payment}</p>

            <hr />

            {order.items.map((item, index) => (
              <div className="cartItem" key={`${item.id}-${index}`}>
                <div className={`miniVisual ${item.tone}`}></div>

                <div>
                  <h3>{item.name}</h3>

                  <p>
                    {item.color} / {item.size} / Qty: {item.quantity}
                  </p>
                </div>

                <strong>{formatPrice(item.price * item.quantity)}</strong>
              </div>
            ))}
          </div>

          <aside className="summary">
            <h2>Shipping</h2>

            <p>{order.shipping.fullName}</p>
            <p>{order.shipping.phone}</p>
            <p>{order.shipping.address}</p>

            <p>
              {order.shipping.ward}, {order.shipping.district},{" "}
              {order.shipping.city}
            </p>

            <hr />

            <div>
              <span>Subtotal</span>
              <strong>{formatPrice(order.subtotal)}</strong>
            </div>

            <div>
              <span>Shipping</span>
              <strong>{formatPrice(order.shippingFee)}</strong>
            </div>

            <div>
              <span>Total</span>
              <strong>{formatPrice(order.total)}</strong>
            </div>
          </aside>
        </div>
      </section>
    </main>
  );
}
