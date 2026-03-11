import { useState, useMemo } from "react";
import { useSearchParams } from "react-router-dom";
import { FaSearch, FaFilter, FaSortAmountDown } from "react-icons/fa";
import ProductCard from "../components/ProductCard";
import { products, CATEGORIES } from "../data/products";

const SORT_OPTIONS = [
  { value: "featured", label: "Nổi bật" },
  { value: "price-asc", label: "Giá tăng dần" },
  { value: "price-desc", label: "Giá giảm dần" },
  { value: "rating", label: "Đánh giá cao" },
  { value: "name", label: "Tên A-Z" },
];

export default function Shop() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [search, setSearch] = useState("");
  const [sort, setSort] = useState("featured");
  const selectedCat = searchParams.get("cat") || "All";

  const setCategory = (cat) => {
    if (cat === "All") searchParams.delete("cat");
    else searchParams.set("cat", cat);
    setSearchParams(searchParams);
  };

  const filtered = useMemo(() => {
    let list = [...products];
    if (selectedCat !== "All") list = list.filter(p => p.category === selectedCat);
    if (search.trim()) {
      const q = search.toLowerCase();
      list = list.filter(p => p.name.toLowerCase().includes(q) || p.tags.some(t => t.includes(q)));
    }
    switch (sort) {
      case "price-asc": list.sort((a, b) => a.price - b.price); break;
      case "price-desc": list.sort((a, b) => b.price - a.price); break;
      case "rating": list.sort((a, b) => b.rating - a.rating); break;
      case "name": list.sort((a, b) => a.name.localeCompare(b.name)); break;
      default: list.sort((a, b) => (b.featured ? 1 : 0) - (a.featured ? 1 : 0));
    }
    return list;
  }, [selectedCat, search, sort]);

  return (
    <div className="shop-page">
      <div className="shop-header">
        <h1>Cửa Hàng Sen Đá</h1>
        <p>Khám phá {products.length}+ loài sen đá tuyệt đẹp</p>
      </div>

      <div className="shop-toolbar">
        <div className="search-box">
          <FaSearch className="search-icon" />
          <input
            type="text"
            placeholder="Tìm kiếm sen đá..."
            value={search}
            onChange={e => setSearch(e.target.value)}
            className="search-input"
            id="search-input"
            data-testid="search-input"
          />
        </div>
        <div className="sort-box">
          <FaSortAmountDown />
          <select value={sort} onChange={e => setSort(e.target.value)} id="sort-select" data-testid="sort-select">
            {SORT_OPTIONS.map(o => <option key={o.value} value={o.value}>{o.label}</option>)}
          </select>
        </div>
      </div>

      <div className="shop-layout">
        <aside className="shop-filters">
          <h3><FaFilter /> Danh Mục</h3>
          {CATEGORIES.map(cat => (
            <button
              key={cat}
              className={`filter-btn ${selectedCat === cat ? "active" : ""}`}
              onClick={() => setCategory(cat)}
              id={`filter-${cat}`}
              data-testid={`filter-${cat}`}
              data-category={cat}
            >
              {cat === "All" ? "Tất cả" : cat}
              <span className="filter-count">
                ({cat === "All" ? products.length : products.filter(p => p.category === cat).length})
              </span>
            </button>
          ))}
        </aside>

        <div className="shop-products">
          <div className="results-info">
            Tìm thấy <strong>{filtered.length}</strong> sản phẩm
            {selectedCat !== "All" && <> trong <em>{selectedCat}</em></>}
          </div>
          {filtered.length === 0 ? (
            <div className="empty-state" data-testid="no-product-message" id="no-results">
              <p>😔 Không tìm thấy sản phẩm phù hợp.</p>
              <button
                className="btn btn-outline"
                onClick={() => { setSearch(""); setCategory("All"); }}
                data-testid="clear-filter"
                id="clear-filter"
              >
                Xóa bộ lọc
              </button>
            </div>
          ) : (
            <div className="product-grid" data-testid="product-grid">
              {filtered.map(p => <ProductCard key={p.id} product={p} />)}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
