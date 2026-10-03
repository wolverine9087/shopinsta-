import { useEffect, useRef, useState } from "react";

import { api } from "../services/api";
import { currency } from "../utils/helpers";
import { imageUrl } from "../data";
import { Link } from "../components/Router";

const weightedCategoryMix = (reels, categoryId, preferredChance = 0.8) => {
  const preferred = [];
  const other = [];

  reels.forEach((reel) => {
    const reelCategory = reel.product?.category?._id || reel.product?.category;
    (reelCategory?.toString() === categoryId.toString() ? preferred : other).push(reel);
  });

  const mixed = [];
  while (preferred.length || other.length) {
    const choosePreferred = preferred.length &&
      (!other.length || Math.random() < preferredChance);
    const pool = choosePreferred ? preferred : other;
    mixed.push(pool.splice(Math.floor(Math.random() * pool.length), 1)[0]);
  }
  return mixed;
};

export default function Reels({
  user,
  onAdd,
  onNotice,
}) {
  const [reels, setReels] = useState([]);
  const [loading, setLoading] = useState(true);
  const [liked, setLiked] = useState([]);
  const [activeIndex, setActiveIndex] = useState(0);
  const feedRef = useRef(null);

  // Load reels
  useEffect(() => {
    const loadReels = async () => {
      try {
        const data = await api("/reels");

        setReels(data.reels || []);
      } catch (error) {
        console.error("Failed to load reels:", error);
        setReels([]);
        onNotice?.("Unable to load reels.");
      } finally {
        setLoading(false);
      }
    };

    loadReels();
  }, [onNotice]);

  const handleLike = async (reel) => {
    if (!user) {
      onNotice?.("Sign in to like a reel.");
      return;
    }

    try {
      const data = await api(`/reels/${reel._id}/like`, { method: "PATCH" });
      setLiked((current) => data.liked
        ? [...new Set([...current, reel._id])]
        : current.filter((id) => id !== reel._id));
      const likedCategory = reel.product?.category?._id || reel.product?.category;
      setReels((current) => {
        const updated = current.map((item) => item._id !== reel._id ? item : {
          ...item,
          likes: data.liked
            ? [...(item.likes || []), user._id || user.id || "liked"]
            : (item.likes || []).slice(0, data.likesCount),
        });

        if (!data.liked || !likedCategory) return updated;

        const alreadyShown = updated.slice(0, activeIndex + 1);
        const remaining = updated.slice(activeIndex + 1);
        return [...alreadyShown, ...weightedCategoryMix(remaining, likedCategory)];
      });
    } catch (error) {
      onNotice?.(error.message || "Unable to update like.");
    }
  };

  // Track reel views
  useEffect(() => {
    if (!reels.length) {
      return;
    }

    const feed = feedRef.current;
    if (!feed) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          const video = entry.target.querySelector("video");
          if (entry.intersectionRatio >= 0.6) {
            video?.play().catch(() => {});
            if (!entry.target.dataset.viewed) {
              entry.target.dataset.viewed = "true";
              api(`/reels/${entry.target.dataset.reel}/view`, { method: "PATCH" }).catch(() => {});
            }
          } else {
            video?.pause();
          }
        });
      },
      { root: feed, threshold: [0, 0.6] }
    );

    const reelElements = feed.querySelectorAll("[data-reel]");

    reelElements.forEach((element) =>
      observer.observe(element)
    );

    return () => {
      observer.disconnect();
    };
  }, [reels]);

  return (
    <main
      className="
        mx-auto
        w-full
        max-w-7xl
        px-0
        sm:px-6
        lg:px-8
      "
    >
      {/* Loading */}
      {loading && (
        <p
          className="
            px-4
            py-16
            text-center
            text-sm
            text-[#777970]
          "
        >
          Finding reels for you…
        </p>
      )}

      {/* Empty State */}
      {!loading && reels.length === 0 && (
        <section
          className="
            mx-4
            my-8
            max-w-md
            bg-[#f2f1eb]
            px-6
            py-14
            text-center
            sm:mx-auto
          "
        >
          <span
            className="text-4xl"
            aria-hidden="true"
          >
            ▶
          </span>

          <h2
            className="
              mt-4
              font-serif
              text-2xl
              sm:text-3xl
            "
          >
            The next reel could be yours.
          </h2>

          <p
            className="
              mt-3
              text-sm
              leading-6
              text-[#777970]
            "
          >
            Sellers share quick videos to show
            their products in real life. Browse
            shops and products while the community
            gets started.
          </p>

          <Link
            to="/become-seller"
            className="
              mt-5
              inline-block
              text-sm
              underline
              underline-offset-4
            "
          >
            Start your shop →
          </Link>
        </section>
      )}

      {/* Reels */}
      {reels.length > 0 && (
        <div
          className="
            w-full
            h-[calc(100dvh-60px)]
            lg:h-[calc(100dvh-100px)]
            relative
            flex
            flex-col
            snap-y
            snap-mandatory
            overflow-y-auto
            scrollbar-none
            overscroll-contain
            scroll-smooth
          "
          ref={feedRef}
          onScroll={(event) => {
            const feed = event.currentTarget;
            setActiveIndex(Math.round(feed.scrollTop / feed.clientHeight));
          }}
        >
          {reels.map((reel) => {
            const product = reel.product;
            const seller = reel.seller;
            const isLiked = liked.includes(reel._id);

            const productImage =
              product?.images?.[0]
                ? imageUrl(product.images[0])
                : undefined;

            return (
              <article
                key={reel._id}
                data-reel={reel._id}
                className="
                  relative
                  mx-auto
                  h-full
                  shrink-0
                  min-h-0
                  w-full
                  snap-start
                  snap-always
                  overflow-hidden
                  bg-[#ddd8cf]
                  text-white

                  /* Mobile */
                  aspect-[9/16]
                  max-h-full

                  /* Centered portrait reel on larger screens */
                  sm:aspect-auto
                  sm:max-w-[380px]
                  sm:rounded-lg

                  /* Large desktop */
                  lg:max-w-[390px]
                "
              >
                {/* Video */}
                <video
                  src={reel.videoUrl}
                  poster={
                    reel.thumbnailUrl ||
                    productImage
                  }
                  autoPlay
                  muted
                  loop
                  playsInline
                  preload="metadata"
                  className="
                    absolute
                    inset-0
                    h-full
                    w-full
                    object-cover
                  "
                />
                <div className="pointer-events-none absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/85 via-black/40 to-transparent px-4 pb-5 pt-28 text-white">
                  <Link to={seller?._id ? `/seller/${seller._id}` : "/"} className="pointer-events-auto flex items-center gap-2 text-sm font-semibold">
                    <img src={seller?.avatar || "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=80&q=80"} alt="" loading="lazy" className="h-9 w-9 rounded-full border border-white object-cover" />
                    <span className="truncate">{seller?.storeName || seller?.name || "Shop"}</span>
                    <span className="text-xs font-normal">· View shop</span>
                  </Link>
                  <p className="mt-3 line-clamp-2 text-xs leading-relaxed">{reel.caption || "A little look at something lovely ♡"}</p>
                  <div className="pointer-events-auto mt-4 flex items-center gap-2">
                    <button type="button" onClick={() => handleLike(reel)} aria-label={isLiked ? "Unlike reel" : "Like reel"} aria-pressed={isLiked} className={`min-h-10 rounded-full bg-black/35 px-4 text-xs backdrop-blur-sm ${isLiked ? "text-rose-300" : "text-white"}`}>
                      {isLiked ? "♥" : "♡"} {reel.likes?.length || 0}
                    </button>
                    <div className="ml-auto flex min-w-0 items-center gap-2">
                      <Link to={product?._id ? `/product/${product._id}` : "/explore"} className="flex min-w-0 max-w-[230px] items-center gap-2 rounded-full bg-white px-4 py-3 text-xs font-semibold text-[#293c33]">
                        <span className="truncate">{product?.name || "Shop this find"}</span>
                        {product?.price != null && <span className="shrink-0">{currency(product.price)}</span>}
                        <span>→</span>
                      </Link>
                      {product && <button type="button" onClick={() => onAdd?.(product)} aria-label={`Add ${product.name} to bag`} className="grid h-11 w-11 shrink-0 place-items-center rounded-full bg-[#293c33] text-lg">＋</button>}
                    </div>
                  </div>
                </div>
              </article>
            );
          })}

        </div>
      )}
    </main>
  );
}
