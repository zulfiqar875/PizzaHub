import { Link, NavLink } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function Header() {
  const { user, logout } = useAuth();

  return (
    <nav className="navbar navbar-expand-lg bg-white border-bottom shadow-sm">
      <div className="container">
        <Link className="navbar-brand d-flex align-items-center gap-2" to="/">
          <i className="bi bi-pizza"></i>
          <span>Pizza Hub</span>
        </Link>

        <button
          className="navbar-toggler"
          type="button"
          data-bs-toggle="collapse"
          data-bs-target="#mainNav"
        >
          <span className="navbar-toggler-icon"></span>
        </button>

        <div id="mainNav" className="collapse navbar-collapse">
          <ul className="navbar-nav me-auto mb-2 mb-lg-0">
            {/* Common for all users */}
            <li className="nav-item">
              <NavLink className="nav-link" to="/">Menu</NavLink>
            </li>
            {user && user.role !== "admin" && (
              <>
                <li className="nav-item">
                  <NavLink className="nav-link" to="/cart">Cart</NavLink>
                </li>
                <li className="nav-item">
                  <NavLink className="nav-link" to="/my-orders">Track Orders</NavLink>
                </li>
              </>
            )}

            {/* Admin links */}
            {user?.role === "admin" && (
              <li className="nav-item dropdown">
                <a
                  href="#"
                  className="nav-link dropdown-toggle"
                  role="button"
                  data-bs-toggle="dropdown"
                >
                  Admin Panel
                </a>
                <ul className="dropdown-menu">
                  <li><NavLink className="dropdown-item" to="/admin">Dashboard</NavLink></li>
                  <li><NavLink className="dropdown-item" to="/admin/categories">Categories</NavLink></li>
                  <li><NavLink className="dropdown-item" to="/admin/products">Products</NavLink></li>
                  <li><NavLink className="dropdown-item" to="/admin/orders">Orders</NavLink></li>
                  <li><NavLink className="dropdown-item" to="/admin/reports">Reports</NavLink></li>
                </ul>
              </li>
            )}
          </ul>

          {/* Right side buttons */}
          <div className="d-flex align-items-center gap-2">
            {user ? (
              <>
                <span className="text-muted small">
                  Hi, {user.name}{" "}
                  {user.role === "admin" && (
                    <span className="badge text-bg-warning ms-1">Admin</span>
                  )}
                </span>
                <button
                  className="btn btn-outline-danger btn-sm"
                  onClick={logout}
                >
                  Logout
                </button>
              </>
            ) : (
              <div className="d-flex gap-2">
                <NavLink className="btn btn-outline-secondary btn-sm" to="/register">
                  Register
                </NavLink>
                <NavLink className="btn btn-primary btn-sm" to="/login">
                  Login
                </NavLink>
              </div>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}
