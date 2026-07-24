export function formatPrice(price) {
  const safePrice = Number(price) || 0;
  return `$${safePrice.toFixed(2)}`;
}

/* CART */

export function getCart() {
  try {
    return JSON.parse(localStorage.getItem("cart")) || [];
  } catch {
    return [];
  }
}

export function saveCart(cart) {
  localStorage.setItem("cart", JSON.stringify(cart));
}

export function addToCart(product) {
  const cart = getCart();

  const quantity = Number(product.quantity) || 1;

  const existingItem = cart.find(
    (item) =>
      item.id === product.id &&
      item.size === product.size &&
      item.color === product.color
  );

  if (existingItem) {
    existingItem.quantity = Number(existingItem.quantity || 0) + quantity;
  } else {
    cart.push({
      id: product.id,
      name: product.name,
      price: Number(product.price) || 0,
      tag: product.tag,
      category: product.category,
      tone: product.tone,
      size: product.size,
      color: product.color,
      image: product.image,
      quantity,
    });
  }

  saveCart(cart);
}

export function updateCartItem(index, quantity) {
  const cart = getCart();

  if (!cart[index]) return cart;

  cart[index].quantity = Math.max(1, Number(quantity) || 1);
  saveCart(cart);

  return cart;
}

export function removeCartItem(index) {
  const cart = getCart();

  cart.splice(index, 1);
  saveCart(cart);

  return cart;
}

export function getCartTotal(cart) {
  return cart.reduce((total, item) => {
    return total + Number(item.price || 0) * Number(item.quantity || 1);
  }, 0);
}

export function clearCart() {
  localStorage.removeItem("cart");
}

/* ORDERS */

export function getOrders() {
  try {
    return JSON.parse(localStorage.getItem("orders")) || [];
  } catch {
    return [];
  }
}

export function saveOrder(order) {
  const orders = getOrders();

  const newOrder = {
    ...order,
    id: order.id || `MOCHA-${Date.now()}`,
    orderNumber:
      order.orderNumber || `#${Math.floor(10000 + Math.random() * 90000)}`,
    date: order.date || new Date().toLocaleDateString(),
    status: order.status || "Processing",
  };

  orders.unshift(newOrder);

  localStorage.setItem("orders", JSON.stringify(orders));
  localStorage.setItem("lastOrderId", newOrder.id);

  return newOrder;
}

export function getOrderById(orderId) {
  const orders = getOrders();
  return orders.find((order) => String(order.id) === String(orderId));
}

export function getLastOrderId() {
  return localStorage.getItem("lastOrderId");
}