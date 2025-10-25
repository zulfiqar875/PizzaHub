// src/pages/Admin/Home.jsx
import { useEffect, useState } from "react";
import { api } from "../../api/client";

const STATUSES = ['PENDING','CONFIRMED','PREPARING','OUT_FOR_DELIVERY','DELIVERED','CANCELLED'];

export default function AdminHome() {
  const [totals, setTotals] = useState({ categories:0, products:0, users:0, orders_today:0 });
  const [orders, setOrders] = useState([]);

  const load = () => {
    api("/admin_stats.php").then(d => {
      setTotals(d.totals || {});
      setOrders(d.today_orders || []);
    }).catch(()=>{});
  };

  useEffect(() => { load(); }, []);

  const updateStatus = async (order_id, status) => {
    const note = prompt("Optional note:", "");
    await api("/order_status.php", {
      method: "POST",
      body: JSON.stringify({ order_id, status, note })
    });
    load();
  };

  return (
    <>
      <h2 className="mb-4">Admin Dashboard</h2>

      {/* KPI Cards */}
      <div className="row g-3 mb-4">
        <div className="col-sm-6 col-lg-3">
          <div className="card shadow-sm h-100">
            <div className="card-body d-flex align-items-center gap-3">
              <i className="bi bi-grid fs-1 text-primary"></i>
              <div>
                <div className="text-muted small">Total Categories</div>
                <div className="fs-4 fw-semibold">{totals.categories}</div>
              </div>
            </div>
          </div>
        </div>

        <div className="col-sm-6 col-lg-3">
          <div className="card shadow-sm h-100">
            <div className="card-body d-flex align-items-center gap-3">
              <i className="bi bi-box-seam fs-1 text-success"></i>
              <div>
                <div className="text-muted small">Total Products</div>
                <div className="fs-4 fw-semibold">{totals.products}</div>
              </div>
            </div>
          </div>
        </div>

        <div className="col-sm-6 col-lg-3">
          <div className="card shadow-sm h-100">
            <div className="card-body d-flex align-items-center gap-3">
              <i className="bi bi-people fs-1 text-warning"></i>
              <div>
                <div className="text-muted small">Total Users</div>
                <div className="fs-4 fw-semibold">{totals.users}</div>
              </div>
            </div>
          </div>
        </div>

        <div className="col-sm-6 col-lg-3">
          <div className="card shadow-sm h-100">
            <div className="card-body d-flex align-items-center gap-3">
              <i className="bi bi-basket fs-1 text-danger"></i>
              <div>
                <div className="text-muted small">Today Orders</div>
                <div className="fs-4 fw-semibold">{totals.orders_today}</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Today's Orders Table */}
      <div className="card shadow-sm">
        <div className="card-body">
          <div className="d-flex align-items-center justify-content-between mb-2">
            <h5 className="mb-0">Today’s Latest Orders</h5>
            <a className="btn btn-sm btn-outline-secondary" href="/admin/orders">Manage all</a>
          </div>
          <div className="table-responsive">
            <table className="table table-hover align-middle mb-0">
              <thead>
                <tr>
                  <th>#</th>
                  <th>User ID</th>
                  <th>Status</th>
                  <th>Total</th>
                  <th>Placed At</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {orders.length ? orders.map(o => (
                  <tr key={o.id}>
                    <td>{o.id}</td>
                    <td>{o.user_id}</td>
                    <td><span className="badge text-bg-secondary">{o.status}</span></td>
                    <td>Rs {Number(o.total).toFixed(2)}</td>
                    <td>{o.placed_at}</td>
                    <td className="text-end">
                      <div className="btn-group">
                        <button className="btn btn-sm btn-outline-primary dropdown-toggle" data-bs-toggle="dropdown">
                          Update Status
                        </button>
                        <ul className="dropdown-menu dropdown-menu-end">
                          {STATUSES.map(s => (
                            <li key={s}>
                              <button className="dropdown-item" onClick={() => updateStatus(o.id, s)}>{s}</button>
                            </li>
                          ))}
                        </ul>
                      </div>
                      <a className="btn btn-sm btn-outline-secondary ms-2" href={`/admin/orders`}>Details</a>
                    </td>
                  </tr>
                )) : (
                  <tr><td colSpan={6} className="text-center text-muted">No orders today.</td></tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </>
  );
}
