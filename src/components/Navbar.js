import React from 'react';
import { Navbar, Nav, Container, NavDropdown, Badge } from 'react-bootstrap';
import { Link, useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { FaShoppingCart, FaUser, FaSearch } from 'react-icons/fa';

const NavigationBar = () => {
  const { getCartItemCount } = useCart();
  const navigate = useNavigate();

  return (
    <Navbar bg="dark" variant="dark" expand="lg" className="py-3">
      <Container>
        <Navbar.Brand as={Link} to="/" className="fw-bold fs-3">
          ShopHub
        </Navbar.Brand>
        
        <Navbar.Toggle aria-controls="basic-navbar-nav" />
        <Navbar.Collapse id="basic-navbar-nav">
          <Nav className="me-auto">
            <Nav.Link as={Link} to="/">Home</Nav.Link>
            <NavDropdown title="Categories" id="basic-nav-dropdown">
              <NavDropdown.Item as={Link} to="/products?category=electronics">Electronics</NavDropdown.Item>
              <NavDropdown.Item as={Link} to="/products?category=clothing">Clothing</NavDropdown.Item>
              <NavDropdown.Item as={Link} to="/products?category=books">Books</NavDropdown.Item>
              <NavDropdown.Item as={Link} to="/products?category=home">Home & Garden</NavDropdown.Item>
            </NavDropdown>
            <Nav.Link as={Link} to="/products">All Products</Nav.Link>
          </Nav>
          
          <Nav className="ms-auto">
            <Nav.Link className="position-relative me-3">
              <FaSearch className="fs-5" />
            </Nav.Link>
            <Nav.Link as={Link} to="/cart" className="position-relative me-3">
              <FaShoppingCart className="fs-5" />
              {getCartItemCount() > 0 && (
                <Badge 
                  bg="danger" 
                  className="position-absolute top-0 start-100 translate-middle rounded-pill"
                  style={{ fontSize: '0.7rem' }}
                >
                  {getCartItemCount()}
                </Badge>
              )}
            </Nav.Link>
            <Nav.Link>
              <FaUser className="fs-5" />
            </Nav.Link>
          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
};

export default NavigationBar;
