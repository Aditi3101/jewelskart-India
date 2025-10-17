import 'dotenv/config';
import mysql from 'mysql2/promise';
import bcrypt from 'bcrypt';

async function ensureAdminUser() {
  const dbHost = process.env.DB_HOST || 'localhost';
  const dbUser = process.env.DB_USER || 'root';
  const dbPassword = process.env.DB_PASSWORD || '';
  const dbPort = Number(process.env.DB_PORT || 3306);
  const dbName = process.env.DB_NAME || 'ecommerce_new';

  const adminEmail = 'admin@example.com';
  const adminUsername = 'admin';
  const plainPassword = 'admin123';
  const passwordHash = await bcrypt.hash(plainPassword, 10);

  console.log('Connecting to MySQL...');
  const conn = await mysql.createConnection({ host: dbHost, user: dbUser, password: dbPassword, port: dbPort });

  try {
    console.log(`Ensuring database '${dbName}' exists...`);
    await conn.query(`CREATE DATABASE IF NOT EXISTS \`${dbName}\``);
    await conn.query(`USE \`${dbName}\``);

    console.log('Ensuring table admin_users exists...');
    await conn.query(`
      CREATE TABLE IF NOT EXISTS admin_users (
        id INT AUTO_INCREMENT PRIMARY KEY,
        username VARCHAR(50) UNIQUE NOT NULL,
        email VARCHAR(100) UNIQUE NOT NULL,
        password_hash VARCHAR(255) NOT NULL,
        role ENUM('admin','super_admin') DEFAULT 'admin',
        is_active BOOLEAN DEFAULT TRUE,
        last_login TIMESTAMP NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
    `);

    console.log('Upserting default admin user...');
    await conn.query(
      `INSERT INTO admin_users (username, email, password_hash, role, is_active)
       VALUES (?, ?, ?, 'admin', TRUE)
       ON DUPLICATE KEY UPDATE password_hash = VALUES(password_hash), role = 'admin', is_active = TRUE`,
      [adminUsername, adminEmail, passwordHash]
    );

    const [rows] = await conn.query(
      `SELECT id, email, role, is_active FROM admin_users WHERE email = ?`,
      [adminEmail]
    );
    console.log('Admin user ready:', rows[0]);
    console.log('\nLogin with:');
    console.log('  Email: admin@example.com');
    console.log('  Password: admin123');
  } finally {
    await conn.end();
  }
}

ensureAdminUser().catch((err) => {
  console.error('Failed to ensure admin user:', err);
  process.exit(1);
});


