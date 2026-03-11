import { createContext, useContext, useState, useEffect, useCallback } from "react";

const API = "http://localhost:3001";
const AppContext = createContext(null);

export function AppProvider({ children }) {
  const [user, setUser] = useState(() => {
    try { return JSON.parse(localStorage.getItem("gh_user")) || null; } catch { return null; }
  });
  const [cart, setCart] = useState([]);
  const [wishlist, setWishlist] = useState([]);
  const [orders, setOrders] = useState([]);
  const [reviews, setReviews] = useState([]);
  const [toasts, setToasts] = useState([]);
  const [loading, setLoading] = useState(() => {
    try { return !!JSON.parse(localStorage.getItem("gh_user")); } catch { return false; }
  });

  // ── Load data from json-server on mount / user change ──────────────────────
  useEffect(() => {
    if (!user) {
      setCart([]);
      setWishlist([]);
      setLoading(false);
      return;
    }
    setLoading(true);
    Promise.all([
      fetch(`${API}/cart?userId=${user.id}`).then(r => r.json()),
      fetch(`${API}/wishlist?userId=${user.id}`).then(r => r.json()),
      fetch(`${API}/orders?userId=${user.id}`).then(r => r.json()),
      fetch(`${API}/reviews`).then(r => r.json()),
    ]).then(([cartData, wishlistData, ordersData, reviewsData]) => {
      setCart(cartData);
      setWishlist(wishlistData);
      setOrders(ordersData);
      setReviews(reviewsData);
    }).catch(() => { }).finally(() => setLoading(false));
  }, [user]);

  // ── Toast ───────────────────────────────────────────────────────────────────
  const showToast = useCallback((message, type = "success") => {
    const id = Date.now();
    setToasts(prev => [...prev, { id, message, type }]);
    setTimeout(() => setToasts(prev => prev.filter(t => t.id !== id)), 3000);
  }, []);

  // ── Auth ────────────────────────────────────────────────────────────────────
  const register = async (name, email, password) => {
    if (password.length < 6)
      return { success: false, error: "Mật khẩu phải có ít nhất 6 ký tự!" };
    try {
      const existing = await fetch(`${API}/users?email=${encodeURIComponent(email)}`).then(r => r.json());
      if (existing.length > 0)
        return { success: false, error: "Email này đã được đăng ký!" };

      const newUser = await fetch(`${API}/users`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email, password, createdAt: new Date().toISOString() }),
      }).then(r => r.json());

      const safeUser = { id: newUser.id, name: newUser.name, email: newUser.email };
      setUser(safeUser);
      localStorage.setItem("gh_user", JSON.stringify(safeUser));
      return { success: true };
    } catch {
      return { success: false, error: "Không thể kết nối máy chủ. Hãy chạy: npm run dev:all" };
    }
  };

  const login = async (email, password) => {
    if (!email || !password)
      return { success: false, error: "Vui lòng nhập đầy đủ thông tin!" };
    try {
      const allUsers = await fetch(`${API}/users`).then(r => r.json());
      const found = allUsers.filter(u => u.email === email && u.password === password);

      if (found.length === 0)
        return { success: false, error: "Email hoặc mật khẩu không chính xác!" };

      const safeUser = { id: found[0].id, name: found[0].name, email: found[0].email };
      setUser(safeUser);
      localStorage.setItem("gh_user", JSON.stringify(safeUser));
      return { success: true };
    } catch {
      return { success: false, error: "Không thể kết nối máy chủ. Hãy chạy: npm run dev:all" };
    }
  };

  const logout = async () => {
    setUser(null);
    setCart([]);
    setWishlist([]);
    localStorage.removeItem("gh_user");
  };

  // ── Cart ────────────────────────────────────────────────────────────────────
  const addToCart = async (product, quantity = 1) => {
    if (!user) {
      showToast("Vui lòng đăng nhập để thêm vào giỏ hàng!", "error");
      return { requireLogin: true };
    }
    if (quantity < 1) return;

    const existing = cart.find(i => i.productId === product.id);
    if (existing) {
      const newQty = existing.quantity + quantity;
      if (newQty > product.stock) {
        showToast(`Chỉ còn ${product.stock} sản phẩm trong kho!`, "error");
        return;
      }
      const updated = await fetch(`${API}/cart/${existing.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ quantity: newQty }),
      }).then(r => r.json());
      setCart(prev => prev.map(i => i.id === existing.id ? updated : i));
    } else {
      if (quantity > product.stock) {
        showToast(`Chỉ còn ${product.stock} sản phẩm trong kho!`, "error");
        return;
      }
      const newItem = await fetch(`${API}/cart`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          userId: user.id,
          productId: product.id,
          name: product.name,
          price: product.price,
          image: product.image,
          stock: product.stock,
          quantity,
        }),
      }).then(r => r.json());
      setCart(prev => [...prev, newItem]);
    }
    showToast(`Đã thêm "${product.name}" vào giỏ hàng!`);
  };

  const removeFromCart = async (cartItemId) => {
    await fetch(`${API}/cart/${cartItemId}`, { method: "DELETE" });
    setCart(prev => prev.filter(i => i.id !== cartItemId));
  };

  const updateCartQuantity = async (cartItemId, quantity) => {
    if (quantity < 1) { removeFromCart(cartItemId); return; }
    const item = cart.find(i => i.id === cartItemId);
    if (!item) return;
    if (quantity > item.stock) {
      showToast(`Chỉ còn ${item.stock} sản phẩm trong kho!`, "error");
      return;
    }
    const updated = await fetch(`${API}/cart/${cartItemId}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ quantity }),
    }).then(r => r.json());
    setCart(prev => prev.map(i => i.id === cartItemId ? updated : i));
  };

  const clearCart = async () => {
    await Promise.all(cart.map(i => fetch(`${API}/cart/${i.id}`, { method: "DELETE" })));
    setCart([]);
  };

  const cartTotal = cart.reduce((sum, i) => sum + i.price * i.quantity, 0);
  const cartCount = cart.reduce((sum, i) => sum + i.quantity, 0);

  // ── Wishlist ────────────────────────────────────────────────────────────────
  const toggleWishlist = async (product) => {
    if (!user) {
      showToast("Vui lòng đăng nhập để thêm vào danh sách yêu thích!", "error");
      return { requireLogin: true };
    }
    const exists = wishlist.find(i => i.productId === product.id);
    if (exists) {
      await fetch(`${API}/wishlist/${exists.id}`, { method: "DELETE" });
      setWishlist(prev => prev.filter(i => i.id !== exists.id));
      showToast(`Đã xóa "${product.name}" khỏi danh sách yêu thích!`, "info");
    } else {
      const newItem = await fetch(`${API}/wishlist`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          userId: user.id,
          productId: product.id,
          name: product.name,
          price: product.price,
          image: product.image,
        }),
      }).then(r => r.json());
      setWishlist(prev => [...prev, newItem]);
      showToast(`Đã thêm "${product.name}" vào danh sách yêu thích!`);
    }
  };

  const isInWishlist = (productId) => wishlist.some(i => i.productId === productId);

  // ── Orders ──────────────────────────────────────────────────────────────────
  const placeOrder = async (orderData) => {
    if (cart.length === 0) return { success: false, error: "Giỏ hàng trống!" };
    const order = await fetch(`${API}/orders`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        userId: user.id,
        items: [...cart],
        total: cartTotal,
        status: "processing",
        createdAt: new Date().toISOString(),
        ...orderData,
      }),
    }).then(r => r.json());
    setOrders(prev => [order, ...prev]);
    await clearCart();
    return { success: true, orderId: order.id };
  };

  // ── Reviews ─────────────────────────────────────────────────────────────────
  const addReview = async (productId, rating, comment) => {
    if (!user) {
      showToast("Vui lòng đăng nhập để gửi đánh giá!", "error");
      return { success: false, error: "Chưa đăng nhập" };
    }
    if (!rating || rating < 1 || rating > 5)
      return { success: false, error: "Vui lòng chọn số sao (1-5)!" };
    if (!comment || comment.trim().length < 10)
      return { success: false, error: "Nội dung nhận xét phải có ít nhất 10 ký tự!" };

    const already = reviews.find(r => r.productId === productId && r.userId === user.id);
    if (already)
      return { success: false, error: "Bạn đã đánh giá sản phẩm này rồi!" };

    const newReview = await fetch(`${API}/reviews`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        productId,
        userId: user.id,
        userName: user.name,
        rating,
        comment: comment.trim(),
        createdAt: new Date().toISOString(),
      }),
    }).then(r => r.json());

    setReviews(prev => [newReview, ...prev]);
    showToast("Đánh giá của bạn đã được gửi thành công!");
    return { success: true };
  };

  const getReviews = (productId) => reviews.filter(r => r.productId === productId);
  const hasReviewed = (productId) => user ? reviews.some(r => r.productId === productId && r.userId === user.id) : false;

  return (
    <AppContext.Provider value={{
      user, register, login, logout,
      cart, addToCart, removeFromCart, updateCartQuantity, clearCart, cartTotal, cartCount,
      wishlist, toggleWishlist, isInWishlist,
      orders, placeOrder,
      reviews, addReview, getReviews, hasReviewed,
      toasts, showToast,
      loading,
    }}>
      {children}
    </AppContext.Provider>
  );
}

export function useApp() {
  const ctx = useContext(AppContext);
  if (!ctx) throw new Error("useApp must be used within AppProvider");
  return ctx;
}
