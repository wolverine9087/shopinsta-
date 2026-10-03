import { useState } from "react";

import { imageUrl } from "../data";
import { currency } from "../utils/helpers";
import Button from "../components/Button";
import { Link } from "../components/Router";

export default function ProductDetail({
  product,
  onAdd,
  onSave,
}) {
  const [qty, setQty] = useState(1);

  // Product not found
  if (!product) {
    return (
      <section className="mx-auto max-w-5xl px-4 py-20 text-center">
        <h1 className="font-serif text-3xl sm:text-4xl">
          We couldn’t find that lovely thing.
        </h1>

        <Link
          to="/"
          className="mt-5 inline-block text-sm underline underline-offset-4"
        >
          Back to shop
        </Link>
      </section>
    );
  }

  const maxQuantity =
    product.stock > 0 ? product.stock : 99;

  const handleQuantityChange = (event) => {
    const value = Number(event.target.value);

    if (!Number.isFinite(value)) {
      setQty(1);
      return;
    }

    setQty(
      Math.min(
        Math.max(1, Math.floor(value)),
        maxQuantity
      )
    );
  };

  const handleAddToCart = () => {
    onAdd?.(product, qty);
  };

  const handleSave = () => {
    onSave?.(product);
  };

  const isOutOfStock = product.stock === 0;

  return (
    <main
      className="
        mx-auto
        grid
        max-w-6xl
        gap-8
        px-4
        py-8
        sm:px-8
        md:grid-cols-2
        md:gap-12
        md:py-14
      "
    >
      {/* Product Image */}
      <div
        className="
          aspect-[0.85]
          overflow-hidden
          bg-[#efeee7]
          md:sticky
          md:top-24
          md:h-fit
        "
      >
        <img
          src={imageUrl(
            product.images?.[0] || product.image
          )}
          alt={product.name}
          loading="eager"
          className="h-full w-full object-cover"
        />
      </div>

      {/* Product Information */}
      <div className="flex flex-col justify-center">
        <Link
          to="/"
          className="
            mb-8
            text-[10px]
            uppercase
            tracking-widest
            text-[#7e8176]
            transition-opacity
            hover:opacity-60
          "
        >
          ← Back to all finds
        </Link>

        {/* Brand */}
        <p className="text-[10px] tracking-[0.15em] text-[#959184]">
          {product.brand ||
            product.seller?.storeName ||
            "INDEPENDENT SHOP"}
        </p>

        {/* Product Name */}
        <h1 className="mt-2 font-serif text-4xl leading-tight sm:text-5xl">
          {product.name}
        </h1>

        {/* Price */}
        <p className="mt-4 text-lg font-medium">
          {currency(product.price)}
        </p>

        {/* Description */}
        <p className="mt-5 text-sm leading-7 text-[#707168]">
          {product.description ||
            "A thoughtful find from an independent shop, made to be loved for a long time."}
        </p>

        {/* Stock */}
        <p
          className={`mt-5 text-xs ${
            isOutOfStock
              ? "font-medium text-[#a84d42]"
              : "text-[#707168]"
          }`}
        >
          {isOutOfStock
            ? "Out of stock"
            : `${product.stock ?? "In stock"} available · Ships with care`}
        </p>

        {/* Quantity + Add to Bag */}
        <div className="mt-8 flex flex-col gap-3 sm:flex-row">
          <label
            className="
              flex
              h-11
              items-center
              justify-between
              gap-3
              border
              border-[#dad9d1]
              px-3
              text-xs
              sm:w-32
              sm:justify-center
            "
          >
            <span>Qty</span>

            <input
              aria-label="Quantity"
              type="number"
              min="1"
              max={maxQuantity}
              value={qty}
              disabled={isOutOfStock}
              onChange={handleQuantityChange}
              className="
                w-12
                bg-transparent
                text-center
                outline-none
                disabled:cursor-not-allowed
                disabled:opacity-50
              "
            />
          </label>

          <Button
            type="button"
            onClick={handleAddToCart}
            disabled={isOutOfStock}
            className="flex-1"
          >
            {isOutOfStock
              ? "Out of stock"
              : `Add to bag — ${currency(
                  product.price * qty
                )}`}
          </Button>
        </div>

        {/* Save */}
        <Button
          type="button"
          variant="light"
          onClick={handleSave}
          className="mt-3 w-full"
        >
          ♡ &nbsp; Save this find
        </Button>

        {/* Contact */}
        <div
          className="
            mt-8
            border-t
            border-[#e4e1d9]
            pt-5
            text-xs
            leading-6
            text-[#707168]
          "
        >
          A little love from a small shop. Questions?{" "}
          <a
            href="mailto:hello@shopinsta.com"
            className="underline underline-offset-2"
          >
            Get in touch
          </a>
          .
        </div>
      </div>
    </main>
  );
}
