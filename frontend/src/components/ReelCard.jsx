import Button from "./Button";

export default function ReelCard({
  reel,
  onLike,
  onAdd,
}) {
  const product = reel?.product || {};
  const likeCount = reel?.likes?.length || 0;

  const handleLike = () => {
    onLike?.(reel);
  };

  const handleAdd = () => {
    if (product?._id) {
      onAdd?.(product);
    }
  };

  return (
    <article
      className="
        group
        relative
        w-full
        overflow-hidden
        rounded-lg
        bg-[#e9e5dd]
        text-white
        aspect-[9/16]
        sm:aspect-[9/14]
        md:aspect-[4/6]
        lg:aspect-[9/14]
        xl:aspect-[9/15]
      "
    >
      {/* Reel Video */}
      <video
        src={reel?.videoUrl}
        poster={reel?.thumbnailUrl}
        controls
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

      {/* Bottom Gradient */}
      <div
        className="
          pointer-events-none
          absolute
          inset-x-0
          bottom-0
          bg-gradient-to-t
          from-black/85
          via-black/45
          to-transparent
          px-3
          pb-3
          pt-20
          sm:px-4
          sm:pb-4
          sm:pt-24
          md:pt-28
        "
      >
        {/* Caption */}
        <p
          className="
            line-clamp-2
            text-[11px]
            leading-relaxed
            sm:text-xs
            md:text-sm
          "
        >
          {reel?.caption ||
            "A little look at something lovely"}
        </p>

        {/* Product Name */}
        {product?.name && (
          <p
            className="
              mt-1.5
              truncate
              text-[10px]
              text-white/75
              sm:mt-2
              sm:text-[11px]
              md:text-xs
            "
          >
            {product.name}
          </p>
        )}

        {/* Actions */}
        <div
          className="
            pointer-events-auto
            mt-2
            flex
            w-full
            gap-2
            sm:mt-3
          "
        >
          {/* Like */}
          <Button
            type="button"
            onClick={handleLike}
            variant="light"
            className="
              min-h-9
              flex-1
              px-2
              text-[10px]
              sm:min-h-10
              sm:px-3
              sm:text-xs
            "
          >
            ♡ {likeCount}
          </Button>

          {/* Shop */}
          <Button
            type="button"
            onClick={handleAdd}
            disabled={!product?._id}
            className="
              min-h-9
              flex-1
              px-2
              text-[10px]
              sm:min-h-10
              sm:px-3
              sm:text-xs
            "
          >
            Shop the find
          </Button>
        </div>
      </div>
    </article>
  );
}
