// src/pages/Admin/Products.jsx
import { useEffect, useState } from "react";
import { api } from "../../api/client";

export default function AdminProducts() {
  const empty = { id:null, category_id:"", name:"", description:"", price:"", image_url:"", is_active:1 };
  const [rows, setRows] = useState([]);
  const [cats, setCats] = useState([]);
  const [form, setForm] = useState(empty);

  const load = async () => {
    const [c, p] = await Promise.all([api("/categories.php"), api("/products.php")]);
    setCats(c); setRows(p);
  };
  useEffect(() => { load(); }, []);

  const save = async (e) => {
    e.preventDefault();
    const payload = {
      category_id: Number(form.category_id),
      name: form.name,
      description: form.description,
      price: Number(form.price),
      image_url: form.image_url
    };
    if (form.id) {
      const body = new URLSearchParams({
        id: form.id,
        category_id: String(payload.category_id),
        name: payload.name,
        description: payload.description,
        price: String(payload.price),
        image_url: payload.image_url,
        is_active: String(form.is_active)
      });
      await api("/products.php", { method:"PUT", body });
    } else {
      await api("/products.php", { method:"POST", body: JSON.stringify(payload) });
    }
    setForm(empty); load();
  };

  const edit = (r) => setForm({
    id:r.id, category_id:r.category_id, name:r.name, description:r.description,
    price:r.price, image_url:r.image_url || "", is_active:r.is_active
  });
  const del  = async (id) => {
    if (!confirm("Delete this product?")) return;
    const body = new URLSearchParams({ id });
    await api("/products.php", { method:"DELETE", body });
    load();
  };

  return (
    <>
      <h3 className="mb-3">Products</h3>

      <form className="row g-2 mb-4" onSubmit={save}>
        <div className="col-md-3">
          <select className="form-select" value={form.category_id} required
                  onChange={(e)=>setForm({...form, category_id:e.target.value})}>
            <option value="">Select category</option>
            {cats.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
          </select>
        </div>
        <div className="col-md-3">
          <input className="form-control" placeholder="Name" value={form.name}
                 onChange={(e)=>setForm({...form, name:e.target.value})} required />
        </div>
        <div className="col-md-2">
          <input type="number" step="0.01" className="form-control" placeholder="Price"
                 value={form.price} onChange={(e)=>setForm({...form, price:e.target.value})} required />
        </div>
        <div className="col-md-4">
          <input className="form-control" placeholder="Image URL" value={form.image_url}
                 onChange={(e)=>setForm({...form, image_url:e.target.value})} />
        </div>
        <div className="col-12">
          <textarea className="form-control" rows={2} placeholder="Description"
                    value={form.description} onChange={(e)=>setForm({...form, description:e.target.value})} />
        </div>
        {form.id && (
          <div className="col-md-2">
            <select className="form-select" value={form.is_active}
                    onChange={(e)=>setForm({...form, is_active:Number(e.target.value)})}>
              <option value={1}>Active</option>
              <option value={0}>Inactive</option>
            </select>
          </div>
        )}
        <div className="col-md-2">
          <button className="btn btn-primary w-100">{form.id ? "Update" : "Add"}</button>
        </div>
        {form.id && (
          <div className="col-md-2">
            <button type="button" className="btn btn-secondary w-100" onClick={()=>setForm(empty)}>Cancel</button>
          </div>
        )}
      </form>

      <div className="card shadow-sm">
        <div className="card-body p-0">
          <table className="table table-hover mb-0">
            <thead><tr>
              <th>#</th><th>Name</th><th>Category</th><th>Price</th><th>Status</th><th style={{width:170}}></th>
            </tr></thead>
            <tbody>
              {rows.map((r,i)=>(
                <tr key={r.id}>
                  <td>{i+1}</td>
                  <td>{r.name}</td>
                  <td>{r.category_name}</td>
                  <td>Rs {Number(r.price).toFixed(2)}</td>
                  <td>{r.is_active ? "Active" : "Inactive"}</td>
                  <td className="text-end">
                    <button className="btn btn-sm btn-outline-primary me-2" onClick={()=>edit(r)}>Edit</button>
                    <button className="btn btn-sm btn-outline-danger" onClick={()=>del(r.id)}>Delete</button>
                  </td>
                </tr>
              ))}
              {!rows.length && <tr><td colSpan={6} className="text-center text-muted">No products.</td></tr>}
            </tbody>
          </table>
        </div>
      </div>
    </>
  );
}
