import { Link } from "react-router-dom";
import Header from "@/components/Header";

export default function Success() {
  return (
    <main>
      <Header />

      <section className="successPage">
        <div className="checkIcon">✓</div>

        <h1>Order Successful</h1>

        <p>Thank you for shopping with MOCHA Store.</p>

        <div className="actions">
          <Link to="/orders" className="btn black">
            View All Orders
          </Link>

          <Link to="/" className="btn white">
            Continue Shopping
          </Link>
        </div>
      </section>
    </main>
  );
}