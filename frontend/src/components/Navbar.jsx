import { useState } from "react";
import { Link } from "./Router.jsx";

export default function Navbar({
  cartCount = 0,
  savedCount = 0,
  onSaved,
  onSearch,
  user,
}) {
  const [menu, setMenu] = useState(false);

  const isSeller = user?.role === "seller";

  const closeMenu = () => {
    setMenu(false);
  };

  return (
    <>
      {/* Promotional Banner */}
      <div
        className="
          hidden
          bg-[#273b32]
          px-2
          py-2
          text-center
          text-[7px]
          leading-tight
          tracking-[0.08em]
          text-white
          lg:block
          sm:px-3
          sm:text-[9px]
          sm:tracking-[0.14em]
        "
      >
        <span>
          A LITTLE SOMETHING FOR YOUR FIRST ORDER
        </span>

        <span className="mx-1 text-[#c9a980] sm:mx-2">
          —
        </span>

        <span>
          TAKE 10% OFF WITH{" "}
          <b className="text-[#e4cba8]">
            HELLO10
          </b>
        </span>
      </div>

      {/* Navbar */}
      <header
        className="
          hidden
          sticky
          top-0
          z-40
          border-b
          border-[#e9e6df]
          bg-[#fbfaf7]/95
          backdrop-blur
          lg:block
        "
      >
        <div
          className="
            relative
            mx-auto
            flex
            h-14
            w-full
            max-w-7xl
            items-center
            justify-between
            px-3

            sm:h-16
            sm:px-6

            lg:h-[68px]
            lg:px-8
          "
        >
          {/* Mobile Menu Button */}
          <button
            type="button"
            onClick={() =>
              setMenu((previous) => !previous)
            }
            aria-label={
              menu
                ? "Close menu"
                : "Open menu"
            }
            aria-expanded={menu}
            className="
              grid
              h-9
              w-9
              shrink-0
              place-items-center
              text-xl
              leading-none
              transition-opacity
              hover:opacity-60
              lg:hidden
            "
          >
            {menu ? "×" : "☰"}
          </button>

          {/* Desktop Navigation */}
          <nav
            className="
              hidden
              items-center
              gap-5
              text-[10px]
              font-semibold
              uppercase
              tracking-widest

              lg:flex
              lg:gap-6
            "
          >
            <Link to="/">Home</Link>

            <Link to="/explore">
              Explore
            </Link>

            <Link to="/reels">
              Reels
            </Link>

            <Link to="/become-seller">
              Become a seller
            </Link>
          </nav>

          {/* Logo */}
          <Link
            to="/"
            aria-label="Shopinsta home"
            className="
              absolute
              left-1/2
              -translate-x-1/2
              whitespace-nowrap
              text-[19px]
              font-semibold
              tracking-[-0.08em]

              sm:text-[23px]

              lg:text-[26px]
            "
          >
            shop
            <span className="text-[#87977d]">
              insta
            </span>
            <span className="text-[#bc8962]">
              .
            </span>
          </Link>

          {/* Right Actions */}
          <div
            className="
              ml-auto
              flex
              items-center
              gap-0

              sm:gap-1

              lg:gap-2
            "
          >
            {/* Search */}
            <button
              type="button"
              onClick={onSearch}
              aria-label="Search"
              className="
                hidden
                h-9
                w-9
                place-items-center
                text-lg
                transition-opacity
                hover:opacity-60

                sm:grid
              "
            >
              ⌕
            </button>

            {/* Saved Items */}
            <button
              type="button"
              onClick={onSaved}
              aria-label={`Saved items${
                savedCount > 0
                  ? `, ${savedCount} items`
                  : ""
              }`}
              className="
                relative
                grid
                h-9
                w-9
                shrink-0
                place-items-center
                text-lg
                transition-opacity
                hover:opacity-60
              "
            >
              ♡

              {savedCount > 0 && (
                <span
                  className="
                    absolute
                    right-0
                    top-0
                    grid
                    h-4
                    min-w-4
                    place-items-center
                    rounded-full
                    bg-[#bc725d]
                    px-1
                    text-[8px]
                    font-semibold
                    text-white
                  "
                >
                  {savedCount > 99
                    ? "99+"
                    : savedCount}
                </span>
              )}
            </button>

            {/* Profile */}
            <Link
              to={
                user
                  ? "/profile"
                  : "/login"
              }
              aria-label={
                user
                  ? "Profile"
                  : "Login"
              }
              className="
                hidden
                h-9
                w-9
                shrink-0
                place-items-center
                text-lg
                transition-opacity
                hover:opacity-60

                sm:grid
              "
            >
              ◎
            </Link>

            {/* Cart */}
            <Link
              to="/cart"
              aria-label={`Cart${
                cartCount > 0
                  ? `, ${cartCount} items`
                  : ""
              }`}
              className="
                relative
                grid
                h-9
                w-9
                shrink-0
                place-items-center
                text-lg
                transition-opacity
                hover:opacity-60
              "
            >
              ♧

              {cartCount > 0 && (
                <span
                  className="
                    absolute
                    right-0
                    top-0
                    grid
                    h-4
                    min-w-4
                    place-items-center
                    rounded-full
                    bg-[#273b32]
                    px-1
                    text-[8px]
                    font-semibold
                    text-white
                  "
                >
                  {cartCount > 99
                    ? "99+"
                    : cartCount}
                </span>
              )}
            </Link>
          </div>
        </div>

        {/* Mobile Navigation */}
        {menu && (
          <nav
            className="
              border-t
              border-[#e9e6df]
              bg-[#fbfaf7]
              px-5
              py-5

              sm:px-8

              lg:hidden
            "
          >
            <div
              className="
                flex
                flex-col
                gap-1
                text-[11px]
                font-semibold
                uppercase
                tracking-[0.14em]
              "
            >
              <Link
                onClick={closeMenu}
                to="/"
                className="
                  border-b
                  border-[#eeeae2]
                  py-3
                "
              >
                Home
              </Link>

              <Link
                onClick={closeMenu}
                to="/explore"
                className="
                  border-b
                  border-[#eeeae2]
                  py-3
                "
              >
                Explore products
              </Link>

              <Link
                onClick={closeMenu}
                to="/reels"
                className="
                  border-b
                  border-[#eeeae2]
                  py-3
                "
              >
                Product reels
              </Link>

              <Link
                onClick={closeMenu}
                to="/orders"
                className="
                  border-b
                  border-[#eeeae2]
                  py-3
                "
              >
                My orders
              </Link>

              <Link
                onClick={closeMenu}
                to="/profile"
                className="
                  border-b
                  border-[#eeeae2]
                  py-3
                "
              >
                My profile
              </Link>

              <Link
                onClick={closeMenu}
                to={
                  isSeller
                    ? "/seller"
                    : "/become-seller"
                }
                className="
                  py-3
                  text-[#87977d]
                "
              >
                {isSeller
                  ? "Seller studio"
                  : "Become a seller"}
              </Link>
            </div>
          </nav>
        )}
      </header>
    </>
  );
}
