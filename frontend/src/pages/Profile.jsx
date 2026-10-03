import { useState } from "react";

import Button from "../components/Button";
import { Field } from "./Login";
import { Link } from "../components/Router";

export default function Profile({
  user,
  onSave,
  onLogout,
  onNotice,
}) {
  const [form, setForm] = useState({
    name: user?.name || "",
    phone: user?.phone || "",
    bio: user?.bio || "",
    storeName: user?.storeName || "",
  });

  const [isSubmitting, setIsSubmitting] = useState(false);

  const update = (field) => (value) => {
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
      await onSave?.(form);

      onNotice?.("Profile saved ♡");
    } catch (error) {
      console.error("Failed to save profile:", error);

      onNotice?.(
        error.message || "Unable to save your profile."
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleLogout = () => {
    onLogout?.();
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
          Your corner
        </p>

        <h1 className="mt-2 font-serif text-3xl sm:text-4xl">
          My profile
        </h1>
      </header>

      {/* Logged Out State */}
      {!user ? (
        <div className="mt-8 bg-white p-6 shadow-sm sm:p-8">
          <p className="text-sm">
            Sign in to see and update your profile.
          </p>

          <Link
            to="/login"
            className="
              mt-4
              inline-block
              text-sm
              underline
              underline-offset-4
            "
          >
            Sign in →
          </Link>
        </div>
      ) : (
        <>
          {/* Profile Form */}
          <form
            onSubmit={handleSubmit}
            className="
              mt-7
              space-y-5
              bg-white
              p-5
              shadow-sm
              sm:space-y-6
              sm:p-8
            "
          >
            <Field
              label="Name"
              value={form.name}
              onChange={update("name")}
              autoComplete="name"
            />

            <Field
              label="Email address"
              type="email"
              value={user.email || ""}
              onChange={() => {}}
              readOnly
              autoComplete="email"
              className="cursor-not-allowed opacity-60"
            />

            <Field
              label="Phone"
              type="tel"
              required={false}
              value={form.phone}
              onChange={update("phone")}
              autoComplete="tel"
            />

            {/* Seller-only field */}
            {user.role === "seller" && (
              <Field
                label="Shop name"
                value={form.storeName}
                onChange={update("storeName")}
              />
            )}

            {/* Bio */}
            <label className="block text-xs font-medium">
              A little about you

              <textarea
                value={form.bio}
                onChange={(event) =>
                  update("bio")(event.target.value)
                }
                rows={4}
                maxLength={500}
                placeholder="Tell people a little about yourself..."
                className="
                  mt-2
                  min-h-28
                  w-full
                  resize-y
                  border
                  border-[#deddd5]
                  bg-[#fbfaf7]
                  p-3
                  text-sm
                  leading-6
                  outline-none
                  transition-colors
                  focus:border-[#82927b]
                  focus:ring-1
                  focus:ring-[#82927b]/20
                "
              />

              <span className="mt-1 block text-right text-[10px] text-[#999486]">
                {form.bio.length}/500
              </span>
            </label>

            {/* Actions */}
            <div className="flex flex-col gap-3 pt-1 sm:flex-row">
              <Button
                type="submit"
                disabled={isSubmitting}
                className="w-full sm:w-auto"
              >
                {isSubmitting
                  ? "Saving..."
                  : "Save changes"}
              </Button>

              <Button
                type="button"
                variant="light"
                onClick={handleLogout}
                disabled={isSubmitting}
                className="w-full sm:w-auto"
              >
                Sign out
              </Button>
            </div>
          </form>

          {/* Seller Profile */}
          {user.role === "seller" && (
            <Link
              to={`/seller/${user.id || user._id}`}
              className="
                mt-4
                inline-block
                text-xs
                underline
                underline-offset-4
                transition-opacity
                hover:opacity-60
              "
            >
              View my public shop profile →
            </Link>
          )}
        </>
      )}
    </main>
  );
}
