import { Link, useNavigate } from "react-router-dom";
import { Dropdown } from "react-bootstrap";
import { FaLeaf, FaShoppingCart, FaHeart, FaUser, FaSignInAlt, FaSignOutAlt, FaStore, FaHome, FaClipboardList } from "react-icons/fa";
import { useApp } from "../context/AppContext";

export default function Navbar() {
  const navigate = useNavigate();
  const { user, logout, cartCount, wishlist } = useApp();

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  return (
    <nav className="navbar">
      <div className="nav-container">
        <Link to="/" className="nav-brand">
          <FaLeaf /> GreenHaven
        </Link>
        <div className="nav-links">
          <Link to="/" className="nav-link">
            <FaHome /> Trang Chủ
          </Link>
          <Link to="/shop" className="nav-link" id="nav-shop">
            <FaStore /> Cửa Hàng
          </Link>
          {user && (
            <Link to="/orders" className="nav-link" id="nav-orders">
              <FaClipboardList /> Đơn Hàng
            </Link>
          )}
        </div>
        <div className="nav-actions">
          <Link to="/wishlist" className="nav-icon-btn" aria-label="Wishlist" id="nav-wishlist" data-testid="nav-wishlist">
            <FaHeart />
            {wishlist.length > 0 && <span className="badge-count">{wishlist.length}</span>}
          </Link>
          <Link to="/cart" className="nav-icon-btn" aria-label="Cart" id="nav-cart" data-testid="nav-cart">
            <FaShoppingCart />
            {cartCount > 0 && <span className="badge-count" data-testid="cart-count">{cartCount}</span>}
          </Link>

          {user ? (
            <Dropdown align="end">
              <Dropdown.Toggle
                variant="light"
                id="nav-user-btn"
                className="nav-user-btn border-0"
                style={{ background: "var(--background-light)", color: "var(--primary-green-dark)", fontWeight: 500 }}
              >
                <FaUser /> {user.name}
              </Dropdown.Toggle>
              <Dropdown.Menu>
                <Dropdown.Item
                  as="button"
                  onClick={handleLogout}
                  id="btn-logout"
                  className="text-danger"
                >
                  <FaSignOutAlt /> Đăng xuất
                </Dropdown.Item>
              </Dropdown.Menu>
            </Dropdown>
          ) : (
            <>
              <Link to="/login" className="nav-link" id="nav-login">
                <FaSignInAlt /> Đăng nhập
              </Link>
              <Link to="/register" className="btn btn-primary btn-sm" id="nav-register">
                Đăng ký
              </Link>
            </>
          )}
        </div>
      </div>
    </nav>
  );
}
