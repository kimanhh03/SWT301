import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { FaStar } from "react-icons/fa";
import { useApp } from "../context/AppContext";

export default function ReviewForm({ productId }) {
  const { user, addReview, hasReviewed } = useApp();
  const navigate = useNavigate();
  const [rating, setRating] = useState(0);
  const [hovered, setHovered] = useState(0);
  const [comment, setComment] = useState("");
  const [error, setError] = useState("");
  const [submitted, setSubmitted] = useState(false);

  if (!user) {
    return (
      <div className="review-login-prompt" data-testid="review-login-prompt">
        <p>Vui lòng <Link to="/login" id="link-login-to-review">đăng nhập</Link> để gửi đánh giá.</p>
      </div>
    );
  }

  if (hasReviewed(productId) || submitted) {
    return (
      <div className="review-already" data-testid="review-already">
        <p>✅ Bạn đã đánh giá sản phẩm này rồi. Cảm ơn bạn!</p>
      </div>
    );
  }

  const handleSubmit = (e) => {
    e.preventDefault();
    setError("");
    const result = addReview(productId, rating, comment);
    if (result.success) {
      setSubmitted(true);
      setRating(0);
      setComment("");
    } else {
      setError(result.error);
    }
  };

  return (
    <form
      className="review-form"
      onSubmit={handleSubmit}
      id="review-form"
      data-testid="review-form"
    >
      <h3>Viết đánh giá của bạn</h3>

      <div className="star-selector" data-testid="rating-stars">
        <label>Số sao:</label>
        <div className="stars-input">
          {[1, 2, 3, 4, 5].map((star) => (
            <FaStar
              key={star}
              className={`star-input ${star <= (hovered || rating) ? "active" : ""}`}
              onClick={() => setRating(star)}
              onMouseEnter={() => setHovered(star)}
              onMouseLeave={() => setHovered(0)}
              data-testid={`star-${star}`}
              id={`star-${star}`}
              role="button"
              aria-label={`${star} sao`}
              tabIndex={0}
              onKeyDown={(e) => e.key === "Enter" && setRating(star)}
            />
          ))}
        </div>
        {rating > 0 && (
          <span className="star-label" data-testid="star-label">
            {["", "Rất tệ", "Tệ", "Bình thường", "Tốt", "Xuất sắc"][rating]}
          </span>
        )}
      </div>

      <div className="form-group">
        <label className="form-label" htmlFor="review-comment">Nhận xét:</label>
        <textarea
          id="review-comment"
          data-testid="review-text"
          className="form-input review-textarea"
          placeholder="Chia sẻ trải nghiệm của bạn về sản phẩm này (ít nhất 10 ký tự)..."
          value={comment}
          onChange={(e) => setComment(e.target.value)}
          rows={4}
        />
        <small className={`char-count ${comment.trim().length < 10 && comment.length > 0 ? "error-text" : ""}`}>
          {comment.trim().length}/10 ký tự tối thiểu
        </small>
      </div>

      {error && (
        <div className="form-error" data-testid="review-error" id="review-error">
          {error}
        </div>
      )}

      <button
        type="submit"
        className="btn btn-primary"
        id="btn-submit-review"
        data-testid="submit-review"
      >
        Gửi đánh giá
      </button>
    </form>
  );
}
