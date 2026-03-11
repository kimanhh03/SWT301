import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { FaLock, FaMapMarkerAlt } from "react-icons/fa";
import { useApp } from "../context/AppContext";

export default function Checkout() {
  const { cart, cartTotal, placeOrder, user } = useApp();
  const navigate = useNavigate();
  const [form, setForm] = useState({
    name: user?.name || "",
    phone: "",
    address: "",
    city: "",
    payment: "cod",
    note: "",
  });
  const [errors, setErrors] = useState({});

  const validate = () => {
    const e = {};
    if (!form.name.trim()) e.name = "Vui lòng nhập họ tên!";
    if (!form.phone.trim()) e.phone = "Vui lòng nhập số điện thoại!";
    else if (!/^0\d{9}$/.test(form.phone)) e.phone = "Số điện thoại không hợp lệ! (VD: 0901234567)";
    if (!form.address.trim()) e.address = "Vui lòng nhập địa chỉ giao hàng!";
    if (!form.city.trim()) e.city = "Vui lòng chọn tỉnh/thành phố!";
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;
    if (cart.length === 0) return;

    const result = await placeOrder({
      customerName: form.name,
      phone: form.phone,
      address: `${form.address}, ${form.city}`,
      payment: form.payment,
      note: form.note,
    });

    if (result.success) {
      navigate(`/order-success/${result.orderId}`);
    }
  };

  const cities = ["Hà Nội", "TP. Hồ Chí Minh", "Đà Nẵng", "Cần Thơ", "Hải Phòng", "Biên Hòa", "Huế", "Khác"];

  return (
    <div className="checkout-page">
      <h1>Thanh Toán</h1>
      <div className="checkout-layout">
        <form className="checkout-form" onSubmit={handleSubmit} noValidate>
          <div className="form-section">
            <h3><FaMapMarkerAlt /> Thông Tin Giao Hàng</h3>
            <div className="form-group">
              <label className="form-label">Họ và tên *</label>
              <input
                className={`form-input ${errors.name ? "error" : ""}`}
                value={form.name}
                onChange={e => setForm({ ...form, name: e.target.value })}
                placeholder="Nguyễn Văn A"
                id="input-name"
                data-testid="shipping-name"
              />
              {errors.name && <span className="field-error" data-testid="error-name">{errors.name}</span>}
            </div>
            <div className="form-group">
              <label className="form-label">Số điện thoại *</label>
              <input
                className={`form-input ${errors.phone ? "error" : ""}`}
                value={form.phone}
                onChange={e => setForm({ ...form, phone: e.target.value })}
                placeholder="0901234567"
                id="input-phone"
                data-testid="shipping-phone"
              />
              {errors.phone && <span className="field-error" data-testid="error-phone">{errors.phone}</span>}
            </div>
            <div className="form-group">
              <label className="form-label">Địa chỉ *</label>
              <input
                className={`form-input ${errors.address ? "error" : ""}`}
                value={form.address}
                onChange={e => setForm({ ...form, address: e.target.value })}
                placeholder="Số nhà, tên đường, phường/xã"
                id="input-address"
                data-testid="shipping-address"
              />
              {errors.address && <span className="field-error" data-testid="error-address">{errors.address}</span>}
            </div>
            <div className="form-group">
              <label className="form-label">Tỉnh/Thành phố *</label>
              <select
                className={`form-input ${errors.city ? "error" : ""}`}
                value={form.city}
                onChange={e => setForm({ ...form, city: e.target.value })}
                id="select-city"
                data-testid="select-city"
              >
                <option value="">-- Chọn tỉnh/thành --</option>
                {cities.map(c => <option key={c} value={c}>{c}</option>)}
              </select>
              {errors.city && <span className="field-error" data-testid="error-city">{errors.city}</span>}
            </div>
            <div className="form-group">
              <label className="form-label">Ghi chú</label>
              <textarea
                className="form-input"
                value={form.note}
                onChange={e => setForm({ ...form, note: e.target.value })}
                placeholder="Ghi chú về đơn hàng..."
                rows={3}
                id="input-note"
              />
            </div>
          </div>

          <div className="form-section">
            <h3><FaLock /> Phương Thức Thanh Toán</h3>
            {[
              { value: "cod", label: "💵 Thanh toán khi nhận hàng (COD)" },
              { value: "transfer", label: "🏦 Chuyển khoản ngân hàng" },
            ].map(opt => (
              <label key={opt.value} className={`payment-opt ${form.payment === opt.value ? "selected" : ""}`}>
                <input
                  type="radio"
                  name="payment"
                  value={opt.value}
                  checked={form.payment === opt.value}
                  onChange={() => setForm({ ...form, payment: opt.value })}
                  id={`payment-${opt.value}`}
                />
                {opt.label}
              </label>
            ))}
          </div>

          <button
            type="submit"
            className="btn btn-primary"
            style={{ width: "100%", padding: "1rem" }}
            id="btn-place-order"
            data-testid="place-order"
          >
            <FaLock /> Đặt Hàng ({cartTotal.toLocaleString("vi-VN")}đ)
          </button>
        </form>

        <div className="order-summary-panel">
          <h3>Đơn Hàng Của Bạn</h3>
          {cart.map(item => (
            <div key={item.id} className="summary-item">
              <img src={item.image} alt={item.name} />
              <div>
                <p>{item.name}</p>
                <small>x{item.quantity}</small>
              </div>
              <span>{(item.price * item.quantity).toLocaleString("vi-VN")}đ</span>
            </div>
          ))}
          <div className="summary-divider" />
          <div className="summary-row total-row">
            <strong>Tổng cộng</strong>
            <strong data-testid="checkout-total">{cartTotal.toLocaleString("vi-VN")}đ</strong>
          </div>
        </div>
      </div>
    </div>
  );
}
