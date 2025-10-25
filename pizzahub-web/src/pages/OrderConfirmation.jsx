import { useEffect, useState } from "react";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import { api } from "../api/client";

const STATUS_STEPS = ['PENDING','CONFIRMED','PREPARING','OUT_FOR_DELIVERY','DELIVERED'];

export default function OrderConfirmation() {
  const { code } = useParams();
  const location = useLocation();
  const nav = useNavigate();
  const [data, setData] = useState(null);
  const [stepIndex, setStepIndex] = useState(0);

  useEffect(() => {
    let stop = false;
    const load = async () => {
      try {
        const res = await api(`/order_status.php?code=${encodeURIComponent(code)}`);
        if (stop) return;
        setData(res);
        const i = STATUS_STEPS.indexOf(res.order.status);
        setStepIndex(i >= 0 ? i : 0);
      } catch {}
    };
    load();
    const t = setInterval(load, 7000);
    return () => { stop = true; clearInterval(t); };
  }, [code]);

  const total = location.state?.total ?? data?.order?.total;

  return (
    <div className="text-center">
      <div className="my-4">
        <div className="rounded-circle d-inline-flex justify-content-center align-items-center"
             style={{width: 90, height: 90, background: "#e9f7ef", border: "3px solid #34c759"}}>
          <i className="bi bi-check-lg" style={{fontSize: 42, color:"#34c759"}}></i>
        </div>
      </div>

      <h2 className="mb-2">Order placed successfully!</h2>
      <p className="text-muted">
        Tracker Code: <b>{code}</b>
        {total ? <> · Total: <b>Rs {Number(total).toFixed(2)}</b></> : null}
      </p>

      <div className="d-flex justify-content-center align-items-center gap-3 my-4">
        {STATUS_STEPS.map((s, idx) => (
          <div key={s} className="d-flex align-items-center">
            <div className={`rounded-circle d-flex justify-content-center align-items-center ${idx <= stepIndex ? "bg-success-subtle border border-success text-success" : "bg-light border text-muted"}`}
                 style={{width: 28, height: 28}}>
              {idx < stepIndex ? <i className="bi bi-check"></i> : idx === stepIndex ? <i className="bi bi-bicycle"></i> : null}
            </div>
            <div className={`ms-2 small ${idx <= stepIndex ? "fw-semibold" : "text-muted"}`}>{s.replaceAll("_"," ")}</div>
            {idx < STATUS_STEPS.length - 1 && (
              <div className={`mx-3 ${idx < stepIndex ? "bg-success" : "bg-light"}`} style={{width:50, height:2}}></div>
            )}
          </div>
        ))}
      </div>

      <div className="vstack gap-2 align-items-center my-3">
        {/* <button className="btn btn-outline-secondary" onClick={()=>nav("/tracker", { state: { code } })}>
          Track in Tracker
        </button> */}
        <button className="btn btn-primary" onClick={()=>nav("/")}>
          Back to Menu
        </button>

        <button className="btn btn-outline-secondary" onClick={()=>nav("/my-orders")}>
            View My Orders
        </button>

      </div>
    </div>
  );
}
