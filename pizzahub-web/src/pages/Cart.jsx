// src/pages/Cart.jsx
import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { api } from "../api/client";

export default function Cart() {
  const [items, setItems] = useState([]);
  const [showReview, setShowReview] = useState(false);
  const [address, setAddress] = useState("");
  const [placing, setPlacing] = useState(false);
  const navigate = useNavigate();

  const load = () => api("/cart.php").then((d) => setItems(d.items || []));
  useEffect(() => { load(); }, []);

  const removeItem = async (id) => {
    await api("/cart.php", { method: "DELETE", body: new URLSearchParams({ id }) });
    await load();
  };

  // Bill breakdown (mirror backend: tax 10%, delivery 150)
  const subtotal = useMemo(() => items.reduce((s, i) => s + Number(i.price) * Number(i.quantity), 0), [items]);
  const tax = useMemo(() => Math.round(subtotal * 0.10 * 100) / 100, [subtotal]);
  const delivery = items.length ? 150 : 0;
  const total = subtotal + tax + delivery;

  const openReview = () => {
    if (!items.length) return;
    setShowReview(true);
  };

  const closeReview = () => setShowReview(false);

  const placeOrder = async () => {
    if (!address.trim()) { alert("Please enter delivery address"); return; }
    setPlacing(true);
    try {
      const o = await api("/orders.php", {
        method: "POST",
        body: JSON.stringify({ delivery_address: address.trim() }),
      });

      // Clear UI immediately
      setItems([]);
      setShowReview(false);
      setAddress("");

      // Go to confirmation page
      navigate(`/order-confirmation/${o.tracker_code}`, {
        state: { order_id: o.order_id, total: o.total },
        replace: true,
      });
    } catch (e) {
      alert("Order failed. Please try again.");
      console.error(e);
    } finally {
      setPlacing(false);
    }
  };

  return (
    <div className="row g-3">
      <div className="col-12">
        <h2 className="mb-3">Your Cart</h2>
      </div>

      {/* Cart items list */}
      <div className="col-12">
        <div className="card shadow-sm">
          <div className="card-body p-0">
            <table className="table align-middle mb-0">
              <thead>
                <tr>
                  <th>Product</th>
                  <th style={{width:120}}>Price</th>
                  <th style={{width:100}}>Qty</th>
                  <th style={{width:140}}>Line Total</th>
                  <th style={{width:120}}></th>
                </tr>
              </thead>
              <tbody>
                {items.map((it) => (
                  <tr key={it.id}>
                    <td>
                      <div className="d-flex align-items-center gap-3">
                        {it.image_url ? (
                          <img src={it.image_url} alt="" width="56" height="40" style={{objectFit:"cover", borderRadius:6}} />
                        ) : (
                          <div className="bg-light d-flex align-items-center justify-content-center" style={{width:56, height:40, borderRadius:6}}>
                            <i className="bi bi-image"></i>
                          </div>
                        )}
                        <div>
                          <div className="fw-semibold">{it.name}</div>
                          <div className="text-muted small">{it.category_name || ""}</div>
                        </div>
                      </div>
                    </td>
                    <td>Rs {Number(it.price).toFixed(2)}</td>
                    <td>{it.quantity}</td>
                    <td>Rs {(Number(it.price) * Number(it.quantity)).toFixed(2)}</td>
                    <td className="text-end">
                      <button className="btn btn-sm btn-outline-danger" onClick={() => removeItem(it.id)}>
                        <i className="bi bi-trash"></i> Remove
                      </button>
                    </td>
                  </tr>
                ))}
                {!items.length && (
                  <tr>
                    <td colSpan={5} className="text-center text-muted py-4">
                      Your cart is empty.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Summary card + Review button */}
      <div className="col-12 col-md-5 col-lg-4 ms-auto">
        <div className="card shadow-sm">
          <div className="card-body">
            <h5 className="mb-3">Summary</h5>
            <div className="d-flex justify-content-between mb-1">
              <span className="text-muted">Subtotal</span>
              <span>Rs {subtotal.toFixed(2)}</span>
            </div>
            <div className="d-flex justify-content-between mb-1">
              <span className="text-muted">Tax (10%)</span>
              <span>Rs {tax.toFixed(2)}</span>
            </div>
            <div className="d-flex justify-content-between mb-3">
              <span className="text-muted">Delivery</span>
              <span>Rs {delivery.toFixed(2)}</span>
            </div>
            <div className="d-flex justify-content-between border-top pt-2">
              <strong>Total</strong>
              <strong>Rs {total.toFixed(2)}</strong>
            </div>

            <button
              className="btn btn-success w-100 mt-3"
              disabled={!items.length}
              onClick={openReview}
            >
              Review & Checkout
            </button>
          </div>
        </div>
      </div>

      {/* Review Modal */}
      {showReview && (
        <>
          <div className="modal fade show d-block" tabIndex="-1" role="dialog" aria-modal="true">
            <div className="modal-dialog modal-lg modal-dialog-centered">
              <div className="modal-content">
                <div className="modal-header">
                  <h5 className="modal-title">
                    <i className="bi bi-receipt-cutoff me-2"></i>Review your order
                  </h5>
                  <button type="button" className="btn-close" onClick={closeReview}></button>
                </div>
                <div className="modal-body">
                  {/* Items snapshot (removal allowed) */}
                  <div className="table-responsive mb-3">
                    <table className="table align-middle">
                      <thead>
                        <tr>
                          <th>Product</th>
                          <th style={{width:120}}>Price</th>
                          <th style={{width:100}}>Qty</th>
                          <th style={{width:140}}>Line Total</th>
                          <th style={{width:120}}></th>
                        </tr>
                      </thead>
                      <tbody>
                        {items.map((it) => (
                          <tr key={it.id}>
                            <td>{it.name}</td>
                            <td>Rs {Number(it.price).toFixed(2)}</td>
                            <td>{it.quantity}</td>
                            <td>Rs {(Number(it.price) * Number(it.quantity)).toFixed(2)}</td>
                            <td className="text-end">
                              <button className="btn btn-sm btn-outline-danger" onClick={() => removeItem(it.id)}>
                                <i className="bi bi-trash"></i> Remove
                              </button>
                            </td>
                          </tr>
                        ))}
                        {!items.length && (
                          <tr><td colSpan={5} className="text-center text-muted">Cart is empty.</td></tr>
                        )}
                      </tbody>
                    </table>
                  </div>

                  {/* Bill */}
                  <div className="row g-3">
                    <div className="col-md-6">
                      <label className="form-label">Delivery Address</label>
                      <textarea
                        className="form-control"
                        rows={3}
                        placeholder="House / Street / City"
                        value={address}
                        onChange={(e) => setAddress(e.target.value)}
                      />
                    </div>
                    <div className="col-md-6">
                      <div className="border rounded p-3 h-100">
                        <div className="d-flex justify-content-between">
                          <span className="text-muted">Subtotal</span>
                          <span>Rs {subtotal.toFixed(2)}</span>
                        </div>
                        <div className="d-flex justify-content-between">
                          <span className="text-muted">Tax (10%)</span>
                          <span>Rs {tax.toFixed(2)}</span>
                        </div>
                        <div className="d-flex justify-content-between mb-2">
                          <span className="text-muted">Delivery</span>
                          <span>Rs {delivery.toFixed(2)}</span>
                        </div>
                        <div className="d-flex justify-content-between border-top pt-2">
                          <strong>Total</strong>
                          <strong>Rs {total.toFixed(2)}</strong>
                        </div>
                      </div>
                    </div>
                  </div>

                </div>
                <div className="modal-footer">
                  <button className="btn btn-outline-secondary" onClick={closeReview}>Back</button>
                  <button className="btn btn-success" disabled={!items.length || placing} onClick={placeOrder}>
                    {placing ? "Placing..." : "Confirm & Place Order"}
                  </button>
                </div>
              </div>
            </div>
          </div>
          {/* Backdrop */}
          <div className="modal-backdrop fade show"></div>
        </>
      )}
    </div>
  );
}
