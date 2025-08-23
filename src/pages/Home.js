import React from 'react';
import { Container, Row, Col, Card, Button, Carousel } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import { FaArrowRight, FaStar } from 'react-icons/fa';

const Home = () => {
  // Sample featured products
  const featuredProducts = [
    {
      id: 1,
      name: "Wireless Bluetooth Headphones",
      price: 99.99,
      image: "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=400&h=300&fit=crop",
      rating: 4.5,
      category: "electronics"
    },
    {
      id: 2,
      name: "Premium Cotton T-Shirt",
      price: 29.99,
      image: "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=400&h=300&fit=crop",
      rating: 4.3,
      category: "clothing"
    },
    {
      id: 3,
      name: "Smart Fitness Watch",
      price: 199.99,
      image: "https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=400&h=300&fit=crop",
      rating: 4.7,
      category: "electronics"
    },
    {
      id: 4,
      name: "Designer Coffee Mug",
      price: 19.99,
      image: "https://images.unsplash.com/photo-1517668808822-9ebb02f2a0e6?w=400&h=300&fit=crop",
      rating: 4.2,
      category: "home"
    }
  ];

  const categories = [
    { name: "Electronics", icon: "🔌", link: "/products?category=electronics", color: "primary" },
    { name: "Clothing", icon: "👕", link: "/products?category=clothing", color: "success" },
    { name: "Books", icon: "📚", link: "/products?category=books", color: "warning" },
    { name: "Home & Garden", icon: "🏠", link: "/products?category=home", color: "info" }
  ];

  return (
    <div>
      {/* Hero Section */}
      <Carousel className="mb-5">
        <Carousel.Item>
          <div className="hero-slide" style={{
            background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
            height: '500px',
            display: 'flex',
            alignItems: 'center',
            color: 'white'
          }}>
            <Container>
              <Row className="align-items-center">
                <Col md={6}>
                  <h1 className="display-4 fw-bold mb-4">Welcome to ShopHub</h1>
                  <p className="lead mb-4">Discover amazing products at unbeatable prices. Shop the latest trends and essentials.</p>
                  <Button as={Link} to="/products" variant="light" size="lg" className="me-3">
                    Shop Now
                  </Button>
                  <Button as={Link} to="/products?category=electronics" variant="outline-light" size="lg">
                    View Electronics
                  </Button>
                </Col>
                <Col md={6} className="text-center">
                  <div className="hero-image-placeholder" style={{
                    width: '300px',
                    height: '300px',
                    background: 'rgba(255,255,255,0.1)',
                    borderRadius: '50%',
                    margin: '0 auto',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: '4rem'
                  }}>
                    🛍️
                  </div>
                </Col>
              </Row>
            </Container>
          </div>
        </Carousel.Item>
        
        <Carousel.Item>
          <div className="hero-slide" style={{
            background: 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)',
            height: '500px',
            display: 'flex',
            alignItems: 'center',
            color: 'white'
          }}>
            <Container>
              <Row className="align-items-center">
                <Col md={6}>
                  <h1 className="display-4 fw-bold mb-4">New Arrivals</h1>
                  <p className="lead mb-4">Check out our latest collection of trending products and exclusive deals.</p>
                  <Button as={Link} to="/products" variant="light" size="lg">
                    Explore New Products
                  </Button>
                </Col>
                <Col md={6} className="text-center">
                  <div className="hero-image-placeholder" style={{
                    width: '300px',
                    height: '300px',
                    background: 'rgba(255,255,255,0.1)',
                    borderRadius: '50%',
                    margin: '0 auto',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: '4rem'
                  }}>
                    ✨
                  </div>
                </Col>
              </Row>
            </Container>
          </div>
        </Carousel.Item>
      </Carousel>

      {/* Category Links */}
      <Container className="mb-5">
        <h2 className="text-center mb-4">Shop by Category</h2>
        <Row>
          {categories.map((category, index) => (
            <Col key={index} md={3} sm={6} className="mb-4">
              <Card 
                as={Link} 
                to={category.link} 
                className={`text-center h-100 category-card text-decoration-none border-${category.color}`}
                style={{ transition: 'transform 0.3s ease' }}
                onMouseEnter={(e) => e.currentTarget.style.transform = 'translateY(-5px)'}
                onMouseLeave={(e) => e.currentTarget.style.transform = 'translateY(0)'}
              >
                <Card.Body className="d-flex flex-column justify-content-center">
                  <div className="mb-3" style={{ fontSize: '3rem' }}>{category.icon}</div>
                  <Card.Title className="text-dark">{category.name}</Card.Title>
                  <Button variant={`outline-${category.color}`} size="sm">
                    Explore <FaArrowRight className="ms-1" />
                  </Button>
                </Card.Body>
              </Card>
            </Col>
          ))}
        </Row>
      </Container>

      {/* Featured Products */}
      <Container className="mb-5">
        <div className="d-flex justify-content-between align-items-center mb-4">
          <h2>Featured Products</h2>
          <Button as={Link} to="/products" variant="outline-primary">
            View All Products <FaArrowRight className="ms-1" />
          </Button>
        </div>
        <Row>
          {featuredProducts.map((product) => (
            <Col key={product.id} lg={3} md={6} className="mb-4">
              <Card className="h-100 product-card">
                <div className="product-image-container" style={{ height: '200px', overflow: 'hidden' }}>
                  <Card.Img 
                    variant="top" 
                    src={product.image} 
                    alt={product.name}
                    style={{ height: '100%', objectFit: 'cover' }}
                  />
                </div>
                <Card.Body className="d-flex flex-column">
                  <Card.Title className="fs-6">{product.name}</Card.Title>
                  <div className="d-flex align-items-center mb-2">
                    <div className="d-flex align-items-center me-2">
                      {[...Array(5)].map((_, i) => (
                        <FaStar 
                          key={i} 
                          className={i < Math.floor(product.rating) ? 'text-warning' : 'text-muted'} 
                          size={14}
                        />
                      ))}
                    </div>
                    <small className="text-muted">({product.rating})</small>
                  </div>
                  <div className="mt-auto">
                    <div className="d-flex justify-content-between align-items-center mb-2">
                      <span className="fw-bold text-primary">${product.price}</span>
                      <small className="text-muted text-capitalize">{product.category}</small>
                    </div>
                    <Button as={Link} to={`/product/${product.id}`} variant="primary" size="sm" className="w-100">
                      View Details
                    </Button>
                  </div>
                </Card.Body>
              </Card>
            </Col>
          ))}
        </Row>
      </Container>

      {/* Call to Action */}
      <div className="bg-light py-5">
        <Container>
          <Row className="text-center">
            <Col>
              <h2 className="mb-3">Ready to Start Shopping?</h2>
              <p className="lead mb-4">Join thousands of satisfied customers and discover amazing products today.</p>
              <Button as={Link} to="/products" variant="primary" size="lg">
                Browse All Products
              </Button>
            </Col>
          </Row>
        </Container>
      </div>
    </div>
  );
};

export default Home;
