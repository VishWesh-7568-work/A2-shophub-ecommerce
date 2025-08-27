const express = require('express');
const { body, validationResult } = require('express-validator');
const { pool } = require('../config/database');
const { optionalAuth } = require('../middleware/auth');

const router = express.Router();

// Use optional authentication for checkout operations
router.use(optionalAuth);

// Process checkout and create order
router.post('/process', [
  body('shipping_address.first_name').notEmpty().withMessage('First name is required'),
  body('shipping_address.last_name').notEmpty().withMessage('Last name is required'),
  body('shipping_address.email').isEmail().withMessage('Valid email is required'),
  body('shipping_address.address').notEmpty().withMessage('Address is required'),
  body('shipping_address.city').notEmpty().withMessage('City is required'),
  body('shipping_address.zip_code').notEmpty().withMessage('ZIP code is required'),
  body('shipping_address.country').notEmpty().withMessage('Country is required')
], async (req, res) => {
  try {
    // Check for validation errors
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        status: 'error',
        message: 'Validation failed',
        errors: errors.array()
      });
    }

    const { shipping_address } = req.body;
    
    // Get cart items
    let cartItems = [];
    let userId = null;
    
    if (req.user) {
      userId = req.user.id;
      // Get cart items for authenticated user
      const [items] = await pool.query(`
        SELECT 
          c.quantity,
          p.id as product_id,
          p.name,
          p.price,
          p.stock
        FROM cart c
        JOIN products p ON c.product_id = p.id
        WHERE c.user_id = ?
      `, [userId]);
      
      cartItems = items;
    } else {
      // For guest users, you might want to implement session-based cart
      // For now, return an error suggesting to login
      return res.status(401).json({
        status: 'error',
        message: 'Please login to complete checkout'
      });
    }
    
    if (cartItems.length === 0) {
      return res.status(400).json({
        status: 'error',
        message: 'Cart is empty. Cannot process checkout.'
      });
    }
    
    // Validate stock availability
    for (const item of cartItems) {
      if (item.quantity > item.stock) {
        return res.status(400).json({
          status: 'error',
          message: `Insufficient stock for ${item.name}. Only ${item.stock} items available.`
        });
      }
    }
    
    // Calculate order totals
    const subtotal = cartItems.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    const taxRate = 0.08; // 8% tax
    const taxAmount = subtotal * taxRate;
    const shippingCost = subtotal > 50 ? 0 : 5.99; // Free shipping over $50
    const totalAmount = subtotal + taxAmount + shippingCost;
    
    // Start transaction
    const connection = await pool.getConnection();
    await connection.beginTransaction();
    
    try {
      // Create order
      const [orderResult] = await connection.query(`
        INSERT INTO orders (
          user_id, 
          total_amount, 
          tax_amount, 
          shipping_amount, 
          status, 
          shipping_address
        ) VALUES (?, ?, ?, ?, 'pending', ?)
      `, [
        userId,
        totalAmount,
        taxAmount,
        shippingCost,
        JSON.stringify(shipping_address)
      ]);
      
      const orderId = orderResult.insertId;
      
      // Create order items
      for (const item of cartItems) {
        await connection.query(`
          INSERT INTO order_items (order_id, product_id, quantity, price)
          VALUES (?, ?, ?, ?)
        `, [orderId, item.product_id, item.quantity, item.price]);
        
        // Update product stock
        await connection.query(`
          UPDATE products 
          SET stock = stock - ? 
          WHERE id = ?
        `, [item.quantity, item.product_id]);
      }
      
      // Clear user's cart
      await connection.query('DELETE FROM cart WHERE user_id = ?', [userId]);
      
      // Commit transaction
      await connection.commit();
      
      // Get order details
      const [orders] = await pool.query(`
        SELECT 
          o.id,
          o.total_amount,
          o.tax_amount,
          o.shipping_amount,
          o.status,
          o.shipping_address,
          o.created_at,
          COUNT(oi.id) as item_count
        FROM orders o
        LEFT JOIN order_items oi ON o.id = oi.order_id
        WHERE o.id = ?
        GROUP BY o.id
      `, [orderId]);
      
      const order = orders[0];
      order.shipping_address = JSON.parse(order.shipping_address);
      
      res.status(201).json({
        status: 'success',
        message: 'Order placed successfully!',
        data: {
          order,
          order_number: `ORD-${orderId.toString().padStart(6, '0')}`,
          estimated_delivery: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString().split('T')[0] // 7 days from now
        }
      });
      
    } catch (error) {
      // Rollback transaction on error
      await connection.rollback();
      throw error;
    } finally {
      connection.release();
    }

  } catch (error) {
    console.error('Checkout error:', error);
    res.status(500).json({
      status: 'error',
      message: 'Failed to process checkout'
    });
  }
});

// Get order history for authenticated user
router.get('/orders', async (req, res) => {
  try {
    if (!req.user) {
      return res.status(401).json({
        status: 'error',
        message: 'Authentication required'
      });
    }
    
    const { page = 1, limit = 10 } = req.query;
    const offset = (page - 1) * limit;
    
    // Get total count
    const [countResult] = await pool.query(
      'SELECT COUNT(*) as total FROM orders WHERE user_id = ?',
      [req.user.id]
    );
    
    const totalOrders = countResult[0].total;
    const totalPages = Math.ceil(totalOrders / limit);
    
    // Get orders with pagination
    const [orders] = await pool.query(`
      SELECT 
        o.id,
        o.total_amount,
        o.tax_amount,
        o.shipping_amount,
        o.status,
        o.shipping_address,
        o.created_at,
        COUNT(oi.id) as item_count
      FROM orders o
      LEFT JOIN order_items oi ON o.id = oi.order_id
      WHERE o.user_id = ?
      GROUP BY o.id
      ORDER BY o.created_at DESC
      LIMIT ? OFFSET ?
    `, [req.user.id, parseInt(limit), offset]);
    
    // Parse shipping address JSON
    const ordersWithParsedAddress = orders.map(order => ({
      ...order,
      shipping_address: JSON.parse(order.shipping_address)
    }));
    
    res.status(200).json({
      status: 'success',
      data: {
        orders: ordersWithParsedAddress,
        pagination: {
          current_page: parseInt(page),
          total_pages: totalPages,
          total_orders: totalOrders,
          orders_per_page: parseInt(limit),
          has_next: page < totalPages,
          has_prev: page > 1
        }
      }
    });

  } catch (error) {
    console.error('Get orders error:', error);
    res.status(500).json({
      status: 'error',
      message: 'Failed to fetch order history'
    });
  }
});

// Get order details by ID
router.get('/orders/:orderId', async (req, res) => {
  try {
    const { orderId } = req.params;
    
    if (!req.user) {
      return res.status(401).json({
        status: 'error',
        message: 'Authentication required'
      });
    }
    
    // Get order details
    const [orders] = await pool.query(`
      SELECT 
        o.id,
        o.total_amount,
        o.tax_amount,
        o.shipping_amount,
        o.status,
        o.shipping_address,
        o.created_at,
        o.updated_at
      FROM orders o
      WHERE o.id = ? AND o.user_id = ?
    `, [orderId, req.user.id]);
    
    if (orders.length === 0) {
      return res.status(404).json({
        status: 'error',
        message: 'Order not found'
      });
    }
    
    const order = orders[0];
    
    // Get order items
    const [orderItems] = await pool.query(`
      SELECT 
        oi.id,
        oi.quantity,
        oi.price,
        p.id as product_id,
        p.name,
        p.description,
        p.image_url,
        p.brand,
        c.name as category_name,
        c.slug as category_slug
      FROM order_items oi
      JOIN products p ON oi.product_id = p.id
      LEFT JOIN categories c ON p.category_id = c.id
      WHERE oi.order_id = ?
    `, [orderId]);
    
    // Parse shipping address JSON
    order.shipping_address = JSON.parse(order.shipping_address);
    
    res.status(200).json({
      status: 'success',
      data: {
        order,
        items: orderItems,
        order_number: `ORD-${orderId.toString().padStart(6, '0')}`
      }
    });

  } catch (error) {
    console.error('Get order details error:', error);
    res.status(500).json({
      status: 'error',
      message: 'Failed to fetch order details'
    });
  }
});

// Cancel order (if status is pending)
router.put('/orders/:orderId/cancel', async (req, res) => {
  try {
    const { orderId } = req.params;
    
    if (!req.user) {
      return res.status(401).json({
        status: 'error',
        message: 'Authentication required'
      });
    }
    
    // Check if order exists and belongs to user
    const [orders] = await pool.query(
      'SELECT id, status FROM orders WHERE id = ? AND user_id = ?',
      [orderId, req.user.id]
    );
    
    if (orders.length === 0) {
      return res.status(404).json({
        status: 'error',
        message: 'Order not found'
      });
    }
    
    const order = orders[0];
    
    if (order.status !== 'pending') {
      return res.status(400).json({
        status: 'error',
        message: 'Only pending orders can be cancelled'
      });
    }
    
    // Start transaction
    const connection = await pool.getConnection();
    await connection.beginTransaction();
    
    try {
      // Update order status
      await connection.query(
        'UPDATE orders SET status = "cancelled" WHERE id = ?',
        [orderId]
      );
      
      // Get order items to restore stock
      const [orderItems] = await connection.query(
        'SELECT product_id, quantity FROM order_items WHERE order_id = ?',
        [orderId]
      );
      
      // Restore product stock
      for (const item of orderItems) {
        await connection.query(`
          UPDATE products 
          SET stock = stock + ? 
          WHERE id = ?
        `, [item.quantity, item.product_id]);
      }
      
      // Commit transaction
      await connection.commit();
      
      res.status(200).json({
        status: 'success',
        message: 'Order cancelled successfully'
      });
      
    } catch (error) {
      // Rollback transaction on error
      await connection.rollback();
      throw error;
    } finally {
      connection.release();
    }

  } catch (error) {
    console.error('Cancel order error:', error);
    res.status(500).json({
      status: 'error',
      message: 'Failed to cancel order'
    });
  }
});

// Get checkout summary (cart totals, shipping, tax)
router.get('/summary', async (req, res) => {
  try {
    let cartItems = [];
    
    if (req.user) {
      // Get cart items for authenticated user
      const [items] = await pool.query(`
        SELECT 
          c.quantity,
          p.id as product_id,
          p.name,
          p.price,
          p.stock
        FROM cart c
        JOIN products p ON c.product_id = p.id
        WHERE c.user_id = ?
      `, [req.user.id]);
      
      cartItems = items;
    }
    
    // Calculate totals
    const subtotal = cartItems.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    const taxRate = 0.08;
    const taxAmount = subtotal * taxRate;
    const shippingCost = subtotal > 50 ? 0 : 5.99;
    const totalAmount = subtotal + taxAmount + shippingCost;
    
    res.status(200).json({
      status: 'success',
      data: {
        cart_summary: {
          item_count: cartItems.length,
          total_quantity: cartItems.reduce((sum, item) => sum + item.quantity, 0),
          subtotal: parseFloat(subtotal.toFixed(2)),
          tax_rate: taxRate,
          tax_amount: parseFloat(taxAmount.toFixed(2)),
          shipping_cost: parseFloat(shippingCost.toFixed(2)),
          total: parseFloat(totalAmount.toFixed(2))
        },
        shipping_info: {
          free_shipping_threshold: 50.00,
          standard_shipping_cost: 5.99,
          estimated_delivery_days: 5,
          return_policy_days: 30
        }
      }
    });

  } catch (error) {
    console.error('Checkout summary error:', error);
    res.status(500).json({
      status: 'error',
      message: 'Failed to fetch checkout summary'
    });
  }
});

module.exports = router;
