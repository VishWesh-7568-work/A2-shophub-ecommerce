import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Card, Button, Badge, Form, Alert } from 'react-bootstrap';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { FaStar, FaShoppingCart, FaArrowLeft } from 'react-icons/fa';

const ProductDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { addToCart } = useCart();
  const [product, setProduct] = useState(null);
  const [quantity, setQuantity] = useState(1);
  const [showAlert, setShowAlert] = useState(false);

  // Sample products data
  const sampleProducts = [
    { id: 1, name: "Wireless Bluetooth Headphones", price: 99.99, category: "electronics", image: "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=400&h=300&fit=crop", rating: 4.5, description: "High-quality wireless headphones with noise cancellation", longDescription: "Experience crystal-clear sound with our premium wireless Bluetooth headphones. Features include active noise cancellation, 30-hour battery life, and premium comfort for extended listening sessions.", features: ["Active Noise Cancellation", "30-hour Battery Life", "Premium Comfort", "Bluetooth 5.0"], stock: 15, brand: "AudioTech" },
    { id: 2, name: "Smart Fitness Watch", price: 199.99, category: "electronics", image: "https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=400&h=300&fit=crop", rating: 4.7, description: "Advanced fitness tracking with heart rate monitor", longDescription: "Track your fitness journey with our advanced smart fitness watch. Monitor heart rate, track workouts, analyze sleep patterns, and stay connected with smartphone notifications.", features: ["Heart Rate Monitor", "GPS Tracking", "Sleep Analysis", "Water Resistant"], stock: 8, brand: "FitTech" },
    { id: 3, name: "Premium Cotton T-Shirt", price: 29.99, category: "clothing", image: "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=400&h=300&fit=crop", rating: 4.3, description: "Soft, breathable cotton t-shirt in various colors", longDescription: "Stay comfortable and stylish with our premium cotton t-shirt. Made from 100% organic cotton, this t-shirt features a modern fit, reinforced stitching, and is available in multiple colors.", features: ["100% Organic Cotton", "Modern Fit", "Reinforced Stitching", "Multiple Colors"], stock: 50, brand: "CottonCo" },
    { id: 4, name: "Designer Coffee Mug", price: 19.99, category: "home", image: "https://images.unsplash.com/photo-1517668808822-9ebb02f2a0e6?w=400&h=300&fit=crop", rating: 4.2, description: "Beautiful ceramic coffee mug with unique design", longDescription: "Start your day with style using our designer coffee mug. Features beautiful ceramic construction, unique designs, and microwave-safe material. Perfect for coffee, tea, or any hot beverage.", features: ["Ceramic Construction", "Unique Designs", "Microwave Safe", "Dishwasher Safe"], stock: 45, brand: "HomeStyle" }
  ];

  useEffect(() => {
    const foundProduct = sampleProducts.find(p => p.id === parseInt(id));
    if (foundProduct) {
      setProduct(foundProduct);
    } else {
      navigate('/products');
    }
  }, [id, navigate]);

  const handleAddToCart = () => {
    if (product) {
      addToCart({ ...product, quantity });
      setShowAlert(true);
      setTimeout(() => setShowAlert(false), 3000);
    }
  };

  if (!product) {
    return <div>Loading...</div>;
  }

  return (
    <Container className="py-4">
      {/* Breadcrumb */}
      <nav aria-label="breadcrumb" className="mb-4">
        <ol className="breadcrumb">
          <li className="breadcrumb-item">
            <Link to="/" className="text-decoration-none">Home</Link>
          </li>
          <li className="breadcrumb-item">
            <Link to="/products" className="text-decoration-none">Products</Link>
          </li>
          <li className="breadcrumb-item active">{product.name}</li>
        </ol>
      </nav>

      {/* Success Alert */}
      {showAlert && (
        <Alert variant="success" dismissible onClose={() => setShowAlert(false)} className="mb-4">
          <FaShoppingCart className="me-2" />
          Product added to cart successfully!
        </Alert>
      )}

      <Row>
        {/* Product Image */}
        <Col lg={6} className="mb-4">
          <div className="main-image-container mb-3" style={{ height: '400px', overflow: 'hidden', borderRadius: '8px' }}>
            <img 
              src={product.image} 
              alt={product.name}
              className="w-100 h-100"
              style={{ objectFit: 'cover' }}
            />
          </div>
        </Col>

        {/* Product Information */}
        <Col lg={6}>
          <div className="product-info">
            <Badge bg="secondary" className="mb-2">{product.category}</Badge>
            <h1 className="mb-3">{product.name}</h1>
            
            {/* Rating */}
            <div className="d-flex align-items-center mb-3">
              <div className="d-flex align-items-center me-2">
                {[...Array(5)].map((_, i) => (
                  <FaStar 
                    key={i} 
                    className={i < Math.floor(product.rating) ? 'text-warning' : 'text-muted'} 
                    size={16}
                  />
                ))}
              </div>
              <span className="text-muted me-3">({product.rating})</span>
              <span className="text-muted">• {product.stock} in stock</span>
            </div>

            {/* Price */}
            <div className="mb-4">
              <span className="display-6 text-primary fw-bold">${product.price}</span>
            </div>

            {/* Description */}
            <p className="text-muted mb-4">{product.longDescription}</p>

            {/* Features */}
            <div className="mb-4">
              <h6>Key Features:</h6>
              <ul className="list-unstyled">
                {product.features.map((feature, index) => (
                  <li key={index} className="mb-1">
                    <span className="text-success me-2">✓</span>
                    {feature}
                  </li>
                ))}
              </ul>
            </div>

            {/* Add to Cart Section */}
            <Card className="mb-4">
              <Card.Body>
                <div className="d-flex align-items-center mb-3">
                  <Form.Label className="me-3 mb-0">Quantity:</Form.Label>
                  <div className="d-flex align-items-center">
                    <Button 
                      variant="outline-secondary" 
                      size="sm"
                      onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    >
                      -
                    </Button>
                    <Form.Control
                      type="number"
                      value={quantity}
                      onChange={(e) => setQuantity(Math.max(1, parseInt(e.target.value) || 1))}
                      min="1"
                      max={product.stock}
                      className="mx-2"
                      style={{ width: '70px' }}
                    />
                    <Button 
                      variant="outline-secondary" 
                      size="sm"
                      onClick={() => setQuantity(Math.min(product.stock, quantity + 1))}
                    >
                      +
                    </Button>
                  </div>
                </div>
                
                <div className="d-grid gap-2">
                  <Button 
                    variant="primary" 
                    size="lg"
                    onClick={handleAddToCart}
                    disabled={product.stock === 0}
                  >
                    <FaShoppingCart className="me-2" />
                    {product.stock === 0 ? 'Out of Stock' : 'Add to Cart'}
                  </Button>
                </div>
              </Card.Body>
            </Card>

            {/* Product Details */}
            <Row className="mb-4">
              <Col md={6}>
                <div className="d-flex align-items-center mb-2">
                  <strong className="me-2">Brand:</strong>
                  <span>{product.brand}</span>
                </div>
              </Col>
              <Col md={6}>
                <div className="d-flex align-items-center mb-2">
                  <strong className="me-2">Category:</strong>
                  <span className="text-capitalize">{product.category}</span>
                </div>
              </Col>
            </Row>
          </div>
        </Col>
      </Row>
    </Container>
  );
};

export default ProductDetail;
