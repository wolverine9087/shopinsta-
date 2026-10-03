import { currency } from "../utils/helpers";
import { imageUrl } from "../data";
import { Link } from "../components/Router";

export default function Orders({ orders = [] }) {
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
          All the lovely things you’ve found
        </p>

        <h1 className="mt-2 font-serif text-3xl sm:text-4xl">
          Your orders
        </h1>
      </header>

      {/* Empty State */}
      {orders.length === 0 ? (
        <div className="py-16 text-center sm:py-24">
          <p className="font-serif text-2xl">
            No orders just yet.
          </p>

          <Link
            to="/"
            className="
              mt-4
              inline-block
              text-sm
              underline
              underline-offset-4
            "
          >
            Let’s find something →
          </Link>
        </div>
      ) : (
        <div className="mt-8 space-y-4">
          {orders.map((order) => (
            <article
              key={order._id}
              className="
                flex
                gap-3
                border
                border-[#e6e3dc]
                bg-white
                p-3
                sm:gap-4
                sm:p-4
              "
            >
              {/* Product Image */}
              <div className="shrink-0">
                <img
                  src={imageUrl(
                    order.product?.images?.[0] ||
                      order.product?.image,
                    300
                  )}
                  alt={order.product?.name || "Ordered product"}
                  loading="lazy"
                  className="
                    h-24
                    w-20
                    object-cover
                    sm:h-28
                    sm:w-24
                  "
                />
              </div>

              {/* Order Details */}
              <div
                className="
                  flex
                  min-w-0
                  flex-1
                  flex-wrap
                  items-start
                  justify-between
                  gap-3
                "
              >
                <div className="min-w-0">
                  <p
                    className="
                      truncate
                      text-[9px]
                      uppercase
                      tracking-widest
                      text-[#909085]
                    "
                  >
                    Order #{order._id}
                  </p>

                  <h2 className="mt-1 truncate text-sm font-medium">
                    {order.product?.name ||
                      "Product unavailable"}
                  </h2>

                  <p className="mt-2 text-xs text-[#555750]">
                    Qty {order.quantity} ·{" "}
                    {currency(order.totalAmount)}
                  </p>

                  {order.paymentMethod && (
                    <p className="mt-1 text-[10px] text-[#888980]">
                      Payment: {order.paymentMethod}
                    </p>
                  )}
                </div>

                {/* Order Status */}
                <span
                  className="
                    shrink-0
                    rounded-full
                    bg-[#edf0e8]
                    px-3
                    py-1
                    text-[10px]
                    font-medium
                    capitalize
                  "
                >
                  {order.orderStatus || "Pending"}
                </span>
              </div>
            </article>
          ))}
        </div>
      )}
    </main>
  );
}
