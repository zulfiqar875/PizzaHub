// src/components/AdminLayout.jsx
import { NavLink, Outlet } from "react-router-dom";

export default function AdminLayout() {
  return (
    <div className="container-fluid">
      <div className="row">
        {/* Sidebar */}
        <aside className="col-12 col-md-3 col-lg-2 border-end bg-light min-vh-100 p-0">
          <div className="list-group list-group-flush">
            <NavLink end to="/admin" className="list-group-item list-group-item-action">Dashboard</NavLink>
            <NavLink to="/admin/categories" className="list-group-item list-group-item-action">Categories</NavLink>
            <NavLink to="/admin/products" className="list-group-item list-group-item-action">Products</NavLink>
            <NavLink to="/admin/orders" className="list-group-item list-group-item-action">Orders</NavLink>
            <NavLink to="/admin/reports" className="list-group-item list-group-item-action">Reports</NavLink>
          </div>
        </aside>

        {/* Main */}
        <main className="col-12 col-md-9 col-lg-10 p-4">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
