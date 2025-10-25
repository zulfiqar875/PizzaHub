import { useEffect, useState } from "react";
import { api } from "../api/client";

export default function Menu() {
  const [cats, setCats] = useState([]);
  const [catId, setCatId] = useState("");
  const [items, setItems] = useState([]);

  useEffect(() => { api("/categories.php").then(setCats); }, []);
  useEffect(() => {
    api(`/products.php${catId ? `?category_id=${catId}` : ""}`).then(setItems);
  }, [catId]);

  const addToCart = async (id) => {
    await api("/cart.php", { method: "POST", body: JSON.stringify({ product_id: id, quantity: 1 }) });
    // A simple toast substitute:
    alert("Added to cart");
  };

  return (
    <>
      <div className="d-flex align-items-center justify-content-between">
        <h2 className="mb-3">Menu</h2>
        <div className="d-flex gap-2">
          <select className="form-select" value={catId} onChange={(e)=>setCatId(e.target.value)}>
            <option value="">All categories</option>
            {cats.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
          </select>
        </div>
      </div>

      <div className="row g-4">
        {items.map(p => (
          <div className="col-sm-6 col-md-4 col-lg-3" key={p.id}>
            <div className="card h-100 shadow-sm product-card">
              {p.image_url ? (
                <img src={p.image_url} className="card-img-top" alt={p.name} />
              ) : (
                <img src="https://via.placeholder.com/600x400?text=Pizza+Hub" className="card-img-top" alt={p.name} />
              )}
              <div className="card-body d-flex flex-column">
                <h5 className="card-title">{p.name}</h5>
                <p className="card-text text-muted small flex-grow-1">{p.description}</p>
                <div className="d-flex align-items-center justify-content-between">
                  <span className="fw-bold">Rs {p.price}</span>
                  <button className="btn btn-sm btn-outline-primary" onClick={()=>addToCart(p.id)}>
                    <i className="bi bi-cart-plus"></i> Add
                  </button>
                </div>
              </div>
            </div>
          </div>
        ))}
        {!items.length && <div className="text-muted">No items.</div>}
      </div>
    </>
  );
}
