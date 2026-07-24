import {
  Navigate,
  Route,
  Routes,
} from "react-router-dom";

import Home from "@/pages/Home";
import Women from "@/pages/Women";
import Men from "@/pages/Men";
import Unisex from "@/pages/Unisex";
import Essentials from "@/pages/Essentials";
import NewArrivals from "@/pages/NewArrivals";

import ItemDetail from "@/pages/ItemDetail";

import Cart from "@/pages/Cart";
import Ship from "@/pages/Ship";
import Checkout from "@/pages/Checkout";
import Success from "@/pages/Success";

import Orders from "@/pages/Orders";
import OrderDetail from "@/pages/OrderDetail";

export default function App() {
  return (
    <Routes>
      <Route
        path="/"
        element={<Home />}
      />

      <Route
        path="/women"
        element={<Women />}
      />

      <Route
        path="/men"
        element={<Men />}
      />

      <Route
        path="/unisex"
        element={<Unisex />}
      />

      <Route
        path="/essentials"
        element={<Essentials />}
      />

      <Route
        path="/new-arrivals"
        element={<NewArrivals />}
      />

      {/* Product detail — dùng page có sẵn */}
      <Route
        path="/item/:productId"
        element={<ItemDetail />}
      />

      <Route
        path="/cart"
        element={<Cart />}
      />

      <Route
        path="/ship"
        element={<Ship />}
      />

      <Route
        path="/checkout"
        element={<Checkout />}
      />

      <Route
        path="/success"
        element={<Success />}
      />

      <Route
        path="/orders"
        element={<Orders />}
      />

      <Route
        path="/orders/:orderId"
        element={<OrderDetail />}
      />

      <Route
        path="*"
        element={
          <Navigate
            to="/"
            replace
          />
        }
      />
    </Routes>
  );
}