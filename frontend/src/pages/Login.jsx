import { useState } from "react";

import Button from "../components/Button";
import { Link } from "../components/Router";

export default function Login({ onLogin, onNotice }) {
  const [form, setForm] = useState({
    email: "",
    password: "",
  });

  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleChange = (field) => (value) => {
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

    setIsSubmitting(true);

    try {
      await onLogin(form);
    } catch (error) {
      console.error("Login failed:", error);

      onNotice?.(
        error.message || "Unable to sign in. Please try again."
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <AuthShell
      title="Welcome back"
      subtitle="Your next lovely find is waiting."
    >
      <form
        onSubmit={handleSubmit}
        className="space-y-4"
      >
        {/* Email */}
        <Field
          label="Email address"
          type="email"
          value={form.email}
          onChange={handleChange("email")}
          autoComplete="email"
        />

        {/* Password */}
        <Field
          label="Password"
          type="password"
          value={form.password}
          onChange={handleChange("password")}
          autoComplete="current-password"
        />

        {/* Submit */}
        <Button
          type="submit"
          disabled={isSubmitting}
          className="w-full"
        >
          {isSubmitting ? "Signing in..." : "Sign in"}
        </Button>
      </form>

      <p className="mt-5 text-center text-xs text-[#777970]">
        New around here?{" "}
        <Link
          to="/register"
          className="font-semibold text-[#293c33] underline underline-offset-4"
        >
          Create an account
        </Link>
      </p>
    </AuthShell>
  );
}

export function AuthShell({
  title,
  subtitle,
  children,
}) {
  return (
    <main
      className="
        grid
        min-h-[75vh]
        place-items-center
        px-4
        py-10
        sm:py-14
      "
    >
      <section
        className="
          w-full
          max-w-md
          bg-white
          p-6
          shadow-sm
          sm:p-10
        "
      >
        {/* Brand */}
        <p
          className="
            text-center
            text-[9px]
            font-semibold
            uppercase
            tracking-[0.2em]
            text-[#9b8c77]
          "
        >
          SHOPINSTA ACCOUNT
        </p>

        {/* Title */}
        <h1
          className="
            mt-3
            text-center
            font-serif
            text-3xl
            sm:text-4xl
          "
        >
          {title}
        </h1>

        {/* Subtitle */}
        <p
          className="
            mb-7
            mt-2
            text-center
            text-xs
            leading-5
            text-[#777970]
          "
        >
          {subtitle}
        </p>

        {children}
      </section>
    </main>
  );
}

export function Field({
  label,
  value,
  onChange,
  type = "text",
  required = true,
  ...props
}) {
  return (
    <label className="block text-xs font-medium">
      {label}

      <input
        type={type}
        value={value}
        required={required}
        onChange={(event) =>
          onChange(event.target.value)
        }
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
          focus:ring-1
          focus:ring-[#82927b]/20
          disabled:cursor-not-allowed
          disabled:opacity-60
        "
        {...props}
      />
    </label>
  );
}
