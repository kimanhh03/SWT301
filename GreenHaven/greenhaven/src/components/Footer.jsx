import { Link } from "react-router-dom";
import { FaLeaf, FaFacebook, FaInstagram, FaTiktok, FaPhone, FaEnvelope, FaMapMarkerAlt } from "react-icons/fa";

export default function Footer() {
  return (
    <footer className="footer">
      <div className="footer-container">
        <div className="footer-brand">
          <div className="nav-brand" style={{ marginBottom: "1rem" }}>
            <FaLeaf /> GreenHaven
          </div>
          <p className="footer-desc">
            Nơi cung cấp những loài sen đá đẹp nhất, chất lượng cao với giá thành hợp lý. Mang thiên nhiên vào không gian sống của bạn.
          </p>
          <div className="footer-social">
            <a href="#" aria-label="Facebook"><FaFacebook /></a>
            <a href="#" aria-label="Instagram"><FaInstagram /></a>
            <a href="#" aria-label="TikTok"><FaTiktok /></a>
          </div>
        </div>

        <div className="footer-links">
          <h4>Khám Phá</h4>
          <Link to="/">Trang Chủ</Link>
          <Link to="/shop">Cửa Hàng</Link>
          <Link to="/wishlist">Yêu Thích</Link>
          <Link to="/orders">Đơn Hàng</Link>
        </div>

        <div className="footer-links">
          <h4>Danh Mục</h4>
          <Link to="/shop?cat=Echeveria">Echeveria</Link>
          <Link to="/shop?cat=Cactus">Cactus</Link>
          <Link to="/shop?cat=Aloe">Aloe</Link>
          <Link to="/shop?cat=Rare">Hiếm & Độc Đáo</Link>
        </div>

        <div className="footer-contact">
          <h4>Liên Hệ</h4>
          <p><FaMapMarkerAlt /> 123 Đường Hoa Sen, Q.1, TP.HCM</p>
          <p><FaPhone /> 0901 234 567</p>
          <p><FaEnvelope /> hello@greenhaven.vn</p>
        </div>
      </div>
      <div className="footer-bottom">
        <p>© 2025 GreenHaven. All rights reserved.</p>
      </div>
    </footer>
  );
}
