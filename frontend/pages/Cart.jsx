import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import Header from "@/components/Header";
import {
  formatPrice,
  getCart,
  getCartTotal,
  removeCartItem,
  updateCartItem,
} from "@/lib/storage";

export default function Cart() {
  const [cart, setCart] = useState([]);

  useEffect(() => {
    setCart(getCart());
  }, []);

  function handleDecrease(index, currentQuantity) {
    const newQuantity = Math.max(1, Number(currentQuantity) - 1);
    const updatedCart = updateCartItem(index, newQuantity);
    setCart([...updatedCart]);
  }

  function handleIncrease(index, currentQuantity) {
    const newQuantity = Number(currentQuantity) + 1;
    const updatedCart = updateCartItem(index, newQuantity);
    setCart([...updatedCart]);
  }

  function handleRemove(index) {
    const updatedCart = removeCartItem(index);
    setCart([...updatedCart]);
  }

  const subtotal = getCartTotal(cart);
  const shippingFee =
  subtotal >= 60 || subtotal === 0
    ? 0
    : 4;

const total = subtotal + shippingFee;

  return (
    <main>
      <Header />

      <section className="page">
        <h1>Your Cart</h1>

        {cart.length === 0 ? (
          <div className="emptyBox">
            <h2>Your cart is empty</h2>
            <p>Add something you love from our latest collection.</p>

            <Link to="/" className="wideBtn">
              Continue Shopping
            </Link>
          </div>
        ) : (
          <div className="checkoutLayout">
            <div className="panel">
              {cart.map((item, index) => (
                <div className="cartItem" key={`${item.id}-${item.color}-${item.size}-${index}`}>
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
                        onClick={() => handleDecrease(index, item.quantity)}
                      >
                        -
                      </button>

                      <span>{item.quantity}</span>

                      <button
                        type="button"
                        onClick={() => handleIncrease(index, item.quantity)}
                      >
                        +
                      </button>
                    </div>
                  </div>

                  <strong>
                    {formatPrice(Number(item.price) * Number(item.quantity))}
                  </strong>

                  <button type="button" onClick={() => handleRemove(index)}>
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
                <strong>
                {shippingFee === 0
                  ? "Free"
                  : formatPrice(shippingFee)}
              </strong>
              </div>

              <hr />

              <div>
                <span>Total</span>
                <strong>{formatPrice(total)}</strong>
              </div>

              <Link to="/checkout" className="wideBtn">
                Checkout
              </Link>
            </div>
          </div>
        )}
      </section>
    </main>
  );
}