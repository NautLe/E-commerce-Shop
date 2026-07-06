import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Header from "@/components/Header";
import { formatPrice, getOrders } from "@/lib/storage";

export default function Orders() {
  const navigate = useNavigate();
  const [orders, setOrders] = useState([]);

  useEffect(() => {
    setOrders(getOrders());
  }, []);

  return (
    <main>
      <Header />

      <section className="page">
        <h1>My Orders</h1>

        {orders.length === 0 ? (
          <div className="emptyBox">
            <p>No orders yet.</p>

            <button onClick={() => navigate("/")}>Start Shopping</button>
          </div>
        ) : (
          <div className="panel">
            {orders.map((order) => (
              <div className="orderRow" key={order.id}>
                <div>
                  <strong>{order.orderNumber}</strong>
                  <p>{order.date}</p>
                </div>

                <span className="status">{order.status}</span>

                <strong>{formatPrice(order.total)}</strong>

                <button onClick={() => navigate(`/order/${order.id}`)}>
                  View
                </button>
              </div>
            ))}
          </div>
        )}
      </section>
    </main>
  );
}
