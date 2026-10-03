import { imageUrl } from "../data";
import { currency } from "../utils/helpers";
import Button from "./Button";
import { Link } from "./Router";

export default function ProductCard({
  product,
  saved = false,
  onSave,
  onAdd,
}) {
  const productImage = imageUrl(product.images?.[0] || product.image);

  const brand = product.brand || product.seller?.storeName || "INDEPENDENT SHOP";

  const handleSave = () => {
    onSave?.(product);
  };

  const handleAdd = () => {
    onAdd?.(product);
  };

  return (
    <article className="group min-w-0">
      {/* Product Image */}
      <div className="relative aspect-[0.8] overflow-hidden rounded-sm bg-[#eee9df]">
        <Link
          to={`/product/${product._id}`}
          aria-label={`View ${product.name}`}
        >
          <img
            src={productImage}
            alt={product.name}
            loading="lazy"
            className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
          />
        </Link>

        {/* Save Button */}
        <button
          type="button"
          onClick={handleSave}
          aria-label={saved ? "Remove from saved items" : "Save item"}
          aria-pressed={saved}
          className={`
            absolute
            right-2
            top-2
            grid
            h-10
            w-10
            place-items-center
            rounded-full
            bg-white/90
            text-xl
            shadow-sm
            backdrop-blur-sm
            transition-transform
            active:scale-90
            ${saved ? "text-[#bc725d]" : "text-[#35382f] hover:text-[#bc725d]"}
          `}
        >
          {saved ? "♥" : "♡"}
        </button>

        {/* Desktop Add to Bag */}
        <Button
          type="button"
          onClick={handleAdd}
          className="
            absolute
            inset-x-2
            bottom-2
            hidden
            sm:flex
          "
        >
          Add to bag +
        </Button>
      </div>

      {/* Product Information */}
      <div className="pt-3">
        {/* Brand / Seller */}
        <p className="truncate text-[9px] tracking-[0.13em] text-[#999486]">
          {brand}
        </p>

        {/* Product Name */}
        <Link
          to={`/product/${product._id}`}
          className="
            mt-1
            block
            truncate
            text-xs
            font-medium
            hover:underline
            sm:text-sm
          "
        >
          {product.name}
        </Link>

        {/* Price */}
        <p className="mt-1 text-xs font-semibold sm:text-sm">
          {currency(product.price)}
        </p>

        {/* Mobile Add to Bag */}
        <button
          type="button"
          onClick={handleAdd}
          className="
            mt-2
            min-h-10
            w-full
            border
            border-[#dad9d1]
            px-3
            py-2
            text-[9px]
            font-semibold
            uppercase
            tracking-widest
            transition-colors
            active:bg-[#273b32]
            active:text-white
            sm:hidden
          "
        >
          Add to bag +
        </button>
      </div>
    </article>
  );
}
