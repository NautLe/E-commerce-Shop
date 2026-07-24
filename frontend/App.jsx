import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

import Home from "./pages/Home";
import NewArrivals from "./pages/NewArrivals";
import CategoryPage from "./pages/CategoryPage";
import ItemDetail from "./pages/ItemDetail";
import Cart from "./pages/Cart";
import Ship from "./pages/Ship";
import Checkout from "./pages/Checkout";
import Success from "./pages/Success";
import Orders from "./pages/Orders";
import OrderDetail from "./pages/OrderDetail";
import Women from "@/pages/Women";
import Men from "@/pages/Men";
import Unisex from "@/pages/Unisex";

export default function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />

        <Route path="/new-arrivals" element={<NewArrivals />} />

        
        <Route path="/women" element={<Women />} />

        <Route path="/men" element={<Men />} />

        <Route path="/unisex" element={<Unisex />} />

        <Route
          path="/essentials"
          element={<CategoryPage category="Essentials" />}
        />

        <Route path="/item/:id" element={<ItemDetail />} />
        <Route path="/cart" element={<Cart />} />
        <Route path="/ship" element={<Ship />} />
        <Route path="/checkout" element={<Checkout />} />
        <Route path="/success" element={<Success />} />
        <Route path="/orders" element={<Orders />} />
        <Route path="/order/:id" element={<OrderDetail />} />
      </Routes>
    </Router>
  );
}