import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { api } from "../api/client";

export default function Register() {
  const [form, setForm] = useState({ name: "", email: "", password: "" });
  const [error, setError] = useState("");
  const nav = useNavigate();

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    try {
      await api("/register.php", { method: "POST", body: JSON.stringify(form) });
      alert("Registration successful! Please log in.");
      nav("/login");
    } catch (e) {
      setError(e.message || "Registration failed.");
    }
  };

  return (
    <div className="row justify-content-center">
      <div className="col-md-6 col-lg-5">
        <div className="card shadow-sm">
          <div className="card-body p-4">
            <h3 className="mb-3 text-center">Create Account</h3>
            <form onSubmit={handleSubmit} className="vstack gap-3">
              <div>
                <label className="form-label">Full Name</label>
                <input className="form-control" name="name" value={form.name} onChange={handleChange} required />
              </div>
              <div>
                <label className="form-label">Email</label>
                <input type="email" className="form-control" name="email" value={form.email} onChange={handleChange} required />
              </div>
              <div>
                <label className="form-label">Password</label>
                <input type="password" className="form-control" name="password" value={form.password} onChange={handleChange} required />
              </div>
              {error && <div className="alert alert-danger py-2">{error}</div>}
              <button className="btn btn-primary w-100">Register</button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
