# ShopHub E-commerce Backend API

A secure, scalable, and production-ready backend API for the ShopHub E-commerce website. Built with Node.js, Express, and MySQL, featuring JWT authentication, comprehensive product management, shopping cart functionality, and order processing.

## 🚀 Features

### 🔐 **Authentication & Security**
- JWT-based user authentication
- Password hashing with bcrypt
- Protected routes with middleware
- Input validation and sanitization
- Rate limiting and security headers

### 🛍️ **E-commerce Functionality**
- **User Management**: Registration, login, profile management
- **Product Management**: CRUD operations, filtering, sorting, pagination
- **Shopping Cart**: Add, remove, update items, cart summary
- **Order Processing**: Checkout, order history, order management
- **Category Management**: Product categorization and organization

### 🗄️ **Database & Architecture**
- MySQL database with proper relationships
- Connection pooling for performance
- Transaction support for data integrity
- Automatic database initialization
- Sample data seeding

## 🛠️ Technologies Used

- **Runtime**: Node.js 18+
- **Framework**: Express.js 4.x
- **Database**: MySQL 8.0+
- **Authentication**: JWT (JSON Web Tokens)
- **Security**: bcrypt, helmet, rate limiting
- **Validation**: express-validator
- **Database Driver**: mysql2 (Promise-based)

## 📁 Project Structure

```
backend/
├── config/
│   └── database.js          # Database configuration and initialization
├── middleware/
│   └── auth.js              # Authentication middleware
├── routes/
│   ├── auth.js              # User authentication routes
│   ├── home.js              # Home page and landing content
│   ├── products.js          # Product management routes
│   ├── cart.js              # Shopping cart operations
│   └── checkout.js          # Checkout and order processing
├── server.js                # Main server file
├── package.json             # Dependencies and scripts
├── config.env               # Environment configuration
└── README.md                # This file
```

## 🚀 Getting Started

### Prerequisites

1. **Node.js** (version 18 or higher)
2. **MySQL** (version 8.0 or higher)
3. **npm** or **yarn** package manager

### Installation

1. **Clone the repository**
   ```bash
   cd backend
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Configure environment variables**
   ```bash
   cp config.env.example config.env
   # Edit config.env with your database credentials
   ```

4. **Set up MySQL database**
   - Create a MySQL database (or use existing)
   - Update `config.env` with your database credentials
   - The API will automatically create tables and seed sample data

5. **Start the server**
   ```bash
   # Development mode with auto-reload
   npm run dev
   
   # Production mode
   npm start
   ```

## ⚙️ Configuration

### Environment Variables

Create a `config.env` file in the backend directory:

```env
# Database Configuration
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=your_password
DB_NAME=shophub_db
DB_PORT=3306

# JWT Configuration
JWT_SECRET=your_super_secret_jwt_key_here
JWT_EXPIRES_IN=24h

# Server Configuration
PORT=5000
NODE_ENV=development

# Security
BCRYPT_ROUNDS=12
RATE_LIMIT_WINDOW_MS=900000
RATE_LIMIT_MAX_REQUESTS=100
```

### Database Setup

The API automatically:
- Creates the database if it doesn't exist
- Creates all necessary tables with proper relationships
- Seeds sample data (categories, products)
- Handles database migrations

## 📚 API Documentation

### Base URL
```
http://localhost:5000/api
```

### Authentication Endpoints

#### Register User
```http
POST /auth/register
Content-Type: application/json

{
  "username": "john_doe",
  "email": "john@example.com",
  "password": "SecurePass123",
  "first_name": "John",
  "last_name": "Doe"
}
```

#### Login User
```http
POST /auth/login
Content-Type: application/json

{
  "email": "john@example.com",
  "password": "SecurePass123"
}
```

#### Get User Profile
```http
GET /auth/profile
Authorization: Bearer <JWT_TOKEN>
```

### Home & Landing Page

#### Get Featured Products
```http
GET /home/featured-products
```

#### Get Categories
```http
GET /home/categories
```

#### Get Promotions
```http
GET /home/promotions
```

#### Get Complete Home Data
```http
GET /home/home-data
```

### Products

#### Get All Products (with filtering)
```http
GET /products?page=1&limit=12&category=electronics&min_price=50&max_price=200&sort_by=price&sort_order=desc
```

#### Get Product by ID
```http
GET /products/1
```

#### Get Products by Category
```http
GET /products/category/electronics?page=1&limit=12&sort_by=rating&sort_order=desc
```

#### Search Products
```http
GET /products/search/laptop?page=1&limit=12
```

### Shopping Cart

#### Get Cart Items
```http
GET /cart
Authorization: Bearer <JWT_TOKEN>
```

#### Add Item to Cart
```http
POST /cart/add
Authorization: Bearer <JWT_TOKEN>
Content-Type: application/json

{
  "product_id": 1,
  "quantity": 2
}
```

#### Update Cart Item
```http
PUT /cart/update/1
Authorization: Bearer <JWT_TOKEN>
Content-Type: application/json

{
  "quantity": 3
}
```

#### Remove Item from Cart
```http
DELETE /cart/remove/1
Authorization: Bearer <JWT_TOKEN>
```

#### Clear Cart
```http
DELETE /cart/clear
Authorization: Bearer <JWT_TOKEN>
```

### Checkout & Orders

#### Process Checkout
```http
POST /checkout/process
Authorization: Bearer <JWT_TOKEN>
Content-Type: application/json

{
  "shipping_address": {
    "first_name": "John",
    "last_name": "Doe",
    "email": "john@example.com",
    "address": "123 Main St",
    "city": "New York",
    "zip_code": "10001",
    "country": "United States"
  }
}
```

#### Get Order History
```http
GET /checkout/orders?page=1&limit=10
Authorization: Bearer <JWT_TOKEN>
```

#### Get Order Details
```http
GET /checkout/orders/1
Authorization: Bearer <JWT_TOKEN>
```

#### Cancel Order
```http
PUT /checkout/orders/1/cancel
Authorization: Bearer <JWT_TOKEN>
```

## 🔒 Security Features

### Authentication
- JWT tokens with configurable expiration
- Password hashing using bcrypt
- Protected routes with middleware
- Optional authentication for guest operations

### Input Validation
- Request body validation using express-validator
- SQL injection prevention with parameterized queries
- XSS protection with helmet middleware

### Rate Limiting
- Configurable rate limiting per IP address
- Prevents abuse and DDoS attacks
- Customizable time windows and request limits

### CORS Configuration
- Configurable CORS settings for production/development
- Secure cross-origin resource sharing
- Credentials support for authenticated requests

## 🗄️ Database Schema

### Tables

1. **users** - User accounts and authentication
2. **categories** - Product categories
3. **products** - Product information and inventory
4. **cart** - Shopping cart items
5. **orders** - Order information and status
6. **order_items** - Individual items in orders

### Key Relationships

- Products belong to Categories (many-to-one)
- Cart items belong to Users and Products
- Orders belong to Users
- Order items belong to Orders and Products

## 🧪 Testing

### Manual Testing

Test the API endpoints using tools like:
- **Postman** - API testing and documentation
- **Insomnia** - REST client
- **cURL** - Command line testing

### Health Check

```bash
curl http://localhost:5000/api/health
```

### Sample API Calls

```bash
# Register a new user
curl -X POST http://localhost:5000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{"username":"testuser","email":"test@example.com","password":"TestPass123","first_name":"Test","last_name":"User"}'

# Get featured products
curl http://localhost:5000/api/home/featured-products

# Get all products
curl "http://localhost:5000/api/products?page=1&limit=5"
```

## 🚀 Deployment

### Production Considerations

1. **Environment Variables**
   - Set `NODE_ENV=production`
   - Use strong JWT secrets
   - Configure production database credentials

2. **Database**
   - Use production MySQL instance
   - Configure connection pooling
   - Set up database backups

3. **Security**
   - Enable HTTPS
   - Configure CORS for production domains
   - Set up proper firewall rules

4. **Performance**
   - Use PM2 or similar process manager
   - Set up reverse proxy (Nginx)
   - Configure load balancing if needed

### Docker Deployment

```dockerfile
FROM node:18-alpine
WORKDIR /app
COPY package*.json ./
RUN npm ci --only=production
COPY . .
EXPOSE 5000
CMD ["npm", "start"]
```

## 🔧 Customization

### Adding New Features

1. **New Routes**: Create new route files in the `routes/` directory
2. **New Models**: Add new tables in `config/database.js`
3. **New Middleware**: Create middleware functions in `middleware/` directory

### Modifying Existing Features

1. **Validation**: Update validation rules in route files
2. **Business Logic**: Modify route handlers as needed
3. **Database Queries**: Update SQL queries in route files

## 📞 Support & Troubleshooting

### Common Issues

1. **Database Connection Failed**
   - Check MySQL service is running
   - Verify database credentials in `config.env`
   - Ensure database exists and is accessible

2. **JWT Token Issues**
   - Check JWT_SECRET is set in environment
   - Verify token expiration settings
   - Check Authorization header format

3. **CORS Errors**
   - Verify CORS configuration in `server.js`
   - Check frontend origin is allowed
   - Ensure credentials are properly configured

### Logs

The API provides comprehensive logging:
- Request/response logging
- Database operation logging
- Error logging with stack traces
- Authentication attempt logging

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## 📄 License

This project is created for educational purposes as part of a bootcamp assignment.

## 🙏 Acknowledgments

- **Express.js** - Web framework
- **MySQL** - Database system
- **JWT** - Authentication standard
- **Bootstrap** - UI framework inspiration

---

**Note**: This is a backend API only. The frontend React application should be configured to communicate with these endpoints. Update the frontend API base URL to point to your backend server.
