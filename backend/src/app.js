import express from "express";
import cookieParser from "cookie-parser";
import cors from "cors";

// Routes
import authRoutes from "./routes/auth.routes.js";
import userRoutes from "./routes/user.routes.js";
import sellerRoutes from "./routes/seller.routes.js";
import productRoutes from "./routes/product.routes.js";
import reelRoutes from "./routes/reel.routes.js";
import orderRoutes from "./routes/order.routes.js";
import commentRoutes from "./routes/comment.routes.js";
import categoryRoutes from "./routes/category.routes.js";

// Error middleware
import {
  notFound,
  errorHandler,
} from "./middleware/error.middleware.js";

const app = express();

// ========================================
// GLOBAL MIDDLEWARE
// ========================================

// CORS
app.use(
  cors({origin:"https://shopinsta-frontend.onrender.com",
    credentials: true,
  })
);

// Parse JSON request bodies
app.use(
  express.json({
    limit: "10kb",
  })
);

// Parse URL-encoded request bodies
app.use(
  express.urlencoded({
    extended: true,
    limit: "10kb",
  })
);

// Parse cookies
app.use(cookieParser());

// ========================================
// HEALTH CHECK
// ========================================

app.get("/", (req, res) => {
  return res.status(200).json({
    success: true,
    message: "Reel Commerce API is running",
  });
});

// Browsers may request this conventional path even when no ICO is used.
app.get("/favicon.ico", (req, res) => res.status(204).end());

// ========================================
// API ROUTES
// ========================================

app.use("/api/auth", authRoutes);
app.use("/api/users", userRoutes);
app.use("/api/sellers", sellerRoutes);
app.use("/api/products", productRoutes);
app.use("/api/reels", reelRoutes);
app.use("/api/orders", orderRoutes);
app.use("/api/comments", commentRoutes);
app.use("/api/categories", categoryRoutes);

// ========================================
// ERROR HANDLING
// ========================================

// Runs when no route matches
app.use(notFound);

// Runs when an error is passed to Express
app.use(errorHandler);

export default app;
