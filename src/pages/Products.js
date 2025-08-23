import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Card, Button, Form, Pagination, Badge } from 'react-bootstrap';
import { Link, useSearchParams } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { FaStar, FaFilter, FaSort, FaShoppingCart } from 'react-icons/fa';

const Products = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const { addToCart } = useCart();
  const [products, setProducts] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [productsPerPage] = useState(8);
  const [sortBy, setSortBy] = useState('name');
  const [categoryFilter, setCategoryFilter] = useState('');
  const [priceFilter, setPriceFilter] = useState('');

  // Sample products data
  const sampleProducts = [
    // Electronics
    { id: 1, name: "Wireless Bluetooth Headphones", price: 99.99, category: "electronics", image: "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=400&h=300&fit=crop", rating: 4.5, description: "High-quality wireless headphones with noise cancellation" },
    { id: 2, name: "Smart Fitness Watch", price: 199.99, category: "electronics", image: "https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=400&h=300&fit=crop", rating: 4.7, description: "Advanced fitness tracking with heart rate monitor" },
    { id: 3, name: "Laptop Stand", price: 49.99, category: "electronics", image: "https://images.unsplash.com/photo-1593642632823-8f785ba67e45?w=400&h=300&fit=crop", rating: 4.2, description: "Adjustable aluminum laptop stand for ergonomic setup" },
    { id: 4, name: "Wireless Mouse", price: 29.99, category: "electronics", image: "https://images.unsplash.com/photo-1527864550417-7fd91fc51a46?w=400&h=300&fit=crop", rating: 4.4, description: "Ergonomic wireless mouse with precision tracking" },
    
    // Clothing
    { id: 5, name: "Premium Cotton T-Shirt", price: 29.99, category: "clothing", image: "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=400&h=300&fit=crop", rating: 4.3, description: "Soft, breathable cotton t-shirt in various colors" },
    { id: 6, name: "Denim Jeans", price: 79.99, category: "clothing", image: "https://images.unsplash.com/photo-1542272604-787c3835535d?w=400&h=300&fit=crop", rating: 4.6, description: "Classic denim jeans with perfect fit" },
    { id: 7, name: "Hooded Sweatshirt", price: 59.99, category: "clothing", image: "https://images.unsplash.com/photo-1556821840-3a63f95609a7?w=400&h=300&fit=crop", rating: 4.1, description: "Comfortable hooded sweatshirt for casual wear" },
    { id: 8, name: "Running Shoes", price: 129.99, category: "clothing", image: "https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=400&h=300&fit=crop", rating: 4.8, description: "Professional running shoes with superior comfort" },
    
    // Books
    { id: 9, name: "The Art of Programming", price: 39.99, category: "books", image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=300&fit=crop", rating: 4.7, description: "Comprehensive guide to modern programming practices" },
    { id: 10, name: "Business Strategy Guide", price: 24.99, category: "books", image: "https://images.unsplash.com/photo-1554224155-6726b3ff858f?w=400&h=300&fit=crop", rating: 4.4, description: "Essential strategies for business success" },
    { id: 11, name: "Science Fiction Collection", price: 19.99, category: "books", image: "https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?w=400&h=300&fit=crop", rating: 4.2, description: "Collection of award-winning science fiction stories" },
    { id: 12, name: "Cookbook Deluxe", price: 34.99, category: "books", image: "https://images.unsplash.com/photo-1589998059171-988d887df646?w=400&h=300&fit=crop", rating: 4.5, description: "Delicious recipes from around the world" },
    
    // Home & Garden
    { id: 13, name: "Designer Coffee Mug", price: 19.99, category: "home", image: "https://images.unsplash.com/photo-1517668808822-9ebb02f2a0e6?w=400&h=300&fit=crop", rating: 4.2, description: "Beautiful ceramic coffee mug with unique design" },
    { id: 14, name: "Indoor Plant Pot", price: 15.99, category: "home", image: "https://images.unsplash.com/photo-1485955900006-10f4d324d411?w=400&h=300&fit=crop", rating: 4.0, description: "Modern plant pot for indoor gardening" },
    { id: 15, name: "Kitchen Knife Set", price: 89.99, category: "home", image: "https://images.unsplash.com/photo-1558904541-efa843a96f01?w=400&h=300&fit=crop", rating: 4.6, description: "Professional kitchen knife set with storage block" },
    { id: 16, name: "Wall Clock", price: 45.99, category: "home", image: "https://images.unsplash.com/photo-1563861826100-9cb868fdbe1c?w=400&h=300&fit=crop", rating: 4.3, description: "Elegant wall clock for modern home decor" }
  ];

  useEffect(() => {
    setProducts(sampleProducts);
  }, []);

  useEffect(() => {
    // Get category from URL params
    const category = searchParams.get('category') || '';
    setCategoryFilter(category);
  }, [searchParams]);

  useEffect(() => {
    let filtered = [...products];

    // Apply category filter
    if (categoryFilter) {
      filtered = filtered.filter(product => product.category === categoryFilter);
    }

    // Apply price filter
    if (priceFilter) {
      switch (priceFilter) {
        case 'under50':
          filtered = filtered.filter(product => product.price < 50);
          break;
        case '50to100':
          filtered = filtered.filter(product => product.price >= 50 && product.price < 100);
          break;
        case '100to200':
          filtered = filtered.filter(product => product.price >= 100 && product.price < 200);
          break;
        case 'over200':
          filtered = filtered.filter(product => product.price >= 200);
          break;
        default:
          break;
      }
    }

    // Apply sorting
    filtered.sort((a, b) => {
      switch (sortBy) {
        case 'price-low':
          return a.price - b.price;
        case 'price-high':
          return b.price - a.price;
        case 'rating':
          return b.rating - a.rating;
        case 'name':
        default:
          return a.name.localeCompare(b.name);
      }
    });

    setFilteredProducts(filtered);
    setCurrentPage(1); // Reset to first page when filters change
  }, [products, categoryFilter, priceFilter, sortBy]);

  // Pagination
  const indexOfLastProduct = currentPage * productsPerPage;
  const indexOfFirstProduct = indexOfLastProduct - productsPerPage;
  const currentProducts = filteredProducts.slice(indexOfFirstProduct, indexOfLastProduct);
  const totalPages = Math.ceil(filteredProducts.length / productsPerPage);

  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
    window.scrollTo(0, 0);
  };

  const handleAddToCart = (product) => {
    addToCart(product);
    // You could add a toast notification here
  };

  return (
    <Container className="py-4">
      {/* Page Header */}
      <Row className="mb-4">
        <Col>
          <h1 className="mb-2">
            {categoryFilter ? `${categoryFilter.charAt(0).toUpperCase() + categoryFilter.slice(1)} Products` : 'All Products'}
          </h1>
          <p className="text-muted">
            {filteredProducts.length} products found
          </p>
        </Col>
      </Row>

      {/* Filters and Sorting */}
      <Row className="mb-4">
        <Col lg={3} md={6} className="mb-3">
          <Form.Group>
            <Form.Label className="d-flex align-items-center">
              <FaFilter className="me-2" />
              Category
            </Form.Label>
            <Form.Select 
              value={categoryFilter} 
              onChange={(e) => setCategoryFilter(e.target.value)}
            >
              <option value="">All Categories</option>
              <option value="electronics">Electronics</option>
              <option value="clothing">Clothing</option>
              <option value="books">Books</option>
              <option value="home">Home & Garden</option>
            </Form.Select>
          </Form.Group>
        </Col>

        <Col lg={3} md={6} className="mb-3">
          <Form.Group>
            <Form.Label className="d-flex align-items-center">
              <FaFilter className="me-2" />
              Price Range
            </Form.Label>
            <Form.Select 
              value={priceFilter} 
              onChange={(e) => setPriceFilter(e.target.value)}
            >
              <option value="">All Prices</option>
              <option value="under50">Under $50</option>
              <option value="50to100">$50 - $100</option>
              <option value="100to200">$100 - $200</option>
              <option value="over200">Over $200</option>
            </Form.Select>
          </Form.Group>
        </Col>

        <Col lg={3} md={6} className="mb-3">
          <Form.Group>
            <Form.Label className="d-flex align-items-center">
              <FaSort className="me-2" />
              Sort By
            </Form.Label>
            <Form.Select 
              value={sortBy} 
              onChange={(e) => setSortBy(e.target.value)}
            >
              <option value="name">Name A-Z</option>
              <option value="price-low">Price: Low to High</option>
              <option value="price-high">Price: High to Low</option>
              <option value="rating">Highest Rated</option>
            </Form.Select>
          </Form.Group>
        </Col>

        <Col lg={3} md={6} className="mb-3 d-flex align-items-end">
          <Button 
            variant="outline-secondary" 
            onClick={() => {
              setCategoryFilter('');
              setPriceFilter('');
              setSortBy('name');
            }}
          >
            Clear Filters
          </Button>
        </Col>
      </Row>

      {/* Products Grid */}
      <Row>
        {currentProducts.map((product) => (
          <Col key={product.id} lg={3} md={6} className="mb-4">
            <Card className="h-100 product-card">
              <div className="product-image-container" style={{ height: '200px', overflow: 'hidden' }}>
                <Card.Img 
                  variant="top" 
                  src={product.image} 
                  alt={product.name}
                  style={{ height: '100%', objectFit: 'cover' }}
                />
                <Badge 
                  bg="secondary" 
                  className="position-absolute top-0 end-0 m-2"
                >
                  {product.category}
                </Badge>
              </div>
              <Card.Body className="d-flex flex-column">
                <Card.Title className="fs-6">{product.name}</Card.Title>
                <Card.Text className="text-muted small mb-2">
                  {product.description}
                </Card.Text>
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
                    <span className="fw-bold text-primary fs-5">${product.price}</span>
                  </div>
                  <div className="d-grid gap-2">
                    <Button 
                      variant="primary" 
                      size="sm"
                      onClick={() => handleAddToCart(product)}
                    >
                      <FaShoppingCart className="me-2" />
                      Add to Cart
                    </Button>
                    <Button 
                      as={Link} 
                      to={`/product/${product.id}`} 
                      variant="outline-secondary" 
                      size="sm"
                    >
                      View Details
                    </Button>
                  </div>
                </div>
              </Card.Body>
            </Card>
          </Col>
        ))}
      </Row>

      {/* Pagination */}
      {totalPages > 1 && (
        <Row className="mt-4">
          <Col className="d-flex justify-content-center">
            <Pagination>
              <Pagination.First 
                onClick={() => handlePageChange(1)} 
                disabled={currentPage === 1}
              />
              <Pagination.Prev 
                onClick={() => handlePageChange(currentPage - 1)} 
                disabled={currentPage === 1}
              />
              
              {[...Array(totalPages)].map((_, index) => {
                const pageNumber = index + 1;
                if (
                  pageNumber === 1 || 
                  pageNumber === totalPages || 
                  (pageNumber >= currentPage - 1 && pageNumber <= currentPage + 1)
                ) {
                  return (
                    <Pagination.Item
                      key={pageNumber}
                      active={pageNumber === currentPage}
                      onClick={() => handlePageChange(pageNumber)}
                    >
                      {pageNumber}
                    </Pagination.Item>
                  );
                } else if (
                  pageNumber === currentPage - 2 || 
                  pageNumber === currentPage + 2
                ) {
                  return <Pagination.Ellipsis key={pageNumber} />;
                }
                return null;
              })}
              
              <Pagination.Next 
                onClick={() => handlePageChange(currentPage + 1)} 
                disabled={currentPage === totalPages}
              />
              <Pagination.Last 
                onClick={() => handlePageChange(totalPages)} 
                disabled={currentPage === totalPages}
              />
            </Pagination>
          </Col>
        </Row>
      )}

      {/* No Products Found */}
      {filteredProducts.length === 0 && (
        <Row className="text-center py-5">
          <Col>
            <h3>No products found</h3>
            <p className="text-muted">Try adjusting your filters or browse all products.</p>
            <Button 
              variant="primary" 
              onClick={() => {
                setCategoryFilter('');
                setPriceFilter('');
                setSortBy('name');
              }}
            >
              Clear All Filters
            </Button>
          </Col>
        </Row>
      )}
    </Container>
  );
};

export default Products;
