import { useEffect, useState } from "react";
import { api } from "../../api/client";

const STATUSES = ['PENDING','CONFIRMED','PREPARING','OUT_FOR_DELIVERY','DELIVERED','CANCELLED'];

export default function AdminOrders() {
  const [rows, setRows] = useState([]);
  const [selected, setSelected] = useState(null);
  const [msg, setMsg] = useState({ type: "", text: "" });
  const [updatingId, setUpdatingId] = useState(0); // disable button per order

  const load = () => api("/orders.php").then(setRows);
  useEffect(() => { load(); }, []);

  const openDetails = async (o) => {
    const hist = await api(`/order_status.php?code=${encodeURIComponent(o.tracker_code)}`);
    const items = await api(`/orders.php?order_id=${o.id}`).catch(()=>({items:[]}));
    setSelected({ order:o, history:hist.history||[], items:items.items||[] });
  };

  const flash = (type, text, ms=2500) => {
    setMsg({ type, text });
    setTimeout(()=> setMsg({ type:"", text:"" }), ms);
  };

  const updateStatus = async (order_id, status) => {
    const note = prompt("Optional note:", "") || "";
    setUpdatingId(order_id);
    try {
      const res = await api("/order_status.php", {
        method: "POST",
        body: JSON.stringify({ order_id, status, note })
      });
      // Success message
      flash("success", `Order #${order_id} updated to ${res.status}`);
      await load();
      if (selected?.order?.id === order_id) {
        // re-open details to reflect latest timeline
        const curr = rows.find(r => r.id === order_id) || selected.order;
        openDetails(curr);
      }
    } catch (e) {
      flash("danger", e.message || "Status update failed");
    } finally {
      setUpdatingId(0);
    }
  };

  return (
    <>
      <h3 className="mb-3">Orders</h3>

      {msg.text && (
        <div className={`alert alert-${msg.type} py-2`} role="alert">
          {msg.text}
        </div>
      )}

      <div className="card shadow-sm mb-3">
        <div className="card-body p-0">
          <table className="table table-hover mb-0 align-middle">
            <thead><tr>
              <th>#</th><th>Customer</th><th>Status</th><th>Total</th><th>Placed</th><th style={{width:240}}></th>
            </tr></thead>
            <tbody>
              {rows.map((o)=>(
                <tr key={o.id}>
                  <td>{o.id}</td>
                  <td>{o.user_id}</td>
                  <td><span className="badge text-bg-secondary">{o.status}</span></td>
                  <td>Rs {Number(o.total).toFixed(2)}</td>
                  <td>{o.placed_at}</td>
                  <td className="text-end">
                    <button className="btn btn-sm btn-outline-secondary me-2" onClick={()=>openDetails(o)}>
                      Details
                    </button>
                    <div className="btn-group">
                      <button
                        className="btn btn-sm btn-outline-primary dropdown-toggle"
                        data-bs-toggle="dropdown"
                        disabled={updatingId === o.id}
                      >
                        {updatingId === o.id ? "Updating..." : "Update Status"}
                      </button>
                      <ul className="dropdown-menu dropdown-menu-end">
                        {STATUSES.map(s=>(
                          <li key={s}>
                            <button className="dropdown-item" onClick={()=>updateStatus(o.id, s)}>
                              {s}
                            </button>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </td>
                </tr>
              ))}
              {!rows.length && <tr><td colSpan={6} className="text-center text-muted">No orders.</td></tr>}
            </tbody>
          </table>
        </div>
      </div>

      {selected && (
        <div className="card shadow-sm">
          <div className="card-body">
            <h5>Order #{selected.order.id} — Rs {Number(selected.order.total).toFixed(2)}</h5>
            <p className="text-muted small mb-2">Tracker: {selected.order.tracker_code}</p>
            <div className="row">
              <div className="col-md-6">
                <h6>Items</h6>
                <ul className="list-group list-group-flush">
                  {selected.items.length ? selected.items.map((it,idx)=>(
                    <li key={idx} className="list-group-item d-flex justify-content-between">
                      <span>{it.name_snapshot} x {it.quantity}</span>
                      <span>Rs {Number(it.price_snapshot).toFixed(2)}</span>
                    </li>
                  )) : <li className="list-group-item text-muted">No items found.</li>}
                </ul>
              </div>
              <div className="col-md-6">
                <h6>Status History</h6>
                <ul className="list-group list-group-flush">
                  {selected.history.map((h,idx)=>(
                    <li key={idx} className="list-group-item d-flex justify-content-between">
                      <span>{h.status} {h.note ? `— ${h.note}` : ""}</span>
                      <span className="text-muted small">{h.changed_at}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
