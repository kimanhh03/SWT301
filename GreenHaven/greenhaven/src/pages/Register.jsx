import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { FaLock, FaEnvelope, FaUser, FaLeaf } from "react-icons/fa";
import { useApp } from "../context/AppContext";

export default function Register() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [error, setError] = useState("");
  const { register } = useApp();
  const navigate = useNavigate();

  const handleRegister = async (e) => {
    e.preventDefault();
    setError("");
    if (!name.trim()) { setError("Vui lòng nhập họ tên!"); return; }
    if (password !== confirm) { setError("Mật khẩu xác nhận không khớp!"); return; }
    const result = await register(name.trim(), email, password);
    if (result.success) {
      navigate("/login");
    } else {
      setError(result.error);
    }
  };

  return (
    <div className="form-container">
      <div className="form-logo"><FaLeaf /></div>
      <h2 className="form-title">Tạo Tài Khoản</h2>
      {error && (
        <div className="form-error" data-testid="register-error" id="register-error">
          {error}
        </div>
      )}
      <form onSubmit={handleRegister} id="register-form">
        <div className="form-group">
          <label className="form-label" htmlFor="name">
            <FaUser /> Họ và tên
          </label>
          <input
            id="name"
            type="text"
            className="form-input"
            placeholder="Nguyễn Văn A"
            value={name}
            onChange={e => setName(e.target.value)}
            required
            data-testid="input-name"
          />
        </div>
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
        <div className="form-group">
          <label className="form-label" htmlFor="confirm">
            <FaLock /> Xác nhận mật khẩu
          </label>
          <input
            id="confirm"
            type="password"
            className="form-input"
            placeholder="Nhập lại mật khẩu"
            value={confirm}
            onChange={e => setConfirm(e.target.value)}
            required
            data-testid="input-confirm"
          />
        </div>
        <button
          type="submit"
          className="btn btn-primary"
          style={{ width: "100%", marginTop: "1rem" }}
          id="btn-register"
          data-testid="btn-register"
        >
          Đăng Ký
        </button>
      </form>
      <p style={{ textAlign: "center", marginTop: "1.5rem", color: "var(--text-muted)" }}>
        Đã có tài khoản? <Link to="/login" id="link-login">Đăng nhập</Link>
      </p>
    </div>
  );
}
