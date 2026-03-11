import { useParams, Link } from "react-router-dom";
import { FaCheckCircle, FaHome, FaClipboardList } from "react-icons/fa";
import { useApp } from "../context/AppContext";

export default function OrderSuccess() {
  const { orderId } = useParams();
  const { orders } = useApp();
  const order = orders.find(o => o.id === orderId);

  return (
    <div className="success-page" data-testid="order-success-page">
      <div className="success-card" data-testid="order-confirmation">
        <FaCheckCircle className="success-icon" />
        <h1>Đặt Hàng Thành Công!</h1>
        <p>Cảm ơn bạn đã tin tưởng GreenHaven. Đơn hàng của bạn đang được xử lý.</p>

        <div className="order-id-box">
          <span>Mã đơn hàng:</span>
          <strong data-testid="order-id">{orderId}</strong>
        </div>

        {order && (
          <div className="order-summary-success">
            <h3>Chi tiết đơn hàng</h3>
            <p>📦 {order.items.length} sản phẩm</p>
            <p>💰 Tổng tiền: <strong>{order.total.toLocaleString("vi-VN")}đ</strong></p>
            <p>📍 Địa chỉ: {order.address}</p>
            <p>💳 Thanh toán: {order.payment === "cod" ? "COD (Nhận hàng trả tiền)" : "Chuyển khoản"}</p>
          </div>
        )}

        <div className="success-actions">
          <Link to="/" className="btn btn-primary" id="btn-home">
            <FaHome /> Về Trang Chủ
          </Link>
          <Link to="/orders" className="btn btn-outline" id="btn-view-orders">
            <FaClipboardList /> Xem Đơn Hàng
          </Link>
        </div>
      </div>
    </div>
  );
}
