import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [err, setErr] = useState("");
  const nav = useNavigate();
  const { login } = useAuth();

  const submit = async (e) => {
    e.preventDefault();
    setErr("");
    try {
      await login(email, password); // calls /login.php + /me.php
      nav("/");
    } catch (e) {
      setErr("Invalid credentials");
    }
  };

  return (
    <div className="row justify-content-center">
      <div className="col-md-5">
        <div className="card shadow-sm">
          <div className="card-body p-4">
            <h3 className="mb-3">Sign in</h3>
            <form onSubmit={submit} className="vstack gap-3">
              <div>
                <label className="form-label">Email</label>
                <input className="form-control" value={email} onChange={(e)=>setEmail(e.target.value)} />
              </div>
              <div>
                <label className="form-label">Password</label>
                <input type="password" className="form-control" value={password} onChange={(e)=>setPassword(e.target.value)} />
              </div>
              {err && <div className="alert alert-danger py-2">{err}</div>}
              <button className="btn btn-primary">Login</button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
