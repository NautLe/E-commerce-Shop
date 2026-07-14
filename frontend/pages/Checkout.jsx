import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Header from "@/components/Header";
import { formatPrice, getCart, saveOrder } from "@/lib/storage";

export default function Checkout() {
  const navigate = useNavigate();

  const [cart, setCart] = useState([]);
  const [payment, setPayment] = useState("Credit / Debit Card");

  useEffect(() => {
    setCart(getCart());
  }, []);

  const subtotal = cart.reduce((sum, item) => {
    return sum + Number(item.price || 0) * Number(item.quantity || 1);
  }, 0);

  const shippingFee = subtotal >= 60 ? 0 : 4;
  const total = subtotal + shippingFee;

  function placeOrder() {
    if (cart.length === 0) {
      navigate("/");
      return;
    }

    const shipping = JSON.parse(localStorage.getItem("shipping") || "{}");

    const orderItems = cart.map((item) => ({
      id: item.id,
      name: item.name,
      price: Number(item.price) || 0,
      tag: item.tag,
      category: item.category,
      tone: item.tone,
      color: item.color,
      size: item.size,
      quantity: Number(item.quantity) || 1,
      image: item.image,
    }));

    const order = {
      id: String(Date.now()),
      orderNumber: `#${Math.floor(10000 + Math.random() * 90000)}`,
      date: new Date().toLocaleDateString(),
      status: "Processing",
      items: orderItems,
      shipping,
      payment,
      subtotal,
      shippingFee,
      total,
    };

    saveOrder(order);
    localStorage.removeItem("cart");

    navigate("/success");
  }

  return (
    <main>
      <Header />

      <section className="page">
        <h1>Checkout</h1>

        <div className="checkoutLayout">
          <div className="panel">
            <h2>Payment Method</h2>

            {["Credit / Debit Card", "MoMo e-Wallet", "Bank Transfer"].map(
              (method) => (
                <label className="radio" key={method}>
                  <input
                    type="radio"
                    checked={payment === method}
                    onChange={() => setPayment(method)}
                  />

                  {method}
                </label>
              )
            )}

            <button className="wideBtn" type="button" onClick={placeOrder}>
              Place Order
            </button>
          </div>

          <aside className="summary">
            <h2>Order Summary</h2>

            <div>
              <span>Subtotal</span>
              <strong>{formatPrice(subtotal)}</strong>
            </div>

            <div>
              <span>Shipping</span>
              <strong>{formatPrice(shippingFee)}</strong>
            </div>

            <div>
              <span>Total</span>
              <strong>{formatPrice(total)}</strong>
            </div>
          </aside>
        </div>
      </section>
    </main>
  );
}