# 🚀 Quick Start Guide - ShopHub Backend

## ⚡ **5-Minute Setup**

### 1. **Prerequisites Check**
```bash
# Check Node.js version (should be 18+)
node --version

# Check if MySQL is running
mysql --version
```

### 2. **Database Setup**
```bash
# Start MySQL (if not running)
# On macOS:
brew services start mysql

# On Ubuntu/Debian:
sudo systemctl start mysql

# On Windows:
# Start MySQL service from Services
```

### 3. **Configure Environment**
```bash
# Edit the config.env file with your MySQL credentials
nano config.env

# Or use the startup script which will guide you
./start.sh
```

### 4. **Start the Server**
```bash
# Option 1: Use the startup script (recommended)
./start.sh

# Option 2: Manual start
npm start

# Option 3: Development mode with auto-reload
npm run dev
```

### 5. **Test the API**
```bash
# Health check
curl http://localhost:5000/api/health

# Get featured products
curl http://localhost:5000/api/home/featured-products

# Get categories
curl http://localhost:5000/api/home/categories
```

## 🔧 **Configuration Examples**

### **config.env (MySQL with password)**
```env
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=your_mysql_password
DB_NAME=shophub_db
DB_PORT=3306
JWT_SECRET=your_super_secret_key_here
PORT=5000
NODE_ENV=development
```

### **config.env (MySQL without password)**
```env
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=
DB_NAME=shophub_db
DB_PORT=3306
JWT_SECRET=your_super_secret_key_here
PORT=5000
NODE_ENV=development
```

## 🌐 **API Endpoints Quick Reference**

| Endpoint | Method | Description | Auth Required |
|----------|--------|-------------|---------------|
| `/api/health` | GET | Health check | No |
| `/api/home/featured-products` | GET | Featured products | No |
| `/api/home/categories` | GET | Product categories | No |
| `/api/products` | GET | All products with filters | No |
| `/api/products/1` | GET | Product details | No |
| `/api/auth/register` | POST | User registration | No |
| `/api/auth/login` | POST | User login | No |
| `/api/cart` | GET | User's cart | Yes |
| `/api/cart/add` | POST | Add to cart | Yes |
| `/api/checkout/process` | POST | Process checkout | Yes |

## 🧪 **Test User Account**

After starting the server, create a test account:

```bash
curl -X POST http://localhost:5000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "username": "testuser",
    "email": "test@example.com",
    "password": "TestPass123",
    "first_name": "Test",
    "last_name": "User"
  }'
```

## 🚨 **Troubleshooting**

### **MySQL Connection Issues**
```bash
# Check MySQL status
brew services list | grep mysql

# Reset MySQL root password (if needed)
mysql_secure_installation

# Test connection
mysql -u root -p
```

### **Port Already in Use**
```bash
# Check what's using port 5000
lsof -i :5000

# Kill the process
kill -9 <PID>

# Or change port in config.env
PORT=5001
```

### **Permission Denied**
```bash
# Make startup script executable
chmod +x start.sh

# Check file permissions
ls -la
```

## 📱 **Frontend Integration**

Update your React frontend to use the backend API:

```javascript
// In your frontend API configuration
const API_BASE_URL = 'http://localhost:5000/api';

// Example API call
fetch(`${API_BASE_URL}/home/featured-products`)
  .then(response => response.json())
  .then(data => console.log(data));
```

## 🎯 **Next Steps**

1. ✅ **Backend is running** - Test with health check
2. 🔗 **Connect frontend** - Update API base URL
3. 🧪 **Test functionality** - Register user, browse products
4. 🚀 **Deploy** - Move to production server

## 📞 **Need Help?**

- Check the main README.md for detailed documentation
- Review API endpoints in the routes/ directory
- Check server logs for error messages
- Ensure MySQL is running and accessible

---

**🎉 Your ShopHub Backend is ready!**
