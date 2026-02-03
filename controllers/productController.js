import pool from "../config/dbConnect.js";

export const createProduct = async (req, res) => {
  try {
    const {
      name,
      description = null,
      price,
      category,
      stock_quantity,
    } = req.body;
    // Validation
    if (!name || !price || !stock_quantity || !category) {
      const err = new Error("Required fields missing");
      err.status = 400;
      throw err;
    }
    const [existing] = await pool.execute(
      `SELECT id FROM products WHERE name = ? AND is_active = TRUE`,
      [name],
    );

    if (existing.length > 0) {
      const err = new Error("Product already available");
      err.status = 409;
      throw err;
    }
    let image = null;
    console.log("req.file", req.file);
    if (req.file) {
      image = `/uploads/${req.file.filename}`;
    }

    const sql = `
      INSERT INTO products 
      (name, description, price,category,image, stock_quantity)
      VALUES (?, ?, ?, ?, ?, ?)
    `;

    const [result] = await pool.execute(sql, [
      name,
      description,
      price,
      category,
      image,
      stock_quantity,
    ]);

    res.status(201).json({
      success: true,
      message: "Product created successfully",
      product: {
        id: result.insertId,
        name,
        description,
        price,
        category,
        stock_quantity,
      },
    });
  } catch (error) {
    console.error("Create product error:", error);

    error.status = error.status || 500;
    throw error;
  }
};

export const getAllProducts = async (req, res) => {
  try {
    let { page = 1, limit = 10, search = "" } = req.query;

    page = parseInt(page, 10);
    limit = parseInt(limit, 10);

    if (isNaN(page) || isNaN(limit)) {
      return res.status(400).json({ message: "Invalid pagination params" });
    }

    const offset = (page - 1) * limit;

    let whereClause = "";
    let params = [];

    if (search) {
      whereClause += ` AND name LIKE ?`;
      params.push(`%${search}%`);
    }

    //  LIMIT/OFFSET injected directly
    const [rows] = await pool.execute(
      `
      SELECT *
      FROM products
      ${whereClause}
      ORDER BY created_at DESC
      LIMIT ${limit} OFFSET ${offset}
      `,
      params,
    );

    const [[countResult]] = await pool.execute(
      `
      SELECT COUNT(*) as total
      FROM products
      ${whereClause}
      `,
      params,
    );

    res.status(200).json({
      success: true,
      data: rows,
      pagination: {
        page,
        totalPages: Math.ceil(countResult.total / limit),
        totalItems: countResult.total,
      },
    });
  } catch (error) {
    console.error("Fetch products error:", error);
    error.status = error.status || 500;
    throw error;
  }
};
export const getProduct = async (req, res) => {
  try {
    const { id } = req.params;

    const [rows] = await pool.execute(
      `
      SELECT *
      FROM products
      WHERE id = ?
      `,
      [id],
    );

    if (rows.length === 0) {
      const err = new Error("Product not found");
      err.status = 404;
      throw err;
    }

    res.status(200).json({
      success: true,
      data: rows[0],
    });
  } catch (error) {
    console.error("Get product error:", error);
    error.status = error.status || 500;
    throw error;
  }
};

export const updateProduct = async (req, res) => {
  try {
    const { id } = req.params;

    const { name, description, price, category, stock_quantity, is_active } =
      req.body;
    const [existing] = await pool.execute(
      `SELECT id FROM products WHERE name = ? AND id != ? `,
      [name, id],
    );

    if (existing.length > 0) {
      const err = new Error("Product already available");
      err.status = 409;
      throw err;
    }
    let sql = `
  UPDATE products
  SET
    name = ?,
    description = ?,
    price = ?,
    category = ?,
    stock_quantity = ?,
    is_active = ?
`;

    const values = [
      name,
      description ?? null,
      price,
      category,
      stock_quantity,
      is_active,
    ];

    if (req.file) {
      sql += `, image = ?`;
      values.push(`/uploads/${req.file.filename}`);
    }

    sql += ` WHERE id = ?`;
    values.push(id);
    const [result] = await pool.execute(sql, values);

    if (result.affectedRows === 0) {
      const err = new Error("Product not found");
      err.status = 404;
      throw err;
    }

    res.json({ success: true, message: "Product updated successfully" });
  } catch (error) {
    console.error("Update product error:", error);
    error.status = error.status || 500;
    throw error;
  }
};

export const deleteProduct = async (req, res) => {
  try {
    const { id } = req.params;

    const [result] = await pool.execute(
      `UPDATE products
       SET is_active = FALSE
       WHERE id = ?`,
      [id],
    );

    if (result.affectedRows === 0) {
      const err = new Error("Product not found");
      err.status = 404;
      throw err;
    }

    res.json({ success: true, message: "Product deleted successfully" });
  } catch (error) {
    console.error("Soft delete error:", error);
    error.status = error.status || 500;
    throw error;
  }
};
