import express from "express";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
import db from "./db.js";
import multer from "multer";
import path from "path";
import fs from "fs";
import ExcelJS from "exceljs";

const router = express.Router();

// Multer configuration for file uploads
// const storage = multer.diskStorage({
//   destination: (req, file, cb) => {
//     const uploadPath = path.join(process.cwd(), 'uploads');
//     if (!fs.existsSync(uploadPath)) {
//       fs.mkdirSync(uploadPath, { recursive: true });
//     }
//     cb(null, uploadPath);
//   },
//   filename: (req, file, cb) => {
//     const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
//     cb(null, file.fieldname + '-' + uniqueSuffix + path.extname(file.originalname));
//   }
// });

// const upload = multer({ 
//   storage: storage,
//   limits: { fileSize: 5 * 1024 * 1024 }, // 5MB limit
//   fileFilter: (req, file, cb) => {
//     if (file.mimetype.startsWith('image/')) {
//       cb(null, true);
//     } else {
//       cb(new Error('Only image files are allowed!'), false);
//     }
//   }
// });

const JWT_SECRET = process.env.JWT_SECRET || 'dev-secret';

// Admin authentication middleware
const verifyAdminToken = (req, res, next) => {
  const token = req.headers.authorization?.split(' ')[1];
  
  if (!token) {
    return res.status(401).json({ success: false, message: "Access token required" });
  }

  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    if (decoded.role !== 'admin') {
      return res.status(403).json({ success: false, message: "Admin access required" });
    }
    req.admin = decoded;
    next();
  } catch (error) {
    return res.status(401).json({ success: false, message: "Invalid token" });
  }
};

// ==============================
// 🔐 ADMIN AUTHENTICATION
// ==============================

// Admin login
router.post("/login", async (req, res) => {
  const { email, password } = req.body;

  // Validate required fields
  if (!email || !password) {
    return res.status(400).json({ 
      success: false, 
      message: "Email and password are required" 
    });
  }

  try {
    const [rows] = await db.promise().query(
      "SELECT * FROM admin_users WHERE email = ?",
      [email]
    );

    if (rows.length === 0) {
      return res.status(401).json({ success: false, message: "Invalid credentials" });
    }

    const admin = rows[0];
    
    // Check if password exists (handle both 'password' and 'password_hash' column names)
    const passwordField = admin.password || admin.password_hash;
    if (!passwordField) {
      console.error(`Admin user ${email} has no password stored`);
      return res.status(401).json({ 
        success: false, 
        message: "Invalid credentials" 
      });
    }

    const isValidPassword = await bcrypt.compare(password, passwordField);

    if (!isValidPassword) {
      return res.status(401).json({ success: false, message: "Invalid credentials" });
    }

    const token = jwt.sign(
      { 
        id: admin.id, 
        email: admin.email, 
        role: 'admin',
        name: admin.name 
      },
      JWT_SECRET,
      { expiresIn: "24h" }
    );

    // Update last login
    await db.promise().query(
      "UPDATE admin_users SET last_login = NOW() WHERE id = ?",
      [admin.id]
    );

    res.json({
      success: true,
      token,
      admin: {
        id: admin.id,
        name: admin.name,
        email: admin.email,
        role: admin.role
      }
    });
  } catch (error) {
    console.error("Admin login error:", error);
    res.status(500).json({ success: false, message: "Server error" });
  }
});

// ==============================
// 📊 DASHBOARD & ANALYTICS
// ==============================

// Get dashboard statistics
router.get("/dashboard/stats", verifyAdminToken, async (req, res) => {
  try {
    console.log('=== Dashboard Stats Debug ===');
    
    // Get total orders with debug
    const [ordersResult] = await db.promise().query('SELECT COUNT(*) as total FROM orders');
    console.log('Orders query result:', ordersResult);
    const totalOrders = ordersResult[0].total;
    console.log('Total orders:', totalOrders);
    
    // Also check actual order IDs to verify
    const [orderIds] = await db.promise().query('SELECT order_id FROM orders ORDER BY order_id');
    console.log('All order IDs:', orderIds.map(o => o.order_id));
    console.log('Actual count from IDs:', orderIds.length);
    
    // Get total revenue
    const [revenueResult] = await db.promise().query('SELECT SUM(total) as total FROM orders');
    const totalRevenue = revenueResult[0].total || 0;
    
    // Get total users
    const [usersResult] = await db.promise().query('SELECT COUNT(*) as total FROM registration');
    const totalUsers = usersResult[0].total;
    
    // Get total products
    const [productsResult] = await db.promise().query('SELECT COUNT(*) as total FROM products');
    const totalProducts = productsResult[0].total;
    
    // Get recent orders
    const [recentOrders] = await db.promise().query(`
      SELECT order_id, customer_id, total, created_at 
      FROM orders 
      ORDER BY created_at DESC 
      LIMIT 5
    `);
    
    const stats = {
      totalOrders: parseInt(totalOrders),
      totalRevenue: parseFloat(totalRevenue),
      totalUsers: parseInt(totalUsers),
      totalProducts: parseInt(totalProducts)
    };
    
    console.log('Final stats:', stats);
    console.log('=== End Debug ===');
    
    res.json({
      success: true,
      stats,
      recentOrders: recentOrders.map(order => ({ ...order, status: 'pending' }))
    });
  } catch (error) {
    console.error('Error fetching dashboard stats:', error);
    res.status(500).json({ success: false, message: 'Error fetching dashboard stats' });
  }
});


// ==============================
// 📦 PRODUCT MANAGEMENT (fixed for your DB schema)
// ==============================

// Get dropdown options for product form
router.get("/product-options", verifyAdminToken, async (req, res) => {
  try {
    const [types] = await db.promise().query('SELECT type_id, type_name FROM types WHERE status = "y" ORDER BY type_name');
    const [categories] = await db.promise().query(`
      SELECT c.catagory_id, c.catagory_name, c.type_id, t.type_name 
      FROM catagories c 
      LEFT JOIN types t ON c.type_id = t.type_id 
      WHERE c.status = "y" 
      ORDER BY c.catagory_name
    `);
    const [collections] = await db.promise().query('SELECT DISTINCT collection_name FROM products WHERE collection_name IS NOT NULL AND collection_name != "" ORDER BY collection_name');
    
    res.json({
      success: true,
      options: {
        types: types,
        categories: categories,
        collections: collections.map(c => c.collection_name)
      }
    });
  } catch (error) {
    console.error('Error fetching product options:', error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

// Get categories by type
router.get("/categories/type/:typeId", verifyAdminToken, async (req, res) => {
  try {
    const { typeId } = req.params;
    const [categories] = await db.promise().query(`
      SELECT catagory_id, catagory_name 
      FROM catagories 
      WHERE type_id = ? AND status = "y" 
      ORDER BY catagory_name
    `, [typeId]);
    
    res.json({
      success: true,
      categories
    });
  } catch (error) {
    console.error('Error fetching categories by type:', error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

// // Get all products with pagination
// router.get("/products", verifyAdminToken, async (req, res) => {
//   try {
//     const page = parseInt(req.query.page) || 1;
//     const limit = parseInt(req.query.limit) || 10;
//     const offset = (page - 1) * limit;
//     const search = req.query.search || "";

//     let whereClause = "";
//     let params = [];

//     if (search) {
//       whereClause = "WHERE p_name LIKE ? OR p_description LIKE ? OR catagory_name LIKE ?";
//       params = [`%${search}%`, `%${search}%`, `%${search}%`];
//     }

//     const [products] = await db.promise().query(`
//       SELECT p_id, p_name, p_description, p_price, catagory_name, collection_name, subname,
//              p_code, p_details, small_description, status, fileToUpload, image1, image2, image3
//       FROM products ${whereClause}
//       ORDER BY p_id DESC
//       LIMIT ? OFFSET ?
//     `, [...params, limit, offset]);

//     const [total] = await db.promise().query(`
//       SELECT COUNT(*) as total FROM products ${whereClause}
//     `, params);

//     res.json({
//       success: true,
//       products,
//       pagination: {
//         page,
//         limit,
//         total: total[0].total,
//         pages: Math.ceil(total[0].total / limit)
//       }
//     });
//   } catch (error) {
//     console.error("Get products error:", error);
//     res.status(500).json({ success: false, message: "Server error" });
//   }
// });

// // Add new product
// router.post("/products", verifyAdminToken, upload.single('image'), async (req, res) => {
//   try {
//     const { p_name, p_description, p_price, catagory_name, collection_name, subname, p_code, p_details, small_description, status } = req.body;
//     const image = req.file ? `/uploads/${req.file.filename}` : null;

//     const [result] = await db.promise().query(`
//       INSERT INTO products (p_name, p_description, p_price, catagory_name, collection_name, subname, p_code, p_details, small_description, status, fileToUpload, image1, created_at)
//       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, NOW())
//     `, [p_name, p_description, p_price, catagory_name, collection_name, subname, p_code, p_details, small_description, status, image, image]);

//     res.json({
//       success: true,
//       message: "Product added successfully",
//       productId: result.insertId
//     });
//   } catch (error) {
//     console.error("Add product error:", error);
//     res.status(500).json({ success: false, message: "Server error" });
//   }
// });

// // Update product
// router.put("/products/:id", verifyAdminToken, upload.single('image'), async (req, res) => {
//   try {
//     const { id } = req.params;
//     const { p_name, p_description, p_price, catagory_name, collection_name, subname, p_code, p_details, small_description, status } = req.body;

//     let query = `
//       UPDATE products 
//       SET p_name=?, p_description=?, p_price=?, catagory_name=?, collection_name=?, subname=?, 
//           p_code=?, p_details=?, small_description=?, status=?`;
//     let params = [p_name, p_description, p_price, catagory_name, collection_name, subname, p_code, p_details, small_description, status];

//     if (req.file) {
//       query += `, fileToUpload=?, image1=?`;
//       params.push(`/uploads/${req.file.filename}`, `/uploads/${req.file.filename}`);
//     }

//     query += " WHERE p_id=?";
//     params.push(id);

//     await db.promise().query(query, params);

//     res.json({
//       success: true,
//       message: "Product updated successfully"
//     });
//   } catch (error) {
//     console.error("Update product error:", error);
//     res.status(500).json({ success: false, message: "Server error" });
//   }
// });

// // Delete product
// router.delete("/products/:id", verifyAdminToken, async (req, res) => {
//   try {
//     const { id } = req.params;

//     const [product] = await db.promise().query(
//       "SELECT fileToUpload FROM products WHERE p_id = ?",
//       [id]
//     );

//     if (product.length > 0 && product[0].fileToUpload) {
//       const imagePath = path.join(process.cwd(), product[0].fileToUpload);
//       if (fs.existsSync(imagePath)) {
//         fs.unlinkSync(imagePath);
//       }
//     }

//     await db.promise().query("DELETE FROM products WHERE p_id = ?", [id]);

//     res.json({
//       success: true,
//       message: "Product deleted successfully"
//     });
//   } catch (error) {
//     console.error("Delete product error:", error);
//     res.status(500).json({ success: false, message: "Server error" });
//   }
// });

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const uploadPath = req.originalUrl.includes('/banners') ? "uploads/banner/" : "uploads/";
    cb(null, uploadPath);
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + path.extname(file.originalname));
  },
});

const upload = multer({ storage });

// ==========================
// Add Product (POST)
// ==========================
router.post(
  "/products",
  verifyAdminToken,
  upload.fields([
    { name: "fileToUpload", maxCount: 1 },
    { name: "image1", maxCount: 1 },
    { name: "image2", maxCount: 1 },
    { name: "image3", maxCount: 1 },
  ]),
  async (req, res) => {
    try {
      const {
        type_name,
        sub_type,
        catagory_id,
        catagory_name,
        collection_name,
        p_name,
        subname,
        p_code,
        p_details,
        p_description,
        small_description,
        p_price,
        status,
      } = req.body;

      const fileToUpload = req.files["fileToUpload"]
        ? req.files["fileToUpload"][0].filename
        : null;
      const image1 = req.files["image1"]
        ? req.files["image1"][0].filename
        : null;
      const image2 = req.files["image2"]
        ? req.files["image2"][0].filename
        : null;
      const image3 = req.files["image3"]
        ? req.files["image3"][0].filename
        : null;

      const [result] = await db
        .promise()
        .query(
          `
        INSERT INTO products 
        (type_name, sub_type, catagory_id, catagory_name, collection_name, p_name, subname, p_code, p_details, p_description, small_description, p_price, fileToUpload, image1, image2, image3, status) 
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
      `,
          [
            type_name,
            sub_type,
            catagory_id,
            catagory_name,
            collection_name,
            p_name,
            subname,
            p_code,
            p_details,
            p_description,
            small_description,
            p_price,
            fileToUpload,
            image1,
            image2,
            image3,
            status,
          ]
        );

      res.json({
        success: true,
        message: "Product added successfully",
        productId: result.insertId,
      });
    } catch (error) {
      console.error("Add product error:", error);
      res.status(500).json({ success: false, message: "Server error" });
    }
  }
);

// ==========================
// Get Products (Paginated)
// ==========================
router.get("/products", verifyAdminToken, async (req, res) => {
  try {
    const { page = 1, search = "" } = req.query;
    const limit = 10;
    const offset = (page - 1) * limit;

    const [rows] = await db
      .promise()
      .query(
        `SELECT * FROM products WHERE p_name LIKE ? ORDER BY p_id DESC LIMIT ? OFFSET ?`,
        [`%${search}%`, limit, offset]
      );

    const [count] = await db
      .promise()
      .query(`SELECT COUNT(*) as total FROM products WHERE p_name LIKE ?`, [
        `%${search}%`,
      ]);

    res.json({
      success: true,
      products: rows,
      pagination: {
        total: count[0].total,
        pages: Math.ceil(count[0].total / limit),
      },
    });
  } catch (error) {
    console.error("Fetch products error:", error);
    res.status(500).json({ success: false, message: "Server error" });
  }
});

// ==========================
// Get Single Product
// ==========================
router.get("/products/:id", verifyAdminToken, async (req, res) => {
  try {
    const { id } = req.params;
    const [rows] = await db
      .promise()
      .query("SELECT * FROM products WHERE p_id = ?", [id]);

    if (!rows.length) {
      return res.status(404).json({ success: false, message: "Not found" });
    }

    res.json({ success: true, product: rows[0] });
  } catch (error) {
    console.error("Fetch product error:", error);
    res.status(500).json({ success: false, message: "Server error" });
  }
});

// ==========================
// Update Product (PUT)
// ==========================
router.put(
  "/products/:id",
  verifyAdminToken,
  upload.fields([
    { name: "fileToUpload", maxCount: 1 },
    { name: "image1", maxCount: 1 },
    { name: "image2", maxCount: 1 },
    { name: "image3", maxCount: 1 },
  ]),
  async (req, res) => {
    try {
      const { id } = req.params;
      const {
        type_name,
        sub_type,
        catagory_id,
        catagory_name,
        collection_name,
        p_name,
        subname,
        p_code,
        p_details,
        p_description,
        small_description,
        p_price,
        status,
      } = req.body;

      let query = `
        UPDATE products SET 
        type_name=?, sub_type=?, catagory_id=?, catagory_name=?, collection_name=?, p_name=?, subname=?, 
        p_code=?, p_details=?, p_description=?, small_description=?, p_price=?, status=?`;
      const params = [
        type_name,
        sub_type,
        catagory_id,
        catagory_name,
        collection_name,
        p_name,
        subname,
        p_code,
        p_details,
        p_description,
        small_description,
        p_price,
        status,
      ];

      if (req.files["fileToUpload"]) {
        query += ", fileToUpload=?";
        params.push(req.files["fileToUpload"][0].filename);
      }
      if (req.files["image1"]) {
        query += ", image1=?";
        params.push(req.files["image1"][0].filename);
      }
      if (req.files["image2"]) {
        query += ", image2=?";
        params.push(req.files["image2"][0].filename);
      }
      if (req.files["image3"]) {
        query += ", image3=?";
        params.push(req.files["image3"][0].filename);
      }

      query += " WHERE p_id=?";
      params.push(id);

      await db.promise().query(query, params);

      res.json({ success: true, message: "Product updated successfully" });
    } catch (error) {
      console.error("Update product error:", error);
      res.status(500).json({ success: false, message: "Server error" });
    }
  }
);

// ==========================
// Delete Product
// ==========================
router.delete("/products/:id", verifyAdminToken, async (req, res) => {
  try {
    const { id } = req.params;

    // fetch product images before deleting
    const [rows] = await db
      .promise()
      .query(
        "SELECT fileToUpload, image1, image2, image3 FROM products WHERE p_id = ?",
        [id]
      );

    if (rows.length) {
      ["fileToUpload", "image1", "image2", "image3"].forEach((field) => {
        if (rows[0][field]) {
          const filePath = path.join(process.cwd(), rows[0][field]);
          if (fs.existsSync(filePath)) fs.unlinkSync(filePath);
        }
      });
    }

    await db.promise().query("DELETE FROM products WHERE p_id = ?", [id]);
    res.json({ success: true, message: "Product deleted successfully" });
  } catch (error) {
    console.error("Delete product error:", error);
    res.status(500).json({ success: false, message: "Server error" });
  }
});

// ==============================
// 📋 ORDER MANAGEMENT
// ==============================

// Get all orders with pagination and search
router.get('/orders', verifyAdminToken, async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const search = req.query.search || '';
    const status = req.query.status || '';
    
    const offset = (page - 1) * limit;
    
    let whereClause = 'WHERE 1=1';
    let params = [];
    
    if (search) {
      whereClause += ' AND (order_id LIKE ? OR customer_id LIKE ?)';
      params.push(`%${search}%`, `%${search}%`);
    }
    
    if (status) {
      whereClause += ' AND status = ?';
      params.push(status);
    }
    
    // Count total orders
    const [countResult] = await db.promise().query(
      `SELECT COUNT(*) as total FROM orders ${whereClause}`,
      params
    );
    
    const totalOrders = countResult[0].total;
    
    // Get orders with pagination
    const [orders] = await db.promise().query(
      `SELECT order_id, customer_id, subtotal, gst, total, invoice_file, 
              created_at, status, cancellation_reason, return_reason, delivered_at
       FROM orders ${whereClause}
       ORDER BY created_at DESC
       LIMIT ? OFFSET ?`,
      [...params, limit, offset]
    );
    
    res.json({
      success: true,
      orders,
      pagination: {
        currentPage: page,
        totalPages: Math.ceil(totalOrders / limit),
        totalOrders,
        hasNext: page * limit < totalOrders,
        hasPrev: page > 1
      }
    });
  } catch (error) {
    console.error('Error fetching orders:', error);
    res.status(500).json({ success: false, message: 'Error fetching orders' });
  }
});

// Get order details
router.get('/orders/:orderId', verifyAdminToken, async (req, res) => {
  try {
    const { orderId } = req.params;
    
    // Get order details
    const [orderResult] = await db.promise().query(
      `SELECT order_id, customer_id, subtotal, gst, total, invoice_file, 
              created_at, status, cancellation_reason, return_reason, delivered_at
       FROM orders WHERE order_id = ?`,
      [orderId]
    );
    
    if (orderResult.length === 0) {
      return res.status(404).json({ success: false, message: 'Order not found' });
    }
    
    const order = orderResult[0];
    
    // Get order items
    const [itemsResult] = await db.promise().query(
      `SELECT item_id, order_id, p_id, quantity, price_at_time, total_price
       FROM order_items WHERE order_id = ?`,
      [orderId]
    );
    
    order.items = itemsResult;
    
    res.json({ success: true, order });
  } catch (error) {
    console.error('Error fetching order details:', error);
    res.status(500).json({ success: false, message: 'Error fetching order details' });
  }
});

// Update order status
router.put('/orders/:orderId/status', verifyAdminToken, async (req, res) => {
  try {
    const { orderId } = req.params;
    const { status, tracking_number, notes } = req.body;
    
    // Update order status
    await db.promise().query(
      `UPDATE orders SET status = ?, delivered_at = ? WHERE order_id = ?`,
      [status, status === 'delivered' ? new Date() : null, orderId]
    );
    
    res.json({ success: true, message: 'Order status updated successfully' });
  } catch (error) {
    console.error('Error updating order status:', error);
    res.status(500).json({ success: false, message: 'Error updating order status' });
  }
});

// ==============================
// 👥 USER MANAGEMENT
// ==============================

// Get all users with pagination
// router.get("/users", verifyAdminToken, async (req, res) => {
//   try {
//     const page = parseInt(req.query.page) || 1;
//     const limit = parseInt(req.query.limit) || 10;
//     const offset = (page - 1) * limit;
//     const search = req.query.search || "";

//     let whereClause = "";
//     let params = [];

//     if (search) {
//       whereClause = "WHERE fname LIKE ? OR lname LIKE ? OR Email LIKE ?";
//       params = [`%${search}%`, `%${search}%`, `%${search}%`];
//     }

//     const [users] = await db.promise().query(`
//       SELECT customer_id, fname, lname, Email, phone, address, status, created_at, last_login
//       FROM registration
//       ${whereClause}
//       ORDER BY created_at DESC
//       LIMIT ? OFFSET ?
//     `, [...params, limit, offset]);

//     const [total] = await db.promise().query(`
//       SELECT COUNT(*) as total FROM registration ${whereClause}
//     `, params);

//     res.json({
//       success: true,
//       users,
//       pagination: {
//         page,
//         limit,
//         total: total[0].total,
//         pages: Math.ceil(total[0].total / limit)
//       }
//     });
//   } catch (error) {
//     console.error("Get users error:", error);
//     res.status(500).json({ success: false, message: "Server error" });
//   }
// });

// // Update user status
// router.put("/users/:id/status", verifyAdminToken, async (req, res) => {
//   try {
//     const { id } = req.params;
//     const { status } = req.body;

//     await db.promise().query(`
//       UPDATE registration 
//       SET status = ?
//       WHERE customer_id = ?
//     `, [status, id]);

//     res.json({
//       success: true,
//       message: "User status updated successfully"
//     });
//   } catch (error) {
//     console.error("Update user status error:", error);
//     res.status(500).json({ success: false, message: "Server error" });
//   }
// });

// ==============================
// 👥 USER MANAGEMENT (fixed for registration.sql)
// ==============================

// Get all users with pagination
router.get("/users", verifyAdminToken, async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const offset = (page - 1) * limit;
    const search = req.query.search || "";

    let whereClause = "";
    let params = [];

    if (search) {
      whereClause = "WHERE fname LIKE ? OR lname LIKE ? OR Email LIKE ?";
      params = [`%${search}%`, `%${search}%`, `%${search}%`];
    }

    const [users] = await db.promise().query(`
      SELECT customer_id, fname, lname, Email, phone, status, street_address, country, state, zip,
             login_count, last_login, is_logged_in
      FROM registration
      ${whereClause}
      ORDER BY last_login DESC
      LIMIT ? OFFSET ?
    `, [...params, limit, offset]);

    const [total] = await db.promise().query(`
      SELECT COUNT(*) as total FROM registration ${whereClause}
    `, params);

    // Combine address fields for UI
    const formattedUsers = users.map(u => ({
      ...u,
      address: `${u.street_address || ""}, ${u.state || ""}, ${u.country || ""}, ${u.zip || ""}`
    }));

    res.json({
      success: true,
      users: formattedUsers,
      pagination: {
        page,
        limit,
        total: total[0].total,
        pages: Math.ceil(total[0].total / limit)
      }
    });
  } catch (error) {
    console.error("Get users error:", error);
    res.status(500).json({ success: false, message: "Server error" });
  }
});

// Update user status
router.put("/users/:id/status", verifyAdminToken, async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    await db.promise().query(`
      UPDATE registration 
      SET status = ?
      WHERE customer_id = ?
    `, [status, id]);

    res.json({
      success: true,
      message: "User status updated successfully"
    });
  } catch (error) {
    console.error("Update user status error:", error);
    res.status(500).json({ success: false, message: "Server error" });
  }
});


// ==============================
// 🏷️ TYPE MANAGEMENT
// ==============================

// Get all types
router.get("/types", verifyAdminToken, async (req, res) => {
  try {
    const search = req.query.search || "";
    let whereClause = "";
    let params = [];

    if (search) {
      whereClause = "WHERE type_name LIKE ?";
      params = [`%${search}%`];
    }

    const [types] = await db.promise().query(`
      SELECT type_id, type_name, status, created_at
      FROM types ${whereClause}
      ORDER BY type_id DESC
    `, params);

    res.json({
      success: true,
      types
    });
  } catch (error) {
    console.error("Get types error:", error);
    res.status(500).json({ success: false, message: "Server error" });
  }
});

// Add new type
router.post("/types", verifyAdminToken, async (req, res) => {
  try {
    const { type_name, status } = req.body;

    const [result] = await db.promise().query(`
      INSERT INTO types (type_name, status, created_at)
      VALUES (?, ?, NOW())
    `, [type_name, status]);

    res.json({
      success: true,
      message: "Type added successfully",
      typeId: result.insertId
    });
  } catch (error) {
    console.error("Add type error:", error);
    res.status(500).json({ success: false, message: "Server error" });
  }
});

// Update type
router.put("/types/:id", verifyAdminToken, async (req, res) => {
  try {
    const { id } = req.params;
    const { type_name, status } = req.body;

    await db.promise().query(`
      UPDATE types 
      SET type_name=?, status=?
      WHERE type_id=?
    `, [type_name, status, id]);

    res.json({
      success: true,
      message: "Type updated successfully"
    });
  } catch (error) {
    console.error("Update type error:", error);
    res.status(500).json({ success: false, message: "Server error" });
  }
});

// Delete type
router.delete("/types/:id", verifyAdminToken, async (req, res) => {
  try {
    const { id } = req.params;

    await db.promise().query("DELETE FROM types WHERE type_id = ?", [id]);

    res.json({
      success: true,
      message: "Type deleted successfully"
    });
  } catch (error) {
    console.error("Delete type error:", error);
    res.status(500).json({ success: false, message: "Server error" });
  }
});

// Update type status
router.put("/types/:id/status", verifyAdminToken, async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    await db.promise().query(
      "UPDATE types SET status = ? WHERE type_id = ?",
      [status, id]
    );

    res.json({
      success: true,
      message: "Type status updated successfully"
    });
  } catch (error) {
    console.error("Update type status error:", error);
    res.status(500).json({ success: false, message: "Server error" });
  }
});

// ==============================
// 📂 CATEGORY MANAGEMENT
// ==============================

// Get all categories
router.get("/categories", verifyAdminToken, async (req, res) => {
  try {
    const search = req.query.search || "";
    let whereClause = "";
    let params = [];

    if (search) {
      whereClause = "WHERE catagory_name LIKE ? OR type_name LIKE ?";
      params = [`%${search}%`, `%${search}%`];
    }

    const [categories] = await db.promise().query(`
      SELECT c.catagory_id, c.catagory_name, c.type_id, t.type_name, c.image, c.description, c.banner_name, c.status
      FROM catagories c
      LEFT JOIN types t ON c.type_id = t.type_id
      ${whereClause}
      ORDER BY c.catagory_id DESC
    `, params);

    res.json({
      success: true,
      categories
    });
  } catch (error) {
    console.error("Get categories error:", error);
    res.status(500).json({ success: false, message: "Server error" });
  }
});

// Add new category
router.post("/categories", verifyAdminToken, upload.single('image'), async (req, res) => {
  try {
    const { catagory_name, type_id, description, banner_name, status } = req.body;
    const image = req.file ? req.file.filename : null;

    const [result] = await db.promise().query(`
      INSERT INTO catagories (catagory_name, type_id, image, description, banner_name, status)
      VALUES (?, ?, ?, ?, ?, ?)
    `, [catagory_name, type_id, image, description, banner_name, status]);

    res.json({
      success: true,
      message: "Category added successfully",
      categoryId: result.insertId
    });
  } catch (error) {
    console.error("Add category error:", error);
    res.status(500).json({ success: false, message: "Server error" });
  }
});

// Update category
router.put("/categories/:id", verifyAdminToken, upload.single('image'), async (req, res) => {
  try {
    const { id } = req.params;
    const { catagory_name, type_id, description, banner_name, status } = req.body;
    
    let query = "UPDATE catagories SET catagory_name=?, type_id=?, description=?, banner_name=?, status=?";
    let params = [catagory_name, type_id, description, banner_name, status];

    if (req.file) {
      query += ", image=?";
      params.push(req.file.filename);
    }

    query += " WHERE catagory_id=?";
    params.push(id);

    await db.promise().query(query, params);

    res.json({
      success: true,
      message: "Category updated successfully"
    });
  } catch (error) {
    console.error("Update category error:", error);
    res.status(500).json({ success: false, message: "Server error" });
  }
});

// Delete category
router.delete("/categories/:id", verifyAdminToken, async (req, res) => {
  try {
    const { id } = req.params;

    // Get category image to delete file
    const [category] = await db.promise().query(
      "SELECT image FROM catagories WHERE catagory_id = ?",
      [id]
    );

    if (category.length > 0 && category[0].image) {
      const imagePath = path.join(process.cwd(), 'uploads', category[0].image);
      if (fs.existsSync(imagePath)) {
        fs.unlinkSync(imagePath);
      }
    }

    await db.promise().query("DELETE FROM catagories WHERE catagory_id = ?", [id]);

    res.json({
      success: true,
      message: "Category deleted successfully"
    });
  } catch (error) {
    console.error("Delete category error:", error);
    res.status(500).json({ success: false, message: "Server error" });
  }
});

// ==============================
// 🖼️ BANNER MANAGEMENT
// ==============================

// Get all banners
router.get("/banners", verifyAdminToken, async (req, res) => {
  try {
    const [banners] = await db.promise().query(`
      SELECT * FROM banners ORDER BY created_at DESC
    `);

    res.json({
      success: true,
      banners
    });
  } catch (error) {
    console.error("Get banners error:", error);
    res.status(500).json({ success: false, message: "Server error" });
  }
});

// Add new banner
router.post("/banners", verifyAdminToken, upload.single('image'), async (req, res) => {
  try {
    const { title, type, is_active } = req.body;
    const image_url = req.file ? req.file.filename : null;

    const [result] = await db.promise().query(`
      INSERT INTO banners (title, image_url, type, is_active, created_at)
      VALUES (?, ?, ?, ?, NOW())
    `, [title, image_url, type, is_active]);

    res.json({
      success: true,
      message: "Banner added successfully",
      bannerId: result.insertId
    });
  } catch (error) {
    console.error("Add banner error:", error);
    res.status(500).json({ success: false, message: "Server error" });
  }
});

// Update banner
router.put("/banners/:id", verifyAdminToken, upload.single('image'), async (req, res) => {
  try {
    const { id } = req.params;
    const { title, type, is_active } = req.body;
    
    let imageUpdate = "";
    let params = [title, type, is_active];

    if (req.file) {
      imageUpdate = ", image_url = ?";
      params.push(req.file.filename);
    }

    params.push(id);

    await db.promise().query(`
      UPDATE banners 
      SET title = ?, type = ?, is_active = ?${imageUpdate}, updated_at = NOW()
      WHERE id = ?
    `, params);

    res.json({
      success: true,
      message: "Banner updated successfully"
    });
  } catch (error) {
    console.error("Update banner error:", error);
    res.status(500).json({ success: false, message: "Server error" });
  }
});

// Delete banner
router.delete("/banners/:id", verifyAdminToken, async (req, res) => {
  try {
    const { id } = req.params;

    // Get banner image to delete file
    const [banner] = await db.promise().query(
      "SELECT image_url FROM banners WHERE id = ?",
      [id]
    );

    if (banner.length > 0 && banner[0].image_url) {
      const imagePath = path.join(process.cwd(), 'uploads/banner', banner[0].image_url);
      if (fs.existsSync(imagePath)) {
        fs.unlinkSync(imagePath);
      }
    }

    await db.promise().query("DELETE FROM banners WHERE id = ?", [id]);

    res.json({
      success: true,
      message: "Banner deleted successfully"
    });
  } catch (error) {
    console.error("Delete banner error:", error);
    res.status(500).json({ success: false, message: "Server error" });
  }
});

// ==============================
// 🔄 BULK OPERATIONS
// ==============================

// Bulk update product status
router.put("/products/:id/status", verifyAdminToken, async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    await db.promise().query(
      "UPDATE products SET status = ? WHERE p_id = ?",
      [status, id]
    );

    res.json({
      success: true,
      message: "Product status updated successfully"
    });
  } catch (error) {
    console.error("Update product status error:", error);
    res.status(500).json({ success: false, message: "Server error" });
  }
});

// Bulk update category status
router.put("/categories/:id/status", verifyAdminToken, async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    await db.promise().query(
      "UPDATE catagories SET status = ? WHERE catagory_id = ?",
      [status, id]
    );

    res.json({
      success: true,
      message: "Category status updated successfully"
    });
  } catch (error) {
    console.error("Update category status error:", error);
    res.status(500).json({ success: false, message: "Server error" });
  }
});

// ==============================
// 📊 EXCEL EXPORT ENDPOINTS
// ==============================

// Export products to Excel
router.get("/export/products", verifyAdminToken, async (req, res) => {
  try {
    const [products] = await db.promise().query(`
      SELECT p_id, p_name, p_price, p_code, catagory_name, collection_name, 
             type_name, sub_type, status, p_description, small_description
      FROM products ORDER BY p_id DESC
    `);

    const workbook = new ExcelJS.Workbook();
    const worksheet = workbook.addWorksheet('Products');
    
    worksheet.columns = [
      { header: 'ID', key: 'p_id', width: 10 },
      { header: 'Name', key: 'p_name', width: 30 },
      { header: 'Price', key: 'p_price', width: 15 },
      { header: 'Code', key: 'p_code', width: 15 },
      { header: 'Category', key: 'catagory_name', width: 20 },
      { header: 'Collection', key: 'collection_name', width: 20 },
      { header: 'Type', key: 'type_name', width: 15 },
      { header: 'Sub Type', key: 'sub_type', width: 15 },
      { header: 'Status', key: 'status', width: 10 },
      { header: 'Description', key: 'p_description', width: 40 },
      { header: 'Small Description', key: 'small_description', width: 30 }
    ];

    worksheet.addRows(products);
    
    res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
    res.setHeader('Content-Disposition', 'attachment; filename=products.xlsx');
    
    await workbook.xlsx.write(res);
    res.end();
  } catch (error) {
    console.error('Export products error:', error);
    res.status(500).json({ success: false, message: 'Export failed' });
  }
});

// Export orders to Excel
router.get("/export/orders", verifyAdminToken, async (req, res) => {
  try {
    const [orders] = await db.promise().query(`
      SELECT o.order_id, o.customer_id, r.fname, r.lname, r.Email, 
             o.subtotal, o.gst, o.total, o.created_at, o.status
      FROM orders o
      LEFT JOIN registration r ON o.customer_id = r.customer_id
      ORDER BY o.created_at DESC
    `);

    const workbook = new ExcelJS.Workbook();
    const worksheet = workbook.addWorksheet('Orders');
    
    worksheet.columns = [
      { header: 'Order ID', key: 'order_id', width: 15 },
      { header: 'Customer ID', key: 'customer_id', width: 15 },
      { header: 'First Name', key: 'fname', width: 20 },
      { header: 'Last Name', key: 'lname', width: 20 },
      { header: 'Email', key: 'Email', width: 30 },
      { header: 'Subtotal', key: 'subtotal', width: 15 },
      { header: 'GST', key: 'gst', width: 15 },
      { header: 'Total', key: 'total', width: 15 },
      { header: 'Order Date', key: 'created_at', width: 20 },
      { header: 'Status', key: 'status', width: 15 }
    ];

    worksheet.addRows(orders);
    
    res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
    res.setHeader('Content-Disposition', 'attachment; filename=orders.xlsx');
    
    await workbook.xlsx.write(res);
    res.end();
  } catch (error) {
    console.error('Export orders error:', error);
    res.status(500).json({ success: false, message: 'Export failed' });
  }
});

// Export users to Excel
router.get("/export/users", verifyAdminToken, async (req, res) => {
  try {
    const [users] = await db.promise().query(`
      SELECT customer_id, fname, lname, Email, phone, street_address, 
             country, state, zip, status, login_count, last_login
      FROM registration ORDER BY customer_id DESC
    `);

    const workbook = new ExcelJS.Workbook();
    const worksheet = workbook.addWorksheet('Users');
    
    worksheet.columns = [
      { header: 'Customer ID', key: 'customer_id', width: 15 },
      { header: 'First Name', key: 'fname', width: 20 },
      { header: 'Last Name', key: 'lname', width: 20 },
      { header: 'Email', key: 'Email', width: 30 },
      { header: 'Phone', key: 'phone', width: 15 },
      { header: 'Address', key: 'street_address', width: 30 },
      { header: 'Country', key: 'country', width: 15 },
      { header: 'State', key: 'state', width: 15 },
      { header: 'ZIP', key: 'zip', width: 10 },
      { header: 'Status', key: 'status', width: 10 },
      { header: 'Login Count', key: 'login_count', width: 15 },
      { header: 'Last Login', key: 'last_login', width: 20 }
    ];

    worksheet.addRows(users);
    
    res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
    res.setHeader('Content-Disposition', 'attachment; filename=users.xlsx');
    
    await workbook.xlsx.write(res);
    res.end();
  } catch (error) {
    console.error('Export users error:', error);
    res.status(500).json({ success: false, message: 'Export failed' });
  }
});

export default router;
