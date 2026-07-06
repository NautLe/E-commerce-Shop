import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import Header from "@/components/Header";
import {
  getCart,
  updateCartQuantity,
  removeFromCart,
  formatPrice,
} from "@/lib/storage";

export default function Cart() {
  const [cart, setCart] = useState([]);

  useEffect(() => {
    setCart(getCart());
  }, []);

  function handleQuantityChange(item, newQuantity) {
    const safeQuantity = Math.max(1, newQuantity);

    updateCartQuantity(item.id, item.size, item.color, safeQuantity);
    setCart(getCart());
  }

  function handleRemove(item) {
    removeFromCart(item.id, item.size, item.color);
    setCart(getCart());
  }

  const subtotal = cart.reduce((total, item) => {
    return total + Number(item.price || 0) * Number(item.quantity || 1);
  }, 0);

  return (
    <main>
      <Header />

      <section className="page">
        <h1>Your Cart</h1>

        {cart.length === 0 ? (
          <div className="emptyBox">
            <h2>Your cart is empty</h2>
            <p>Start shopping and add your favorite items.</p>

            <Link to="/" className="btn black">
              Continue Shopping
            </Link>
          </div>
        ) : (
          <div className="checkoutLayout">
            <div className="panel">
              {cart.map((item) => (
                <div
                  className="cartItem"
                  key={`${item.id}-${item.color}-${item.size}`}
                >
                  <div className="miniVisual cartImageBox">
                    {item.image ? (
                      <img src={item.image} alt={item.name} />
                    ) : (
                      <span>No image</span>
                    )}
                  </div>

                  <div>
                    <h3>{item.name}</h3>
                    <p>
                      {item.color} / {item.size}
                    </p>

                    <div className="qty small">
                      <button
                        type="button"
                        onClick={() =>
                          handleQuantityChange(
                            item,
                            Number(item.quantity || 1) - 1
                          )
                        }
                      >
                        -
                      </button>

                      <span>{item.quantity}</span>

                      <button
                        type="button"
                        onClick={() =>
                          handleQuantityChange(
                            item,
                            Number(item.quantity || 1) + 1
                          )
                        }
                      >
                        +
                      </button>
                    </div>
                  </div>

                  <strong>
                    {formatPrice(
                      Number(item.price || 0) * Number(item.quantity || 1)
                    )}
                  </strong>

                  <button type="button" onClick={() => handleRemove(item)}>
                    Remove
                  </button>
                </div>
              ))}
            </div>

            <div className="summary">
              <h2>Order Summary</h2>

              <div>
                <span>Subtotal</span>
                <strong>{formatPrice(subtotal)}</strong>
              </div>

              <div>
                <span>Shipping</span>
                <strong>Free</strong>
              </div>

              <hr />

              <div>
                <span>Total</span>
                <strong>{formatPrice(subtotal)}</strong>
              </div>

              <Link to="/ship" className="wideBtn">
                Checkout
              </Link>
            </div>
          </div>
        )}
      </section>
    </main>
  );
}
