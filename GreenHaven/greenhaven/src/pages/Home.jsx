import { Link } from "react-router-dom";
import { FaLeaf, FaStar, FaShieldAlt, FaTruck, FaSeedling } from "react-icons/fa";
import ProductCard from "../components/ProductCard";
import { getFeatured } from "../data/products";
import { CATEGORIES } from "../data/products";

const categoryIcons = { Echeveria: "🌸", Cactus: "🌵", Aloe: "🌿", Haworthia: "🦓", Rare: "💎" };

export default function Home() {
  const featured = getFeatured();

  return (
    <>
      <section className="hero">
        <div className="hero-content">
          <div className="hero-badge"><FaLeaf /> Cửa hàng sen đá uy tín</div>
          <h1>Mang Thiên Nhiên<br/>Vào Không Gian Của Bạn</h1>
          <p>Khám phá bộ sưu tập sen đá độc đáo, được chăm sóc và tuyển chọn kỹ lưỡng. Đảm bảo chất lượng, giao hàng toàn quốc.</p>
          <div className="hero-btns">
            <Link to="/shop" className="btn btn-white" id="hero-shop-btn">Khám Phá Ngay</Link>
            <Link to="/shop?cat=Rare" className="btn btn-outline-white">Hàng Hiếm</Link>
          </div>
        </div>
        <div className="hero-stats">
          <div className="stat-item"><strong>500+</strong><span>Loại sen đá</span></div>
          <div className="stat-item"><strong>10K+</strong><span>Khách hàng</span></div>
          <div className="stat-item"><strong>4.9★</strong><span>Đánh giá</span></div>
        </div>
      </section>

      <section className="section-categories">
        <h2 className="section-title">Khám Phá Theo Loài</h2>
        <div className="categories-grid">
          {CATEGORIES.filter(c => c !== "All").map(cat => (
            <Link key={cat} to={`/shop?cat=${cat}`} className="category-card">
              <span className="cat-icon">{categoryIcons[cat] || "🌱"}</span>
              <span>{cat}</span>
            </Link>
          ))}
        </div>
      </section>

      <section className="section-featured">
        <div className="section-header">
          <h2 className="section-title">Sản Phẩm Nổi Bật</h2>
          <Link to="/shop" className="link-all">Xem tất cả →</Link>
        </div>
        <div className="product-grid" id="featured-products">
          {featured.map(product => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      </section>

      <section className="section-why">
        <h2 className="section-title">Tại Sao Chọn GreenHaven?</h2>
        <div className="why-grid">
          <div className="why-card">
            <FaStar className="why-icon" />
            <h3>Chất Lượng Cao</h3>
            <p>Mỗi sản phẩm được tuyển chọn và kiểm tra kỹ lưỡng trước khi đến tay khách hàng.</p>
          </div>
          <div className="why-card">
            <FaTruck className="why-icon" />
            <h3>Giao Hàng Toàn Quốc</h3>
            <p>Đóng gói cẩn thận, giao hàng nhanh chóng trên toàn quốc trong 2-5 ngày.</p>
          </div>
          <div className="why-card">
            <FaShieldAlt className="why-icon" />
            <h3>Bảo Hành 30 Ngày</h3>
            <p>Cam kết hoàn tiền hoặc đổi cây nếu sản phẩm không đạt chất lượng.</p>
          </div>
          <div className="why-card">
            <FaSeedling className="why-icon" />
            <h3>Tư Vấn Miễn Phí</h3>
            <p>Đội ngũ chuyên gia sẵn sàng tư vấn cách chăm sóc sen đá cho bạn.</p>
          </div>
        </div>
      </section>
    </>
  );
}
