import { Link, useParams } from "react-router-dom";
import Header from "@/components/Header";
import { products } from "@/lib/products";
import { formatPrice, getOrderById } from "@/lib/storage";

export default function OrderDetail() {
  const { id } = useParams();
  const order = getOrderById(id);

  function getItemImage(item) {
    const product = products.find((product) => product.id === item.id);

    if (product?.images?.[item.color]) {
      return product.images[item.color];
    }

    if (product?.image) {
      return product.image;
    }

    return item.image;
  }

  if (!order) {
    return (
      <main>
        <Header />

        <section className="page">
          <h1>Order not found</h1>

          <Link to="/orders" className="wideBtn">
            Back to Orders
          </Link>
        </section>
      </main>
    );
  }

  const subtotal =
    order.items?.reduce((total, item) => {
      return total + Number(item.price || 0) * Number(item.quantity || 1);
    }, 0) || 0;

  return (
    <main>
      <Header />

      <section className="page">
        <h1>Order Detail</h1>

        <div className="checkoutLayout">
          <div className="panel orderDetailPanel">
            <h2>{order.orderNumber || `#${order.id}`}</h2>

            <div className="orderMeta">
              <p>Status: {order.status}</p>
              <p>Date: {order.date}</p>
              <p>Payment: {order.payment}</p>
            </div>

            <hr />

            <div className="orderItemList">
              {order.items?.map((item, index) => {
                const itemImage = getItemImage(item);

                return (
                  <div
                    className="orderDetailItem"
                    key={`${item.id}-${item.color}-${item.size}-${index}`}
                  >
                    <div className="orderDetailImage">
                      {itemImage ? (
                        <img src={itemImage} alt={item.name} />
                      ) : (
                        <span>No image</span>
                      )}
                    </div>

                    <div className="orderDetailInfo">
                      <h3>{item.name}</h3>

                      <p>
                        {item.color} / {item.size} / Qty: {item.quantity}
                      </p>
                    </div>

                    <strong>
                      {formatPrice(Number(item.price) * Number(item.quantity))}
                    </strong>
                  </div>
                );
              })}
            </div>
          </div>

          <aside className="summary">
            <h2>Shipping</h2>

            <p>{order.shipping?.name}</p>
            <p>{order.shipping?.phone}</p>
            <p>{order.shipping?.address}</p>
            <p>{order.shipping?.city}</p>

            <hr />

            <div>
              <span>Subtotal</span>
              <strong>{formatPrice(subtotal)}</strong>
            </div>

            <div>
              <span>Shipping</span>
              <strong>{formatPrice(order.shippingFee || 0)}</strong>
            </div>

            <div>
              <span>Total</span>
              <strong>{formatPrice(order.total || subtotal)}</strong>
            </div>
          </aside>
        </div>
      </section>
    </main>
  );
}