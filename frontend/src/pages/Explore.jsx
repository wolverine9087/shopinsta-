import { useMemo, useState } from "react";

import { categories } from "../data";
import ProductCard from "../components/ProductCard";
import { Link } from "../components/Router";

export default function Explore({
  products,
  saved,
  onSave,
  onAdd,
  hasMoreProducts = false,
  loadingMoreProducts = false,
  onLoadMore,
}) {
  const [query, setQuery] = useState("");
  const [category, setCategory] = useState("All finds");

  const found = useMemo(() => {
    return products.filter((item) => {
      const productCategory =
        item.category?.name || item.category || "";

      const matchesCategory =
        category === "All finds" ||
        productCategory.toLowerCase() ===
          category.toLowerCase();

      const searchText = `
        ${item.name}
        ${item.brand || ""}
        ${productCategory}
        ${item.seller?.storeName || ""}
      `.toLowerCase();

      const matchesSearch = searchText.includes(
        query.toLowerCase()
      );

      return matchesCategory && matchesSearch;
    });
  }, [products, category, query]);

  return (
    <main
      className="
        mx-auto
        min-h-[70vh]
        max-w-7xl
        px-4
        py-7
        sm:px-8
        sm:py-12
      "
    >
      {/* Header */}
      <p
        className="
          text-[9px]
          font-semibold
          uppercase
          tracking-[0.2em]
          text-[#9b8c77]
        "
      >
        Find your next favourite
      </p>

      <div className="flex flex-wrap items-end justify-between gap-4">
        <h1 className="font-serif text-4xl sm:text-5xl">
          Explore
        </h1>

        <Link
          to="/reels"
          className="text-xs underline underline-offset-4"
        >
          Watch product reels →
        </Link>
      </div>

      {/* Search */}
      <label
        className="
          mt-6
          flex
          h-12
          items-center
          gap-3
          border
          border-[#deddd5]
          bg-white
          px-4
        "
      >
        <span className="text-xl" aria-hidden="true">
          ⌕
        </span>

        <input
          type="search"
          value={query}
          onChange={(event) =>
            setQuery(event.target.value)
          }
          placeholder="Search products, shops, categories…"
          aria-label="Search products"
          className="w-full text-sm outline-none"
        />
      </label>

      {/* Categories */}
      <div
        className="
          mt-5
          flex
          gap-2
          overflow-x-auto
          pb-1
          scrollbar-none
        "
      >
        {categories.map((name) => {
          const isActive = category === name;

          return (
            <button
              key={name}
              type="button"
              onClick={() => setCategory(name)}
              aria-pressed={isActive}
              className={`
                whitespace-nowrap
                rounded-full
                px-4
                py-2
                text-[10px]
                transition-colors
                ${
                  isActive
                    ? "bg-[#293c33] text-white"
                    : "bg-[#efeee7] text-[#66675f] hover:bg-[#e4e3dc]"
                }
              `}
            >
              {name}
            </button>
          );
        })}
      </div>

      {/* Results Header */}
      <div className="mt-8 flex items-end justify-between gap-4">
        <h2 className="font-serif text-2xl">
          {category === "All finds"
            ? "All good finds"
            : category}
        </h2>

        <span className="text-[10px] text-[#777970]">
          {found.length}{" "}
          {found.length === 1 ? "find" : "finds"}
        </span>
      </div>

      {/* Products */}
      {found.length > 0 && (
        <div
          className="
            mt-4
            grid
            grid-cols-2
            gap-x-3
            gap-y-7
            sm:grid-cols-3
            sm:gap-5
            lg:grid-cols-4
          "
        >
          {found.map((item) => (
            <div key={item._id} className="min-w-0">
              <ProductCard
                product={item}
                saved={saved.some(
                  (savedItem) =>
                    savedItem._id === item._id
                )}
                onSave={onSave}
                onAdd={onAdd}
              />

              {item.seller?._id && (
                <Link
                  to={`/seller/${item.seller._id}`}
                  className="
                    mt-2
                    block
                    truncate
                    text-[10px]
                    text-[#777970]
                    hover:underline
                  "
                >
                  From{" "}
                  {item.seller.storeName ||
                    item.seller.name}{" "}
                  →
                </Link>
              )}
            </div>
          ))}
        </div>
      )}

      {hasMoreProducts && (
        <div className="mt-10 text-center">
          <button
            type="button"
            onClick={onLoadMore}
            disabled={loadingMoreProducts}
            className="border border-[#293c33] px-6 py-3 text-xs font-medium text-[#293c33] transition-colors hover:bg-[#293c33] hover:text-white disabled:cursor-wait disabled:opacity-60"
          >
            {loadingMoreProducts
              ? "Loading products…"
              : "Load older products"}
          </button>
        </div>
      )}

      {/* Empty State */}
      {!found.length && (
        <div className="py-16 text-center">
          <p className="text-sm text-[#777970]">
            No finds in that search yet.
          </p>

          <p className="mt-1 text-xs text-[#999486]">
            Try another category or search term ♡
          </p>
        </div>
      )}
    </main>
  );
}
