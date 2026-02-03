import { createPool } from "mysql2/promise";
import dotenv from "dotenv";

dotenv.config();

const pool = createPool({
  host: "localhost",
  user: "root",
  password: process.env.DB_PASSWORD,
  database: "product_management",
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
 
});

export const dbConnect = async () => {
  try {
    const connection = await pool.getConnection();
    console.log(" MySQL connected successfully");
    connection.release();
  } catch (err) {
    console.error(" MySQL connection failed:", err);
    process.exit(1);
  }
};

export default pool;
