import { useEffect, useState } from "react"

import { api } from "../services/api";
import Button from "../components/Button";
import { Field } from "./Login";

export default function AddReel({ onNotice, onDone }) {
  const [products, setProducts] = useState([]);
  const [isLoadingProducts, setIsLoadingProducts] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [form, setForm] = useState({
    product: "",
    video: null,
    thumbnail: null,
    caption: "",
  });

  // Load seller's products
  useEffect(() => {
    const loadProducts = async () => {
      try {
        const data = await api("/products/seller/my-products");

        setProducts(data.products || []);
      } catch (error) {
        console.error("Failed to load products:", error);

        setProducts([]);

        onNotice?.("Unable to load your products.");
      } finally {
        setIsLoadingProducts(false);
      }
    };

    loadProducts();
  }, [onNotice]);

  // Update form fields
  const handleChange = (field) => (value) => {
    setForm((previousForm) => ({
      ...previousForm,
      [field]: value,
    }));
  };

  // Handle product selection
  const handleProductChange = (event) => {
    setForm((previousForm) => ({
      ...previousForm,
      product: event.target.value,
    }));
  };

  // Submit reel
  const handleSubmit = async (event) => {
    event.preventDefault();

    if (isSubmitting) {
      return;
    }

    setIsSubmitting(true);

    try {
      const reelData = new FormData();
      reelData.append("product", form.product);
      reelData.append("caption", form.caption);
      reelData.append("video", form.video);
      if (form.thumbnail) reelData.append("thumbnail", form.thumbnail);

      await api("/reels", {
        method: "POST",
        body: reelData,
      });

      onNotice?.("Your reel is up ♡");

      onDone?.();
    } catch (error) {
      console.error("Failed to publish reel:", error);

      onNotice?.(
        error.message || "Failed to publish reel."
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <main
      className="
        mx-auto
        min-h-[65vh]
        max-w-3xl
        px-4
        py-8
        sm:px-8
        sm:py-16
      "
    >
      {/* Page Header */}
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
          Seller studio
        </p>

        <h1 className="mt-2 font-serif text-3xl sm:text-4xl">
          Share a reel
        </h1>

        <p className="mt-2 max-w-xl text-sm text-[#777970]">
          Create a short video showcasing one of your
          products.
        </p>
      </div>

      {/* Reel Form */}
      <form
        onSubmit={handleSubmit}
        className="
          mt-7
          space-y-5
          bg-white
          p-4
          shadow-sm
          sm:space-y-6
          sm:p-8
        "
      >
        {/* Featured Product */}
        <label className="block text-xs font-medium">
          Featured product

          <select
            required
            value={form.product}
            onChange={handleProductChange}
            disabled={isLoadingProducts || isSubmitting}
            className="
              mt-2
              h-11
              w-full
              border
              border-[#dad9d1]
              bg-[#fbfaf7]
              px-3
              text-sm
              outline-none
              focus:border-[#273b32]
              disabled:cursor-not-allowed
              disabled:opacity-60
            "
          >
            <option value="">
              {isLoadingProducts
                ? "Loading products..."
                : "Choose a product"}
            </option>

            {!isLoadingProducts &&
              products.map((product) => (
                <option
                  key={product._id}
                  value={product._id}
                >
                  {product.name}
                </option>
              ))}
          </select>

          {!isLoadingProducts && products.length === 0 && (
            <p className="mt-2 text-xs text-[#a84d42]">
              You need to create a product before publishing
              a reel.
            </p>
          )}
        </label>

        <label className="block text-xs font-medium">
          Reel video <span className="font-normal text-[#888]">(up to 50 MB)</span>
          <input type="file" accept="video/*" required onChange={(event) => setForm((current) => ({ ...current, video: event.target.files?.[0] || null }))} className="mt-2 block w-full text-sm" />
          {form.video && <span className="mt-1 block text-xs text-[#777970]">{form.video.name}</span>}
        </label>

        <label className="block text-xs font-medium">
          Thumbnail image <span className="font-normal text-[#888]">(optional, 5 MB maximum)</span>
          <input type="file" accept="image/*" onChange={(event) => setForm((current) => ({ ...current, thumbnail: event.target.files?.[0] || null }))} className="mt-2 block w-full text-sm" />
        </label>

        {/* Caption */}
        <label className="block text-xs font-medium">
          Caption

          <textarea
            maxLength={500}
            value={form.caption}
            onChange={(event) =>
              handleChange("caption")(event.target.value)
            }
            rows={4}
            placeholder="Tell people what makes this product special..."
            className="
              mt-2
              min-h-28
              w-full
              resize-y
              border
              border-[#dad9d1]
              bg-[#fbfaf7]
              p-3
              text-sm
              outline-none
              focus:border-[#273b32]
            "
          />

          <span className="mt-1 block text-right text-[10px] text-[#999486]">
            {form.caption.length}/500
          </span>
        </label>

        {/* Submit */}
        <Button
          type="submit"
          disabled={
            isSubmitting ||
            isLoadingProducts ||
            products.length === 0
          }
          className="w-full sm:w-auto"
        >
          {isSubmitting
            ? "Publishing..."
            : "Publish reel"}
        </Button>
      </form>
    </main>
  );
}
