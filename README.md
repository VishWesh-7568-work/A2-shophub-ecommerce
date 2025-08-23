# ShopHub - E-commerce Website Frontend

A fully responsive E-commerce website frontend built with React.js, JavaScript, and React-Bootstrap. This project demonstrates modern React practices, component-based architecture, and responsive design principles.

## 🚀 Features

### 1. Home Page
- **Hero Section**: Attractive banner carousel showcasing featured products and promotions
- **Product Highlights**: Grid display of best-selling and new arrival products
- **Category Links**: Navigation sections for different product categories
- **Responsive Design**: Fully responsive layout for all screen sizes

### 2. Products Page
- **Product Grid**: Responsive grid layout showing all available products
- **Advanced Filtering**: Filter by category, price range
- **Sorting Options**: Sort by name, price (low to high/high to low), rating
- **Pagination**: Efficient pagination system for large product catalogs
- **Search & Navigation**: Easy navigation between product categories

### 3. Product Details Page
- **Detailed Information**: Comprehensive product details with images, descriptions, and features
- **Add to Cart**: Seamless shopping cart integration
- **Product Gallery**: Image display with product information
- **Related Products**: Suggestions for similar items

### 4. Shopping Cart
- **Cart Management**: Add, remove, and update product quantities
- **Real-time Updates**: Live cart total and item count
- **Checkout Process**: Simulated checkout experience with form validation
- **Order Summary**: Detailed breakdown of costs including tax and shipping

### 5. Responsive Design
- **Mobile-First**: Optimized for mobile devices
- **Tablet Support**: Responsive layouts for tablet screens
- **Desktop Experience**: Enhanced experience for larger screens
- **Cross-Browser**: Compatible with all modern browsers

## 🛠️ Technologies Used

- **Frontend Framework**: React.js 18
- **UI Library**: React-Bootstrap 2.x
- **Styling**: Bootstrap 5.x + Custom CSS
- **Routing**: React Router DOM 6
- **State Management**: React Context API + useReducer
- **Icons**: React Icons (Font Awesome)
- **Build Tool**: Create React App

## 📁 Project Structure

```
src/
├── components/          # Reusable UI components
│   ├── Navbar.js       # Navigation bar component
│   └── Footer.js       # Footer component
├── context/            # React Context for state management
│   └── CartContext.js  # Shopping cart state management
├── pages/              # Page components
│   ├── Home.js         # Home page with hero and featured products
│   ├── Products.js     # Products listing with filters and pagination
│   ├── ProductDetail.js # Individual product detail page
│   └── Cart.js         # Shopping cart and checkout
├── App.js              # Main application component with routing
├── App.css             # Custom styles and responsive design
└── index.js            # Application entry point
```

## 🚀 Getting Started

### Prerequisites
- Node.js (version 14 or higher)
- npm or yarn package manager

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd ecommerce-website
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Start the development server**
   ```bash
   npm start
   ```

4. **Open your browser**
   Navigate to `http://localhost:3000` to view the application

### Available Scripts

- `npm start` - Runs the app in development mode
- `npm run build` - Builds the app for production
- `npm test` - Launches the test runner
- `npm run eject` - Ejects from Create React App (not recommended)

## 🎨 Design Features

### Color Scheme
- **Primary**: Bootstrap Blue (#0d6efd)
- **Secondary**: Bootstrap Gray (#6c757d)
- **Success**: Bootstrap Green (#198754)
- **Warning**: Bootstrap Yellow (#ffc107)
- **Danger**: Bootstrap Red (#dc3545)

### Typography
- **Headings**: Bootstrap's default heading styles
- **Body Text**: Clean, readable fonts optimized for web
- **Responsive**: Font sizes that scale appropriately

### Layout
- **Grid System**: Bootstrap's responsive 12-column grid
- **Spacing**: Consistent spacing using Bootstrap's spacing utilities
- **Components**: Modern card-based design with subtle shadows

## 📱 Responsive Breakpoints

- **Mobile**: < 576px
- **Small**: ≥ 576px
- **Medium**: ≥ 768px
- **Large**: ≥ 992px
- **Extra Large**: ≥ 1200px

## 🔧 Customization

### Adding New Products
Products are defined in the `sampleProducts` array within each page component. To add new products:

1. Add product data to the array
2. Include required fields: `id`, `name`, `price`, `category`, `image`, `rating`, `description`
3. For product details, also include: `longDescription`, `features`, `stock`, `brand`

### Styling Changes
- **CSS Variables**: Modify colors and spacing in `App.css`
- **Bootstrap Overrides**: Customize Bootstrap components in `App.css`
- **Responsive Design**: Adjust breakpoints and mobile-specific styles

### Adding New Categories
1. Update the categories array in the Home component
2. Add category options to filter dropdowns
3. Update navigation links and breadcrumbs

## 🚀 Deployment

### Build for Production
```bash
npm run build
```

### Deploy to Static Hosting
The `build` folder contains optimized production files that can be deployed to:
- Netlify
- Vercel
- GitHub Pages
- AWS S3
- Any static hosting service

## 🧪 Testing

### Manual Testing Checklist
- [ ] Navigation between all pages
- [ ] Product filtering and sorting
- [ ] Add/remove items from cart
- [ ] Cart quantity updates
- [ ] Checkout form validation
- [ ] Responsive design on different screen sizes
- [ ] Cross-browser compatibility

## 📚 Learning Resources

This project demonstrates several important concepts:
- **React Hooks**: useState, useEffect, useContext, useReducer
- **Component Architecture**: Reusable, maintainable components
- **State Management**: Context API for global state
- **Routing**: Client-side routing with React Router
- **Responsive Design**: Mobile-first responsive layouts
- **Modern JavaScript**: ES6+ features and best practices

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## 📄 License

This project is created for educational purposes as part of a bootcamp assignment.

## 🙏 Acknowledgments

- **Bootstrap**: For the responsive UI framework
- **React-Bootstrap**: For React components
- **Unsplash**: For sample product images
- **Font Awesome**: For icons via React Icons

## 📞 Support

For questions or support, please refer to the project documentation or create an issue in the repository.

---

**Note**: This is a frontend-only demonstration. In a real production environment, you would need to:
- Connect to a backend API for product data
- Implement real payment processing
- Add user authentication
- Include proper error handling
- Add loading states and error boundaries
- Implement proper SEO optimization
