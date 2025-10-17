# Full-Stack E-commerce Platform with Admin Panel

A comprehensive e-commerce platform built with modern web technologies, featuring a customer-facing store and a complete admin management system. This project demonstrates proficiency in full-stack development, database design, authentication systems, and modern web development practices.

## 🚀 Technical Stack

### Frontend
- **React 19** with TypeScript
- **Vite** for build tooling and development
- **React Router DOM** for client-side routing
- **Tailwind CSS** for responsive styling
- **Bootstrap** for UI components
- **Axios** for HTTP requests
- **React Icons** for iconography
- **React Toastify** for notifications
- **jsPDF** for client-side PDF generation

### Backend
- **Node.js** with Express.js
- **ES6 Modules** (type: "module")
- **MySQL** database with connection pooling
- **JWT** authentication and authorization
- **bcrypt** for password hashing
- **Multer** for file upload handling
- **PDFKit** for server-side PDF generation
- **Nodemailer** for email services
- **CORS** configuration for cross-origin requests

### Database
- **MySQL** with optimized schema design
- **Connection pooling** for performance
- **Prepared statements** for security
- **Indexing** on frequently queried columns

## 🏗️ Architecture & Features

### Customer-Facing E-commerce Store

#### 🛍️ Product Catalog
- Dynamic product listing with categories and collections
- Advanced search functionality with multiple filters
- Product detail pages with image galleries
- Responsive product cards with hover effects
- Category-based navigation system

#### 🛒 Shopping Cart & Wishlist
- Real-time cart management with local storage
- Wishlist functionality for saved items
- Quantity updates and item removal
- Cart persistence across sessions
- Auto-expiry for cart items (4-day retention)

#### 👤 User Authentication & Management
- Secure user registration and login
- JWT-based session management
- Password hashing with bcrypt
- Protected routes for authenticated users
- User profile management
- Login tracking and analytics

#### 📦 Order Management
- Complete order placement workflow
- PDF invoice generation with company branding
- Email notifications with invoice attachments
- Order history tracking
- Order status updates

#### 🔍 Search & Navigation
- Real-time search with autocomplete
- Category and collection filtering
- Responsive navigation with mobile sidebar
- Breadcrumb navigation
- SEO-friendly URLs

### Admin Panel & Management System

#### 📊 Dashboard & Analytics
- Real-time statistics dashboard
- Revenue tracking and reporting
- User engagement metrics
- Monthly revenue charts
- Recent orders overview
- Key performance indicators (KPIs)

#### 📦 Product Management
- Complete CRUD operations for products
- Multi-image upload support (main + 3 additional images)
- Product categorization and tagging
- Inventory management
- Bulk operations support
- Image optimization and storage

#### 📋 Order Management
- Order listing with pagination and search
- Order status management (pending, processing, shipped, delivered)
- Order details with item breakdown
- Invoice management and regeneration
- Customer communication tools

#### 👥 User Management
- Customer account management
- User status control (active/inactive)
- Login analytics and tracking
- User search and filtering
- Account verification system

#### 🖼️ Banner Management
- Dynamic banner creation and management
- Image upload and optimization
- Banner positioning and scheduling
- Active/inactive status control
- Responsive banner display

### Security Features

#### 🔐 Authentication & Authorization
- JWT-based authentication system
- Role-based access control (admin/customer)
- Password hashing with bcrypt (10 salt rounds)
- API key verification middleware
- Protected route implementation
- Session management and token expiry

#### 🛡️ Data Protection
- SQL injection prevention with prepared statements
- Input validation and sanitization
- File upload security with type checking
- CORS configuration for secure cross-origin requests
- Environment variable management for sensitive data

### Performance Optimizations

#### ⚡ Frontend Performance
- Code splitting with React lazy loading
- Image optimization and lazy loading
- Efficient state management with Context API
- Memoization for expensive computations
- Bundle optimization with Vite

#### 🚀 Backend Performance
- Database connection pooling
- Efficient query optimization
- Pagination for large datasets
- File upload optimization
- Response caching strategies

## 📁 Project Structure

```
Ecommerce/
├── backend/                    # Node.js Express Server
│   ├── uploads/               # File storage directory
│   │   ├── banner/           # Banner images
│   │   └── products/         # Product images
│   ├── invoices/             # Generated PDF invoices
│   ├── server.js             # Main server file
│   ├── adminRoutes.js        # Admin API routes
│   ├── db.js                 # Database connection
│   ├── .env                  # Environment variables
│   └── package.json          # Backend dependencies
│
├── ecommerce/                 # React Frontend
│   ├── src/
│   │   ├── components/       # React components
│   │   │   ├── AdminPanel/   # Admin management components
│   │   │   ├── Cart.tsx      # Shopping cart
│   │   │   ├── ProductPage.tsx # Product listings
│   │   │   ├── OrderHistory.tsx # Order tracking
│   │   │   └── ...           # Other components
│   │   ├── contexts/         # React Context providers
│   │   ├── App.tsx           # Main application
│   │   └── main.tsx          # Application entry point
│   ├── public/               # Static assets
│   ├── package.json          # Frontend dependencies
│   └── vite.config.ts        # Vite configuration
│
└── README.md                 # Project documentation
```

## 🗄️ Database Schema

### Core Tables
- **products** - Product catalog with images and metadata
- **registration** - Customer accounts and authentication
- **orders** - Order tracking and management
- **order_items** - Individual order line items
- **cart** - Shopping cart persistence
- **wishlist** - Customer wishlist items
- **admin_users** - Admin authentication and roles
- **banners** - Dynamic banner management

### Key Features
- Foreign key relationships for data integrity
- Indexing on frequently queried columns
- Optimized queries with proper joins
- Data validation at database level

## 🔧 API Architecture

### RESTful API Design
- **Authentication**: `/login`, `/register`
- **Products**: `/api/products/*`, `/search`
- **Cart**: `/cart` (GET, POST, PUT, DELETE)
- **Orders**: `/place-order`, `/orders/*`
- **Admin**: `/admin/*` (protected routes)

### Features
- Consistent error handling
- Input validation middleware
- Rate limiting capabilities
- API versioning support
- Comprehensive logging

## 📧 Email & PDF Services

### Email Integration
- Nodemailer configuration with Gmail SMTP
- HTML email templates
- Invoice attachment system
- Order confirmation emails
- Responsive email design

### PDF Generation
- Server-side PDF creation with PDFKit
- Professional invoice templates
- Company branding integration
- Automatic file management
- Email attachment support

## 🔄 State Management

### Frontend State
- React Context API for global state
- Local storage for cart persistence
- Session management for authentication
- Optimistic UI updates

### Backend State
- Database-driven state management
- Session storage with JWT
- Real-time data synchronization
- Efficient caching strategies

## 📱 Responsive Design

### Mobile-First Approach
- Responsive grid layouts
- Mobile navigation drawer
- Touch-friendly interfaces
- Optimized image loading
- Cross-browser compatibility

## 🚀 Deployment & DevOps

### Development Setup
```bash
# Backend setup
cd backend
npm install
npm start

# Frontend setup
cd ecommerce
npm install
npm run dev
```

### Production Considerations
- Environment-specific configurations
- Database optimization and indexing
- CDN integration for static assets
- SSL certificate implementation
- Performance monitoring

## 🎯 Key Achievements

### Technical Accomplishments
- **Full-Stack Development**: Complete MERN-like stack implementation
- **Database Design**: Optimized MySQL schema with proper relationships
- **Authentication System**: Secure JWT-based auth with role management
- **File Management**: Multi-file upload with image optimization
- **PDF Generation**: Dynamic invoice creation and email delivery
- **Responsive Design**: Mobile-first approach with modern CSS
- **API Development**: RESTful API with comprehensive error handling
- **Security Implementation**: Input validation, SQL injection prevention
- **Performance Optimization**: Efficient queries and caching strategies

### Business Features
- **E-commerce Functionality**: Complete shopping cart and checkout flow
- **Admin Dashboard**: Comprehensive management system
- **Order Management**: Full order lifecycle tracking
- **User Management**: Customer account and authentication system
- **Content Management**: Dynamic banner and product management
- **Analytics**: Real-time dashboard with key metrics
- **Email Integration**: Automated notifications and invoice delivery

## 🛠️ Skills Demonstrated

### Frontend Development
- React.js with TypeScript
- Modern CSS (Tailwind, Bootstrap)
- Responsive web design
- State management (Context API)
- Component architecture
- Performance optimization

### Backend Development
- Node.js and Express.js
- RESTful API design
- Database integration (MySQL)
- Authentication and authorization
- File upload handling
- Email services integration

### Database Management
- MySQL database design
- Query optimization
- Data relationships
- Performance tuning
- Security best practices

### DevOps & Tools
- Version control (Git)
- Package management (npm)
- Build tools (Vite)
- Environment configuration
- Deployment strategies

This project showcases a complete understanding of modern web development practices, from frontend user experience to backend architecture and database design, making it an excellent demonstration of full-stack development capabilities.