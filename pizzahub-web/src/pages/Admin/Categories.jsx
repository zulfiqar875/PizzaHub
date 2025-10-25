// src/pages/Admin/Categories.jsx
import { useEffect, useState } from "react";
import { api } from "../../api/client";

export default function AdminCategories() {
  const [rows, setRows] = useState([]);
  const [form, setForm] = useState({ id:null, name:"", is_active:1 });
  const [loading, setLoading] = useState(false);

  const load = () => api("/categories.php").then(setRows);
  useEffect(() => { load(); }, []);

  const save = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      if (form.id) {
        const body = new URLSearchParams({ id:form.id, name:form.name, is_active:String(form.is_active) });
        await api("/categories.php", { method:"PUT", body });
      } else {
        await api("/categories.php", { method:"POST", body: JSON.stringify({ name: form.name }) });
      }
      setForm({ id:null, name:"", is_active:1 });
      load();
    } finally { setLoading(false); }
  };

  const edit = (r) => setForm({ id:r.id, name:r.name, is_active:r.is_active });
  const del  = async (id) => {
    if (!confirm("Delete this category?")) return;
    const body = new URLSearchParams({ id });
    await api("/categories.php", { method:"DELETE", body });
    load();
  };

  return (
    <>
      <div className="d-flex align-items-center justify-content-between mb-3">
        <h3>Categories</h3>
      </div>

      <form className="row g-2 mb-4" onSubmit={save}>
        <div className="col-md-5">
          <input className="form-control" placeholder="Category name" value={form.name}
                 onChange={(e)=>setForm({...form, name:e.target.value})} required />
        </div>
        {form.id && (
          <div className="col-md-3">
            <select className="form-select" value={form.is_active}
                    onChange={(e)=>setForm({...form, is_active: Number(e.target.value) })}>
              <option value={1}>Active</option>
              <option value={0}>Inactive</option>
            </select>
          </div>
        )}
        <div className="col-md-2">
          <button className="btn btn-primary w-100" disabled={loading}>{form.id ? "Update" : "Add"}</button>
        </div>
        {form.id && (
          <div className="col-md-2">
            <button type="button" className="btn btn-secondary w-100" onClick={()=>setForm({id:null,name:"",is_active:1})}>
              Cancel
            </button>
          </div>
        )}
      </form>

      <div className="card shadow-sm">
        <div className="card-body p-0">
          <table className="table table-hover mb-0">
            <thead>
              <tr><th>#</th><th>Name</th><th>Status</th><th style={{width:160}}></th></tr>
            </thead>
            <tbody>
              {rows.map((r,i)=>(
                <tr key={r.id}>
                  <td>{i+1}</td>
                  <td>{r.name}</td>
                  <td>{r.is_active ? "Active" : "Inactive"}</td>
                  <td className="text-end">
                    <button className="btn btn-sm btn-outline-primary me-2" onClick={()=>edit(r)}>Edit</button>
                    <button className="btn btn-sm btn-outline-danger" onClick={()=>del(r.id)}>Delete</button>
                  </td>
                </tr>
              ))}
              {!rows.length && <tr><td colSpan={4} className="text-center text-muted">No categories.</td></tr>}
            </tbody>
          </table>
        </div>
      </div>
    </>
  );
}
