import { useState } from "react";

import Button from "../components/Button";
import { Link } from "../components/Router";
import { AuthShell, Field } from "./Login";

export default function Register({
  onRegister,
  onNotice,
}) {
  const [form, setForm] = useState(() => {
    const params = new URLSearchParams(
      window.location.search
    );

    const isSeller = params.get("seller") === "1";

    return {
      name: "",
      email: "",
      password: "",
      role: isSeller ? "seller" : "user",
      storeName: "",
    };
  });

  const [isSubmitting, setIsSubmitting] = useState(false);

  const updateField = (field) => (value) => {
    setForm((previousForm) => ({
      ...previousForm,
      [field]: value,
    }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (isSubmitting) {
      return;
    }

    if (
      form.role === "seller" &&
      form.storeName.trim().length < 2
    ) {
      onNotice?.(
        "Shop name must contain at least 2 characters."
      );
      return;
    }

    setIsSubmitting(true);

    try {
      await onRegister({
        ...form,
        name: form.name.trim(),
        email: form.email.trim().toLowerCase(),
        storeName: form.storeName.trim(),
      });
    } catch (error) {
      console.error("Registration failed:", error);

      onNotice?.(
        error.message ||
          "Unable to create your account. Please try again."
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  const isSeller = form.role === "seller";

  return (
    <AuthShell
      title={isSeller ? "Open your shop" : "Come on in"}
      subtitle={
        isSeller
          ? "Create your seller account and let your shop be found."
          : "Make room for a few good finds."
      }
    >
      <form
        onSubmit={handleSubmit}
        className="space-y-5"
      >
        {/* Name */}
        <Field
          label="Your name"
          value={form.name}
          onChange={updateField("name")}
          autoComplete="name"
        />

        {/* Email */}
        <Field
          label="Email address"
          type="email"
          value={form.email}
          onChange={updateField("email")}
          autoComplete="email"
        />

        {/* Password */}
        <Field
          label="Password"
          type="password"
          minLength={6}
          value={form.password}
          onChange={updateField("password")}
          autoComplete="new-password"
        />

        {/* Account Type */}
        <label className="block text-xs font-medium">
          I’m here as

          <select
            value={form.role}
            onChange={(event) =>
              updateField("role")(event.target.value)
            }
            disabled={isSubmitting}
            className="
              mt-2
              h-11
              w-full
              border
              border-[#deddd5]
              bg-[#fbfaf7]
              px-3
              text-sm
              outline-none
              transition-colors
              focus:border-[#82927b]
              disabled:cursor-not-allowed
              disabled:opacity-60
            "
          >
            <option value="user">
              A shopper
            </option>

            <option value="seller">
              A seller
            </option>
          </select>
        </label>

        {/* Seller Shop Name */}
        {isSeller && (
          <Field
            label="Shop name"
            value={form.storeName}
            onChange={updateField("storeName")}
            minLength={2}
            maxLength={100}
            autoComplete="organization"
          />
        )}

        {/* Submit */}
        <Button
          type="submit"
          disabled={isSubmitting}
          className="w-full"
        >
          {isSubmitting
            ? "Creating account..."
            : isSeller
              ? "Create my seller account"
              : "Create account"}
        </Button>
      </form>

      {/* Login Link */}
      <p className="mt-5 text-center text-xs text-[#777970]">
        Already part of the good stuff?{" "}
        <Link
          to="/login"
          className="underline underline-offset-4"
        >
          Sign in
        </Link>
      </p>
    </AuthShell>
  );
}
