import { useMemo, useState } from "react";

import { categories } from "../data";
import ProductCard from "../components/ProductCard";
import { Link } from "../components/Router";

export default function Explore({
  products = [],
  saved = [],
  onSave,
  onAdd,
}) {
  const [query, setQuery] = useState("");
  const [category, setCategory] = useState("All finds");

  // Filter products
  const foundProducts = useMemo(() => {
    const searchQuery = query.trim().toLowerCase();

    return products.filter((product) => {
      const productCategory = (
        product.category?.name ||
        product.category ||
        ""
      ).toLowerCase();

      const matchesCategory =
        category === "All finds" ||
        productCategory === category.toLowerCase();

      const searchableText = [
        product.name,
        product.brand,
        productCategory,
        product.seller?.storeName,
        product.seller?.name,
      ]
        .filter(Boolean)
        .join(" ")
        .toLowerCase();

      const matchesSearch =
        searchableText.includes(searchQuery);

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
      {/* Page Header */}
      <header>
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

        <div
          className="
            mt-1
            flex
            flex-wrap
            items-end
            justify-between
            gap-4
          "
        >
          <h1 className="font-serif text-4xl sm:text-5xl">
            Explore
          </h1>

          <Link
            to="/reels"
            className="
              text-xs
              underline
              underline-offset-4
              transition-opacity
              hover:opacity-60
            "
          >
            Watch product reels →
          </Link>
        </div>
      </header>

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
          focus-within:border-[#82927b]
        "
      >
        <span
          className="text-xl text-[#777970]"
          aria-hidden="true"
        >
          ⌕
        </span>

        <input
          type="search"
          value={query}
          onChange={(event) =>
            setQuery(event.target.value)
          }
          placeholder="Search products, shops, categories…"
          aria-label="Search products, shops, and categories"
          className="
            w-full
            bg-transparent
            text-sm
            outline-none
            placeholder:text-[#aaa9a1]
          "
        />

        {query && (
          <button
            type="button"
            onClick={() => setQuery("")}
            aria-label="Clear search"
            className="
              grid
              h-7
              w-7
              shrink-0
              place-items-center
              rounded-full
              text-sm
              text-[#777970]
              hover:bg-[#efeee7]
            "
          >
            ×
          </button>
        )}
      </label>

      {/* Category Filters */}
      <div
        className="
          mt-5
          flex
          gap-2
          overflow-x-auto
          pb-2
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
                shrink-0
                whitespace-nowrap
                rounded-full
                px-4
                py-2
                text-[10px]
                font-medium
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
      <div
        className="
          mt-8
          flex
          items-end
          justify-between
          gap-4
        "
      >
        <h2 className="font-serif text-2xl">
          {category === "All finds"
            ? "All good finds"
            : category}
        </h2>

        <span className="shrink-0 text-[10px] text-[#777970]">
          {foundProducts.length}{" "}
          {foundProducts.length === 1
            ? "find"
            : "finds"}
        </span>
      </div>

      {/* Product Grid */}
      {foundProducts.length > 0 && (
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
          {foundProducts.map((product) => {
            const isSaved = saved.some(
              (savedProduct) =>
                savedProduct._id === product._id
            );

            return (
              <article
                key={product._id}
                className="min-w-0"
              >
                <ProductCard
                  product={product}
                  saved={isSaved}
                  onSave={onSave}
                  onAdd={onAdd}
                />

                {/* Seller */}
                {product.seller?._id && (
                  <Link
                    to={`/seller/${product.seller._id}`}
                    className="
                      mt-2
                      block
                      truncate
                      text-[10px]
                      text-[#777970]
                      transition-opacity
                      hover:opacity-60
                    "
                  >
                    From{" "}
                    {product.seller.storeName ||
                      product.seller.name}{" "}
                    →
                  </Link>
                )}
              </article>
            );
          })}
        </div>
      )}

      {/* Empty State */}
      {foundProducts.length === 0 && (
        <div className="py-16 text-center sm:py-20">
          <p className="font-serif text-xl">
            No finds yet.
          </p>

          <p className="mt-2 text-xs text-[#777970]">
            Try another category or search term ♡
          </p>

          {(query || category !== "All finds") && (
            <button
              type="button"
              onClick={() => {
                setQuery("");
                setCategory("All finds");
              }}
              className="
                mt-4
                text-xs
                underline
                underline-offset-4
              "
            >
              Clear filters
            </button>
          )}
        </div>
      )}
    </main>
  );
}