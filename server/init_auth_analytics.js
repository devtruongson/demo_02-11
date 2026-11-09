import mysql from 'mysql2/promise';
import bcrypt from 'bcryptjs';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
dotenv.config({ path: path.join(__dirname, '.env') });
dotenv.config();

async function init() {
  const conn = await mysql.createConnection({
    host: process.env.DB_HOST || '103.200.23.80',
    user: process.env.DB_USER || 'tinkerai4016_db_test',
    password: process.env.DB_PASS || 'FstackDev@1234',
    database: process.env.DB_NAME || 'tinkerai4016_db_test_17',
    port: Number(process.env.DB_PORT) || 3306,
    charset: 'utf8mb4'
  });

  console.log('Connected to MySQL to setup Auth & Analytics schema...');

  // 1. Users table
  await conn.query(`
    CREATE TABLE IF NOT EXISTS users (
      id INT PRIMARY KEY AUTO_INCREMENT,
      username VARCHAR(100) UNIQUE NOT NULL,
      email VARCHAR(150) UNIQUE NOT NULL,
      password_hash VARCHAR(255) NOT NULL,
      full_name VARCHAR(150) NOT NULL,
      role ENUM('admin', 'student') NOT NULL DEFAULT 'student',
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
  `);

  // 2. Add view_count to resources if not exists
  try {
    await conn.query(`ALTER TABLE resources ADD COLUMN view_count INT DEFAULT 0;`);
    console.log('Added view_count column to resources.');
  } catch (e) {
    if (e.code !== 'ER_DUP_FIELDNAME') {
      console.log('Note on view_count:', e.message);
    }
  }

  // Set realistic initial view counts for existing resources
  await conn.query(`
    UPDATE resources SET view_count = FLOOR(120 + RAND() * 450) WHERE view_count = 0 OR view_count IS NULL;
  `);

  // 3. Activity logs table
  await conn.query(`
    CREATE TABLE IF NOT EXISTS activity_logs (
      id INT PRIMARY KEY AUTO_INCREMENT,
      user_id INT NULL,
      username VARCHAR(100) NULL,
      action VARCHAR(100) NOT NULL,
      details TEXT,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
  `);

  // 4. Seed default accounts
  await conn.query('DELETE FROM users');

  const adminHash = bcrypt.hashSync('Admin@2026', 10);
  const studentHash = bcrypt.hashSync('Student@2026', 10);

  await conn.query(`
    INSERT INTO users (username, email, password_hash, full_name, role)
    VALUES 
      ('admin', 'admin@sukyso.edu.vn', ?, 'Thầy Nguyễn Văn An (Quản trị viên)', 'admin'),
      ('student', 'student@sukyso.edu.vn', ?, 'Lê Minh Khôi (Học sinh 10A1)', 'student')
  `, [adminHash, studentHash]);

  // Seed sample activity logs for realistic analytics
  await conn.query('DELETE FROM activity_logs');
  const sampleLogs = [
    ['admin', 'SYSTEM_INIT', 'Khởi tạo hệ thống học liệu Sử Học Số'],
    ['admin', 'SEED_RESOURCES', 'Nhập 32 tư liệu lịch sử Chủ đề Văn minh Đông Nam Á'],
    ['student', 'LOGIN', 'Học sinh Lê Minh Khôi đăng nhập'],
    ['student', 'VIEW_3D', 'Tương tác mô hình 3D Trống đồng Ngọc Lũ (Đông Sơn)'],
    ['student', 'VIEW_RESOURCE', 'Xem tư liệu Bản đồ hành trình phát triển văn minh Đông Nam Á'],
    ['student', 'VIEW_3D', 'Xoay 360 độ Đại bảo tháp Borobudur Java'],
    ['student', 'QUIZ_SUBMIT', 'Hoàn thành bài trắc nghiệm quan sát hiện vật với điểm số 4/4'],
    ['admin', 'UPDATE_RESOURCE', 'Cập nhật gợi ý khai thác sư phạm cho Đài thờ Mỹ Sơn E1']
  ];

  for (const [uname, act, det] of sampleLogs) {
    await conn.query(`
      INSERT INTO activity_logs (username, action, details, created_at)
      VALUES (?, ?, ?, DATE_SUB(NOW(), INTERVAL FLOOR(RAND() * 24) HOUR))
    `, [uname, act, det]);
  }

  const [users] = await conn.query('SELECT id, username, email, full_name, role FROM users');
  console.log('✅ Auth & Analytics initialized successfully. Users:', users);

  await conn.end();
}

init().catch(console.error);

