const mysql = require('mysql2/promise');
require('dotenv').config({ path: '../config.env' });

// Database configuration
const dbConfig = {
  host: process.env.DB_HOST || 'localhost',
  user: process.env.DB_USER || 'root',
  password: process.env.DB_PASSWORD || '',
  database: process.env.DB_NAME || 'shophub_db',
  port: process.env.DB_PORT || 3306,
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
  acquireTimeout: 60000,
  timeout: 60000,
  reconnect: true
};

// Create connection pool
const pool = mysql.createPool(dbConfig);

// Test connection function
const testConnection = async () => {
  try {
    const connection = await pool.getConnection();
    console.log('✅ Database connection successful');
    connection.release();
    return true;
  } catch (error) {
    console.error('❌ Database connection failed:', error.message);
    return false;
  }
};

// Initialize database tables
const initializeDatabase = async () => {
  try {
    // Create database if it doesn't exist
    const createDbQuery = `CREATE DATABASE IF NOT EXISTS ${dbConfig.database}`;
    const tempPool = mysql.createPool({
      host: dbConfig.host,
      user: dbConfig.user,
      password: dbConfig.password,
      port: dbConfig.port
    });
    
    await tempPool.query(createDbQuery);
    await tempPool.end();
    
    // Create tables
    await createTables();
    console.log('✅ Database initialized successfully');
  } catch (error) {
    console.error('❌ Database initialization failed:', error.message);
    throw error;
  }
};

// Create all necessary tables
const createTables = async () => {
  const tables = [
    // Users table
    `CREATE TABLE IF NOT EXISTS users (
      id INT PRIMARY KEY AUTO_INCREMENT,
      username VARCHAR(50) UNIQUE NOT NULL,
      email VARCHAR(100) UNIQUE NOT NULL,
      password VARCHAR(255) NOT NULL,
      first_name VARCHAR(50),
      last_name VARCHAR(50),
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
    )`,
    
    // Categories table
    `CREATE TABLE IF NOT EXISTS categories (
      id INT PRIMARY KEY AUTO_INCREMENT,
      name VARCHAR(100) NOT NULL,
      slug VARCHAR(100) UNIQUE NOT NULL,
      description TEXT,
      icon VARCHAR(50),
      color VARCHAR(20),
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    )`,
    
    // Products table
    `CREATE TABLE IF NOT EXISTS products (
      id INT PRIMARY KEY AUTO_INCREMENT,
      name VARCHAR(255) NOT NULL,
      description TEXT,
      long_description TEXT,
      price DECIMAL(10,2) NOT NULL,
      category_id INT,
      image_url VARCHAR(500),
      rating DECIMAL(3,2) DEFAULT 0.00,
      stock INT DEFAULT 0,
      brand VARCHAR(100),
      features JSON,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
      FOREIGN KEY (category_id) REFERENCES categories(id) ON DELETE SET NULL
    )`,
    
    // Cart table
    `CREATE TABLE IF NOT EXISTS cart (
      id INT PRIMARY KEY AUTO_INCREMENT,
      user_id INT,
      session_id VARCHAR(255),
      product_id INT NOT NULL,
      quantity INT NOT NULL DEFAULT 1,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
      FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
      FOREIGN KEY (product_id) REFERENCES products(id) ON DELETE CASCADE
    )`,
    
    // Orders table
    `CREATE TABLE IF NOT EXISTS orders (
      id INT PRIMARY KEY AUTO_INCREMENT,
      user_id INT,
      session_id VARCHAR(255),
      total_amount DECIMAL(10,2) NOT NULL,
      tax_amount DECIMAL(10,2) DEFAULT 0.00,
      shipping_amount DECIMAL(10,2) DEFAULT 0.00,
      status ENUM('pending', 'processing', 'shipped', 'delivered', 'cancelled') DEFAULT 'pending',
      shipping_address JSON,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
      FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE SET NULL
    )`,
    
    // Order items table
    `CREATE TABLE IF NOT EXISTS order_items (
      id INT PRIMARY KEY AUTO_INCREMENT,
      order_id INT NOT NULL,
      product_id INT NOT NULL,
      quantity INT NOT NULL,
      price DECIMAL(10,2) NOT NULL,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (order_id) REFERENCES orders(id) ON DELETE CASCADE,
      FOREIGN KEY (product_id) REFERENCES products(id) ON DELETE CASCADE
    )`
  ];
  
  for (const tableQuery of tables) {
    await pool.query(tableQuery);
  }
};

// Insert sample data
const insertSampleData = async () => {
  try {
    // Check if data already exists
    const [categories] = await pool.query('SELECT COUNT(*) as count FROM categories');
    if (categories[0].count > 0) {
      console.log('📊 Sample data already exists, skipping...');
      return;
    }
    
    // Insert categories
    const categoryData = [
      { name: 'Electronics', slug: 'electronics', description: 'Latest electronic devices and gadgets', icon: '🔌', color: 'primary' },
      { name: 'Clothing', slug: 'clothing', description: 'Fashion and apparel for all ages', icon: '👕', color: 'success' },
      { name: 'Books', slug: 'books', description: 'Educational and entertainment books', icon: '📚', color: 'warning' },
      { name: 'Home & Garden', slug: 'home', description: 'Home improvement and garden supplies', icon: '🏠', color: 'info' }
    ];
    
    for (const category of categoryData) {
      await pool.query(
        'INSERT INTO categories (name, slug, description, icon, color) VALUES (?, ?, ?, ?, ?)',
        [category.name, category.slug, category.description, category.icon, category.color]
      );
    }
    
    // Insert sample products
    const productData = [
      {
        name: 'Wireless Bluetooth Headphones',
        description: 'High-quality wireless headphones with noise cancellation',
        long_description: 'Experience crystal-clear sound with our premium wireless Bluetooth headphones. Features include active noise cancellation, 30-hour battery life, and premium comfort for extended listening sessions.',
        price: 99.99,
        category_id: 1,
        image_url: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=400&h=300&fit=crop',
        rating: 4.5,
        stock: 15,
        brand: 'AudioTech',
        features: JSON.stringify(['Active Noise Cancellation', '30-hour Battery Life', 'Premium Comfort', 'Bluetooth 5.0'])
      },
      {
        name: 'Smart Fitness Watch',
        description: 'Advanced fitness tracking with heart rate monitor',
        long_description: 'Track your fitness journey with our advanced smart fitness watch. Monitor heart rate, track workouts, analyze sleep patterns, and stay connected with smartphone notifications.',
        price: 199.99,
        category_id: 1,
        image_url: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=400&h=300&fit=crop',
        rating: 4.7,
        stock: 8,
        brand: 'FitTech',
        features: JSON.stringify(['Heart Rate Monitor', 'GPS Tracking', 'Sleep Analysis', 'Water Resistant'])
      },
      {
        name: 'Premium Cotton T-Shirt',
        description: 'Soft, breathable cotton t-shirt in various colors',
        long_description: 'Stay comfortable and stylish with our premium cotton t-shirt. Made from 100% organic cotton, this t-shirt features a modern fit, reinforced stitching, and is available in multiple colors.',
        price: 29.99,
        category_id: 2,
        image_url: 'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=400&h=300&fit=crop',
        rating: 4.3,
        stock: 50,
        brand: 'CottonCo',
        features: JSON.stringify(['100% Organic Cotton', 'Modern Fit', 'Reinforced Stitching', 'Multiple Colors'])
      },
      {
        name: 'Designer Coffee Mug',
        description: 'Beautiful ceramic coffee mug with unique design',
        long_description: 'Start your day with style using our designer coffee mug. Features beautiful ceramic construction, unique designs, and microwave-safe material. Perfect for coffee, tea, or any hot beverage.',
        price: 19.99,
        category_id: 4,
        image_url: 'https://images.unsplash.com/photo-1517668808822-9ebb02f2a0e6?w=400&h=300&fit=crop',
        rating: 4.2,
        stock: 45,
        brand: 'HomeStyle',
        features: JSON.stringify(['Ceramic Construction', 'Unique Designs', 'Microwave Safe', 'Dishwasher Safe'])
      }
    ];
    
    for (const product of productData) {
      await pool.query(
        'INSERT INTO products (name, description, long_description, price, category_id, image_url, rating, stock, brand, features) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)',
        [product.name, product.description, product.long_description, product.price, product.category_id, product.image_url, product.rating, product.stock, product.brand, product.features]
      );
    }
    
    console.log('📊 Sample data inserted successfully');
  } catch (error) {
    console.error('❌ Error inserting sample data:', error.message);
  }
};

// Initialize database on startup
const init = async () => {
  try {
    await initializeDatabase();
    await insertSampleData();
  } catch (error) {
    console.error('❌ Database initialization failed:', error.message);
  }
};

// Export pool and functions
module.exports = {
  pool,
  query: (sql, params) => pool.query(sql, params),
  testConnection,
  init
};
