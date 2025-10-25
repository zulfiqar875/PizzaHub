import { useState } from "react";
import { api } from "../api/client";
import { useLocation } from "react-router-dom";


export default function Tracker() {
  const [code, setCode] = useState("");
  const [data, setData] = useState(null);

  const search = async () => {
    try {
      const res = await api(`/order_status.php?code=${encodeURIComponent(code)}`);
      setData(res);
    } catch {
      setData(null);
      alert("Order not found");
    }

    const location = useLocation();
    useEffect(() => {
      if (location.state?.code) setCode(location.state.code);
    }, [location.state]);
  };

  return (
    <>
      <div className="d-flex gap-2 align-items-end mb-3">
        <div className="flex-grow-1">
          <label className="form-label">Tracker Code</label>
          <input className="form-control" placeholder="e.g., 8F2A1CDE" value={code} onChange={(e)=>setCode(e.target.value)} />
        </div>
        <button className="btn btn-primary" onClick={search} style={{height: "fit-content"}}>Track</button>
      </div>

      {data && (
        <div className="card shadow-sm">
          <div className="card-body">
            <h5>Order Status: <span className="badge text-bg-secondary">{data.order.status}</span></h5>
            <div className="mt-3">
              <ul className="list-group list-group-flush">
                {data.history.map((h, i) => (
                  <li key={i} className="list-group-item">
                    <div className="d-flex justify-content-between">
                      <span>{h.status}{h.note ? ` — ${h.note}` : ""}</span>
                      <span className="text-muted small">{h.changed_at}</span>
                    </div>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
