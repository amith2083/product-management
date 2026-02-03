import express from "express";
import dotenv from "dotenv";
import path from "path";
import { fileURLToPath } from "url";
import { dbConnect } from "./config/dbConnect.js";
import productRouter from "./routes/productRoutes.js";
import reportRouter from "./routes/reportRoutes.js";

dotenv.config();
const app = express();
const PORT = 3000;
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

await dbConnect();

// middlewares
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
// Serve ONLY static assets (css, js, images)
app.use(express.static(path.join(__dirname, "public")));

// ---------- PAGE ROUTES ----------

// Login page
app.get("/login", (req, res) => {
  res.sendFile(path.join(__dirname, "views", "login.html"));
});

// Dashboard page
app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "views", "dashboard.html"));
});

// ---------- API ROUTES ----------
app.use("/api/products", productRouter);
app.use("/api/reports", reportRouter);

// ---------- GLOBAL ERROR HANDLER ----------
app.use((err, req, res, next) => {
  console.error("Global Error:", err.message);

  res.status(err.status || 500).json({
    success: false,
    message: err.message || "Internal Server Error",
  });
});

// start server
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
