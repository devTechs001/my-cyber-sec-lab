import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { api, tokenStore } from "../api.js";
import SectionHeading from "../components/SectionHeading.jsx";
import Icon from "../components/Icon.jsx";

export default function Login() {
  const [mode, setMode] = useState("login");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState(null);
  const [busy, setBusy] = useState(false);
  const navigate = useNavigate();

  const submit = async (e) => {
    e.preventDefault();
    setBusy(true);
    setError(null);
    try {
      const r = mode === "login" ? await api.login(username, password) : await api.register(username, password);
      tokenStore.set(r.token);
      navigate("/dashboard");
    } catch (err) {
      setError(err.message);
    } finally {
      setBusy(false);
    }
  };

  return (
    <section className="section">
      <SectionHeading
        eyebrow="Account"
        title={mode === "login" ? "Sign in" : "Create your account"}
        subtitle="Your lesson & lab progress is saved per account — sign in to keep it across devices and restarts."
      />
      <form className="auth-card pop" onSubmit={submit}>
        <div className="auth-tabs">
          <button type="button" className={mode === "login" ? "auth-tab active" : "auth-tab"} onClick={() => { setMode("login"); setError(null); }}>
            Sign in
          </button>
          <button type="button" className={mode === "register" ? "auth-tab active" : "auth-tab"} onClick={() => { setMode("register"); setError(null); }}>
            Register
          </button>
        </div>
        <label className="auth-label">Username
          <input className="auth-input" value={username} onChange={(e) => setUsername(e.target.value)} required minLength={3} maxLength={20} autoComplete="username" />
        </label>
        <label className="auth-label">Password
          <input className="auth-input" type="password" value={password} onChange={(e) => setPassword(e.target.value)} required minLength={6} autoComplete={mode === "login" ? "current-password" : "new-password"} />
        </label>
        {error && <p className="error auth-error"><Icon name="alert" size={16} /> {error}</p>}
        <button className="btn btn-primary auth-submit" disabled={busy}>
          <Icon name="shield" size={16} /> {busy ? "…" : mode === "login" ? "Sign in" : "Create account"}
        </button>
        <p className="auth-hint">
          {mode === "login" ? <>No account? <button type="button" className="link-btn" onClick={() => setMode("register")}>Register</button></>
            : <>Have an account? <button type="button" className="link-btn" onClick={() => setMode("login")}>Sign in</button></>}
          {" · "}<Link to="/dashboard">continue as guest</Link>
        </p>
      </form>
    </section>
  );
}
