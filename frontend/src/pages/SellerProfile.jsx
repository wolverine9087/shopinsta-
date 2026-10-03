import { useEffect, useState } from "react";

import { api } from "../services/api";
import { imageUrl } from "../data";
import { Link } from "../components/Router";
import ProductCard from "../components/ProductCard";

export default function SellerProfile({
  id,
  onAdd,
  onSave,
  saved = [],
  onNotice,
}) {
  const [seller, setSeller] = useState(null);
  const [products, setProducts] = useState([]);
  const [reels, setReels] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadSellerProfile = async () => {
      setLoading(true);

      try {
        const [sellerData, productsData, reelsData] =
          await Promise.all([
            api(`/sellers/${id}/public`),
            api("/products"),
            api("/reels?limit=30"),
          ]);

        setSeller(sellerData.seller || null);

        setProducts(
          (productsData.products || []).filter(
            (product) =>
              product.seller?._id === id
          )
        );

        setReels(
          (reelsData.reels || []).filter(
            (reel) =>
              reel.seller?._id === id
          )
        );
      } catch (error) {
        console.error(
          "Failed to load seller profile:",
          error
        );

        setSeller(null);
        setProducts([]);
        setReels([]);

        onNotice?.(
          error.message ||
            "Unable to load this shop."
        );
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      loadSellerProfile();
    }
  }, [id, onNotice]);

  // Loading state
  if (loading) {
    return (
      <main
        className="
          grid
          min-h-[60vh]
          place-items-center
          px-4
          text-center
          text-sm
          text-[#777970]
        "
      >
        Opening this little shop…
      </main>
    );
  }

  // Seller not found
  if (!seller) {
    return (
      <main
        className="
          mx-auto
          min-h-[60vh]
          max-w-3xl
          px-4
          py-24
          text-center
        "
      >
        <h1 className="font-serif text-3xl sm:text-4xl">
          Shop not found
        </h1>

        <Link
          to="/explore"
          className="
            mt-4
            inline-block
            text-sm
            underline
            underline-offset-4
          "
        >
          Explore other shops →
        </Link>
      </main>
    );
  }

  const sellerName =
    seller.storeName ||
    seller.name ||
    "Independent shop";

  const productCount =
    seller.productCount ?? products.length;

  const reelCount =
    seller.reelCount ?? reels.length;

  const sellerAvatar =
    seller.avatar ||
    "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=180&q=80";

  return (
    <main
      className="
        mx-auto
        min-h-[70vh]
        max-w-6xl
        px-4
        py-8
        sm:px-8
        sm:py-12
      "
    >
      {/* Seller Header */}
      <header
        className="
          flex
          flex-col
          items-center
          gap-5
          border-b
          border-[#e4e1d9]
          pb-8
          text-center
          sm:flex-row
          sm:text-left
        "
      >
        <img
          src={sellerAvatar}
          alt={`${sellerName} profile`}
          loading="eager"
          className="
            h-24
            w-24
            shrink-0
            rounded-full
            border-4
            border-[#eef0e9]
            object-cover
          "
        />

        <div className="min-w-0 flex-1">
          <p
            className="
              text-[9px]
              font-semibold
              uppercase
              tracking-[0.2em]
              text-[#9b8c77]
            "
          >
            A ShopInsta independent
          </p>

          <h1 className="mt-1 font-serif text-3xl sm:text-4xl">
            {sellerName}{" "}
            <span
              className="text-base text-[#819078]"
              aria-hidden="true"
            >
              ✳
            </span>
          </h1>

          <p
            className="
              mt-2
              max-w-lg
              text-sm
              leading-6
              text-[#74756c]
            "
          >
            {seller.bio ||
              "A small shop with a big heart. Take a look around and find something made for you."}
          </p>
        </div>

        {/* Shop Stats */}
        <div className="flex shrink-0 gap-6 text-center text-xs">
          <div>
            <b className="block text-lg">
              {productCount}
            </b>
            finds
          </div>

          <div>
            <b className="block text-lg">
              {reelCount}
            </b>
            reels
          </div>
        </div>
      </header>

      {/* Products */}
      <section className="py-8">
        <div className="flex items-center justify-between gap-4">
          <h2 className="font-serif text-2xl">
            Finds from this shop
          </h2>

          <Link
            to="/explore"
            className="
              shrink-0
              text-xs
              underline
              underline-offset-4
              transition-opacity
              hover:opacity-60
            "
          >
            Explore more shops
          </Link>
        </div>

        {products.length > 0 ? (
          <div
            className="
              mt-5
              grid
              grid-cols-2
              gap-x-3
              gap-y-7
              sm:grid-cols-3
              sm:gap-5
              lg:grid-cols-4
            "
          >
            {products.map((product) => {
              const isSaved = saved.some(
                (savedProduct) =>
                  savedProduct._id === product._id
              );

              return (
                <ProductCard
                  key={product._id}
                  product={product}
                  saved={isSaved}
                  onSave={onSave}
                  onAdd={onAdd}
                />
              );
            })}
          </div>
        ) : (
          <p className="py-10 text-sm text-[#777970]">
            This shop is getting its first finds ready.
          </p>
        )}
      </section>

      {/* Reels */}
      {reels.length > 0 && (
        <section
          className="
            border-t
            border-[#e4e1d9]
            py-8
          "
        >
          <div className="flex items-center justify-between gap-4">
            <h2 className="font-serif text-2xl">
              Shop reels
            </h2>

            <Link
              to="/reels"
              className="
                text-xs
                underline
                underline-offset-4
              "
            >
              Watch all →
            </Link>
          </div>

          <div
            className="
              mt-5
              grid
              grid-cols-2
              gap-3
              sm:grid-cols-4
            "
          >
            {reels.map((reel) => {
              const thumbnail =
                reel.thumbnailUrl ||
                imageUrl(
                  reel.product?.images?.[0]
                );

              return (
                <Link
                  key={reel._id}
                  to="/reels"
                  className="
                    group
                    relative
                    aspect-[0.7]
                    overflow-hidden
                    bg-[#eee9df]
                  "
                  aria-label={`Watch ${
                    reel.caption || "shop reel"
                  }`}
                >
                  <img
                    src={thumbnail}
                    alt={
                      reel.caption ||
                      "Shop reel"
                    }
                    loading="lazy"
                    className="
                      h-full
                      w-full
                      object-cover
                      transition-transform
                      duration-500
                      group-hover:scale-105
                    "
                  />

                  <div
                    className="
                      absolute
                      inset-x-0
                      bottom-0
                      bg-gradient-to-t
                      from-black/70
                      to-transparent
                      px-2
                      pb-2
                      pt-8
                    "
                  >
                    <span className="text-xs text-white">
                      ▶ &nbsp; {reel.views || 0} views
                    </span>
                  </div>
                </Link>
              );
            })}
          </div>
        </section>
      )}
    </main>
  );
}
