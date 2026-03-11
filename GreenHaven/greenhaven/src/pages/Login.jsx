import { useState } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { FaLock, FaEnvelope, FaLeaf } from "react-icons/fa";
import { useApp } from "../context/AppContext";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const { login } = useApp();
  const navigate = useNavigate();
  const location = useLocation();
  const from = location.state?.from?.pathname || "/";

  const handleLogin = async (e) => {
    e.preventDefault();
    setError("");
    const result = await login(email, password);
    if (result.success) {
      navigate(from, { replace: true });
    } else {
      setError(result.error);
    }
  };

  return (
    <div className="form-container">
      <div className="form-logo"><FaLeaf /></div>
      <h2 className="form-title">Chào Mừng Trở Lại</h2>
      {error && (
        <div className="form-error" data-testid="login-error" id="login-error">
          {error}
        </div>
      )}
      <form onSubmit={handleLogin} id="login-form">
        <div className="form-group">
          <label className="form-label" htmlFor="email">
            <FaEnvelope /> Email
          </label>
          <input
            id="email"
            type="email"
            className="form-input"
            placeholder="you@example.com"
            value={email}
            onChange={e => setEmail(e.target.value)}
            required
            data-testid="input-email"
          />
        </div>
        <div className="form-group">
          <label className="form-label" htmlFor="password">
            <FaLock /> Mật khẩu
          </label>
          <input
            id="password"
            type="password"
            className="form-input"
            placeholder="Tối thiểu 6 ký tự"
            value={password}
            onChange={e => setPassword(e.target.value)}
            required
            data-testid="input-password"
          />
        </div>
        <button
          type="submit"
          className="btn btn-primary"
          style={{ width: "100%", marginTop: "1rem" }}
          id="btn-login"
          data-testid="btn-login"
        >
          Đăng Nhập
        </button>
      </form>
      <p style={{ textAlign: "center", marginTop: "1.5rem", color: "var(--text-muted)" }}>
        Chưa có tài khoản? <Link to="/register" id="link-register">Đăng ký ngay</Link>
      </p>
    </div>
  );
}
