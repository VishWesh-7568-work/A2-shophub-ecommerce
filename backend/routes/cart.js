const express = require('express');
const { body, validationResult } = require('express-validator');
const { pool } = require('../config/database');
const { optionalAuth } = require('../middleware/auth');

const router = express.Router();

// Use optional authentication for cart operations
router.use(optionalAuth);

// Get cart items
router.get('/', async (req, res) => {
  try {
    let cartItems = [];
    
    if (req.user) {
      // Get cart items for authenticated user
      const [items] = await pool.query(`
        SELECT 
          c.id as cart_id,
          c.quantity,
          c.created_at as added_at,
          p.id,
          p.name,
          p.description,
          p.price,
          p.image_url,
          p.stock,
          p.brand,
          cat.name as category_name,
          cat.slug as category_slug
        FROM cart c
        JOIN products p ON c.product_id = p.id
        LEFT JOIN categories cat ON p.category_id = cat.id
        WHERE c.user_id = ?
        ORDER BY c.created_at DESC
      `, [req.user.id]);
      
      cartItems = items;
    } else {
      // For guest users, you might want to implement session-based cart
      // For now, return empty cart
      cartItems = [];
    }
    
    // Calculate cart summary
    const subtotal = cartItems.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    const taxRate = 0.08; // 8% tax
    const taxAmount = subtotal * taxRate;
    const shippingCost = subtotal > 50 ? 0 : 5.99; // Free shipping over $50
    const total = subtotal + taxAmount + shippingCost;
    
    res.status(200).json({
      status: 'success',
      data: {
        items: cartItems,
        summary: {
          subtotal: parseFloat(subtotal.toFixed(2)),
          tax_rate: taxRate,
          tax_amount: parseFloat(taxAmount.toFixed(2)),
          shipping_cost: parseFloat(shippingCost.toFixed(2)),
          total: parseFloat(total.toFixed(2)),
          item_count: cartItems.length,
          total_quantity: cartItems.reduce((sum, item) => sum + item.quantity, 0)
        }
      }
    });

  } catch (error) {
    console.error('Get cart error:', error);
    res.status(500).json({
      status: 'error',
      message: 'Failed to fetch cart items'
    });
  }
});

// Add item to cart
router.post('/add', [
  body('product_id').isInt().withMessage('Product ID must be a valid integer'),
  body('quantity').isInt({ min: 1 }).withMessage('Quantity must be at least 1')
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

    const { product_id, quantity } = req.body;
    
    // Check if product exists and has sufficient stock
    const [products] = await pool.query(
      'SELECT id, name, price, stock FROM products WHERE id = ?',
      [product_id]
    );
    
    if (products.length === 0) {
      return res.status(404).json({
        status: 'error',
        message: 'Product not found'
      });
    }
    
    const product = products[0];
    
    if (product.stock < quantity) {
      return res.status(400).json({
        status: 'error',
        message: `Insufficient stock. Only ${product.stock} items available.`
      });
    }
    
    if (req.user) {
      // Check if item already exists in cart for authenticated user
      const [existingItems] = await pool.query(
        'SELECT id, quantity FROM cart WHERE user_id = ? AND product_id = ?',
        [req.user.id, product_id]
      );
      
      if (existingItems.length > 0) {
        // Update quantity
        const newQuantity = existingItems[0].quantity + quantity;
        
        if (newQuantity > product.stock) {
          return res.status(400).json({
            status: 'error',
            message: `Cannot add ${quantity} more items. Total quantity would exceed available stock.`
          });
        }
        
        await pool.query(
          'UPDATE cart SET quantity = ?, updated_at = CURRENT_TIMESTAMP WHERE id = ?',
          [newQuantity, existingItems[0].id]
        );
        
        // Get updated cart item
        const [updatedItems] = await pool.query(`
          SELECT 
            c.id as cart_id,
            c.quantity,
            c.created_at as added_at,
            p.id,
            p.name,
            p.description,
            p.price,
            p.image_url,
            p.stock,
            p.brand,
            cat.name as category_name,
            cat.slug as category_slug
          FROM cart c
          JOIN products p ON c.product_id = p.id
          LEFT JOIN categories cat ON p.category_id = cat.id
          WHERE c.id = ?
        `, [existingItems[0].id]);
        
        res.status(200).json({
          status: 'success',
          message: 'Cart item quantity updated',
          data: {
            cart_item: updatedItems[0]
          }
        });
      } else {
        // Add new item to cart
        const [result] = await pool.query(
          'INSERT INTO cart (user_id, product_id, quantity) VALUES (?, ?, ?)',
          [req.user.id, product_id, quantity]
        );
        
        // Get newly added cart item
        const [newItems] = await pool.query(`
          SELECT 
            c.id as cart_id,
            c.quantity,
            c.created_at as added_at,
            p.id,
            p.name,
            p.description,
            p.price,
            p.image_url,
            p.stock,
            p.brand,
            cat.name as category_name,
            cat.slug as category_slug
          FROM cart c
          JOIN products p ON c.product_id = p.id
          LEFT JOIN categories cat ON p.category_id = cat.id
          WHERE c.id = ?
        `, [result.insertId]);
        
        res.status(201).json({
          status: 'success',
          message: 'Item added to cart successfully',
          data: {
            cart_item: newItems[0]
          }
        });
      }
    } else {
      // For guest users, you might want to implement session-based cart
      // For now, return an error suggesting to login
      res.status(401).json({
        status: 'error',
        message: 'Please login to add items to cart'
      });
    }

  } catch (error) {
    console.error('Add to cart error:', error);
    res.status(500).json({
      status: 'error',
      message: 'Failed to add item to cart'
    });
  }
});

// Update cart item quantity
router.put('/update/:cartId', [
  body('quantity').isInt({ min: 1 }).withMessage('Quantity must be at least 1')
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

    const { cartId } = req.params;
    const { quantity } = req.body;
    
    if (!req.user) {
      return res.status(401).json({
        status: 'error',
        message: 'Authentication required'
      });
    }
    
    // Check if cart item exists and belongs to user
    const [cartItems] = await pool.query(
      'SELECT c.id, c.product_id, p.stock FROM cart c JOIN products p ON c.product_id = p.id WHERE c.id = ? AND c.user_id = ?',
      [cartId, req.user.id]
    );
    
    if (cartItems.length === 0) {
      return res.status(404).json({
        status: 'error',
        message: 'Cart item not found'
      });
    }
    
    const cartItem = cartItems[0];
    
    // Check stock availability
    if (quantity > cartItem.stock) {
      return res.status(400).json({
        status: 'error',
        message: `Cannot update quantity. Only ${cartItem.stock} items available.`
      });
    }
    
    // Update quantity
    await pool.query(
      'UPDATE cart SET quantity = ?, updated_at = CURRENT_TIMESTAMP WHERE id = ?',
      [quantity, cartId]
    );
    
    // Get updated cart item
    const [updatedItems] = await pool.query(`
      SELECT 
        c.id as cart_id,
        c.quantity,
        c.created_at as added_at,
        p.id,
        p.name,
        p.description,
        p.price,
        p.image_url,
        p.stock,
        p.brand,
        cat.name as category_name,
        cat.slug as category_slug
      FROM cart c
      JOIN products p ON c.product_id = p.id
      LEFT JOIN categories cat ON p.category_id = cat.id
      WHERE c.id = ?
    `, [cartId]);
    
    res.status(200).json({
      status: 'success',
      message: 'Cart item updated successfully',
      data: {
        cart_item: updatedItems[0]
      }
    });

  } catch (error) {
    console.error('Update cart error:', error);
    res.status(500).json({
      status: 'error',
      message: 'Failed to update cart item'
    });
  }
});

// Remove item from cart
router.delete('/remove/:cartId', async (req, res) => {
  try {
    const { cartId } = req.params;
    
    if (!req.user) {
      return res.status(401).json({
        status: 'error',
        message: 'Authentication required'
      });
    }
    
    // Check if cart item exists and belongs to user
    const [cartItems] = await pool.query(
      'SELECT id FROM cart WHERE id = ? AND user_id = ?',
      [cartId, req.user.id]
    );
    
    if (cartItems.length === 0) {
      return res.status(404).json({
        status: 'error',
        message: 'Cart item not found'
      });
    }
    
    // Remove item from cart
    await pool.query('DELETE FROM cart WHERE id = ?', [cartId]);
    
    res.status(200).json({
      status: 'success',
      message: 'Item removed from cart successfully'
    });

  } catch (error) {
    console.error('Remove from cart error:', error);
    res.status(500).json({
      status: 'error',
      message: 'Failed to remove item from cart'
    });
  }
});

// Clear entire cart
router.delete('/clear', async (req, res) => {
  try {
    if (!req.user) {
      return res.status(401).json({
        status: 'error',
        message: 'Authentication required'
      });
    }
    
    // Clear all items from user's cart
    await pool.query('DELETE FROM cart WHERE user_id = ?', [req.user.id]);
    
    res.status(200).json({
      status: 'success',
      message: 'Cart cleared successfully'
    });

  } catch (error) {
    console.error('Clear cart error:', error);
    res.status(500).json({
      status: 'error',
      message: 'Failed to clear cart'
    });
  }
});

// Get cart summary (for quick display)
router.get('/summary', async (req, res) => {
  try {
    let itemCount = 0;
    let totalQuantity = 0;
    let subtotal = 0;
    
    if (req.user) {
      const [items] = await pool.query(`
        SELECT c.quantity, p.price
        FROM cart c
        JOIN products p ON c.product_id = p.id
        WHERE c.user_id = ?
      `, [req.user.id]);
      
      itemCount = items.length;
      totalQuantity = items.reduce((sum, item) => sum + item.quantity, 0);
      subtotal = items.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    }
    
    const taxRate = 0.08;
    const taxAmount = subtotal * taxRate;
    const shippingCost = subtotal > 50 ? 0 : 5.99;
    const total = subtotal + taxAmount + shippingCost;
    
    res.status(200).json({
      status: 'success',
      data: {
        item_count: itemCount,
        total_quantity: totalQuantity,
        subtotal: parseFloat(subtotal.toFixed(2)),
        tax_amount: parseFloat(taxAmount.toFixed(2)),
        shipping_cost: parseFloat(shippingCost.toFixed(2)),
        total: parseFloat(total.toFixed(2))
      }
    });

  } catch (error) {
    console.error('Cart summary error:', error);
    res.status(500).json({
      status: 'error',
      message: 'Failed to fetch cart summary'
    });
  }
});

module.exports = router;
