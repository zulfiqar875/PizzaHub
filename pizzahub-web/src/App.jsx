// src/App.jsx
import { Route, Routes } from "react-router-dom";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Menu from "./pages/Menu";
import Cart from "./pages/Cart";
import Tracker from "./pages/Tracker";
import Protected from "./components/Protected";
import Layout from "./components/Layout";

// Admin
import AdminLayout from "./components/AdminLayout";
import AdminHome from "./pages/Admin/Home";
import AdminCategories from "./pages/Admin/Categories";
import AdminProducts from "./pages/Admin/Products";
import AdminOrders from "./pages/Admin/Orders";
import AdminReports from "./pages/Admin/Reports";
import OrderConfirmation from "./pages/OrderConfirmation";
import MyOrders from "./pages/MyOrders";




export default function App() {
  return (
    <Layout>
      <Routes>
        <Route path="/" element={<Menu />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/cart" element={<Protected><Cart /></Protected>} />
        <Route path="/my-orders" element={<MyOrders />} />
        <Route path="/order-confirmation/:code" element={<OrderConfirmation />} />


        {/* Admin area */}
        <Route path="/admin" element={
          <Protected role="admin"><AdminLayout /></Protected>
        }>
          <Route index element={<AdminHome />} />
          <Route path="categories" element={<AdminCategories />} />
          <Route path="products" element={<AdminProducts />} />
          <Route path="orders" element={<AdminOrders />} />
          <Route path="reports" element={<AdminReports />} />
        </Route>
      </Routes>
    </Layout>
  );
}
