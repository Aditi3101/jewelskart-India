import express from "express";
import PDFDocument from "pdfkit";

import cors from "cors";
import dotenv from "dotenv";
import path from "path";
import { fileURLToPath } from "url";
import { dirname } from "path";
import db from "./db.js";
import fs from "fs";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";

import nodemailer from "nodemailer";
import adminRoutes from "./adminRoutes.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
dotenv.config();

const app = express();

// choose a salt rounds value (10 is standard)
const SALT_ROUNDS = 10;

// CORS setup
app.use(
  cors({
    origin: ["http://localhost:5173", "http://localhost:5174"],
    methods: ["GET", "POST", "DELETE", "PUT"],
    credentials: true,
  })
);

app.use(express.json());

// Admin routes
app.use('/admin', adminRoutes);

// Serve image uploads
app.use("/uploads", express.static(path.join(__dirname, "uploads")));
app.use("/images", express.static(path.join(__dirname, "uploads")));
app.use("/invoices", express.static(path.join(__dirname, "invoices")));
// Serve static banner images
app.use(
  "/uploads/banner",
  express.static(path.join(__dirname, "uploads/banner"))
);


// ✅ Middleware: API key verification
const verifyApiKey = (req, res, next) => {
  const apiKey = req.headers["x-api-key"];
  if (apiKey !== process.env.API_KEY) {
    return res.status(403).json({ success: false, message: "Invalid API key" });
  }
  next();
};

// ==============================
// 🔐 AUTH APIS
// ==============================

// ✅ Register API
// app.post("/register", verifyApiKey, (req, res) => {
//   const { fname, lname, email, pass } = req.body;
//   const status = "active";

//   const checkQuery = "SELECT * FROM registration WHERE Email = ?";
//   db.query(checkQuery, [email], (err, result) => {
//     if (err) return res.json({ success: false, message: "DB error" });
//     if (result.length > 0)
//       return res.json({ success: false, message: "Email already registered" });

//     const insertQuery = `
//       INSERT INTO registration (fname, lname, Email, pass, status)
//       VALUES (?, ?, ?, ?, ?)
//     `;
//     db.query(insertQuery, [fname, lname, email, pass, status], (err) => {
//       if (err) return res.json({ success: false, message: "Insert failed" });
//       return res.json({ success: true });
//     });
//   });
// });

// app.post("/login", verifyApiKey, async (req, res) => {
//   const { email, pass } = req.body;

//   try {
//     // Check if credentials are valid
//     const [rows] = await db
//       .promise()
//       .query("SELECT * FROM registration WHERE Email = ? AND pass = ?", [
//         email,
//         pass,
//       ]);

//     if (rows.length === 1) {
//       const user = rows[0];

//       // ✅ Generate JWT token
//       const token = jwt.sign(
//         { email: user.Email, id: user.customer_id },
//         process.env.JWT_SECRET,
//         { expiresIn: "1h" }
//       );

//       // Check if user is already logged in
//       if (!user.is_logged_in) {
//         // Update individual login count & last login, and set is_logged_in to true
//         await db
//           .promise()
//           .query(
//             "UPDATE registration SET login_count = login_count + 1, last_login = NOW(), is_logged_in = TRUE WHERE Email = ?",
//             [email]
//           );

//         // Update global login counter
//         try {
//           await db
//             .promise()
//             .query("UPDATE login_counter SET count = count + 1 WHERE id = 1");
//           console.log("✅ Global login counter incremented");
//         } catch (err) {
//           console.error("❌ Failed to update global login counter:", err);
//         }
//       }

//       return res.json({
//         success: true,
//         message: "Login successful",
//         token,
//         user: {
//           id: user.customer_id,
//           name: `${user.fname} ${user.lname}`,
//           email: user.Email,
//         },
//       });
//     } else {
//       return res.json({ success: false, message: "Invalid credentials" });
//     }
//   } catch (err) {
//     console.error("❌ Login error:", err);
//     return res.status(500).json({ success: false, message: "Server error" });
//   }
// });

/*
  Register: hash password then insert.
  (keeps verifyApiKey middleware from your file)
*/
app.post("/register", verifyApiKey, async (req, res) => {
  try {
    const { fname, lname, email, pass } = req.body;
    if (!fname || !lname || !email || !pass) {
      return res
        .status(400)
        .json({ success: false, message: "Missing fields" });
    }

    // check if email exists
    const checkQuery = "SELECT * FROM registration WHERE Email = ?";
    const [rows] = await db.promise().query(checkQuery, [email]);
    if (rows.length > 0) {
      return res.json({ success: false, message: "Email already registered" });
    }

    // hash password
    const hashed = await bcrypt.hash(pass, SALT_ROUNDS);

    const insertQuery = `
      INSERT INTO registration (fname, lname, Email, pass, status)
      VALUES (?, ?, ?, ?, ?)
    `;
    const status = "active";
    await db
      .promise()
      .query(insertQuery, [fname, lname, email, hashed, status]);

    return res.json({ success: true });
  } catch (err) {
    console.error("Register error:", err);
    return res.status(500).json({ success: false, message: "Server error" });
  }
});

/*
  Login: fetch user by email then compare bcrypt.
*/
app.post("/login", verifyApiKey, async (req, res) => {
  try {
    const { email, pass } = req.body;
    if (!email || !pass) {
      return res
        .status(400)
        .json({ success: false, message: "Missing credentials" });
    }

    // fetch user by email only
    const [rows] = await db
      .promise()
      .query("SELECT * FROM registration WHERE Email = ?", [email]);

    if (rows.length !== 1) {
      return res.json({ success: false, message: "Invalid credentials" });
    }

    const user = rows[0];

    // compare plain password with stored hash
    const passwordMatch = await bcrypt.compare(pass, user.pass);
    if (!passwordMatch) {
      return res.json({ success: false, message: "Invalid credentials" });
    }

    // password OK -> generate token
    const token = jwt.sign(
      { email: user.Email, id: user.customer_id },
      process.env.JWT_SECRET,
      { expiresIn: "1h" }
    );

    // update login counts / last_login / is_logged_in as you already do
    if (!user.is_logged_in) {
      try {
        await db
          .promise()
          .query(
            "UPDATE registration SET login_count = login_count + 1, last_login = NOW(), is_logged_in = TRUE WHERE Email = ?",
            [email]
          );
        await db
          .promise()
          .query("UPDATE login_counter SET count = count + 1 WHERE id = 1");
      } catch (err) {
        console.error("Failed to update login counters:", err);
      }
    }

    return res.json({
      success: true,
      message: "Login successful",
      token,
      user: {
        id: user.customer_id,
        name: `${user.fname} ${user.lname}`,
        email: user.Email,
      },
    });
  } catch (err) {
    console.error("Login error:", err);
    return res.status(500).json({ success: false, message: "Server error" });
  }
});

app.get("/logged-in-count", (req, res) => {
  const sql =
    "SELECT COUNT(*) AS count FROM registration WHERE is_logged_in = TRUE";
  db.query(sql, (err, result) => {
    if (err) return res.status(500).json({ success: false });
    res.json({ success: true, count: result[0].count });
  });
});

// app.post("/login", verifyApiKey, (req, res) => {
//   const { email, pass } = req.body;
//   const query = "SELECT * FROM registration WHERE Email = ? AND pass = ?";
//   db.query(query, [email, pass], (err, result) => {
//     if (err) return res.json({ success: false, message: "DB error" });

//     if (result.length > 0) {
//       const user = result[0];
//       const token = jwt.sign(
//         { email: user.Email, id: user.customer_id },
//         process.env.JWT_SECRET,
//         { expiresIn: "1h" }
//       );

//       // ✅ Increment login count and update last_login timestamp
//       const updateQuery = "UPDATE registration SET login_count = login_count + 1, last_login = NOW() WHERE Email = ?";
//       db.query(updateQuery, [email], (updateErr) => {
//         if (updateErr) {
//           console.error("Login count or last_login update failed", updateErr);
//         }
//       });

//       return res.json({ success: true, token });
//     }

//     return res.json({ success: false, message: "Invalid email or password" });
//   });
// });

// ==============================
// ✅ Get user by email (Protected by API key)
app.get("/user/:email", verifyApiKey, (req, res) => {
  const { email } = req.params;
  const sql = `SELECT customer_id, fname, lname, Email, street_address, phone FROM registration WHERE Email = ?`;

  db.query(sql, [email], (err, result) => {
    if (err)
      return res.status(500).json({ success: false, message: "DB Error" });
    if (result.length === 0)
      return res
        .status(404)
        .json({ success: false, message: "User not found" });

    res.json({ success: true, user: result[0] });
  });
});

// ✅ Update user info
app.put("/user/:email", (req, res) => {
  const { email } = req.params;
  const { street_address, phone } = req.body;

  const sql = `UPDATE registration SET street_address = ?, phone = ? WHERE Email = ?`;
  db.query(sql, [street_address, phone, email], (err) => {
    if (err)
      return res.status(500).json({ success: false, message: "Update failed" });
    res.json({ success: true, message: "User info updated" });
  });
});

// ==============================
// 📊 NAVBAR MENU
// ==============================

// ✅ Get navbar items (grouped dropdowns and flat links)
app.get("/api/navbar-grouped", (req, res) => {
  const sql = `
    SELECT 
      mg.group_id,
      mg.group_name,
      mg.group_path,
      mb.id AS menu_id,
      mb.menu_name,
      mb.path
    FROM menu_bar mb
    LEFT JOIN menu_group mg ON mb.group_id = mg.group_id
    ORDER BY mg.group_name, mb.menu_name;
  `;

  db.query(sql, (err, rows) => {
    if (err) return res.status(500).json({ error: "DB Error" });

    const dropdown = {};
    const flatLinks = [];

    rows.forEach((row) => {
      if (row.group_id) {
        if (!dropdown[row.group_name]) {
          dropdown[row.group_name] = {
            path: row.group_path,
            items: [],
          };
        }
        dropdown[row.group_name].items.push({
          id: row.menu_id,
          name: row.menu_name,
          path: row.path,
        });
      } else {
        flatLinks.push({
          id: row.menu_id,
          name: row.menu_name,
          path: row.path,
        });
      }
    });

    const dropdownList = Object.entries(dropdown).map(
      ([group_name, group]) => ({
        group_name,
        group_path: group.path,
        items: group.items,
      })
    );

    res.json({ dropdownList, flatLinks });
  });
});

// ==============================
// 🎯 BANNERS
// ==============================

app.get("/api/banner", (req, res) => {
  const sql = "SELECT * FROM banner_content WHERE id=2 LIMIT 1";
  db.query(sql, (err, result) => {
    if (err)
      return res.status(500).json({ success: false, message: "DB Error" });
    res.json(result[0]);
  });
});

app.get("/api/collection-banner", (req, res) => {
  const sql =
    "SELECT id, image_path, banner_text FROM banner_content WHERE id=1 LIMIT 1";
  db.query(sql, (err, result) => {
    if (err)
      return res.status(500).json({ success: false, message: "DB Error" });
    if (result.length > 0) return res.json(result[0]);
    res.status(404).json({ success: false, message: "No banner found" });
  });
});

// ==============================
// 🛍️ WISHLIST
// ==============================

app.post("/wishlist", (req, res) => {
  const { customer_id, p_name, p_price, p_code, fileToUpload, quantity } =
    req.body;

  const checkQuery =
    "SELECT * FROM wishlist WHERE customer_id = ? AND p_code = ?";
  db.query(checkQuery, [customer_id, p_code], (err, result) => {
    if (err) return res.status(500).json({ error: "Database error" });
    if (result.length > 0)
      return res.status(409).json({ error: "Already in wishlist" });

    const insertQuery = `
      INSERT INTO wishlist (customer_id, p_name, p_price, p_code, fileToUpload, quantity)
      VALUES (?, ?, ?, ?, ?, ?)
    `;
    db.query(
      insertQuery,
      [customer_id, p_name, p_price, p_code, fileToUpload, quantity],
      (err2) => {
        if (err2) return res.status(500).json({ error: "Insert failed" });
        res.json({ success: true, message: "Item added to wishlist" });
      }
    );
  });
});

app.get("/wishlist", (req, res) => {
  const customer_id = req.query.customer_id;
  if (!customer_id)
    return res.status(400).json({ error: "Missing customer_id" });

  db.query(
    "SELECT * FROM wishlist WHERE customer_id = ?",
    [customer_id],
    (err, result) => {
      if (err) return res.status(500).json({ error: "DB error" });
      res.json(result);
    }
  );
});

app.delete("/wishlist/:id", (req, res) => {
  const { id } = req.params;
  db.query("DELETE FROM wishlist WHERE wishlist_id = ?", [id], (err) => {
    if (err) return res.status(500).json({ error: "Delete error" });
    res.json({ success: true });
  });
});

// ==============================
// 🛒 CART
// ==============================

app.post("/cart", (req, res) => {
  const { customer_id, p_name, p_price, p_code, fileToUpload, quantity, size } =
    req.body;

  const checkQuery = "SELECT * FROM cart WHERE customer_id = ? AND p_code = ?";
  db.query(checkQuery, [customer_id, p_code], (err, result) => {
    if (err) return res.status(500).json({ error: "Database error" });
    if (result.length > 0)
      return res.status(409).json({ error: "Already in cart" });

    const insertQuery = `
      INSERT INTO cart (customer_id, p_name, p_price, p_code, fileToUpload, quantity, size)
      VALUES (?, ?, ?, ?, ?, ?, ?)
    `;
    db.query(
      insertQuery,
      [customer_id, p_name, p_price, p_code, fileToUpload, quantity, size],
      (err2) => {
        if (err2) return res.status(500).json({ error: "Insert failed" });
        res.json({ success: true, message: "Item added to cart" });
      }
    );
  });
});

// app.get("/cart", (req, res) => {
//   const customer_id = req.query.customer_id;
//   if (!customer_id) {
//     return res.status(400).json({ error: "Missing customer_id" });
//   }

//   // Auto-delete expired items (older than 4 days)
//   db.query(
//     "DELETE FROM cart WHERE customer_id = ? AND created_at < NOW() - INTERVAL 4 DAY",
//     [customer_id],
//     (err) => {
//       if (err) console.error("Error deleting expired items:", err);
//     }
//   );

//   // Then return only fresh items
//   db.query(
//     "SELECT * FROM cart WHERE customer_id = ? AND created_at >= NOW() - INTERVAL 4 DAY",
//     [customer_id],
//     (err, result) => {
//       if (err) return res.status(500).json({ error: "DB error" });
//       res.json(result);
//     }
//   );
// });
app.get("/cart", (req, res) => {
  const customer_id = req.query.customer_id;
  if (!customer_id) {
    return res.status(400).json({ error: "Missing customer_id" });
  }

  // ✅ Step 1: Auto-delete expired items (older than 4 days)
  db.query(
    "DELETE FROM cart WHERE customer_id = ? AND created_at < NOW() - INTERVAL 4 DAY",
    [customer_id],
    (err) => {
      if (err) console.error("Error deleting expired items:", err);
    }
  );

  // ✅ Step 2: Return valid cart items with joined product info
  const query = `
    SELECT 
      c.cart_id,
      c.quantity,
      c.created_at,
      p.p_id,
      p.p_name,
      p.p_price,
      p.fileToUpload
    FROM cart c
    JOIN products p ON c.p_code = p.p_code
    WHERE c.customer_id = ? AND c.created_at >= NOW() - INTERVAL 4 DAY
  `;

  db.query(query, [customer_id], (err, results) => {
    if (err) {
      console.error("DB error:", err);
      return res.status(500).json({ error: "DB error" });
    }
    res.json(results);
  });
});

app.delete("/cart/:id", (req, res) => {
  const { id } = req.params;
  db.query("DELETE FROM cart WHERE cart_id = ?", [id], (err) => {
    if (err) return res.status(500).json({ error: "Delete error" });
    res.json({ success: true });
  });
});

app.put("/cart/:id", (req, res) => {
  const { quantity } = req.body;
  const { id } = req.params;
  db.query(
    "UPDATE cart SET quantity = ? WHERE cart_id = ?",
    [quantity, id],
    (err) => {
      if (err) return res.status(500).json({ error: "Update failed" });
      res.json({ success: true });
    }
  );
});

// ==============================
// 🏷️ TYPES & CATEGORIES & COLLECTIONS
// ==============================

// ✅ Get all active types for navbar
app.get("/api/types", (req, res) => {
  const sql = "SELECT type_id, type_name, path FROM types WHERE status = 'y' ORDER BY type_name";
  db.query(sql, (err, result) => {
    if (err) return res.status(500).json({ error: err });
    console.log("Types result:", result);
    res.json(result);
  });
});

// ✅ Category list for homepage
app.get("/categories", (req, res) => {
  const sql = `
    SELECT c.catagory_id, c.catagory_name, c.type_name, c.image, 
           c.description, c.banner_name, c.status, c.type_id
    FROM catagories c
    WHERE c.status = 'y'
    ORDER BY c.type_id, c.catagory_name
  `;
  
  db.query(sql, (err, result) => {
    if (err) return res.status(500).json({ error: err });
    res.json(result);
  });
});

// ✅ Categories by type_id
app.get("/categories/type/:typeId", (req, res) => {
  const { typeId } = req.params;
  const sql = `
    SELECT c.catagory_id, c.catagory_name, c.type_name, c.image, 
           c.description, c.banner_name, c.status, c.type_id
    FROM catagories c
    WHERE c.status = 'y' AND c.type_id = ?
    ORDER BY c.catagory_name
  `;
  
  db.query(sql, [typeId], (err, result) => {
    if (err) return res.status(500).json({ error: err });
    res.json(result);
  });
});

// ✅ Single category by category_id
app.get("/categories/:categoryId", (req, res) => {
  const { categoryId } = req.params;
  const sql = `
    SELECT c.catagory_id, c.catagory_name, c.type_name, c.image, 
           c.description, c.banner_name, c.status, c.type_id
    FROM catagories c
    WHERE c.status = 'y' AND c.catagory_id = ?
  `;
  
  db.query(sql, [categoryId], (err, result) => {
    if (err) return res.status(500).json({ error: err });
    res.json(result[0] || null);
  });
});

// ✅ SEO Routes - Get ID by name/slug
app.get("/api/type-id/:nameOrSlug", (req, res) => {
  const { nameOrSlug } = req.params;
  const isId = /^\d+$/.test(nameOrSlug);
  
  if (isId) {
    return res.json({ type_id: parseInt(nameOrSlug) });
  }
  
  const searchName = nameOrSlug.replace(/-/g, ' ');
  const sql = "SELECT type_id, type_name FROM types WHERE LOWER(type_name) LIKE ? AND status = 'y' ORDER BY CHAR_LENGTH(type_name) ASC";
  
  db.query(sql, [`%${searchName.toLowerCase()}%`], (err, result) => {
    if (err) return res.status(500).json({ error: err });
    if (result.length === 0) return res.status(404).json({ error: "Type not found" });
    res.json({ type_id: result[0].type_id });
  });
});

app.get("/api/category-id/:nameOrSlug", (req, res) => {
  const { nameOrSlug } = req.params;
  console.log('🔍 Backend: Looking for category:', nameOrSlug);
  
  const isId = /^\d+$/.test(nameOrSlug);
  
  if (isId) {
    console.log('🔢 Backend: Is numeric ID:', nameOrSlug);
    return res.json({ catagory_id: parseInt(nameOrSlug) });
  }
  
  const searchName = nameOrSlug.replace(/-/g, ' ');
  console.log('🔍 Backend: Searching for name:', searchName);
  
  // Try multiple search strategies
  const searches = [
    `${searchName.toLowerCase()}%`,  // Starts with
    `%${searchName.toLowerCase()}%`, // Contains
    `%${searchName.toLowerCase()}`,  // Ends with
  ];
  
  const sql = "SELECT catagory_id, catagory_name FROM catagories WHERE LOWER(catagory_name) LIKE ? AND status = 'y' ORDER BY CHAR_LENGTH(catagory_name) ASC";
  
  // Try first search pattern
  db.query(sql, [searches[0]], (err, result) => {
    if (err) {
      console.log('💥 Backend: Database error:', err);
      return res.status(500).json({ error: err });
    }
    
    if (result.length > 0) {
      console.log('✅ Backend: Found category:', result[0]);
      return res.json({ catagory_id: result[0].catagory_id });
    }
    
    // Try second search pattern
    db.query(sql, [searches[1]], (err2, result2) => {
      if (err2) return res.status(500).json({ error: err2 });
      
      if (result2.length > 0) {
        console.log('✅ Backend: Found category (contains):', result2[0]);
        return res.json({ catagory_id: result2[0].catagory_id });
      }
      
      console.log('❌ Backend: Category not found for:', nameOrSlug);
      return res.status(404).json({ error: "Category not found", searched: searchName });
    });
  });
});

app.get("/api/product-id/:nameOrSlug", (req, res) => {
  const { nameOrSlug } = req.params;
  console.log('🔍 Backend: Looking for product:', nameOrSlug);
  
  const isId = /^\d+$/.test(nameOrSlug);
  
  if (isId) {
    console.log('🔢 Backend: Is numeric ID:', nameOrSlug);
    return res.json({ p_id: parseInt(nameOrSlug) });
  }
  
  const searchName = nameOrSlug.replace(/-/g, ' ');
  console.log('🔍 Backend: Searching for product name:', searchName);
  
  // Try multiple search strategies
  const searches = [
    `${searchName.toLowerCase()}%`,  // Starts with
    `%${searchName.toLowerCase()}%`, // Contains
    `%${searchName.toLowerCase()}`,  // Ends with
  ];
  
  const sql = "SELECT p_id, p_name FROM products WHERE LOWER(p_name) LIKE ? AND status = 'y' ORDER BY CHAR_LENGTH(p_name) ASC";
  
  // Try first search pattern
  db.query(sql, [searches[0]], (err, result) => {
    if (err) {
      console.log('💥 Backend: Database error:', err);
      return res.status(500).json({ error: err });
    }
    
    if (result.length > 0) {
      console.log('✅ Backend: Found product:', result[0]);
      return res.json({ p_id: result[0].p_id });
    }
    
    // Try second search pattern
    db.query(sql, [searches[1]], (err2, result2) => {
      if (err2) return res.status(500).json({ error: err2 });
      
      if (result2.length > 0) {
        console.log('✅ Backend: Found product (contains):', result2[0]);
        return res.json({ p_id: result2[0].p_id });
      }
      
      console.log('❌ Backend: Product not found for:', nameOrSlug);
      return res.status(404).json({ error: "Product not found", searched: searchName });
    });
  });
});

// ✅ Products by category_id
app.get("/api/products/category/:categoryId", (req, res) => {
  const { categoryId } = req.params;
  const sql = `
    SELECT p.* FROM products p
    JOIN catagories c ON p.catagory_name = c.catagory_name
    WHERE p.status = 'y' AND c.catagory_id = ?
    ORDER BY p.p_name
  `;

  db.query(sql, [categoryId], (err, result) => {
    if (err) return res.status(500).json({ error: err });
    res.json(result);
  });
});

// ✅ Products by category or collection
app.get("/api/products/:category", (req, res) => {
  const { category } = req.params;

  const sql = `
    SELECT * FROM products 
    WHERE status = 'y' AND (catagory_name = ? OR collection_name = ?)
    ORDER BY p_name
  `;

  db.query(sql, [category, category], (err, result) => {
    if (err) return res.status(500).json({ error: err });
    res.json(result);
  });
});

// ✅ Products by type_id
app.get("/api/products/type/:typeId", (req, res) => {
  const { typeId } = req.params;

  const sql = `
    SELECT p.* FROM products p
    JOIN catagories c ON p.catagory_name = c.catagory_name
    WHERE p.status = 'y' AND c.type_id = ?
    ORDER BY p.p_name
  `;

  db.query(sql, [typeId], (err, result) => {
    if (err) return res.status(500).json({ error: err });
    res.json(result);
  });
});

// ✅ All available collections
app.get("/api/collections", (req, res) => {
  const query = `
    SELECT * FROM products 
    WHERE collection_name IS NOT NULL 
    GROUP BY collection_name
    ORDER BY collection_name ASC
  `;

  db.query(query, (err, results) => {
    if (err) return res.status(500).send("Server error");
    res.json(results);
  });
});

// ==============================
// 🎯 OFFERS API
// ==============================

// Get products for offers page
app.get("/api/offers", verifyApiKey, (req, res) => {
  const sql = `
    SELECT p_id, p_name, p_price, p_code, fileToUpload, catagory_name, 
           collection_name, small_description
    FROM products 
    WHERE status = 'y'
    ORDER BY RAND()
    LIMIT 12
  `;

  db.query(sql, (err, result) => {
    if (err) return res.status(500).json({ error: "Database error" });
    res.json(result);
  });
});

// ==============================
// 🔍 SEARCH
// ==============================

app.get("/search", (req, res) => {
  const query = req.query.query;
  if (!query)
    return res
      .status(400)
      .json({ success: false, message: "No query provided" });

  const wildcard = `%${query}%`;
  const sql = `
    SELECT p_id, p_name, p_price, p_code, catagory_name, collection_name, 
           small_description, fileToUpload, image1 
    FROM products 
    WHERE 
      p_name LIKE ? OR 
      catagory_name LIKE ? OR 
      collection_name LIKE ? OR
      type_name LIKE ? OR 
      sub_type LIKE ? OR
      p_code LIKE ?
  `;

  db.query(sql, Array(6).fill(wildcard), (err, results) => {
    if (err)
      return res
        .status(500)
        .json({ success: false, message: "Database error" });
    res.json(results);
  });
});

// ✅ Search result with redirect to product details
app.get("/api/search", (req, res) => {
  const query = req.query.query;

  let sql;
  let values;

  if (query && query.trim() !== "") {
    const wildcard = `%${query}%`;
    sql = `
      SELECT * FROM products
      WHERE 
        p_name LIKE ? OR
        p_code LIKE ? OR
        catagory_name LIKE ? OR
        collection_name LIKE ? OR
        type_name LIKE ? OR
        sub_type LIKE ?
    `;
    values = Array(6).fill(wildcard);
  } else {
    sql = "SELECT * FROM products";
    values = [];
  }

  db.query(sql, values, (err, result) => {
    if (err) return res.status(500).json({ error: "Search failed" });
    res.json(result);
  });
});

// ==============================
// 🔎 PRODUCT DETAILS
// ==============================

app.get("/api/product/:id", (req, res) => {
  const { id } = req.params;

  const sql = `SELECT * FROM products WHERE p_id = ?`;
  db.query(sql, [id], (err, result) => {
    if (err) return res.status(500).json({ error: "Database error" });
    if (result.length === 0)
      return res.status(404).json({ message: "Product not found" });
    res.json(result[0]);
  });
});

// ✅ Add this route at the bottom of your server.js

// app.post("/place-order", async (req, res) => {
//   const { user, cart, subtotal, gst, total } = req.body;

//   if (!user || !cart || cart.length === 0) {
//     return res.status(400).json({ success: false, message: "Missing data" });
//   }

//   const htmlInvoice = `
//     <h2 style="color:#333">Order Invoice</h2>
//     <p><strong>Name:</strong> ${user.fname} ${user.lname}</p>
//     <p><strong>Address:</strong> ${user.street_address}</p>
//     <p><strong>Phone:</strong> ${user.phone}</p>
//     <hr/>
//     <h4>Items:</h4>
//     <ul>
//       ${cart.map(item =>
//         `<li>${item.p_name} - ₹${item.p_price} × ${item.quantity} = ₹${item.p_price * item.quantity}</li>`
//       ).join('')}
//     </ul>
//     <hr/>
//     <p><strong>Subtotal:</strong> ₹${subtotal.toFixed(2)}</p>
//     <p><strong>GST (18%):</strong> ₹${gst.toFixed(2)}</p>
//     <h3 style="color:green">Total Payable: ₹${total.toFixed(2)}</h3>
//   `;

//   const transporter = nodemailer.createTransport({
//     service: "gmail",
//     auth: {
//       user: process.env.EMAIL_USER,
//       pass: process.env.EMAIL_PASS, // Use Gmail App Password
//     },
//   });

//   const mailOptions = {
//     from: process.env.EMAIL_USER,
//     to: user.Email,
//     subject: "Your Order Invoice",
//     html: htmlInvoice,
//   };

//   try {
//     await transporter.sendMail(mailOptions);

//     // ✅ Optional: Clear the cart
//     db.query("DELETE FROM cart WHERE customer_id = ?", [user.customer_id], (err) => {
//       if (err) console.error("Cart clear failed", err);
//     });

//     res.json({ success: true, message: "Invoice sent successfully" });
//   } catch (err) {
//     console.error("Error sending email:", err);
//     res.status(500).json({ success: false, message: "Failed to send invoice" });
//   }
// });

// ==============================
// 📧 ORDER INVOICE & EMAIL
// app.post("/place-order", async (req, res) => {
//   const { user, cart, subtotal, gst, total } = req.body;

//   if (!user || !cart || cart.length === 0) {
//     console.error("Place order failed: Missing data");
//     return res.status(400).json({ success: false, message: "Missing data" });
//   }

//   try {
//     const PDFDocument = await import("pdfkit").then((m) => m.default);
//     const doc = new PDFDocument();
//     const filename = `invoice_${Date.now()}.pdf`;
//     const invoiceDir = path.join(__dirname, "invoices");
//     const invoicePath = path.join(invoiceDir, filename);

//     // ✅ Ensure invoice directory exists
//     if (!fs.existsSync(invoiceDir)) {
//       fs.mkdirSync(invoiceDir);
//     }

//     const writeStream = fs.createWriteStream(invoicePath);
//     doc.pipe(writeStream);

//     // ✅ PDF Content
//     doc.fontSize(20).text("INVOICE", { align: "center" }).moveDown();
//     doc.fontSize(12).text(`Name: ${user.fname} ${user.lname}`);
//     doc.text(`Email: ${user.Email}`);
//     doc.text(`Phone: ${user.phone}`);
//     doc.text(`Address: ${user.street_address}`).moveDown();

//     doc.text("Items:");
//     cart.forEach((item, index) => {
//       doc.text(
//         `${index + 1}. ${item.p_name} - ₹${item.p_price} × ${item.quantity} = ₹${item.p_price * item.quantity}`
//       );
//     });

//     doc.moveDown();
//     doc.text(`Subtotal: ₹${subtotal}`);
//     doc.text(`GST (18%): ₹${gst}`);
//     doc.font("Helvetica-Bold").text(`Total: ₹${total}`);
//     doc.end();

//     // ✅ After PDF is written, send email
//     writeStream.on("finish", async () => {
//       console.log("Invoice PDF generated:", invoicePath);

//       // ✅ Setup nodemailer
//       const transporter = nodemailer.createTransport({
//         service: "gmail",
//         auth: {
//           user: process.env.EMAIL_USER,
//           pass: process.env.EMAIL_PASS,
//         },
//       });

//       const mailOptions = {
//         from: process.env.EMAIL_USER,
//         to: user.Email,
//         subject: "Your Order Invoice",
//         html: `
//           <p>Dear ${user.fname},</p>
//           <p>Thank you for your order. Please find your invoice attached.</p>
//           <p>Regards,<br/>Your Shop Team</p>
//         `,
//         attachments: [
//           {
//             filename: filename,
//             path: invoicePath,
//           },
//         ],
//       };

//       try {
//         await transporter.sendMail(mailOptions);
//         console.log("Email sent to:", user.Email);
//       } catch (err) {
//         console.error("Email send error:", err);
//       }

//       // ✅ Optional: Clear cart
//       db.query("DELETE FROM cart WHERE customer_id = ?", [user.customer_id], (err) => {
//         if (err) console.error("Cart clear failed", err);
//       });

//       res.json({
//         success: true,
//         message: "Order placed, invoice generated and emailed.",
//         invoiceUrl: `http://localhost:5000/invoices/${filename}`,
//       });
//     });

//     writeStream.on("error", (err) => {
//       console.error("PDF write error:", err);
//       res.status(500).json({ success: false, message: "Failed to generate invoice" });
//     });
//   } catch (error) {
//     console.error("Order placement error:", error);
//     res.status(500).json({ success: false, message: "Internal Server Error" });
//   }
// });

// app.post("/place-order", async (req, res) => {
//   const { user, cart, subtotal, gst, total } = req.body;

//   if (!user || !cart || cart.length === 0) {
//     return res.status(400).json({ success: false, message: "Missing data" });
//   }

//   try {
//     const PDFDocument = await import("pdfkit").then((m) => m.default);
//     const doc = new PDFDocument({ size: "A4", margin: 50 });
//     const filename = `invoice_${Date.now()}.pdf`;
//     const invoiceDir = path.join(__dirname, "invoices");
//     const invoicePath = path.join(invoiceDir, filename);

//     if (!fs.existsSync(invoiceDir)) {
//       fs.mkdirSync(invoiceDir);
//     }

//     const writeStream = fs.createWriteStream(invoicePath);
//     doc.pipe(writeStream);

//     // ✅ Logo and Header
//     try {
//       const logoPath = path.join(__dirname, "logo.png");
//       if (fs.existsSync(logoPath)) {
//         doc.image(logoPath, 50, 40, { width: 50 });
//       }
//     } catch {
//       console.warn("Logo not found, skipping.");
//     }

//     doc
//       .fontSize(22)
//       .font("Helvetica-Bold")
//       .text("Meeon Jewels - Invoice", 0, 50, { align: "right" })
//       .moveDown();

//     doc
//       .fontSize(11)
//       .font("Helvetica")
//       .text(`Invoice Date: ${new Date().toLocaleDateString()}`, { align: "right" })
//       .text(`Invoice No: ${Date.now()}`, { align: "right" })
//       .moveDown();

//     doc
//       .moveTo(50, doc.y)
//       .lineTo(550, doc.y)
//       .strokeColor("#cccccc")
//       .stroke()
//       .moveDown(1);

//     // ✅ Customer Info
//     doc
//       .fontSize(13)
//       .fillColor("#000")
//       .font("Helvetica-Bold")
//       .text("Bill To:", 50, doc.y)
//       .moveDown(0.2);

//     doc
//       .font("Helvetica")
//       .fontSize(11)
//       .fillColor("#333")
//       .text(`Name: ${user.fname} ${user.lname}`)
//       .text(`Email: ${user.Email}`)
//       .text(`Phone: ${user.phone}`)
//       .text(`Address: ${user.street_address}`)
//       .moveDown(1);

//     doc
//       .moveTo(50, doc.y)
//       .lineTo(550, doc.y)
//       .strokeColor("#cccccc")
//       .stroke()
//       .moveDown(1);

//     // ✅ Product Table Layout
//     const tableTop = doc.y + 10;
//     const columnWidths = {
//       no: 40,
//       product: 200,
//       price: 80,
//       qty: 50,
//       total: 80,
//     };
//     const colX = {
//       no: 50,
//       product: 90,
//       price: 300,
//       qty: 380,
//       total: 450,
//     };

//     doc.font("Helvetica-Bold").fontSize(12);
//     doc.text("No", colX.no, tableTop);
//     doc.text("Product", colX.product, tableTop);
//     doc.text("Price", colX.price, tableTop, { width: columnWidths.price, align: "right" });
//     doc.text("Qty", colX.qty, tableTop, { width: columnWidths.qty, align: "right" });
//     doc.text("Total", colX.total, tableTop, { width: columnWidths.total, align: "right" });

//     doc
//       .moveTo(50, tableTop + 15)
//       .lineTo(550, tableTop + 15)
//       .strokeColor("#cccccc")
//       .stroke();

//     doc.font("Helvetica").fontSize(11);
//     let y = tableTop + 25;

//     cart.forEach((item, index) => {
//       const totalPrice = item.p_price * item.quantity;

//       doc.text(index + 1, colX.no, y, { width: columnWidths.no });
//       doc.text(item.p_name, colX.product, y, { width: columnWidths.product });
//       doc.text(`₹${item.p_price}`, colX.price, y, {
//         width: columnWidths.price,
//         align: "right",
//       });
//       doc.text(item.quantity.toString(), colX.qty, y, {
//         width: columnWidths.qty,
//         align: "right",
//       });
//       doc.text(`₹${totalPrice}`, colX.total, y, {
//         width: columnWidths.total,
//         align: "right",
//       });

//       y += 20;

//       // Optional row separator
//       doc
//         .moveTo(50, y)
//         .lineTo(550, y)
//         .strokeColor("#eeeeee")
//         .stroke();
//     });

//     // ✅ Totals
//     y += 20;
//     doc.font("Helvetica-Bold").fontSize(12);
//     doc.text(`Subtotal: ₹${subtotal.toFixed(2)}`, 400, y, { align: "right" });
//     doc.text(`GST (18%): ₹${gst.toFixed(2)}`, 400, y + 20, { align: "right" });
//     doc
//       .fontSize(14)
//       .text(`Total: ₹${total.toFixed(2)}`, 400, y + 40, {
//         align: "right",
//         underline: true,
//       });

//     doc.moveDown(2);
//     doc
//       .fontSize(11)
//       .font("Helvetica")
//       .fillColor("#444")
//       .text("Thank you for shopping with Meeon Jewels!", {
//         align: "center",
//       });

//     doc.end();

//     // ✅ On PDF creation complete
//     writeStream.on("finish", async () => {
//       const transporter = nodemailer.createTransport({
//         service: "gmail",
//         auth: {
//           user: process.env.EMAIL_USER,
//           pass: process.env.EMAIL_PASS,
//         },
//       });

//       const mailOptions = {
//         from: `"Meeon Jewels" <${process.env.EMAIL_USER}>`,
//         to: user.Email,
//         subject: "Your Meeon Jewels Invoice",
//         html: `
//           <div style="font-family: Arial, sans-serif; max-width: 600px; margin: auto;">
//             <h2 style="color: #333;">🧾 Invoice Confirmation</h2>
//             <p>Dear <strong>${user.fname}</strong>,</p>
//             <p>Thank you for your order! Your invoice is attached below.</p>
//             <h4>Order Summary:</h4>
//             <ul style="padding-left: 20px;">
//               ${cart
//                 .map(
//                   (item) =>
//                     `<li>${item.p_name} - ₹${item.p_price} × ${item.quantity} = ₹${item.p_price * item.quantity}</li>`
//                 )
//                 .join("")}
//             </ul>
//             <p><strong>Total Paid: ₹${total.toFixed(2)}</strong></p>
//             <hr/>
//             <p style="font-size: 13px; color: #999;">Meeon Jewels | www.meeonjewels.com</p>
//           </div>
//         `,
//         attachments: [
//           {
//             filename: filename,
//             path: invoicePath,
//           },
//         ],
//       };

//       try {
//         await transporter.sendMail(mailOptions);
//         console.log("✅ Email sent to:", user.Email);
//       } catch (err) {
//         console.error("❌ Failed to send email:", err);
//       }

//       db.query("DELETE FROM cart WHERE customer_id = ?", [user.customer_id], (err) => {
//         if (err) console.error("⚠️ Failed to clear cart:", err);
//       });

//       res.json({
//         success: true,
//         message: "Order placed, invoice generated and emailed.",
//         invoiceUrl: `http://localhost:5000/invoices/${filename}`,
//       });
//     });

//     writeStream.on("error", (err) => {
//       console.error("❌ PDF write error:", err);
//       res.status(500).json({ success: false, message: "Failed to generate invoice" });
//     });
//   } catch (error) {
//     console.error("❌ Unexpected error:", error);
//     res.status(500).json({ success: false, message: "Internal Server Error" });
//   }
// });

app.post("/place-order", async (req, res) => {
  const { user, cart, subtotal, gst, total } = req.body;

  if (!user || !cart || cart.length === 0) {
    return res.status(400).json({ success: false, message: "Missing data" });
  }

  const timestamp = Date.now();
  const invoiceNumber = timestamp;
  
  try {
    const PDFDocument = await import("pdfkit").then((m) => m.default);
    const doc = new PDFDocument({ size: "A4", margin: 50 });
    const filename = `invoice_${timestamp}.pdf`;
    const invoiceDir = path.join(__dirname, "invoices");
    const invoicePath = path.join(invoiceDir, filename);

    if (!fs.existsSync(invoiceDir)) {
      fs.mkdirSync(invoiceDir);
    }

    const writeStream = fs.createWriteStream(invoicePath);
    doc.pipe(writeStream);

    // ✅ Logo
    try {
      const logoPath = path.join(__dirname, "logo.png");
      if (fs.existsSync(logoPath)) {
        doc.image(logoPath, 50, 40, { width: 50 });
      }
    } catch {
      console.warn("Logo not found, skipping.");
    }

    // ✅ Header
    doc
      .fontSize(22)
      .font("Helvetica-Bold")
      .text("Meeon Jewels - Invoice", 0, 50, { align: "right" })
      .moveDown();

    doc
      .fontSize(11)
      .font("Helvetica")
      .text(`Invoice Date: ${new Date().toLocaleDateString()}`, {
        align: "right",
      })
      .text(`Invoice No: INV-${invoiceNumber}`, { align: "right" })
      .moveDown();

    doc
      .moveTo(50, doc.y)
      .lineTo(550, doc.y)
      .strokeColor("#cccccc")
      .stroke()
      .moveDown(1);

    // ✅ Customer Info
    doc
      .fontSize(13)
      .font("Helvetica-Bold")
      .text("Bill To:", 50, doc.y)
      .moveDown(0.2);

    doc
      .font("Helvetica")
      .fontSize(11)
      .fillColor("#333")
      .text(`Name: ${user.fname} ${user.lname}`)
      .text(`Email: ${user.Email}`)
      .text(`Phone: ${user.phone}`)
      .text(`Address: ${user.street_address}`)
      .moveDown(1);

    doc
      .moveTo(50, doc.y)
      .lineTo(550, doc.y)
      .strokeColor("#cccccc")
      .stroke()
      .moveDown(1);

    // ✅ Table Layout Config
    const tableTop = doc.y + 10;
    const columnWidths = {
      no: 40,
      product: 180,
      price: 90,
      qty: 60,
      total: 90,
    };

    const colX = {
      no: 50,
      product: 95,
      price: 300,
      qty: 400,
      total: 480,
    };

    // ✅ Table Headers
    doc.font("Helvetica-Bold").fontSize(11);
    doc.text("No", colX.no, tableTop);
    doc.text("Product", colX.product, tableTop);
    doc.text("Price", colX.price, tableTop, {
      width: columnWidths.price,
      align: "right",
    });
    doc.text("Qty", colX.qty, tableTop, {
      width: columnWidths.qty,
      align: "right",
    });
    doc.text("Total", colX.total, tableTop, {
      width: columnWidths.total,
      align: "right",
    });

    doc
      .moveTo(50, tableTop + 15)
      .lineTo(550, tableTop + 15)
      .strokeColor("#cccccc")
      .stroke();

    doc.font("Helvetica").fontSize(10);
    let y = tableTop + 25;

    cart.forEach((item, index) => {
      const totalPrice = item.p_price * item.quantity;

      doc.text(index + 1, colX.no, y);
      doc.text(item.p_name, colX.product, y, { width: columnWidths.product });

      doc.text(`INR ${item.p_price.toFixed(2)}`, colX.price, y, {
        width: columnWidths.price,
        align: "right",
      });

      doc.text(`${item.quantity}`, colX.qty, y, {
        width: columnWidths.qty,
        align: "right",
      });

      doc.text(`INR ${totalPrice.toFixed(2)}`, colX.total, y, {
        width: columnWidths.total,
        align: "right",
      });

      y += 20;

      doc.moveTo(50, y).lineTo(550, y).strokeColor("#eeeeee").stroke();
    });

    // ✅ Totals
    y += 20;
    doc.font("Helvetica-Bold").fontSize(11);
    doc.text(`Subtotal: INR ${subtotal.toFixed(2)}`, 400, y, {
      align: "right",
    });
    doc.text(`GST (18%): INR ${gst.toFixed(2)}`, 400, y + 20, {
      align: "right",
    });

    doc.fontSize(13).text(`Total: INR ${total.toFixed(2)}`, 400, y + 40, {
      align: "right",
      underline: true,
    });

    doc.moveDown(2);
    doc
      .fontSize(11)
      .font("Helvetica")
      .fillColor("#444")
      .text("Thank you for shopping with Meeon Jewels!", { align: "center" });

    doc.end();

    // ✅ Handle PDF finish
    writeStream.on("finish", async () => {
      try {
        // Insert into orders table
        const [orderResult] = await db
          .promise()
          .query(
            "INSERT INTO orders (customer_id, subtotal, gst, total, invoice_file, invoice) VALUES (?, ?, ?, ?, ?, ?)",
            [user.customer_id, subtotal, gst, total, filename, invoiceNumber]
          );

        const orderId = orderResult.insertId;

        // Insert items into order_items
        for (const item of cart) {
          await db
            .promise()
            .query(
              "INSERT INTO order_items (order_id, p_id, quantity, price_at_time, total_price) VALUES (?, ?, ?, ?, ?)",
              [
                orderId,
                item.p_id,
                item.quantity,
                item.p_price,
                item.p_price * item.quantity,
              ]
            );
        }

        // ✅ Send Email
        const transporter = nodemailer.createTransport({
          service: "gmail",
          auth: {
            user: process.env.EMAIL_USER,
            pass: process.env.EMAIL_PASS,
          },
        });

        const mailOptions = {
          from: `"Meeon Jewels" <${process.env.EMAIL_USER}>`,
          to: user.Email,
          subject: "Your Meeon Jewels Invoice",
          html: `
            <div style="font-family: Arial, sans-serif;">
              <h2>🧾 Invoice Confirmation</h2>
              <p>Dear <strong>${user.fname}</strong>,</p>
              <p>Thank you for your order! Your invoice is attached below.</p>
              <h4>Order Summary:</h4>
              <ul>
                ${cart
                  .map(
                    (item) =>
                      `<li>${item.p_name} - INR ${item.p_price} × ${
                        item.quantity
                      } = INR ${item.p_price * item.quantity}</li>`
                  )
                  .join("")}
              </ul>
              <p><strong>GST (18%): INR ${gst.toFixed(2)}</strong></p>
              <p><strong>Total Paid: INR ${total.toFixed(2)}</strong></p>
              <hr />
              <p style="font-size: 13px; color: #888;">Meeon Jewels | www.meeonjewels.com</p>
            </div>
          `,
          attachments: [{ filename, path: invoicePath }],
        };

        await transporter.sendMail(mailOptions);
        console.log("✅ Email sent to:", user.Email);

        db.query(
          "DELETE FROM cart WHERE customer_id = ?",
          [user.customer_id],
          (err) => {
            if (err) console.error("⚠️ Failed to clear cart:", err);
          }
        );

        res.json({
          success: true,
          message: "Order placed, invoice generated and emailed.",
          invoiceUrl: `http://localhost:5000/invoices/${filename}`,
        });
      } catch (err) {
        console.error("❌ Error after PDF:", err);
        res
          .status(500)
          .json({ success: false, message: "Order processing failed" });
      }
    });

    writeStream.on("error", (err) => {
      console.error("❌ PDF write error:", err);
      res
        .status(500)
        .json({ success: false, message: "Failed to generate invoice" });
    });
  } catch (error) {
    console.error("❌ Unexpected error:", error);
    res.status(500).json({ success: false, message: "Internal Server Error" });
  }
});

// ==============================
// 📜 ORDER HISTORY APIS
// ==============================

// Get all orders for a customer
app.get("/orders", verifyApiKey, async (req, res) => {
  try {
    const { customer_id } = req.query;
    if (!customer_id) {
      return res
        .status(400)
        .json({ success: false, message: "Missing customer_id" });
    }

    const [rows] = await db.promise().query(
      `SELECT order_id, customer_id, subtotal, gst, total, invoice_file, created_at
         FROM orders
         WHERE customer_id = ?
         ORDER BY created_at DESC`,
      [customer_id]
    );

    const orders = rows.map((row) => ({
      ...row,
      invoiceUrl: `/invoices/${row.invoice_file}`,
    }));

    res.json({ success: true, orders });
  } catch (err) {
    console.error("Error fetching orders:", err);
    res.status(500).json({ success: false, message: "Failed to fetch orders" });
  }
});

// Get one order details with items
app.get("/orders/:orderId", verifyApiKey, async (req, res) => {
  try {
    const { orderId } = req.params;

    const [orderRows] = await db.promise().query(
      `SELECT order_id, customer_id, subtotal, gst, total, invoice_file, created_at
         FROM orders WHERE order_id = ?`,
      [orderId]
    );

    if (orderRows.length === 0) {
      return res
        .status(404)
        .json({ success: false, message: "Order not found" });
    }

    const order = orderRows[0];

    let itemRows = [];
    try {
      const [items] = await db.promise().query(
        `SELECT oi.p_id, oi.quantity, oi.price_at_time, oi.total_price,
                  p.p_name, p.fileToUpload
           FROM order_items oi
           LEFT JOIN products p ON p.p_id = oi.p_id
           WHERE oi.order_id = ?`,
        [orderId]
      );
      itemRows = items;
    } catch (itemsErr) {
      console.error(
        "Order items fetch failed, returning summary only:",
        itemsErr
      );
      itemRows = [];
    }

    res.json({
      success: true,
      order: {
        ...order,
        invoiceUrl: `/invoices/${order.invoice_file}`,
        items: itemRows,
      },
    });
  } catch (err) {
    console.error("Error fetching order details:", err);
    res
      .status(500)
      .json({ success: false, message: "Failed to fetch order details" });
  }
});

// ==============================
// 👁️ VISIT COUNTER
// app.post("/increment-visit", async (req, res) => {
//   try {
//     const promiseDb = db.promise();
//     await promiseDb.query("UPDATE views SET count = (count + 1) WHERE id = 1");
//     const [rows] = await promiseDb.query("SELECT count FROM views WHERE id = 1");
//     res.json({ success: true, count: rows[0].count});
//   } catch (err) {
//     console.error("Error updating view count", err);
//     res.status(500).json({ success: false, message: "Failed to update views" });
//   }
// });

// API: Get all banners
app.get("/api/banners", async (req, res) => {
  try {
    const [rows] = await db
      .promise()
      .query(
        "SELECT id, title, image_url, placement, link, is_active, created_at, updated_at, type FROM banners WHERE is_active = 1"
      );

    res.json({ success: true, banners: rows });
  } catch (err) {
    console.error("Error fetching banners:", err);
    res.status(500).json({ success: false, error: "Server error" });
  }
});

// API: Get banners by placement
app.get("/api/banners/:placement", async (req, res) => {
  const { placement } = req.params;
  try {
    const [rows] = await db
      .promise()
      .query(
        "SELECT id, title, type, image_url, link, placement FROM banners WHERE placement = ? AND is_active = 1",
        [placement]
      );

    const banners = rows.map((banner) => ({
      ...banner,
      image_url: banner.image_url.startsWith("/")
        ? banner.image_url
        : `/uploads/banner/${banner.image_url}`, // ✅ correct path
    }));

    res.json(banners);
  } catch (err) {
    console.error("Error fetching banners:", err);
    res.status(500).json({ error: "Server error" });
  }
});

// ==============================
// 📝 REVIEWS API
// ==============================

// Get all reviews for homepage
app.get("/api/all-reviews", verifyApiKey, async (req, res) => {
  try {
    const [rows] = await db.promise().query(
      "SELECT review_id, p_id, user_name, user_rating, user_review, datetime, created_date FROM review_table ORDER BY created_date DESC LIMIT 20"
    );
    res.json(rows);
  } catch (error) {
    console.error("Error fetching all reviews:", error);
    res.status(500).json({ success: false, message: "Failed to fetch reviews" });
  }
});

// ==============================
// 📝 EXISTING REVIEWS API
// ==============================

// Get reviews for a product
app.get("/api/reviews/:productId", async (req, res) => {
  try {
    const { productId } = req.params;
    console.log("Fetching reviews for product ID:", productId);
    
    const [rows] = await db.promise().query(
      "SELECT review_id, p_id, user_name, user_rating, user_review, datetime, created_date FROM review_table WHERE p_id = ? ORDER BY created_date DESC",
      [productId]
    );
    
    console.log("Found reviews:", rows.length);
    res.json({ success: true, reviews: rows });
  } catch (error) {
    console.error("Error fetching reviews:", error);
    res.status(500).json({ success: false, message: "Failed to fetch reviews", error: error.message });
  }
});

// Submit a new review
app.post("/api/reviews", async (req, res) => {
  try {
    const { p_id, user_email, user_rating, user_review } = req.body;
    console.log("Submitting review:", { p_id, user_email, user_rating, user_review });
    
    if (!p_id || !user_email || !user_rating || !user_review) {
      return res.status(400).json({ success: false, message: "Missing required fields" });
    }

    // Get user name from email
    const [userRows] = await db.promise().query(
      "SELECT fname, lname FROM registration WHERE Email = ?",
      [user_email]
    );

    console.log("User found:", userRows.length > 0 ? `${userRows[0]?.fname} ${userRows[0]?.lname}` : "No user");

    if (userRows.length === 0) {
      return res.status(404).json({ success: false, message: "User not found" });
    }

    const user_name = `${userRows[0].fname} ${userRows[0].lname}`;

    const [result] = await db.promise().query(
      "INSERT INTO review_table (p_id, user_name, user_rating, user_review, datetime, created_date) VALUES (?, ?, ?, ?, NOW(), NOW())",
      [p_id, user_name, user_rating, user_review]
    );

    console.log("Review inserted with ID:", result.insertId);
    res.json({ success: true, message: "Review submitted successfully" });
  } catch (error) {
    console.error("Error submitting review:", error);
    res.status(500).json({ success: false, message: "Failed to submit review", error: error.message });
  }
});

// ==============================
// 🏠 ROOT ROUTE
// ==============================

app.get("/", (req, res) => {
  res.json({ 
    success: true, 
    message: "Jewelskart Backend API is running!",
    version: "1.0.0",
    endpoints: {
      auth: "/login, /register",
      products: "/api/products",
      cart: "/cart",
      orders: "/orders",
      admin: "/admin/*"
    }
  });
});

// ==============================
// ✅ START SERVER
// ==============================

const PORT = process.env.PORT || 5000;
app.listen(PORT, '0.0.0.0', () => {
  console.log(`🚀 Backend running on port ${PORT}`);
});
