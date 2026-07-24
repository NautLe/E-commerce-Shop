import { Route, Routes } from "react-router-dom";

import Home from "@/pages/Home";
import Women from "@/pages/Women";
import Men from "@/pages/Men";
import Unisex from "@/pages/Unisex";
import Essentials from "@/pages/Essentials";
import Orders from "@/pages/Orders";
import OrderDetail from "@/pages/OrderDetail";

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />

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
        path="/orders"
        element={<Orders />}
      />

      <Route
        path="/orders/:orderId"
        element={<OrderDetail />}
      />
    </Routes>
  );
}