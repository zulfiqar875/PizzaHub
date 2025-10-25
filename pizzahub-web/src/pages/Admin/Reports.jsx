// src/pages/Admin/Reports.jsx
import { useEffect, useState } from "react";
import { api } from "../../api/client";

export default function AdminReports() {
  const [range, setRange] = useState("daily"); // daily|weekly|monthly
  const [rows, setRows] = useState([]);

  const load = () => api(`/reports.php?range=${range}`).then(setRows);
  useEffect(() => { load(); }, [range]);

  const totalRevenue = rows.reduce((s,r)=> s + Number(r.revenue||0), 0);
  const totalOrders  = rows.reduce((s,r)=> s + Number(r.orders_count||0), 0);

  return (
    <>
      <div className="d-flex justify-content-between align-items-center mb-3">
        <h3>Reports</h3>
        <select className="form-select w-auto" value={range} onChange={(e)=>setRange(e.target.value)}>
          <option value="daily">Daily</option>
          <option value="weekly">Weekly</option>
          <option value="monthly">Monthly</option>
        </select>
      </div>

      <div className="row g-3 mb-3">
        <div className="col-md-6">
          <div className="card shadow-sm"><div className="card-body">
            <h6 className="text-muted">Total Revenue</h6>
            <div className="fs-4">Rs {totalRevenue.toFixed(2)}</div>
          </div></div>
        </div>
        <div className="col-md-6">
          <div className="card shadow-sm"><div className="card-body">
            <h6 className="text-muted">Total Orders</h6>
            <div className="fs-4">{totalOrders}</div>
          </div></div>
        </div>
      </div>

      <div className="card shadow-sm">
        <div className="card-body p-0">
          <table className="table table-striped mb-0">
            <thead><tr><th>Period</th><th>Orders</th><th>Revenue</th></tr></thead>
            <tbody>
              {rows.map((r, i)=>(
                <tr key={i}>
                  <td>{r.period}</td>
                  <td>{r.orders_count}</td>
                  <td>Rs {Number(r.revenue).toFixed(2)}</td>
                </tr>
              ))}
              {!rows.length && <tr><td colSpan={3} className="text-center text-muted">No data.</td></tr>}
            </tbody>
          </table>
        </div>
      </div>
    </>
  );
}
