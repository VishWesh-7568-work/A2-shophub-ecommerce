import React from 'react';
import { Container, Row, Col } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import { FaFacebook, FaTwitter, FaInstagram, FaLinkedin } from 'react-icons/fa';

const Footer = () => {
  return (
    <footer className="bg-dark text-light py-5 mt-5">
      <Container>
        <Row>
          <Col md={4} className="mb-4">
            <h5 className="mb-3">ShopHub</h5>
            <p className="text-muted">
              Your one-stop destination for quality products. We provide the best shopping experience with a wide range of products.
            </p>
            <div className="d-flex gap-3">
              <a href="#" className="text-light"><FaFacebook size={20} /></a>
              <a href="#" className="text-light"><FaTwitter size={20} /></a>
              <a href="#" className="text-light"><FaInstagram size={20} /></a>
              <a href="#" className="text-light"><FaLinkedin size={20} /></a>
            </div>
          </Col>
          
          <Col md={2} className="mb-4">
            <h6 className="mb-3">Quick Links</h6>
            <ul className="list-unstyled">
              <li><Link to="/" className="text-muted text-decoration-none">Home</Link></li>
              <li><Link to="/products" className="text-muted text-decoration-none">Products</Link></li>
              <li><Link to="/cart" className="text-muted text-decoration-none">Cart</Link></li>
            </ul>
          </Col>
          
          <Col md={2} className="mb-4">
            <h6 className="mb-3">Categories</h6>
            <ul className="list-unstyled">
              <li><Link to="/products?category=electronics" className="text-muted text-decoration-none">Electronics</Link></li>
              <li><Link to="/products?category=clothing" className="text-muted text-decoration-none">Clothing</Link></li>
              <li><Link to="/products?category=books" className="text-muted text-decoration-none">Books</Link></li>
              <li><Link to="/products?category=home" className="text-muted text-decoration-none">Home & Garden</Link></li>
            </ul>
          </Col>
          
          <Col md={4} className="mb-4">
            <h6 className="mb-3">Newsletter</h6>
            <p className="text-muted">Subscribe to get updates on new products and special offers.</p>
            <div className="input-group">
              <input 
                type="email" 
                className="form-control" 
                placeholder="Enter your email"
              />
              <button className="btn btn-primary" type="button">Subscribe</button>
            </div>
          </Col>
        </Row>
        
        <hr className="my-4" />
        
        <Row>
          <Col className="text-center">
            <p className="text-muted mb-0">
              © 2025 ShopHub. All rights reserved. | Privacy Policy | Terms of Service
            </p>
          </Col>
        </Row>
      </Container>
    </footer>
  );
};

export default Footer;
