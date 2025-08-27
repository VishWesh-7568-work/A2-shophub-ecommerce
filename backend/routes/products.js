const express = require('express');
const { pool } = require('../config/database');

const router = express.Router();

// Get all products with filtering, sorting, and pagination
router.get('/', async (req, res) => {
  try {
    const {
      page = 1,
      limit = 12,
      category,
      min_price,
      max_price,
      sort_by = 'name',
      sort_order = 'asc',
      search
    } = req.query;

    // Calculate offset for pagination
    const offset = (page - 1) * limit;
    
    // Build WHERE clause
    let whereClause = 'WHERE 1=1';
    const params = [];
    
    if (category) {
      whereClause += ' AND c.slug = ?';
      params.push(category);
    }
    
    if (min_price) {
      whereClause += ' AND p.price >= ?';
      params.push(parseFloat(min_price));
    }
    
    if (max_price) {
      whereClause += ' AND p.price <= ?';
      params.push(parseFloat(max_price));
    }
    
    if (search) {
      whereClause += ' AND (p.name LIKE ? OR p.description LIKE ? OR p.brand LIKE ?)';
      const searchTerm = `%${search}%`;
      params.push(searchTerm, searchTerm, searchTerm);
    }
    
    // Build ORDER BY clause
    let orderClause = 'ORDER BY ';
    switch (sort_by) {
      case 'price':
        orderClause += `p.price ${sort_order.toUpperCase()}`;
        break;
      case 'rating':
        orderClause += `p.rating ${sort_order.toUpperCase()}`;
        break;
      case 'name':
      default:
        orderClause += `p.name ${sort_order.toUpperCase()}`;
        break;
    }
    
    // Get total count for pagination
    const [countResult] = await pool.query(`
      SELECT COUNT(*) as total
      FROM products p
      LEFT JOIN categories c ON p.category_id = c.id
      ${whereClause}
    `, params);
    
    const totalProducts = countResult[0].total;
    const totalPages = Math.ceil(totalProducts / limit);
    
    // Get products with pagination
    const [products] = await pool.query(`
      SELECT 
        p.id,
        p.name,
        p.description,
        p.long_description,
        p.price,
        p.image_url,
        p.rating,
        p.stock,
        p.brand,
        p.features,
        p.created_at,
        c.id as category_id,
        c.name as category_name,
        c.slug as category_slug,
        c.icon as category_icon,
        c.color as category_color
      FROM products p
      LEFT JOIN categories c ON p.category_id = c.id
      ${whereClause}
      ${orderClause}
      LIMIT ? OFFSET ?
    `, [...params, parseInt(limit), offset]);
    
    // Parse features JSON
    const productsWithParsedFeatures = products.map(product => ({
      ...product,
      features: product.features ? JSON.parse(product.features) : []
    }));
    
    res.status(200).json({
      status: 'success',
      data: {
        products: productsWithParsedFeatures,
        pagination: {
          current_page: parseInt(page),
          total_pages: totalPages,
          total_products,
          products_per_page: parseInt(limit),
          has_next: page < totalPages,
          has_prev: page > 1
        },
        filters: {
          category,
          min_price,
          max_price,
          sort_by,
          sort_order,
          search
        }
      }
    });

  } catch (error) {
    console.error('Products error:', error);
    res.status(500).json({
      status: 'error',
      message: 'Failed to fetch products'
    });
  }
});

// Get product by ID
router.get('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    
    const [products] = await pool.query(`
      SELECT 
        p.id,
        p.name,
        p.description,
        p.long_description,
        p.price,
        p.image_url,
        p.rating,
        p.stock,
        p.brand,
        p.features,
        p.created_at,
        c.id as category_id,
        c.name as category_name,
        c.slug as category_slug,
        c.icon as category_icon,
        c.color as category_color
      FROM products p
      LEFT JOIN categories c ON p.category_id = c.id
      WHERE p.id = ?
    `, [id]);
    
    if (products.length === 0) {
      return res.status(404).json({
        status: 'error',
        message: 'Product not found'
      });
    }
    
    const product = products[0];
    
    // Parse features JSON
    if (product.features) {
      product.features = JSON.parse(product.features);
    }
    
    // Get related products (same category, different product)
    const [relatedProducts] = await pool.query(`
      SELECT 
        p.id,
        p.name,
        p.description,
        p.price,
        p.image_url,
        p.rating,
        p.stock,
        c.name as category_name,
        c.slug as category_slug
      FROM products p
      LEFT JOIN categories c ON p.category_id = c.id
      WHERE p.category_id = ? AND p.id != ? AND p.stock > 0
      ORDER BY p.rating DESC
      LIMIT 4
    `, [product.category_id, id]);
    
    res.status(200).json({
      status: 'success',
      data: {
        product,
        related_products: relatedProducts
      }
    });

  } catch (error) {
    console.error('Product detail error:', error);
    res.status(500).json({
      status: 'error',
      message: 'Failed to fetch product details'
    });
  }
});

// Get products by category
router.get('/category/:categorySlug', async (req, res) => {
  try {
    const { categorySlug } = req.params;
    const { page = 1, limit = 12, sort_by = 'name', sort_order = 'asc' } = req.query;
    
    const offset = (page - 1) * limit;
    
    // Get category details
    const [categories] = await pool.query(
      'SELECT * FROM categories WHERE slug = ?',
      [categorySlug]
    );
    
    if (categories.length === 0) {
      return res.status(404).json({
        status: 'error',
        message: 'Category not found'
      });
    }
    
    const category = categories[0];
    
    // Build ORDER BY clause
    let orderClause = 'ORDER BY ';
    switch (sort_by) {
      case 'price':
        orderClause += `p.price ${sort_order.toUpperCase()}`;
        break;
      case 'rating':
        orderClause += `p.rating ${sort_order.toUpperCase()}`;
        break;
      case 'name':
      default:
        orderClause += `p.name ${sort_order.toUpperCase()}`;
        break;
    }
    
    // Get total count
    const [countResult] = await pool.query(
      'SELECT COUNT(*) as total FROM products WHERE category_id = ?',
      [category.id]
    );
    
    const totalProducts = countResult[0].total;
    const totalPages = Math.ceil(totalProducts / limit);
    
    // Get products
    const [products] = await pool.query(`
      SELECT 
        p.id,
        p.name,
        p.description,
        p.price,
        p.image_url,
        p.rating,
        p.stock,
        p.brand,
        p.features,
        c.name as category_name,
        c.slug as category_slug
      FROM products p
      LEFT JOIN categories c ON p.category_id = c.id
      WHERE p.category_id = ?
      ${orderClause}
      LIMIT ? OFFSET ?
    `, [category.id, parseInt(limit), offset]);
    
    // Parse features JSON
    const productsWithParsedFeatures = products.map(product => ({
      ...product,
      features: product.features ? JSON.parse(product.features) : []
    }));
    
    res.status(200).json({
      status: 'success',
      data: {
        category,
        products: productsWithParsedFeatures,
        pagination: {
          current_page: parseInt(page),
          total_pages: totalPages,
          total_products,
          products_per_page: parseInt(limit),
          has_next: page < totalPages,
          has_prev: page > 1
        }
      }
    });

  } catch (error) {
    console.error('Category products error:', error);
    res.status(500).json({
      status: 'error',
      message: 'Failed to fetch category products'
    });
  }
});

// Search products
router.get('/search/:query', async (req, res) => {
  try {
    const { query } = req.params;
    const { page = 1, limit = 12 } = req.query;
    
    if (!query || query.length < 2) {
      return res.status(400).json({
        status: 'error',
        message: 'Search query must be at least 2 characters long'
      });
    }
    
    const offset = (page - 1) * limit;
    const searchTerm = `%${query}%`;
    
    // Get total count
    const [countResult] = await pool.query(`
      SELECT COUNT(*) as total
      FROM products p
      LEFT JOIN categories c ON p.category_id = c.id
      WHERE p.name LIKE ? OR p.description LIKE ? OR p.brand LIKE ? OR c.name LIKE ?
    `, [searchTerm, searchTerm, searchTerm, searchTerm]);
    
    const totalProducts = countResult[0].total;
    const totalPages = Math.ceil(totalProducts / limit);
    
    // Get products
    const [products] = await pool.query(`
      SELECT 
        p.id,
        p.name,
        p.description,
        p.price,
        p.image_url,
        p.rating,
        p.stock,
        p.brand,
        c.name as category_name,
        c.slug as category_slug
      FROM products p
      LEFT JOIN categories c ON p.category_id = c.id
      WHERE p.name LIKE ? OR p.description LIKE ? OR p.brand LIKE ? OR c.name LIKE ?
      ORDER BY p.rating DESC, p.name ASC
      LIMIT ? OFFSET ?
    `, [searchTerm, searchTerm, searchTerm, searchTerm, parseInt(limit), offset]);
    
    res.status(200).json({
      status: 'success',
      data: {
        query,
        products,
        pagination: {
          current_page: parseInt(page),
          total_pages: totalPages,
          total_products,
          products_per_page: parseInt(limit),
          has_next: page < totalPages,
          has_prev: page > 1
        }
      }
    });

  } catch (error) {
    console.error('Search error:', error);
    res.status(500).json({
      status: 'error',
      message: 'Failed to search products'
    });
  }
});

// Get product categories
router.get('/categories/all', async (req, res) => {
  try {
    const [categories] = await pool.query(`
      SELECT 
        c.id,
        c.name,
        c.slug,
        c.description,
        c.icon,
        c.color,
        COUNT(p.id) as product_count
      FROM categories c
      LEFT JOIN products p ON c.id = p.category_id
      GROUP BY c.id
      ORDER BY c.name ASC
    `);
    
    res.status(200).json({
      status: 'success',
      data: {
        categories,
        count: categories.length
      }
    });

  } catch (error) {
    console.error('Categories error:', error);
    res.status(500).json({
      status: 'error',
      message: 'Failed to fetch categories'
    });
  }
});

module.exports = router;
