import { Link, useNavigate } from "react-router-dom";
import { FaHeart, FaRegHeart, FaStar, FaShoppingCart } from "react-icons/fa";
import { useApp } from "../context/AppContext";

export default function ProductCard({ product }) {
  const { addToCart, toggleWishlist, isInWishlist } = useApp();
  const navigate = useNavigate();
  const wished = isInWishlist(product.id);

  const handleAddToCart = async () => {
    const result = await addToCart(product);
    if (result?.requireLogin) navigate("/login");
  };

  const handleToggleWishlist = async () => {
    const result = await toggleWishlist(product);
    if (result?.requireLogin) navigate("/login");
  };

  return (
    <div className="product-card" data-testid={`product-card-${product.id}`}>
      <Link to={`/product/${product.id}`} className="product-img-link">
        <img
          src={product.image}
          alt={product.name}
          className="product-image"
          loading="lazy"
        />
        {product.stock <= 5 && product.stock > 0 && (
          <span className="badge badge-warning" data-testid="low-stock-badge">Còn {product.stock}</span>
        )}
        {product.stock === 0 && (
          <span className="badge badge-danger" data-testid="out-of-stock-badge">Hết hàng</span>
        )}
      </Link>
      <div className="product-info">
        <span className="product-category">{product.category}</span>
        <Link to={`/product/${product.id}`}>
          <h3 className="product-title">{product.name}</h3>
        </Link>
        <div className="product-rating">
          <FaStar className="star-icon" />
          <span>{product.rating}</span>
          <span className="review-count">({product.reviewCount})</span>
        </div>
        <div className="product-price">{product.price.toLocaleString("vi-VN")}đ</div>
        <div className="product-actions">
          <button
            className="btn btn-primary btn-sm"
            onClick={handleAddToCart}
            disabled={product.stock === 0}
            data-testid={`add-to-cart-${product.id}`}
            id={`add-to-cart-${product.id}`}
          >
            <FaShoppingCart />
            {product.stock === 0 ? "Hết hàng" : "Thêm vào giỏ"}
          </button>
          <button
            className={`btn-wishlist ${wished ? "active" : ""}`}
            onClick={handleToggleWishlist}
            aria-label={wished ? "Bỏ yêu thích" : "Yêu thích"}
            data-testid={`wishlist-btn-${product.id}`}
            id={`wishlist-btn-${product.id}`}
          >
            {wished ? <FaHeart /> : <FaRegHeart />}
          </button>
        </div>
      </div>
    </div>
  );
}
