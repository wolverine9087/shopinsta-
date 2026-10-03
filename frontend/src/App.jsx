import { useEffect, useMemo, useState } from "react";

import { AuthProvider, useAuth } from "./context/AuthContext";
import { products as sampleProducts } from "./data";
import { api } from "./services/api";
import {
  currency,
  getErrorMessage,
} from "./utils/helpers";

import Navbar from "./components/Navbar";
import Button from "./components/Button";
import {
  Link,
  navigate,
  usePath,
} from "./components/Router";

import Home from "./pages/Home";
import ProductDetail from "./pages/ProductDetail";
import Cart from "./pages/Cart";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Orders from "./pages/Orders";
import Profile from "./pages/Profile";
import SellerDashboard from "./pages/SellerDashboard";
import AddProduct from "./pages/AddProduct";
import AddReel from "./pages/AddReel";
import Saved from "./pages/Saved";
import Explore from "./pages/Explore";
import Reels from "./pages/Reels";
import SellerProfile from "./pages/SellerProfile";
import BecomeSeller from "./pages/BecomeSeller";

function Checkout({
  cart,
  onClose,
  onComplete,
  user,
}) {
  const [fields, setFields] = useState({
    name: user?.name || "",
    phone: user?.phone || "",
    address: "",
    city: "",
    state: "",
    pincode: "",
  });

  const [busy, setBusy] = useState(false);

  const set = (key) => (event) => {
    setFields((previousFields) => ({
      ...previousFields,
      [key]: event.target.value,
    }));
  };

  const place = async (event) => {
    event.preventDefault();

    if (busy) {
      return;
    }

    setBusy(true);

    try {
      for (const item of cart) {
        await api("/orders", {
          method: "POST",
          body: {
            productId: item._id,
            quantity: item.quantity,
            shippingAddress: fields,
          },
        });
      }

      onComplete();
    } catch (error) {
      window.dispatchEvent(
        new CustomEvent("shopinsta:notice", {
          detail: getErrorMessage(error),
        })
      );
    } finally {
      setBusy(false);
    }
  };

  const total = cart.reduce(
    (sum, item) =>
      sum + item.price * item.quantity,
    0
  );

  const fieldsConfig = [
    ["name", "Full name"],
    ["phone", "Phone (10 digits)"],
    ["address", "Street address"],
    ["city", "City"],
    ["state", "State"],
    ["pincode", "PIN code (6 digits)"],
  ];

  return (
    <div className="fixed inset-0 z-50 grid place-items-center bg-black/40 p-4">
      <section className="max-h-[90vh] w-full max-w-xl overflow-auto bg-[#fbfaf7] p-5 sm:p-8">
        <div className="flex justify-between">
          <div>
            <p className="text-[9px] uppercase tracking-widest text-[#8d907f]">
              Almost yours
            </p>

            <h2 className="font-serif text-3xl">
              Delivery details
            </h2>
          </div>

          <button
            type="button"
            onClick={onClose}
            aria-label="Close checkout"
            className="text-2xl"
          >
            ×
          </button>
        </div>

        <form
          onSubmit={place}
          className="mt-6 grid gap-4 sm:grid-cols-2"
        >
          {fieldsConfig.map(
            ([key, label]) => (
              <label
                key={key}
                className={`text-xs font-medium ${
                  key === "address"
                    ? "sm:col-span-2"
                    : ""
                }`}
              >
                {label}

                <input
                  required
                  value={fields[key]}
                  onChange={set(key)}
                  pattern={
                    key === "phone"
                      ? "[0-9]{10}"
                      : key === "pincode"
                        ? "[0-9]{6}"
                        : undefined
                  }
                  className="mt-2 h-11 w-full border border-[#deddd5] bg-white px-3 text-sm outline-none focus:border-[#82927b]"
                />
              </label>
            )
          )}

          <p className="text-xs text-[#777970] sm:col-span-2">
            Cash on delivery · Total{" "}
            {currency(total)}
          </p>

          <Button
            type="submit"
            disabled={busy}
            className="sm:col-span-2"
          >
            {busy
              ? "Placing your order…"
              : "Place order"}
          </Button>
        </form>
      </section>
    </div>
  );
}

function Storefront() {
  const path = usePath();

  const {
    user,
    login,
    logout,
  } = useAuth();

  const [products, setProducts] =
    useState(sampleProducts);
  const [productPage, setProductPage] = useState(1);
  const [hasMoreProducts, setHasMoreProducts] = useState(false);
  const [loadingMoreProducts, setLoadingMoreProducts] = useState(false);

  const [cart, setCart] = useState(() => {
    try {
      return (
        JSON.parse(
          localStorage.getItem("shopinsta-cart")
        ) || []
      );
    } catch {
      return [];
    }
  });

  const [saved, setSaved] = useState(() => {
    try {
      return (
        JSON.parse(
          localStorage.getItem("shopinsta-saved")
        ) || []
      );
    } catch {
      return [];
    }
  });

  const [orders, setOrders] = useState([]);
  const [notice, setNotice] = useState("");
  const [checkout, setCheckout] =
    useState(false);
  const [product, setProduct] = useState(null);

  const cartCount = cart.reduce(
    (sum, item) => sum + item.quantity,
    0
  );

  const notify = (message) => {
    setNotice(message);

    window.clearTimeout(notify.timer);

    notify.timer = window.setTimeout(() => {
      setNotice("");
    }, 2600);
  };

  const addToCart = (
    item,
    quantity = 1
  ) => {
    if (!item?._id) {
      notify(
        "This product is unavailable right now."
      );
      return;
    }

    setCart((oldCart) => {
      const existing = oldCart.find(
        (product) =>
          product._id === item._id
      );

      const nextCart = existing
        ? oldCart.map((product) =>
            product._id === item._id
              ? {
                  ...product,
                  quantity:
                    product.quantity +
                    quantity,
                }
              : product
          )
        : [
            ...oldCart,
            {
              ...item,
              quantity,
            },
          ];

      localStorage.setItem(
        "shopinsta-cart",
        JSON.stringify(nextCart)
      );

      return nextCart;
    });

    notify(
      `${item.name} added to your bag ♡`
    );
  };

  const saveItem = (item) => {
    setSaved((oldSaved) => {
      const exists = oldSaved.some(
        (product) =>
          product._id === item._id
      );

      const nextSaved = exists
        ? oldSaved.filter(
            (product) =>
              product._id !== item._id
          )
        : [...oldSaved, item];

      localStorage.setItem(
        "shopinsta-saved",
        JSON.stringify(nextSaved)
      );

      notify(
        exists
          ? "Removed from saved finds"
          : "Saved for later ♡"
      );

      return nextSaved;
    });
  };

  // Load products
  useEffect(() => {
    api("/products?page=1&limit=20")
      .then((data) => {
        if (data.products?.length) {
          setProducts(data.products);
        }
        setProductPage(Number(data.page) || 1);
        setHasMoreProducts(
          Number(data.page) < Number(data.pages)
        );
      })
      .catch(() => {});
  }, []);

  const loadMoreProducts = async () => {
    if (loadingMoreProducts || !hasMoreProducts) return;

    setLoadingMoreProducts(true);
    try {
      const data = await api(
        `/products?page=${productPage + 1}&limit=20`
      );
      const nextProducts = data.products || [];
      setProducts((current) => {
        const existingIds = new Set(current.map((item) => item._id));
        return [
          ...current,
          ...nextProducts.filter((item) => !existingIds.has(item._id)),
        ];
      });
      setProductPage(Number(data.page) || productPage + 1);
      setHasMoreProducts(
        Number(data.page) < Number(data.pages)
      );
    } catch (error) {
      notify(error.message || "Unable to load older products.");
    } finally {
      setLoadingMoreProducts(false);
    }
  };

  // Checkout and notification events
  useEffect(() => {
    const onCheckout = () => {
      setCheckout(true);
    };

    const onNotice = (event) => {
      notify(event.detail);
    };

    window.addEventListener(
      "shopinsta:checkout",
      onCheckout
    );

    window.addEventListener(
      "shopinsta:notice",
      onNotice
    );

    return () => {
      window.removeEventListener(
        "shopinsta:checkout",
        onCheckout
      );

      window.removeEventListener(
        "shopinsta:notice",
        onNotice
      );
    };
  }, []);

  // Load orders
  useEffect(() => {
    if (path !== "/orders" || !user) {
      return;
    }

    api("/orders/my-orders")
      .then((data) => {
        setOrders(data.orders || []);
      })
      .catch((error) => {
        notify(error.message);
      });
  }, [path, user]);

  // Load product details
  useEffect(() => {
    const match = path.match(
      /^\/product\/([^/]+)/
    );

    if (!match) {
      setProduct(null);
      return;
    }

    const productId = match[1];

    setProduct(
      products.find(
        (item) => item._id === productId
      ) || null
    );

    api(`/products/${productId}`)
      .then((data) => {
        setProduct(data.product || null);
      })
      .catch(() => {});
  }, [path, products]);

  // Save profile
  const saveProfile = (fields) =>
    api("/users/profile", {
      method: "PATCH",
      body: fields,
    }).then((data) => {
      if (data.user) {
        login({
          ...user,
          ...data.user,
        });
      }
    });

  // Login / Register
  const authAction = async (
    endpoint,
    fields
  ) => {
    const data = await api(endpoint, {
      method: "POST",
      body: fields,
    });

    if (
      endpoint === "/auth/register" &&
      fields.role === "seller" &&
      fields.storeName
    ) {
      try {
        await api("/sellers/profile", {
          method: "PATCH",
          body: {
            storeName: fields.storeName,
          },
        });
      } catch {
        notify(
          "Account created. Add your shop name in your seller profile."
        );
      }
    }

    login(data.user);

    navigate(
      fields.role === "seller"
        ? "/seller"
        : "/"
    );

    notify(
      `Welcome${
        data.user?.name
          ? `, ${data.user.name}`
          : ""
      } ♡`
    );
  };

  const completeOrder = () => {
    setCheckout(false);
    setCart([]);

    localStorage.removeItem(
      "shopinsta-cart"
    );

    notify(
      "Order placed. Thank you for finding us ♡"
    );

    navigate("/orders");
  };

  const content = useMemo(() => {
    if (path === "/") {
      return (
        <Home
          products={products}
          saved={saved}
          onSave={saveItem}
          onAdd={addToCart}
        />
      );
    }

    if (path === "/explore") {
      return (
        <Explore
          products={products}
          saved={saved}
          onSave={saveItem}
          onAdd={addToCart}
          hasMoreProducts={hasMoreProducts}
          loadingMoreProducts={loadingMoreProducts}
          onLoadMore={loadMoreProducts}
        />
      );
    }

    if (path === "/reels") {
      return (
        <Reels
          user={user}
          onAdd={addToCart}
          onNotice={notify}
        />
      );
    }

    if (path === "/become-seller") {
      return (
        <BecomeSeller
          user={user}
          onBecome={(updatedUser) => {
            login(updatedUser);
            navigate("/seller");
            notify(
              "Your seller shop is ready ♡"
            );
          }}
          onNotice={notify}
        />
      );
    }

    if (path === "/cart") {
      return (
        <Cart
          cart={cart}
          onQuantity={(id, quantity) =>
            setCart((oldCart) => {
              const nextCart =
                quantity < 1
                  ? oldCart.filter(
                      (item) =>
                        item._id !== id
                    )
                  : oldCart.map((item) =>
                      item._id === id
                        ? {
                            ...item,
                            quantity,
                          }
                        : item
                    );

              localStorage.setItem(
                "shopinsta-cart",
                JSON.stringify(nextCart)
              );

              return nextCart;
            })
          }
          onRemove={(id) =>
            setCart((oldCart) => {
              const nextCart =
                oldCart.filter(
                  (item) =>
                    item._id !== id
                );

              localStorage.setItem(
                "shopinsta-cart",
                JSON.stringify(nextCart)
              );

              return nextCart;
            })
          }
        />
      );
    }

    if (path === "/saved") {
      return (
        <Saved
          items={saved}
          onSave={saveItem}
          onAdd={addToCart}
        />
      );
    }

    if (path === "/login") {
      return (
        <Login
          onLogin={(fields) =>
            authAction(
              "/auth/login",
              fields
            )
          }
          onNotice={notify}
        />
      );
    }

    if (path === "/register") {
      return (
        <Register
          onRegister={(fields) =>
            authAction(
              "/auth/register",
              fields
            )
          }
          onNotice={notify}
        />
      );
    }

    if (path === "/orders") {
      return user ? (
        <Orders orders={orders} />
      ) : (
        <Login
          onLogin={(fields) =>
            authAction(
              "/auth/login",
              fields
            )
          }
          onNotice={notify}
        />
      );
    }

    if (path === "/profile") {
      return (
        <Profile
          user={user}
          onSave={saveProfile}
          onLogout={() => {
            api("/auth/logout", {
              method: "POST",
            }).catch(() => {});

            logout();
            navigate("/");
            notify("You've signed out");
          }}
          onNotice={notify}
        />
      );
    }

    if (path === "/seller") {
      return user?.role === "seller" ? (
        <SellerDashboard
          onNotice={notify}
        />
      ) : (
        <Login
          onLogin={(fields) =>
            authAction(
              "/auth/login",
              fields
            )
          }
          onNotice={notify}
        />
      );
    }

    if (path === "/seller/add-product") {
      return user?.role === "seller" ? (
        <AddProduct
          onNotice={notify}
          onDone={() =>
            navigate("/seller")
          }
        />
      ) : (
        <Login
          onLogin={(fields) =>
            authAction(
              "/auth/login",
              fields
            )
          }
          onNotice={notify}
        />
      );
    }

    if (path === "/seller/add-reel") {
      return user?.role === "seller" ? (
        <AddReel
          onNotice={notify}
          onDone={() =>
            navigate("/seller")
          }
        />
      ) : (
        <Login
          onLogin={(fields) =>
            authAction(
              "/auth/login",
              fields
            )
          }
          onNotice={notify}
        />
      );
    }

    if (
      path.match(/^\/seller\/[^/]+$/)
    ) {
      return (
        <SellerProfile
          id={path.split("/")[2]}
          saved={saved}
          onAdd={addToCart}
          onSave={saveItem}
          onNotice={notify}
        />
      );
    }

    if (path.startsWith("/product/")) {
      return (
        <ProductDetail
          product={product}
          onAdd={addToCart}
          onSave={saveItem}
        />
      );
    }

    return (
      <section className="mx-auto min-h-[65vh] max-w-4xl px-4 py-24 text-center">
        <h1 className="font-serif text-5xl">
          That page wandered off.
        </h1>

        <Link
          to="/"
          className="mt-5 inline-block underline"
        >
          Back to the good finds →
        </Link>
      </section>
    );
  }, [
    path,
    products,
    saved,
    cart,
    user,
    orders,
    product,
    hasMoreProducts,
    loadingMoreProducts,
  ]);

  return (
    <div className="min-h-screen bg-[#fbfaf7] text-[#272923]">
      <Navbar
        user={user}
        cartCount={cartCount}
        savedCount={saved.length}
        onSaved={() =>
          navigate("/saved")
        }
        onSearch={() =>
          navigate("/explore")
        }
      />

      {content}

      {path !== "/reels" && <footer
        id="about"
        className="bg-[#f1efe9] px-4 py-9 pb-24 sm:px-8 sm:pb-9"
      >
        <div className="mx-auto grid max-w-7xl gap-6 sm:grid-cols-3">
          <div>
            <Link
              to="/"
              className="text-2xl font-semibold tracking-[-.08em]"
            >
              shop
              <span className="text-[#87977d]">
                insta
              </span>
              <span className="text-[#bc8962]">
                .
              </span>
            </Link>

            <p className="mt-2 max-w-xs text-xs leading-5 text-[#72736b]">
              A happy little corner of the
              internet for good finds and the
              people who make them.
            </p>
          </div>

          <div className="flex flex-wrap content-start gap-x-5 gap-y-3 text-xs">
            <Link to="/explore">
              Explore
            </Link>

            <Link to="/reels">
              Product reels
            </Link>

            <Link to="/orders">
              My orders
            </Link>

            <Link to="/profile">
              My profile
            </Link>

            <Link
              to={
                user?.role === "seller"
                  ? "/seller"
                  : "/become-seller"
              }
            >
              {user?.role === "seller"
                ? "Seller studio"
                : "Become a seller"}
            </Link>
          </div>

          <form
            onSubmit={(event) => {
              event.preventDefault();
              notify(
                "You're on the list. Welcome in ♡"
              );
            }}
          >
            <p className="text-[9px] font-semibold uppercase tracking-widest">
              A little love in your inbox
            </p>

            <div className="mt-3 flex border-b border-[#a5a59a] pb-2">
              <input
                type="email"
                required
                placeholder="Your email address"
                className="min-w-0 flex-1 bg-transparent text-xs outline-none"
              />

              <button
                type="submit"
                className="text-[9px] font-semibold uppercase tracking-widest"
              >
                Count me in →
              </button>
            </div>
          </form>
        </div>

        <p className="mx-auto mt-8 max-w-7xl border-t border-[#dedbd2] pt-4 text-[9px] text-[#898980]">
          © 2025 ShopInsta

          <span className="float-right">
            Made with a little heart ♡
          </span>
        </p>
      </footer>}

      <nav className="fixed inset-x-0 bottom-0 z-40 flex h-[calc(60px+env(safe-area-inset-bottom))] items-center justify-around border-t border-[#e6e3dc] bg-[#fbfaf7]/95 pb-[env(safe-area-inset-bottom)] text-[9px] backdrop-blur lg:hidden">
        <Link
          to="/"
          className="flex flex-col items-center gap-1"
        >
          <span
            className="text-lg"
            aria-hidden="true"
          >
            ⌂
          </span>
          Home
        </Link>

        <Link
          to="/explore"
          className="flex flex-col items-center gap-1"
        >
          <span
            className="text-lg"
            aria-hidden="true"
          >
            ⌕
          </span>
          Explore
        </Link>

        <Link
          to="/reels"
          className="flex flex-col items-center gap-1"
        >
          <span
            className="text-lg"
            aria-hidden="true"
          >
            ▣
          </span>
          Reels
        </Link>

        <Link
          to="/saved"
          className="flex flex-col items-center gap-1"
        >
          <span
            className="text-lg"
            aria-hidden="true"
          >
            ♡
          </span>
          Saved
        </Link>

        <Link
          to={user ? "/profile" : "/login"}
          className="flex flex-col items-center gap-1"
        >
          <span
            className="text-lg"
            aria-hidden="true"
          >
            ◎
          </span>
          Profile
        </Link>
      </nav>

      {notice && (
        <div
          role="status"
          className="fixed app-toast bottom-[72px] left-1/2 z-50 -translate-x-1/2 rounded-full bg-[#293c33] px-5 py-3 text-xs text-white shadow-lg lg:bottom-6"
        >
          {notice}
        </div>
      )}

      {checkout && (
        <Checkout
          cart={cart}
          onClose={() => setCheckout(false)}
          onComplete={completeOrder}
          user={user}
        />
      )}
    </div>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <Storefront />
    </AuthProvider>
  );
}
