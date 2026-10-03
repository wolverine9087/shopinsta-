import { useEffect, useState } from "react";

import { api } from "../services/api";
import Button from "../components/Button";
import { Field } from "./Login";

export default function AddProduct({ onNotice, onDone }) {
  const [categories, setCategories] = useState([]);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [form, setForm] = useState({
    name: "",
    description: "",
    price: "",
    stock: "",
    category: "",
    images: [],
  });

  // Fetch categories
  useEffect(() => {
    const loadCategories = async () => {
      try {
        const data = await api("/categories");

        setCategories(data.categories || []);
      } catch (error) {
        console.error("Failed to load categories:", error);

        setCategories([]);
        onNotice?.("Unable to load categories.");
      }
    };

    loadCategories();
  }, [onNotice]);

  // Update form fields
  const handleChange = (field) => (value) => {
    setForm((previousForm) => ({
      ...previousForm,
      [field]: value,
    }));
  };

  // Handle category change
  const handleCategoryChange = (event) => {
    setForm((previousForm) => ({
      ...previousForm,
      category: event.target.value,
    }));
  };

  // Submit product
  const handleSubmit = async (event) => {
    event.preventDefault();

    if (isSubmitting) {
      return;
    }

    setIsSubmitting(true);

    try {
      const productData = new FormData();
      productData.append("name", form.name);
      productData.append("description", form.description);
      productData.append("price", form.price);
      productData.append("stock", form.stock);
      productData.append("category", form.category);
      form.images.forEach((image) => productData.append("images", image));

      await api("/products", {
        method: "POST",
        body: productData,
      });

      onNotice?.("Your product is live ♡");

      onDone?.();
    } catch (error) {
      console.error("Failed to create product:", error);

      onNotice?.(
        error.message || "Failed to publish product."
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
          Add a good find
        </h1>
      </div>

      {/* Product Form */}
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
        {/* Product Name */}
        <Field
          label="Product name"
          value={form.name}
          onChange={handleChange("name")}
          required
        />

        {/* Category */}
        <label className="block text-xs font-medium">
          Category

          <select
            required
            value={form.category}
            onChange={handleCategoryChange}
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
            "
          >
            <option value="">
              Choose a category
            </option>

            {categories.map((category) => (
              <option
                key={category._id}
                value={category._id}
              >
                {category.name}
              </option>
            ))}
          </select>
        </label>

        {/* Description */}
        <label className="block text-xs font-medium">
          Description

          <textarea
            required
            minLength={10}
            value={form.description}
            onChange={(event) =>
              handleChange("description")(
                event.target.value
              )
            }
            rows={4}
            placeholder="Describe your product..."
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
        </label>

        {/* Price and Stock */}
        <div className="grid gap-4 sm:grid-cols-2">
          <Field
            label="Price (₹)"
            type="number"
            min="0"
            step="0.01"
            value={form.price}
            onChange={handleChange("price")}
            required
          />

          <Field
            label="Stock"
            type="number"
            min="0"
            step="1"
            value={form.stock}
            onChange={handleChange("stock")}
            required
          />
        </div>

        <label className="block text-xs font-medium">
          Product photos <span className="font-normal text-[#888]">(up to 5 images, 5 MB each)</span>
          <input
            type="file"
            accept="image/*"
            multiple
            required
            onChange={(event) => setForm((current) => ({ ...current, images: Array.from(event.target.files || []).slice(0, 5) }))}
            className="mt-2 block w-full text-sm"
          />
          {form.images.length > 0 && <span className="mt-1 block text-xs text-[#777970]">{form.images.map((image) => image.name).join(", ")}</span>}
        </label>

        {/* Submit */}
        <Button
          type="submit"
          disabled={isSubmitting}
          className="w-full sm:w-auto"
        >
          {isSubmitting
            ? "Publishing..."
            : "Publish product"}
        </Button>
      </form>
    </main>
  );
}
