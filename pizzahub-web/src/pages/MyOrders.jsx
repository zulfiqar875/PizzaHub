import { useEffect, useMemo, useState } from "react";
import { api } from "../api/client";

const STATUS_STEPS = ['PENDING','CONFIRMED','PREPARING','OUT_FOR_DELIVERY','DELIVERED'];
const statusIcon = (s) => {
  switch (s) {
    case 'PENDING': return 'bi-hourglass-split';
    case 'CONFIRMED': return 'bi-patch-check';
    case 'PREPARING': return 'bi-fire';
    case 'OUT_FOR_DELIVERY': return 'bi-truck';
    case 'DELIVERED': return 'bi-check2-circle';
    case 'CANCELLED': return 'bi-x-circle';
    default: return 'bi-info-circle';
  }
};

export default function MyOrders() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [openId, setOpenId] = useState(null);
  const [details, setDetails] = useState({ items:[], history:[] });

  const load = async () => {
    try {
      const list = await api("/orders.php"); // returns user's orders
      setOrders(list);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
    const t = setInterval(load, 10000); // auto refresh every 10s
    return () => clearInterval(t);
  }, []);

  const openDetails = async (o) => {
    setOpenId(o.id);
    // items
    const it = await api(`/orders.php?order_id=${o.id}`).catch(()=>({items:[]}));
    // history by tracker code
    const hs = await api(`/order_status.php?code=${encodeURIComponent(o.tracker_code)}`).catch(()=>({history:[]}));
    setDetails({ items: it.items || [], history: hs.history || [] });
  };

  const totalOrders = useMemo(() => orders.length, [orders]);

  return (
    <>
      <div className="d-flex align-items-center justify-content-between">
        <h2 className="mb-3">My Orders</h2>
        <span className="badge text-bg-primary">Total: {totalOrders}</span>
      </div>

      {loading ? (
        <div className="text-muted">Loading…</div>
      ) : !orders.length ? (
        <div className="alert alert-secondary">You have no orders yet.</div>
      ) : (
        <div className="vstack gap-3">
          {orders.map((o) => {
            const idx = STATUS_STEPS.indexOf(o.status);
            const safeIdx = idx >= 0 ? idx : 0;
            return (
              <div key={o.id} className="card shadow-sm">
                <div className="card-body">
                  <div className="d-flex justify-content-between align-items-center flex-wrap gap-2">
                    <div className="d-flex align-items-center gap-3">
                      <div className="rounded-circle d-flex justify-content-center align-items-center"
                           style={{width: 42, height: 42, background:"#f1f5f9"}}>
                        <i className={`bi ${statusIcon(o.status)} fs-5`}></i>
                      </div>
                      <div>
                        <div className="fw-semibold">Order #{o.id}</div>
                        <div className="text-muted small">Placed: {o.placed_at}</div>
                        <div className="text-muted small">Tracker: {o.tracker_code}</div>
                      </div>
                    </div>
                    <div className="text-end">
                      <div className="badge text-bg-secondary">{o.status.replaceAll("_"," ")}</div>
                      <div className="fw-semibold">Rs {Number(o.total).toFixed(2)}</div>
                    </div>
                  </div>

                  {/* Stepper */}
                  <div className="d-flex justify-content-center align-items-center gap-3 my-3">
                    {STATUS_STEPS.map((s, i) => (
                      <div key={s} className="d-flex align-items-center">
                        <div
                          className={`rounded-circle d-flex justify-content-center align-items-center ${i <= safeIdx ? "bg-success-subtle border border-success text-success" : "bg-light border text-muted"}`}
                          style={{ width: 26, height: 26 }}
                          title={s}
                        >
                          {i < safeIdx ? <i className="bi bi-check"></i> : i === safeIdx ? <i className={`bi ${statusIcon(o.status)}`}></i> : null}
                        </div>
                        <div className={`ms-2 small ${i <= safeIdx ? "fw-semibold" : "text-muted"}`}>{s.replaceAll("_"," ")}</div>
                        {i < STATUS_STEPS.length - 1 && (
                          <div className={`mx-3 ${i < safeIdx ? "bg-success" : "bg-light"}`} style={{ width: 50, height: 2 }}></div>
                        )}
                      </div>
                    ))}
                  </div>

                  <div className="d-flex justify-content-end">
                    <button
                      className="btn btn-sm btn-outline-secondary"
                      onClick={() => openDetails(o)}
                      data-bs-toggle="collapse"
                      data-bs-target={`#order-${o.id}-details`}
                      aria-expanded={openId === o.id}
                    >
                      View details
                    </button>
                  </div>

                  {/* Collapsible details */}
                  <div className="collapse mt-3" id={`order-${o.id}-details`}>
                    <div className="row">
                      <div className="col-md-6">
                        <h6>Items</h6>
                        <ul className="list-group list-group-flush">
                          {(openId === o.id && details.items.length ? details.items : []).map((it, i) => (
                            <li key={i} className="list-group-item d-flex justify-content-between">
                              <span>{it.name_snapshot} × {it.quantity}</span>
                              <span>Rs {Number(it.price_snapshot).toFixed(2)}</span>
                            </li>
                          ))}
                          {openId === o.id && !details.items.length && (
                            <li className="list-group-item text-muted">No items.</li>
                          )}
                        </ul>
                      </div>
                      <div className="col-md-6">
                        <h6>Status History</h6>
                        <ul className="list-group list-group-flush">
                          {(openId === o.id && details.history.length ? details.history : []).map((h, i) => (
                            <li key={i} className="list-group-item d-flex justify-content-between">
                              <span>
                                <i className={`bi ${statusIcon(h.status)} me-2`}></i>
                                {h.status.replaceAll("_"," ")} {h.note ? `— ${h.note}` : ""}
                              </span>
                              <span className="text-muted small">{h.changed_at}</span>
                            </li>
                          ))}
                          {openId === o.id && !details.history.length && (
                            <li className="list-group-item text-muted">No history.</li>
                          )}
                        </ul>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </>
  );
}
