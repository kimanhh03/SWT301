import { Link } from "react-router-dom";
import { FaHeart, FaShoppingCart, FaTrash } from "react-icons/fa";
import { useApp } from "../context/AppContext";

export default function Wishlist() {
  const { wishlist, toggleWishlist, addToCart, user } = useApp();

  if (!user) {
    return (
      <div className="empty-state">
        <h2>Vui lòng đăng nhập</h2>
        <p>Bạn cần đăng nhập để xem danh sách yêu thích.</p>
        <Link to="/login" className="btn btn-primary">Đăng Nhập</Link>
      </div>
    );
  }

  if (wishlist.length === 0) {
    return (
      <div className="empty-state" data-testid="empty-wishlist">
        <FaHeart style={{ fontSize: "4rem", color: "var(--border-color)", marginBottom: "1rem" }} />
        <h2>Danh sách yêu thích trống</h2>
        <p>Nhấn vào biểu tượng ❤️ trên sản phẩm để thêm vào yêu thích!</p>
        <Link to="/shop" className="btn btn-primary">Khám Phá Ngay</Link>
      </div>
    );
  }

  return (
    <div className="wishlist-page">
      <h1>Danh Sách Yêu Thích ({wishlist.length} sản phẩm)</h1>
      <div className="wishlist-grid" data-testid="wishlist-items">
        {wishlist.map(item => (
          <div key={item.id} className="wishlist-card" data-testid={`wishlist-item-${item.id}`}>
            <Link to={`/product/${item.productId}`}>
              <img src={item.image} alt={item.name} />
            </Link>
            <div className="wishlist-info">
              <Link to={`/product/${item.productId}`}>
                <h3>{item.name}</h3>
              </Link>
              <span className="product-price">{item.price.toLocaleString("vi-VN")}đ</span>
              <div className="wishlist-actions">
                <button
                  className="btn btn-primary btn-sm"
                  onClick={() => addToCart({ id: item.productId, ...item })}
                  id={`wishlist-add-cart-${item.id}`}
                  data-testid={`wishlist-add-cart-${item.id}`}
                >
                  <FaShoppingCart /> Thêm vào giỏ
                </button>
                <button
                  className="btn-remove"
                  onClick={() => toggleWishlist(item)}
                  aria-label="Remove from wishlist"
                  id={`wishlist-remove-${item.id}`}
                  data-testid={`wishlist-remove-${item.id}`}
                >
                  <FaTrash />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
