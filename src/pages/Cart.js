import React, { useState } from 'react';
import { Container, Row, Col, Card, Button, Form, Alert, Badge } from 'react-bootstrap';
import { Link, useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { FaTrash, FaShoppingCart, FaArrowLeft, FaCreditCard, FaTruck } from 'react-icons/fa';

const Cart = () => {
  const { items, removeFromCart, updateQuantity, clearCart, getCartTotal } = useCart();
  const navigate = useNavigate();
  const [showCheckout, setShowCheckout] = useState(false);
  const [checkoutForm, setCheckoutForm] = useState({
    firstName: '',
    lastName: '',
    email: '',
    address: '',
    city: '',
    zipCode: '',
    country: 'United States'
  });

  const taxRate = 0.08; // 8% tax
  const shippingCost = items.length > 0 ? (getCartTotal() > 50 ? 0 : 5.99) : 0;
  const taxAmount = getCartTotal() * taxRate;
  const totalAmount = getCartTotal() + taxAmount + shippingCost;

  const handleQuantityChange = (productId, newQuantity) => {
    if (newQuantity <= 0) {
      removeFromCart(productId);
    } else {
      updateQuantity(productId, newQuantity);
    }
  };

  const handleCheckout = (e) => {
    e.preventDefault();
    // Simulate checkout process
    alert('Thank you for your order! This is a demo checkout.');
    clearCart();
    setShowCheckout(false);
    navigate('/');
  };

  const handleInputChange = (e) => {
    setCheckoutForm({
      ...checkoutForm,
      [e.target.name]: e.target.value
    });
  };

  if (items.length === 0) {
    return (
      <Container className="py-5">
        <Row className="justify-content-center">
          <Col md={6} className="text-center">
            <div className="mb-4">
              <FaShoppingCart size={64} className="text-muted" />
            </div>
            <h2>Your cart is empty</h2>
            <p className="text-muted mb-4">
              Looks like you haven't added any products to your cart yet.
            </p>
            <Button as={Link} to="/products" variant="primary" size="lg">
              Start Shopping
            </Button>
          </Col>
        </Row>
      </Container>
    );
  }

  return (
    <Container className="py-4">
      {/* Page Header */}
      <Row className="mb-4">
        <Col>
          <div className="d-flex align-items-center mb-2">
            <Button 
              variant="outline-secondary" 
              onClick={() => navigate(-1)} 
              className="me-3"
            >
              <FaArrowLeft className="me-2" />
              Back
            </Button>
            <h1 className="mb-0">Shopping Cart</h1>
          </div>
          <p className="text-muted">
            {items.length} {items.length === 1 ? 'item' : 'items'} in your cart
          </p>
        </Col>
      </Row>

      <Row>
        {/* Cart Items */}
        <Col lg={8} className="mb-4">
          <Card>
            <Card.Header>
              <h5 className="mb-0">Cart Items</h5>
            </Card.Header>
            <Card.Body>
              {items.map((item) => (
                <div key={item.id} className="cart-item border-bottom pb-3 mb-3">
                  <Row className="align-items-center">
                    <Col md={2} className="mb-3 mb-md-0">
                      <div className="cart-item-image" style={{ height: '80px', overflow: 'hidden', borderRadius: '4px' }}>
                        <img 
                          src={item.image} 
                          alt={item.name}
                          className="w-100 h-100"
                          style={{ objectFit: 'cover' }}
                        />
                      </div>
                    </Col>
                    
                    <Col md={4} className="mb-3 mb-md-0">
                      <h6 className="mb-1">{item.name}</h6>
                      <Badge bg="secondary" className="mb-2">{item.category}</Badge>
                      <p className="text-muted small mb-0">${item.price}</p>
                    </Col>
                    
                    <Col md={2} className="mb-3 mb-md-0">
                      <div className="d-flex align-items-center">
                        <Button 
                          variant="outline-secondary" 
                          size="sm"
                          onClick={() => handleQuantityChange(item.id, item.quantity - 1)}
                        >
                          -
                        </Button>
                        <Form.Control
                          type="number"
                          value={item.quantity}
                          onChange={(e) => handleQuantityChange(item.id, parseInt(e.target.value) || 1)}
                          min="1"
                          className="mx-2"
                          style={{ width: '60px' }}
                        />
                        <Button 
                          variant="outline-secondary" 
                          size="sm"
                          onClick={() => handleQuantityChange(item.id, item.quantity + 1)}
                        >
                          +
                        </Button>
                      </div>
                    </Col>
                    
                    <Col md={2} className="mb-3 mb-md-0 text-center">
                      <span className="fw-bold">${(item.price * item.quantity).toFixed(2)}</span>
                    </Col>
                    
                    <Col md={2} className="text-center">
                      <Button 
                        variant="outline-danger" 
                        size="sm"
                        onClick={() => removeFromCart(item.id)}
                      >
                        <FaTrash />
                      </Button>
                    </Col>
                  </Row>
                </div>
              ))}
              
              <div className="d-flex justify-content-between align-items-center">
                <Button 
                  variant="outline-secondary" 
                  onClick={clearCart}
                >
                  Clear Cart
                </Button>
                <Button 
                  as={Link} 
                  to="/products" 
                  variant="outline-primary"
                >
                  Continue Shopping
                </Button>
              </div>
            </Card.Body>
          </Card>
        </Col>

        {/* Cart Summary */}
        <Col lg={4}>
          <Card className="sticky-top" style={{ top: '20px' }}>
            <Card.Header>
              <h5 className="mb-0">Order Summary</h5>
            </Card.Header>
            <Card.Body>
              <div className="d-flex justify-content-between mb-2">
                <span>Subtotal ({items.length} {items.length === 1 ? 'item' : 'items'}):</span>
                <span>${getCartTotal().toFixed(2)}</span>
              </div>
              
              <div className="d-flex justify-content-between mb-2">
                <span>Tax (8%):</span>
                <span>${taxAmount.toFixed(2)}</span>
              </div>
              
              <div className="d-flex justify-content-between mb-2">
                <span>Shipping:</span>
                <span>{shippingCost === 0 ? 'Free' : `$${shippingCost.toFixed(2)}`}</span>
              </div>
              
              {shippingCost > 0 && (
                <div className="text-success small mb-3">
                  <FaTruck className="me-1" />
                  Free shipping on orders over $50
                </div>
              )}
              
              <hr />
              
              <div className="d-flex justify-content-between mb-3">
                <strong>Total:</strong>
                <strong className="text-primary fs-5">${totalAmount.toFixed(2)}</strong>
              </div>
              
              <Button 
                variant="primary" 
                size="lg" 
                className="w-100 mb-2"
                onClick={() => setShowCheckout(true)}
              >
                <FaCreditCard className="me-2" />
                Proceed to Checkout
              </Button>
              
              <div className="text-center">
                <small className="text-muted">
                  Secure checkout powered by Stripe
                </small>
              </div>
            </Card.Body>
          </Card>
        </Col>
      </Row>

      {/* Checkout Modal */}
      {showCheckout && (
        <div className="checkout-overlay position-fixed top-0 start-0 w-100 h-100 bg-dark bg-opacity-50 d-flex align-items-center justify-content-center" style={{ zIndex: 1050 }}>
          <div className="checkout-modal bg-white rounded p-4" style={{ maxWidth: '500px', width: '90%', maxHeight: '90vh', overflowY: 'auto' }}>
            <div className="d-flex justify-content-between align-items-center mb-4">
              <h4>Checkout</h4>
              <Button 
                variant="outline-secondary" 
                size="sm"
                onClick={() => setShowCheckout(false)}
              >
                ×
              </Button>
            </div>
            
            <Form onSubmit={handleCheckout}>
              <Row>
                <Col md={6}>
                  <Form.Group className="mb-3">
                    <Form.Label>First Name</Form.Label>
                    <Form.Control
                      type="text"
                      name="firstName"
                      value={checkoutForm.firstName}
                      onChange={handleInputChange}
                      required
                    />
                  </Form.Group>
                </Col>
                <Col md={6}>
                  <Form.Group className="mb-3">
                    <Form.Label>Last Name</Form.Label>
                    <Form.Control
                      type="text"
                      name="lastName"
                      value={checkoutForm.lastName}
                      onChange={handleInputChange}
                      required
                    />
                  </Form.Group>
                </Col>
              </Row>
              
              <Form.Group className="mb-3">
                <Form.Label>Email</Form.Label>
                <Form.Control
                  type="email"
                  name="email"
                  value={checkoutForm.email}
                  onChange={handleInputChange}
                  required
                />
              </Form.Group>
              
              <Form.Group className="mb-3">
                <Form.Label>Address</Form.Label>
                <Form.Control
                  type="text"
                  name="address"
                  value={checkoutForm.address}
                  onChange={handleInputChange}
                  required
                />
              </Form.Group>
              
              <Row>
                <Col md={6}>
                  <Form.Group className="mb-3">
                    <Form.Label>City</Form.Label>
                    <Form.Control
                      type="text"
                      name="city"
                      value={checkoutForm.city}
                      onChange={handleInputChange}
                      required
                    />
                  </Form.Group>
                </Col>
                <Col md={6}>
                  <Form.Group className="mb-3">
                    <Form.Label>ZIP Code</Form.Label>
                    <Form.Control
                      type="text"
                      name="zipCode"
                      value={checkoutForm.zipCode}
                      onChange={handleInputChange}
                      required
                    />
                  </Form.Group>
                </Col>
              </Row>
              
              <Form.Group className="mb-4">
                <Form.Label>Country</Form.Label>
                <Form.Select
                  name="country"
                  value={checkoutForm.country}
                  onChange={handleInputChange}
                >
                  <option value="United States">United States</option>
                  <option value="Canada">Canada</option>
                  <option value="United Kingdom">United Kingdom</option>
                  <option value="Australia">Australia</option>
                </Form.Select>
              </Form.Group>
              
              <div className="d-grid gap-2">
                <Button type="submit" variant="primary" size="lg">
                  Complete Order - ${totalAmount.toFixed(2)}
                </Button>
                <Button 
                  type="button" 
                  variant="outline-secondary"
                  onClick={() => setShowCheckout(false)}
                >
                  Cancel
                </Button>
              </div>
            </Form>
          </div>
        </div>
      )}
    </Container>
  );
};

export default Cart;
