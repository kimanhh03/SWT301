import { Link, useNavigate } from "react-router-dom";
import { FaTrash, FaMinus, FaPlus, FaShoppingCart, FaArrowLeft } from "react-icons/fa";
import { useApp } from "../context/AppContext";

export default function Cart() {
  const { cart, removeFromCart, updateCartQuantity, cartTotal, user } = useApp();
  const navigate = useNavigate();

  if (cart.length === 0) {
    return (
      <div className="empty-state" data-testid="empty-cart">
        <FaShoppingCart style={{ fontSize: "4rem", color: "var(--border-color)", marginBottom: "1rem" }} />
        <h2>Giỏ hàng của bạn đang trống</h2>
        <p>Hãy khám phá cửa hàng và thêm sản phẩm vào giỏ!</p>
        <Link to="/shop" className="btn btn-primary" id="btn-continue-shopping">Tiếp tục mua sắm</Link>
      </div>
    );
  }

  const handleCheckout = () => {
    if (!user) {
      navigate("/login");
      return;
    }
    navigate("/checkout");
  };

  return (
    <div className="cart-page" data-testid="cart-container">
      <div className="page-header">
        <button className="btn-back" onClick={() => navigate(-1)}>
          <FaArrowLeft /> Tiếp tục mua sắm
        </button>
        <h1>Giỏ Hàng ({cart.length} sản phẩm)</h1>
      </div>

      <div className="cart-layout">
        <div className="cart-items" data-testid="cart-items">
          {cart.map(item => (
            <div key={item.id} className="cart-item" data-testid="cart-item" id={`cart-item-${item.id}`}>
              <img src={item.image} alt={item.name} className="cart-item-img" />
              <div className="cart-item-info">
                <Link to={`/product/${item.productId}`} className="cart-item-name">{item.name}</Link>
                <span className="cart-item-price">{item.price.toLocaleString("vi-VN")}đ/cây</span>
              </div>
              <div className="cart-item-qty">
                <button
                  onClick={() => updateCartQuantity(item.id, item.quantity - 1)}
                  aria-label="Decrease"
                  id={`qty-decrease-${item.id}`}
                  data-testid="decrease"
                >
                  <FaMinus />
                </button>
                <span data-testid="cart-qty" id={`cart-qty-${item.id}`}>{item.quantity}</span>
                <button
                  onClick={() => updateCartQuantity(item.id, item.quantity + 1)}
                  aria-label="Increase"
                  id={`qty-increase-${item.id}`}
                  data-testid="increase"
                >
                  <FaPlus />
                </button>
              </div>
              <div className="cart-item-subtotal">
                {(item.price * item.quantity).toLocaleString("vi-VN")}đ
              </div>
              <button
                className="btn-remove"
                onClick={() => removeFromCart(item.id)}
                aria-label="Remove"
                id={`remove-${item.id}`}
                data-testid={`remove-item-${item.id}`}
              >
                <FaTrash />
              </button>
            </div>
          ))}
        </div>

        <div className="cart-summary">
          <h3>Tóm Tắt Đơn Hàng</h3>
          <div className="summary-row">
            <span>Tạm tính</span>
            <span>{cartTotal.toLocaleString("vi-VN")}đ</span>
          </div>
          <div className="summary-row">
            <span>Phí vận chuyển</span>
            <span className="free-ship">MIỄN PHÍ</span>
          </div>
          <div className="summary-row total-row">
            <strong>Tổng cộng</strong>
            <strong data-testid="cart-total">{cartTotal.toLocaleString("vi-VN")}đ</strong>
          </div>
          <button
            className="btn btn-primary"
            style={{ width: "100%", marginTop: "1.5rem" }}
            onClick={handleCheckout}
            id="btn-checkout"
            data-testid="checkout-btn"
          >
            Tiến hành thanh toán
          </button>
          {!user && (
            <p className="checkout-note" data-testid="login-required-note">
              * Bạn cần <Link to="/login">đăng nhập</Link> để đặt hàng
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
