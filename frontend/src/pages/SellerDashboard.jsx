import { useEffect, useState } from "react";

import { api } from "../services/api";
import { currency } from "../utils/helpers";
import Button from "../components/Button";
import { Link } from "../components/Router";

export default function SellerDashboard() {
  const [data, setData] = useState(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);
  const [sellerOrders, setSellerOrders] = useState([]);
  const [updatingOrderId, setUpdatingOrderId] = useState(null);
  const [orderError, setOrderError] = useState("");

  // Load seller dashboard
  useEffect(() => {
    const loadDashboard = async () => {
      try {
        const response = await api("/sellers/dashboard");

        setData(response.dashboard || null);
      } catch (error) {
        console.error(
          "Failed to load seller dashboard:",
          error
        );

        setError(
          error.message ||
            "Unable to load your seller dashboard."
        );
      } finally {
        setLoading(false);
      }
    };

    loadDashboard();
  }, []);

  useEffect(() => {
    api("/orders/seller/orders")
      .then((response) => setSellerOrders(response.orders || []))
      .catch((loadError) => setOrderError(loadError.message || "Unable to load orders."));
  }, []);

  const changeOrderStatus = async (orderId, orderStatus) => {
    setUpdatingOrderId(orderId);
    setOrderError("");
    try {
      const response = await api(`/orders/seller/${orderId}/status`, {
        method: "PATCH",
        body: { orderStatus },
      });
      setSellerOrders((current) => current.map((order) =>
        order._id === orderId
          ? { ...order, orderStatus: response.order.orderStatus, paymentStatus: response.order.paymentStatus }
          : order
      ));
    } catch (updateError) {
      setOrderError(updateError.message || "Unable to update order status.");
    } finally {
      setUpdatingOrderId(null);
    }
  };

  const revenue =
    data?.revenue?.total || 0;

  const totalOrders =
    data?.orders?.total || 0;

  const totalProducts =
    data?.products?.total || 0;

  const totalViews =
    data?.reels?.views || 0;

  const orderStats = [
    {
      label: "Pending",
      count: data?.orders?.pending || 0,
    },
    {
      label: "Confirmed",
      count: data?.orders?.confirmed || 0,
    },
    {
      label: "Shipped",
      count: data?.orders?.shipped || 0,
    },
    {
      label: "Delivered",
      count: data?.orders?.delivered || 0,
    },
  ];

  const stats = [
    {
      label: "Revenue",
      value: currency(revenue),
    },
    {
      label: "Orders",
      value: totalOrders,
    },
    {
      label: "Products",
      value: totalProducts,
    },
    {
      label: "Views",
      value: totalViews,
    },
  ];

  return (
    <main
      className="
        mx-auto
        min-h-[65vh]
        max-w-6xl
        px-4
        py-8
        sm:px-8
        sm:py-16
      "
    >
      {/* Header */}
      <header className="flex flex-wrap items-end justify-between gap-4">
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
            Your little shop
          </h1>
        </div>

        <div className="flex flex-wrap gap-2">
          <Link to="/seller/add-product">
            <Button type="button">
              Add product +
            </Button>
          </Link>

          <Link to="/seller/add-reel">
            <Button type="button" variant="light">
              Share a reel
            </Button>
          </Link>
        </div>
      </header>

      {/* Error */}
      {error && (
        <div
          className="
            mt-8
            border
            border-[#e6e3dc]
            bg-white
            p-5
            text-sm
            text-[#777970]
          "
        >
          <p>{error}</p>

          <p className="mt-2 text-xs">
            Sign in with a seller account to see your
            shop dashboard.
          </p>

          <Link
            to="/login"
            className="
              mt-3
              inline-block
              text-xs
              underline
              underline-offset-4
            "
          >
            Sign in →
          </Link>
        </div>
      )}

      {/* Loading */}
      {loading ? (
        <div className="mt-8 bg-[#f2f1eb] p-8 text-center">
          <p className="text-sm text-[#777970]">
            Loading your shop...
          </p>
        </div>
      ) : (
        <>
          {/* Stats */}
          <section
            aria-label="Shop statistics"
            className="
              mt-8
              grid
              grid-cols-2
              gap-3
              sm:grid-cols-4
            "
          >
            {stats.map((stat) => (
              <div
                key={stat.label}
                className="bg-[#f2f1eb] p-4 sm:p-6"
              >
                <p
                  className="
                    text-[9px]
                    uppercase
                    tracking-widest
                    text-[#777970]
                  "
                >
                  {stat.label}
                </p>

                <p className="mt-2 font-serif text-2xl sm:text-3xl">
                  {stat.value}
                </p>
              </div>
            ))}
          </section>

          {/* Dashboard Sections */}
          <div
            className="
              mt-8
              grid
              gap-8
              md:grid-cols-2
            "
          >
            {/* Orders */}
            <section>
              <div className="flex items-center justify-between gap-4">
                <h2 className="font-serif text-2xl">
                  Orders at a glance
                </h2>

                <Link
                  to="/orders"
                  className="
                    shrink-0
                    text-xs
                    underline
                    underline-offset-4
                  "
                >
                  View all
                </Link>
              </div>

              <div className="mt-4 grid grid-cols-2 gap-2">
                {orderStats.map((item) => (
                  <div
                    key={item.label}
                    className="
                      bg-white
                      p-4
                      text-xs
                      shadow-sm
                    "
                  >
                    <span>{item.label}</span>

                    <b className="float-right">
                      {item.count}
                    </b>
                  </div>
                ))}
              </div>

              <h3 className="mt-6 font-serif text-xl">Manage orders</h3>
              {orderError && <p role="status" className="mt-2 text-xs text-[#a84d42]">{orderError}</p>}
              {sellerOrders.length === 0 ? (
                <p className="mt-3 bg-white p-4 text-xs text-[#777970]">No orders yet.</p>
              ) : (
                <div className="mt-3 space-y-3">
                  {sellerOrders.map((order) => (
                    <article key={order._id} className="flex flex-wrap items-center justify-between gap-3 bg-white p-4 shadow-sm">
                      <div className="min-w-0">
                        <p className="truncate text-sm font-medium">{order.product?.name || "Product"}</p>
                        <p className="mt-1 text-xs text-[#777970]">
                          {order.user?.name || "Customer"} · Qty {order.quantity} · {currency(order.totalAmount)}
                        </p>
                        <p className="mt-1 text-[10px] text-[#777970]">Order #{order._id}</p>
                      </div>
                      <select
                        aria-label={`Status for order ${order._id}`}
                        value={order.orderStatus}
                        disabled={updatingOrderId === order._id || order.orderStatus === "Cancelled"}
                        onChange={(event) => changeOrderStatus(order._id, event.target.value)}
                        className="h-10 border border-[#deddd5] bg-[#fbfaf7] px-3 text-xs disabled:opacity-60"
                      >
                        {order.orderStatus === "Pending" && <option value="Pending" disabled>Pending</option>}
                        <option value="Confirmed">Confirmed</option>
                        <option value="Shipped">Shipped</option>
                        <option value="Delivered">Delivered</option>
                        <option value="Cancelled">Cancelled</option>
                      </select>
                    </article>
                  ))}
                </div>
              )}
            </section>

            {/* Quick Links */}
            <section>
              <h2 className="font-serif text-2xl">
                Quick links
              </h2>

              <div className="mt-4 grid gap-2">
                <Link
                  to="/seller/add-product"
                  className="
                    bg-white
                    p-4
                    text-xs
                    transition-colors
                    hover:bg-[#f2f1eb]
                  "
                >
                  ＋ Add a product
                </Link>

                <Link
                  to="/seller/add-reel"
                  className="
                    bg-white
                    p-4
                    text-xs
                    transition-colors
                    hover:bg-[#f2f1eb]
                  "
                >
                  ＋ Share a reel
                </Link>

                <Link
                  to="/profile"
                  className="
                    bg-white
                    p-4
                    text-xs
                    transition-colors
                    hover:bg-[#f2f1eb]
                  "
                >
                  Edit shop profile
                </Link>
              </div>
            </section>
          </div>
        </>
      )}
    </main>
  );
}
