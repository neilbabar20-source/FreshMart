import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import dotenv from "dotenv";

dotenv.config();

// Load backend modules only after environment variables are loaded
const { connectDB } = await import("./config/connectDB.js");

const { default: userRoutes } = await import("./routes/user.routes.js");
const { default: sellerRoutes } = await import("./routes/seller.routes.js");
const { default: adminRoutes } = await import("./routes/admin.route.js");
const { connectCloudinary } = await import("./config/cloudinary.js");
const { default: productRoutes } = await import("./routes/product.routes.js");
const { default: cartRoutes } = await import("./routes/cart.routes.js");
const { default: orderRoutes } = await import("./routes/order.routes.js");
const { default: addressRoutes } = await import("./routes/address.route.js");
const { default: paymentRoutes } = await import("./routes/payment.route.js");

const app = express();

connectDB();
connectCloudinary();

const allowedOrigins = [
  "http://localhost:5173",
  "https://fresh-mart-qanb-chi.vercel.app",
];

// Middleware
app.use(express.json());
app.use(cors({ origin: allowedOrigins, credentials: true }));
app.use(cookieParser());

// API Endpoints
app.use("/images", express.static("uploads"));

app.use("/api/user", userRoutes);
app.use("/api/seller", sellerRoutes);
app.use("/api/admin", adminRoutes);
app.use("/api/product", productRoutes);
app.use("/api/cart", cartRoutes);
app.use("/api/order", orderRoutes);
app.use("/api/address", addressRoutes);
app.use("/api/payment", paymentRoutes);

const PORT = process.env.PORT || 4000;

app.listen(PORT, () => {
  console.log(`server is running on port ${PORT}`);
});