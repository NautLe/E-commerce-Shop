import {
  useCallback,
  useEffect,
  useState,
} from "react";

import {
  Navigate,
  Route,
  Routes,
} from "react-router-dom";

import VoucherPopup from "./components/VoucherPopup.jsx";
import SiteFooter from "./components/SiteFooter.jsx";

import Home from "./pages/Home.jsx";
import Women from "./pages/Women.jsx";
import Men from "./pages/Men.jsx";
import Unisex from "./pages/Unisex.jsx";
import Essentials from "./pages/Essentials.jsx";
import NewArrivals from "./pages/NewArrivals.jsx";

import ItemDetail from "./pages/ItemDetail.jsx";
import Cart from "./pages/Cart.jsx";
import Ship from "./pages/Ship.jsx";
import Checkout from "./pages/Checkout.jsx";
import Success from "./pages/Success.jsx";
import Orders from "./pages/Orders.jsx";
import OrderDetail from "./pages/OrderDetail.jsx";

export default function App() {
  const [
    voucherOpen,
    setVoucherOpen,
  ] = useState(false);

  const openVoucher = useCallback(() => {
    setVoucherOpen(true);
  }, []);

  const closeVoucher =
    useCallback(() => {
      setVoucherOpen(false);
    }, []);

  /*
   * Không sử dụng localStorage.
   *
   * Popup chỉ mở một lần trong lần
   * tải hiện tại của ứng dụng.
   *
   * Khi người dùng reload trình duyệt,
   * App được khởi tạo lại và popup
   * sẽ tiếp tục xuất hiện.
   */
  useEffect(() => {
    const timer = window.setTimeout(
      () => {
        openVoucher();
      },
      650
    );

    return () => {
      window.clearTimeout(timer);
    };
  }, [openVoucher]);

  return (
    <div className="mochaAppLayout">
      <VoucherPopup
        open={voucherOpen}
        onClose={closeVoucher}
      />

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

        {/*
          ItemDetail hiện tại của bạn dùng:

          const { id } = useParams();

          nên route phải là :id.
        */}

        <Route
          path="/item/:id"
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

      <SiteFooter
        onOpenVoucher={openVoucher}
      />
    </div>
  );
}