const express = require('express');
const { pool } = require('../config/database');

const router = express.Router();

// Get featured products for home page
router.get('/featured-products', async (req, res) => {
  try {
    // Get featured products (top rated, in stock)
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
      WHERE p.stock > 0
      ORDER BY p.rating DESC, p.stock DESC
      LIMIT 8
    `);

    res.status(200).json({
      status: 'success',
      data: {
        products,
        count: products.length
      }
    });

  } catch (error) {
    console.error('Featured products error:', error);
    res.status(500).json({
      status: 'error',
      message: 'Failed to fetch featured products'
    });
  }
});

// Get all categories for home page
router.get('/categories', async (req, res) => {
  try {
    const [categories] = await pool.query(`
      SELECT 
        id,
        name,
        slug,
        description,
        icon,
        color
      FROM categories
      ORDER BY name ASC
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

// Get promotional content and banners
router.get('/promotions', async (req, res) => {
  try {
    // This could be dynamic content from database in the future
    const promotions = [
      {
        id: 1,
        title: "Welcome to ShopHub",
        subtitle: "Discover amazing products at unbeatable prices",
        description: "Shop the latest trends and essentials with our wide selection of products",
        image_url: "https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=800&h=400&fit=crop",
        button_text: "Shop Now",
        button_link: "/products",
        background_color: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
        text_color: "white"
      },
      {
        id: 2,
        title: "New Arrivals",
        subtitle: "Check out our latest collection",
        description: "Explore trending products and exclusive deals",
        image_url: "https://images.unsplash.com/photo-1441984904996-e0b6ba687e04?w=800&h=400&fit=crop",
        button_text: "Explore New Products",
        button_link: "/products",
        background_color: "linear-gradient(135deg, #f093fb 0%, #f5576c 100%)",
        text_color: "white"
      }
    ];

    res.status(200).json({
      status: 'success',
      data: {
        promotions,
        count: promotions.length
      }
    });

  } catch (error) {
    console.error('Promotions error:', error);
    res.status(500).json({
      status: 'error',
      message: 'Failed to fetch promotions'
    });
  }
});

// Get home page statistics
router.get('/stats', async (req, res) => {
  try {
    // Get total products count
    const [productCount] = await pool.query('SELECT COUNT(*) as count FROM products');
    
    // Get total categories count
    const [categoryCount] = await pool.query('SELECT COUNT(*) as count FROM categories');
    
    // Get total users count (optional - for admin purposes)
    const [userCount] = await pool.query('SELECT COUNT(*) as count FROM users');

    res.status(200).json({
      status: 'success',
      data: {
        total_products: productCount[0].count,
        total_categories: categoryCount[0].count,
        total_users: userCount[0].count
      }
    });

  } catch (error) {
    console.error('Stats error:', error);
    res.status(500).json({
      status: 'error',
      message: 'Failed to fetch statistics'
    });
  }
});

// Get search suggestions
router.get('/search-suggestions', async (req, res) => {
  try {
    const { q } = req.query;
    
    if (!q || q.length < 2) {
      return res.status(200).json({
        status: 'success',
        data: {
          suggestions: [],
          count: 0
        }
      });
    }

    // Search in products and categories
    const [products] = await pool.query(`
      SELECT 
        'product' as type,
        id,
        name,
        price,
        image_url,
        category_id
      FROM products 
      WHERE name LIKE ? OR description LIKE ?
      LIMIT 5
    `, [`%${q}%`, `%${q}%`]);

    const [categories] = await pool.query(`
      SELECT 
        'category' as type,
        id,
        name,
        slug,
        icon
      FROM categories 
      WHERE name LIKE ? OR description LIKE ?
      LIMIT 3
    `, [`%${q}%`, `%${q}%`]);

    const suggestions = [...products, ...categories];

    res.status(200).json({
      status: 'success',
      data: {
        suggestions,
        count: suggestions.length
      }
    });

  } catch (error) {
    console.error('Search suggestions error:', error);
    res.status(500).json({
      status: 'error',
      message: 'Failed to fetch search suggestions'
    });
  }
});

// Get home page complete data (for initial load)
router.get('/home-data', async (req, res) => {
  try {
    // Get all data in parallel for better performance
    const [featuredProducts, categories, promotions] = await Promise.all([
      pool.query(`
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
        WHERE p.stock > 0
        ORDER BY p.rating DESC, p.stock DESC
        LIMIT 8
      `),
      pool.query(`
        SELECT 
          id,
          name,
          slug,
          description,
          icon,
          color
        FROM categories
        ORDER BY name ASC
      `),
      Promise.resolve([
        {
          id: 1,
          title: "Welcome to ShopHub",
          subtitle: "Discover amazing products at unbeatable prices",
          description: "Shop the latest trends and essentials with our wide selection of products",
          image_url: "https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=800&h=400&fit=crop",
          button_text: "Shop Now",
          button_link: "/products",
          background_color: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
          text_color: "white"
        },
        {
          id: 2,
          title: "New Arrivals",
          subtitle: "Check out our latest collection",
          description: "Explore trending products and exclusive deals",
          image_url: "https://images.unsplash.com/photo-1441984904996-e0b6ba687e04?w=800&h=400&fit=crop",
          button_text: "Explore New Products",
          button_link: "/products",
          background_color: "linear-gradient(135deg, #f093fb 0%, #f5576c 100%)",
          text_color: "white"
        }
      ])
    ]);

    res.status(200).json({
      status: 'success',
      data: {
        featured_products: featuredProducts[0],
        categories: categories[0],
        promotions: promotions,
        meta: {
          total_products: featuredProducts[0].length,
          total_categories: categories[0].length,
          total_promotions: promotions.length
        }
      }
    });

  } catch (error) {
    console.error('Home data error:', error);
    res.status(500).json({
      status: 'error',
      message: 'Failed to fetch home page data'
    });
  }
});

module.exports = router;
