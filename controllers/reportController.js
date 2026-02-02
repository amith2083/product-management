import pool from "../config/dbConnect.js";

export const getDashboardStats = async (req, res) => {
  try {
    const [rows] = await pool.execute(`
      SELECT
        COUNT(*) AS totalProducts,
        COALESCE(SUM(price * stock_quantity), 0) AS totalValue,
        COALESCE(SUM(stock_quantity), 0) AS totalQuantity
      FROM products
      WHERE is_active = TRUE
    `);

    const stats = rows[0];

    res.json({
      success: true,
      data: {
        totalProducts: stats.totalProducts,
        totalValue: stats.totalValue,
        totalQuantity: stats.totalQuantity,
      },
    });
  } catch (error) {
    console.error("Dashboard stats error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to load statistics",
    });
  }
};
