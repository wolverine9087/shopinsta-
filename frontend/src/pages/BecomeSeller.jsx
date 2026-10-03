import { useState } from "react";

import { Link } from "../components/Router";
import Button from "../components/Button";
import { api } from "../services/api";

export default function BecomeSeller({
  user,
  onBecome,
  onNotice,
}) {
  const [storeName, setStoreName] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const isSeller = user?.role === "seller";

  const handleSubmit = async (event) => {
    event.preventDefault();

    const trimmedStoreName = storeName.trim();

    if (trimmedStoreName.length < 2) {
      onNotice?.("Shop name must contain at least 2 characters.");
      return;
    }

    if (isSubmitting) {
      return;
    }

    setIsSubmitting(true);

    try {
      await api("/users/become-seller", {
        method: "POST",
        body: {
          storeName: trimmedStoreName,
        },
      });

      onBecome?.({
        ...user,
        role: "seller",
        storeName: trimmedStoreName,
      });
    } catch (error) {
      console.error("Failed to become seller:", error);

      onNotice?.(
        error.message || "Unable to set up your seller account."
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <main
      className="
        mx-auto
        grid
        min-h-[70vh]
        max-w-6xl
        items-center
        gap-8
        px-4
        py-8
        sm:px-8
        sm:py-12
        lg:grid-cols-2
        lg:gap-12
        lg:py-16
      "
    >
      {/* Shop Image */}
      <div
        className="
          relative
          h-[300px]
          overflow-hidden
          bg-[#e9e4da]
          sm:h-[460px]
          lg:h-[560px]
        "
      >
        <img
          src="https://images.unsplash.com/photo-1441986300917-64674bd600d8?auto=format&fit=crop&w=1000&q=85"
          alt="A warmly lit independent shop"
          loading="lazy"
          className="h-full w-full object-cover"
        />

        <span
          className="
            absolute
            bottom-4
            left-4
            bg-white/90
            px-3
            py-2
            text-[10px]
            backdrop-blur-sm
          "
        >
          Small shops belong here ♡
        </span>
      </div>

      {/* Content */}
      <div>
        <p
          className="
            text-[9px]
            font-semibold
            uppercase
            tracking-[0.2em]
            text-[#9b8c77]
          "
        >
          For the people behind the good stuff
        </p>

        <h1
          className="
            mt-3
            font-serif
            text-4xl
            leading-tight
            sm:text-5xl
            lg:text-6xl
          "
        >
          Your shop deserves to be{" "}
          <em className="font-normal text-[#88967f]">
            found.
          </em>
        </h1>

        <p
          className="
            mt-5
            max-w-lg
            text-sm
            leading-7
            text-[#74756c]
          "
        >
          Open a little corner of ShopInsta. Add your
          products, share the story behind them through reels,
          and meet people who love shopping small.
        </p>

        {/* Seller Benefits */}
        <div className="mt-7 space-y-3 text-xs text-[#565950]">
          <p>✳ &nbsp; Build a profile for your shop</p>
          <p>✳ &nbsp; List products and manage your stock</p>
          <p>
            ✳ &nbsp; Share product reels and reach new shoppers
          </p>
          <p>
            ✳ &nbsp; Track orders from one simple dashboard
          </p>
        </div>

        {/* Seller / User / Guest */}
        {isSeller ? (
          <Link to="/seller">
            <Button className="mt-8 w-full sm:w-auto">
              Open seller studio →
            </Button>
          </Link>
        ) : user ? (
          <form
            onSubmit={handleSubmit}
            className="mt-7 max-w-sm"
          >
            <label className="block text-xs font-medium">
              Shop name

              <input
                type="text"
                minLength={2}
                maxLength={100}
                required
                value={storeName}
                onChange={(event) =>
                  setStoreName(event.target.value)
                }
                placeholder="Your lovely shop"
                disabled={isSubmitting}
                className="
                  mt-2
                  h-11
                  w-full
                  border
                  border-[#deddd5]
                  bg-white
                  px-3
                  text-sm
                  outline-none
                  transition-colors
                  focus:border-[#82927b]
                  disabled:cursor-not-allowed
                  disabled:opacity-60
                "
              />
            </label>

            <Button
              type="submit"
              disabled={isSubmitting}
              className="mt-3 w-full"
            >
              {isSubmitting
                ? "Setting up your shop…"
                : "Become a seller →"}
            </Button>
          </form>
        ) : (
          <Link to="/register?seller=1">
            <Button className="mt-8 w-full sm:w-auto">
              Become a seller →
            </Button>
          </Link>
        )}

        <p className="mt-3 text-[10px] text-[#85867c]">
          Free to get started. Your shop, your story.
        </p>
      </div>
    </main>
  );
}
