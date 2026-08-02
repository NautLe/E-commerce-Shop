import React, { useEffect, useState } from "react";
import { showToast } from "../utils/showToast";
import { useDispatch, useSelector } from "react-redux";
import {
  updateCartItemQty,
  removeErrors,
  removeItemFromCart,
  removeMessage,
} from "../features/cart/cartSlice";

const CartItem = ({ item }) => {
  const { success, loading, error, message } = useSelector(
    (state) => state.cart
  );
  console.log(item);
  
 
  
  const dispatch = useDispatch();
  const [quantity, setQuantity] = useState(item.quantity);

  const increaseQuantity = () => {
    // Prevent going above available stock
    if (item.stock <= quantity) {
      showToast.error("Only " + item.stock + " items available.");
      return;
    }
    setQuantity((qty) => qty + 1);
  };

  const decreaseQuantity = () => {
    if (quantity <= 1) {
      showToast.error("Quantity cannot be less than 1");
      return;
    }
    setQuantity((qty) => qty - 1);
  };

  const handleUpdate = () => {
    if (loading) return;
    if (quantity !== item.quantity) {
      // Use updateCartItemQty to SET the quantity,
      dispatch(updateCartItemQty({ productId: item.productId, quantity }));
    }
  };

  const handleRemove = () => {
    if (loading) return;
    dispatch(removeItemFromCart(item.productId));
    showToast.success("Item removed from cart Successfully.");
  };

  useEffect(() => {
    if (error) {
      showToast.error(
        typeof error === "string"
          ? error
          : error.response?.data?.message || error.message,
      );
      dispatch(removeErrors());
    }
  }, [dispatch, error]);

  useEffect(() => {
    if (success) {
      showToast.success(message, { toastId: "cart-updated" });
      dispatch(removeMessage());
    }
  }, [dispatch, success, message]);

  return (
    <div className="cart-item">
      <div className="item-info">
        <img src={item.image} alt={item.name} className="item-image" />
        <div className="item-details">
          <h3 className="item-name">{item.name}</h3>
          <p className="item-price">
            <strong>Price: </strong>${item.price.toFixed(2)}
          </p>
          {item.size && (
            <p
              className="item-size"
              style={{ fontSize: "13px", color: "#555", margin: "3px 0" }}
            >
              <strong>Size: </strong>
              <span
                style={{
                  textTransform: "uppercase",
                  fontWeight: "700",
                  color: "#111",
                }}
              >
                {item.size}
              </span>
            </p>
            
          )}
          <p >Stock: {item.stock}</p>
          <p className="item-quantity">
            <strong>Quantity: </strong> {item.quantity}
          </p>
        </div>
      </div>
      <div className="quantity-controls">
        <button
          className="quantity-button decrease-btn"
          onClick={decreaseQuantity}
          disabled={loading}
        >
          -
        </button>
        <input
          type="number"
          value={quantity}
          className="quantity-input"
          readOnly
          min="1"
        />
        <button
          className="quantity-button increase-btn"
          onClick={increaseQuantity}
          disabled={loading}
        >
          +
        </button>
      </div>
      <div className="item-total">
        <span className="item-total-price">
          {(item.price * item.quantity).toFixed(2)}
        </span>
      </div>
      <div className="item-actions">
        <button
          className="update-item-btn"
          onClick={handleUpdate}
          disabled={loading || quantity === item.quantity}
        >
          {loading ? "Updating" : "Update"}
        </button>
        <button
          className="remove-item-btn"
          disabled={loading}
          onClick={handleRemove}
        >
          Remove
        </button>
      </div>
    </div>
  );
};

export default CartItem;
