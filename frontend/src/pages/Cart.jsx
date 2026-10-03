import { imageUrl } from "../data";
import { currency } from "../utils/helpers";
import Button from "../components/Button";
import { Link } from "../components/Router";

export default function Cart({
  cart,
  onQuantity,
  onRemove,
}) {
  const total = cart.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0
  );

  const handleDecrease = (item) => {
    if (item.quantity <= 1) {
      return;
    }

    onQuantity?.(item._id, item.quantity - 1);
  };

  const handleIncrease = (item) => {
    onQuantity?.(item._id, item.quantity + 1);
  };

  const handleRemove = (productId) => {
    onRemove?.(productId);
  };

  const handleCheckout = () => {
    window.dispatchEvent(
      new CustomEvent("shopinsta:checkout")
    );
  };

  return (
    <main
      className="
        mx-auto
        min-h-[65vh]
        max-w-5xl
        px-4
        py-8
        sm:px-8
        sm:py-16
      "
    >
      {/* Header */}
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
          Your little collection
        </p>

        <h1 className="mt-2 font-serif text-3xl sm:text-4xl">
          Shopping bag
        </h1>
      </div>

      {/* Empty Cart */}
      {!cart.length ? (
        <div className="py-16 text-center sm:py-24">
          <p className="font-serif text-2xl">
            Your bag is waiting for a lovely find.
          </p>

          <Link
            to="/"
            className="mt-5 inline-block text-sm underline underline-offset-4"
          >
            Find something lovely →
          </Link>
        </div>
      ) : (
        <div
          className="
            mt-8
            grid
            gap-8
            md:grid-cols-[1fr_300px]
            md:gap-10
          "
        >
          {/* Cart Items */}
          <div className="divide-y divide-[#e4e1d9]">
            {cart.map((item) => (
              <article
                key={item._id}
                className="flex gap-3 py-5 sm:gap-4"
              >
                {/* Product Image */}
                <Link
                  to={`/product/${item._id}`}
                  className="shrink-0"
                  aria-label={`View ${item.name}`}
                >
                  <img
                    src={imageUrl(
                      item.images?.[0] || item.image,
                      300
                    )}
                    alt={item.name}
                    loading="lazy"
                    className="
                      h-28
                      w-24
                      object-cover
                      sm:h-36
                      sm:w-32
                    "
                  />
                </Link>

                {/* Product Details */}
                <div className="flex min-w-0 flex-1 flex-col">
                  <p
                    className="
                      truncate
                      text-[9px]
                      tracking-widest
                      text-[#999486]
                    "
                  >
                    {item.brand || "INDEPENDENT SHOP"}
                  </p>

                  <Link
                    to={`/product/${item._id}`}
                    className="
                      mt-1
                      truncate
                      text-sm
                      font-medium
                      hover:underline
                    "
                  >
                    {item.name}
                  </Link>

                  <p className="mt-2 text-xs font-semibold">
                    {currency(item.price)}
                  </p>

                  {/* Quantity Controls */}
                  <div className="mt-auto flex items-center gap-3 pt-4 text-xs">
                    <button
                      type="button"
                      onClick={() => handleDecrease(item)}
                      disabled={item.quantity <= 1}
                      aria-label={`Decrease quantity of ${item.name}`}
                      className="
                        grid
                        h-8
                        w-8
                        place-items-center
                        border
                        border-[#dad9d1]
                        text-base
                        transition-colors
                        hover:bg-[#f2f1eb]
                        disabled:cursor-not-allowed
                        disabled:opacity-40
                      "
                    >
                      −
                    </button>

                    <span
                      className="min-w-5 text-center"
                      aria-label={`Quantity ${item.quantity}`}
                    >
                      {item.quantity}
                    </span>

                    <button
                      type="button"
                      onClick={() => handleIncrease(item)}
                      aria-label={`Increase quantity of ${item.name}`}
                      className="
                        grid
                        h-8
                        w-8
                        place-items-center
                        border
                        border-[#dad9d1]
                        text-base
                        transition-colors
                        hover:bg-[#f2f1eb]
                      "
                    >
                      +
                    </button>

                    <button
                      type="button"
                      onClick={() =>
                        handleRemove(item._id)
                      }
                      className="
                        ml-auto
                        text-[10px]
                        underline
                        underline-offset-4
                        transition-opacity
                        hover:opacity-60
                      "
                    >
                      Remove
                    </button>
                  </div>
                </div>
              </article>
            ))}
          </div>

          {/* Order Summary */}
          <aside
            className="
              h-fit
              bg-[#f2f1eb]
              p-5
              sm:p-6
              md:sticky
              md:top-24
            "
          >
            <h2 className="font-serif text-2xl">
              Summary
            </h2>

            <div className="mt-5">
              <p className="flex justify-between text-sm">
                <span>Subtotal</span>
                <b>{currency(total)}</b>
              </p>

              <p className="mt-2 flex justify-between gap-4 text-xs text-[#777970]">
                <span>Shipping</span>
                <span className="text-right">
                  Calculated at checkout
                </span>
              </p>
            </div>

            <Button
              type="button"
              onClick={handleCheckout}
              className="mt-6 w-full"
            >
              Continue to checkout
            </Button>

            <Link
              to="/"
              className="
                mt-4
                block
                text-center
                text-xs
                underline
                underline-offset-4
              "
            >
              Keep finding
            </Link>
          </aside>
        </div>
      )}
    </main>
  );
}
