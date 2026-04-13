import { Routes, Route } from "react-router-dom";
import { useEffect, useState } from "react";
import Home from "./pages/Home.jsx";
import ProductDetail from "./pages/ProductDetail.jsx";
import Cart from "./pages/Cart.jsx";
import Login from "./pages/Login.jsx";
import Register from "./pages/Register.jsx";
import Header from "./components/Header.jsx";
import { fetchCart } from "./services/cartApi.js";
import { getUser } from "./utils/auth.js";
import OrderSuccess from "./pages/OrderSuccess.jsx";
import Orders from "./pages/Orders.jsx";
import OrderDetail from "./pages/OrderDetail.jsx";
import AdminOrders from "./pages/AdminOrders.jsx";
import AdminProducts from "./pages/AdminProducts.jsx";
import Profile from "./pages/Profile.jsx";


function App() {
  const [cartCount, setCartCount] = useState(0);
  const [user, setUser] = useState(null);

  const refreshUser = () => {
    setUser(getUser());
  };

  const refreshCartCount = async () => {
    try {
      const cart = await fetchCart();
      const total = cart.reduce((sum, item) => sum + item.quantity, 0);
      setCartCount(total);
    } catch (error) {
      console.error(error.message);
    }
  };

  useEffect(() => {
    refreshUser();
    refreshCartCount();
  }, []);

  return (
    <>
      <Header cartCount={cartCount} user={user} />

      <Routes>
        <Route path="/" element={<Home />} />
        <Route
          path="/product/:id"
          element={<ProductDetail refreshCartCount={refreshCartCount} />}
        />
        <Route
          path="/cart"
          element={<Cart refreshCartCount={refreshCartCount} />}
        />
        <Route path="/login" element={<Login refreshUser={refreshUser} />} />
        <Route path="/register" element={<Register />} />
        <Route path="/order-success" element={<OrderSuccess />} />
        <Route path="/orders" element={<Orders />} />
        <Route path="/orders/:id" element={<OrderDetail />} />
        <Route path="/admin/orders" element={<AdminOrders />} />
        <Route path="/admin/products" element={<AdminProducts />} />
        <Route path="/profile" element={<Profile />} />
      </Routes>
    </>
  );
}

export default App;