import { Link } from "react-router-dom";
import { FaClipboardList, FaBox, FaTruck, FaCheckCircle } from "react-icons/fa";
import { useApp } from "../context/AppContext";

const statusMap = {
  processing: { label: "Đang xử lý", icon: <FaBox />, color: "#ff9800" },
  shipping: { label: "Đang giao", icon: <FaTruck />, color: "#2196f3" },
  delivered: { label: "Đã nhận", icon: <FaCheckCircle />, color: "#4caf50" },
};

export default function Orders() {
  const { orders, user } = useApp();

  if (!user) {
    return (
      <div className="empty-state">
        <h2>Vui lòng đăng nhập</h2>
        <p>Bạn cần đăng nhập để xem lịch sử đơn hàng.</p>
        <Link to="/login" className="btn btn-primary">Đăng Nhập</Link>
      </div>
    );
  }

  if (orders.length === 0) {
    return (
      <div className="empty-state" data-testid="no-orders">
        <FaClipboardList style={{ fontSize: "4rem", color: "var(--border-color)", marginBottom: "1rem" }} />
        <h2>Chưa có đơn hàng nào</h2>
        <p>Hãy mua sắm để tạo đơn hàng đầu tiên!</p>
        <Link to="/shop" className="btn btn-primary">Mua Sắm Ngay</Link>
      </div>
    );
  }

  return (
    <div className="orders-page">
      <h1>Lịch Sử Đơn Hàng ({orders.length})</h1>
      <div className="orders-list" data-testid="orders-list">
        {orders.map(order => {
          const status = statusMap[order.status] || statusMap.processing;
          return (
            <div key={order.id} className="order-card" data-testid={`order-${order.id}`}>
              <div className="order-card-header">
                <div>
                  <span className="order-id">#{order.id}</span>
                  <span className="order-date">{new Date(order.createdAt).toLocaleDateString("vi-VN")}</span>
                </div>
                <span className="order-status" style={{ color: status.color }}>
                  {status.icon} {status.label}
                </span>
              </div>
              <div className="order-items-preview">
                {order.items.slice(0, 3).map(item => (
                  <img key={item.id} src={item.image} alt={item.name} title={item.name} />
                ))}
                {order.items.length > 3 && <span>+{order.items.length - 3}</span>}
              </div>
              <div className="order-card-footer">
                <span>{order.items.reduce((s, i) => s + i.quantity, 0)} sản phẩm</span>
                <strong data-testid={`order-total-${order.id}`}>
                  {order.total.toLocaleString("vi-VN")}đ
                </strong>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
