export function formatPrice(price) {
  const safePrice = Number(price) || 0;

  return safePrice.toLocaleString("en-US", {
    style: "currency",
    currency: "USD",
  });
}

export function getCart() {
  if (typeof window === "undefined") return [];

  const cart = localStorage.getItem("cart");

  if (!cart) return [];

  try {
    return JSON.parse(cart);
  } catch {
    return [];
  }
}

export function saveCart(cart) {
  if (typeof window === "undefined") return;

  localStorage.setItem("cart", JSON.stringify(cart));
}

export function addToCart(product) {
  const cart = getCart();

  const newItem = {
    ...product,
    price: Number(product.price) || 0,
    quantity: Number(product.quantity) || 1,
    size: product.size || "M",
    color: product.color || "White",
  };

  const existing = cart.find(
    (item) =>
      item.id === newItem.id &&
      item.size === newItem.size &&
      item.color === newItem.color
  );

  if (existing) {
    existing.quantity = Number(existing.quantity || 0) + newItem.quantity;
  } else {
    cart.push(newItem);
  }

  saveCart(cart);
}

export function updateCartQuantity(id, size, color, quantity) {
  const cart = getCart();

  const newQuantity = Number(quantity) || 1;

  const updatedCart = cart.map((item) => {
    if (item.id === id && item.size === size && item.color === color) {
      return {
        ...item,
        quantity: newQuantity,
      };
    }

    return item;
  });

  saveCart(updatedCart);
}

export function removeFromCart(id, size, color) {
  const cart = getCart();

  const updatedCart = cart.filter(
    (item) => !(item.id === id && item.size === size && item.color === color)
  );

  saveCart(updatedCart);
}

export function getCartTotal() {
  const cart = getCart();

  return cart.reduce((total, item) => {
    const price = Number(item.price) || 0;
    const quantity = Number(item.quantity) || 1;

    return total + price * quantity;
  }, 0);
}

export function clearCart() {
  if (typeof window === "undefined") return;

  localStorage.removeItem("cart");
}

export function getOrders() {
  if (typeof window === "undefined") return [];

  const orders = localStorage.getItem("orders");

  if (!orders) return [];

  try {
    return JSON.parse(orders);
  } catch {
    return [];
  }
}

export function saveOrder(order) {
  if (typeof window === "undefined") return;

  const orders = getOrders();
  orders.push(order);
  localStorage.setItem("orders", JSON.stringify(orders));
  localStorage.setItem("latestOrder", JSON.stringify(order));
}
