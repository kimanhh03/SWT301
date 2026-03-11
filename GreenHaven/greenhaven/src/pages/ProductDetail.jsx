import { useState } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import { FaStar, FaHeart, FaRegHeart, FaShoppingCart, FaArrowLeft, FaMinus, FaPlus } from "react-icons/fa";
import { getById, getRelated } from "../data/products";
import { useApp } from "../context/AppContext";
import ProductCard from "../components/ProductCard";
import ReviewForm from "../components/ReviewForm";




export default function ProductDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { addToCart, toggleWishlist, isInWishlist, getReviews } = useApp();
  const [qty, setQty] = useState(1);
  const product = getById(id);

  if (!product) return (
    <div className="empty-state">
      <p>Không tìm thấy sản phẩm!</p>
      <Link to="/shop" className="btn btn-primary">Quay lại cửa hàng</Link>
    </div>
  );

  const wished = isInWishlist(product.id);
  const related = getRelated(product);
  const productReviews = getReviews(product.id);
  const avgRating = productReviews.length > 0
    ? (productReviews.reduce((sum, r) => sum + r.rating, 0) / productReviews.length).toFixed(1)
    : product.rating;

  const handleAddToCart = async () => {
    const result = await addToCart(product, qty);
    if (result?.requireLogin) navigate("/login");
  };

  const handleBuyNow = async () => {
    const result = await addToCart(product, qty);
    if (result?.requireLogin) { navigate("/login"); return; }
    navigate("/cart");
  };

  const handleToggleWishlist = async () => {
    const result = await toggleWishlist(product);
    if (result?.requireLogin) navigate("/login");
  };

  return (
    <div className="product-detail-page">
      <button className="btn-back" onClick={() => navigate(-1)} id="btn-back">
        <FaArrowLeft /> Quay lại
      </button>

      <div className="detail-layout">
        <div className="detail-image-section">
          <img src={product.image} alt={product.name} className="detail-image" id="product-main-image" />
          <span className="detail-category">{product.category}</span>
        </div>

        <div className="detail-info">
          <h1 className="detail-title" id="product-name">{product.name}</h1>
          <div className="detail-rating">
            {[...Array(5)].map((_, i) => (
              <FaStar key={i} className={i < Math.floor(avgRating) ? "star-filled" : "star-empty"} />
            ))}
            <span data-testid="average-rating">{avgRating} ({productReviews.length > 0 ? productReviews.length : product.reviewCount} đánh giá)</span>
          </div>
          <div className="detail-price" id="product-price">
            {product.price.toLocaleString("vi-VN")}đ
          </div>

          <p className="detail-description">{product.description}</p>

          <div className="detail-care">
            <h3>🌿 Hướng dẫn chăm sóc</h3>
            <p>{product.care}</p>
          </div>

          <div className="detail-stock" data-testid="stock-info">
            {product.stock > 0
              ? <span className="in-stock">✅ Còn hàng ({product.stock} sản phẩm)</span>
              : <span className="out-of-stock">❌ Hết hàng</span>
            }
          </div>

          {product.stock > 0 && (
            <div className="quantity-selector">
              <label>Số lượng:</label>
              <div className="qty-control">
                <button onClick={() => setQty(q => Math.max(1, q - 1))} id="qty-decrease" aria-label="Decrease quantity"><FaMinus /></button>
                <span id="qty-value" data-testid="qty-value">{qty}</span>
                <button onClick={() => setQty(q => Math.min(product.stock, q + 1))} id="qty-increase" aria-label="Increase quantity"><FaPlus /></button>
              </div>
            </div>
          )}

          <div className="detail-actions">
            <button
              className="btn btn-primary"
              onClick={handleAddToCart}
              disabled={product.stock === 0}
              id="btn-add-to-cart"
              data-testid="btn-add-to-cart"
            >
              <FaShoppingCart /> Thêm vào giỏ
            </button>
            <button
              className="btn btn-secondary"
              onClick={handleBuyNow}
              disabled={product.stock === 0}
              id="btn-buy-now"
            >
              Mua ngay
            </button>
            <button
              className={`btn-wishlist-lg ${wished ? "active" : ""}`}
              onClick={handleToggleWishlist}
              id="btn-wishlist"
              data-testid="btn-wishlist-detail"
            >
              {wished ? <FaHeart /> : <FaRegHeart />}
            </button>
          </div>
        </div>
      </div>

      <section className="reviews-section">
        <h2>Đánh Giá Khách Hàng</h2>

        <ReviewForm productId={product.id} />

        <div className="reviews-list" data-testid="reviews-list">
          {productReviews.length === 0 ? (
            <p className="no-reviews" data-testid="no-reviews">Chưa có đánh giá nào. Hãy là người đầu tiên!</p>
          ) : (
            productReviews.map(r => (
              <div key={r.id} className="review-card" data-testid="review-item" id={`review-item-${r.id}`}>
                <div className="review-header">
                  <strong>{r.userName}</strong>
                  <div className="review-stars">
                    {[...Array(r.rating)].map((_, i) => <FaStar key={i} className="star-filled" />)}
                    {[...Array(5 - r.rating)].map((_, i) => <FaStar key={i} className="star-empty" />)}
                  </div>
                  <span className="review-date">{new Date(r.createdAt).toLocaleDateString("vi-VN")}</span>
                </div>
                <p>{r.comment}</p>
              </div>
            ))
          )}
        </div>
      </section>

      {related.length > 0 && (
        <section className="related-section">
          <h2>Sản Phẩm Liên Quan</h2>
          <div className="product-grid">
            {related.map(p => <ProductCard key={p.id} product={p} />)}
          </div>
        </section>
      )}
    </div>
  );
}
