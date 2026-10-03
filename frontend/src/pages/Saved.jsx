import ProductCard from "../components/ProductCard";
import { Link } from "../components/Router";

export default function Saved({
  items = [],
  onSave,
  onAdd,
}) {
  return (
    <main
      className="
        mx-auto
        min-h-[65vh]
        max-w-7xl
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
          A little list for later
        </p>

        <h1 className="mt-2 font-serif text-3xl sm:text-4xl">
          Saved finds
        </h1>
      </header>

      {/* Saved Products */}
      {items.length > 0 ? (
        <div
          className="
            mt-8
            grid
            grid-cols-2
            gap-x-3
            gap-y-7
            sm:grid-cols-3
            sm:gap-5
            lg:grid-cols-4
          "
        >
          {items.map((item) => (
            <ProductCard
              key={item._id}
              product={item}
              saved
              onSave={onSave}
              onAdd={onAdd}
            />
          ))}
        </div>
      ) : (
        /* Empty State */
        <div className="py-16 text-center sm:py-24">
          <p className="font-serif text-2xl">
            Your saved list is a fresh page.
          </p>

          <p className="mt-2 text-xs text-[#777970]">
            Tap a heart on anything you love to keep it
            here.
          </p>

          <Link
            to="/"
            className="
              mt-5
              inline-block
              text-sm
              underline
              underline-offset-4
              transition-opacity
              hover:opacity-60
            "
          >
            Explore the finds →
          </Link>
        </div>
      )}
    </main>
  );
}
