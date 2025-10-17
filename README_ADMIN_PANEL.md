# E-commerce Admin Panel

A comprehensive admin panel for managing your e-commerce store, built with React (TypeScript) frontend and Node.js backend. This admin panel is designed to work with your existing database structure and provides full CRUD operations for products, orders, users, and banners.

## Features

- **Dashboard Overview**: Real-time statistics and recent orders
- **Product Management**: Add, edit, delete, and manage product inventory
- **Order Management**: View, update status, and track orders
- **User Management**: Manage customer accounts and status
- **Banner Management**: Create and manage promotional banners
- **Responsive Design**: Works on desktop and mobile devices
- **Secure Authentication**: JWT-based admin authentication

## Database Compatibility

This admin panel is designed to work with your existing database structure:

### Existing Tables (No Changes Required)
- `orders` - Your existing orders table with columns: `order_id`, `customer_id`, `subtotal`, `gst`, `total`, `invoice_file`, `created_at`, `status`, `cancellation_reason`, `return_reason`, `delivered_at`
- `order_items` - Your existing order items table with columns: `item_id`, `order_id`, `p_id`, `quantity`, `price_at_time`, `total_price`

### New Tables (Will Be Created)
- `admin_users` - Admin authentication and management
- `products` - Product catalog management
- `banners` - Promotional banner management

### Optional Enhancements
The setup script will automatically add these columns to your existing tables if they don't exist:
- `tracking_number` and `notes` to `orders` table
- `product_name`, `unit_price`, and `created_at` to `order_items` table

## Installation

### Backend Setup

1. **Navigate to backend directory:**
   ```bash
   cd backend
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Set up environment variables:**
   Create a `.env` file in the backend directory:
   ```env
   DB_HOST=localhost
   DB_USER=your_db_username
   DB_PASSWORD=your_db_password
   DB_NAME=your_database_name
   JWT_SECRET=your_jwt_secret_key
   PORT=5000
   ```

4. **Run the database setup script:**
   ```bash
   mysql -u your_username -p your_database_name < admin_tables_compatible.sql
   ```
   
   **Important**: Use `admin_tables_compatible.sql` instead of `admin_tables.sql` to ensure compatibility with your existing tables.

5. **Start the backend server:**
   ```bash
   npm start
   ```

### Frontend Setup

1. **Navigate to frontend directory:**
   ```bash
   cd ecommerce
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Start the development server:**
   ```bash
   npm run dev
   ```

## Default Admin Credentials

- **Username:** `admin`
- **Password:** `admin123`
- **Email:** `admin@example.com`

**Important**: Change these credentials after first login for security.

## Usage

### Accessing the Admin Panel

1. Navigate to `/admin` in your React application
2. Login with the default credentials
3. You'll be redirected to the dashboard

### Dashboard Features

- **Statistics Cards**: View total orders, revenue, users, and products
- **Recent Orders**: Quick overview of latest orders
- **Quick Actions**: Fast access to common admin tasks

### Managing Products

- **View All Products**: List, search, and paginate through products
- **Add New Product**: Upload images, set prices, and manage inventory
- **Edit Products**: Update product information and images
- **Delete Products**: Remove products from catalog

### Managing Orders

- **Order List**: View all orders with search and status filtering
- **Order Details**: See complete order information and items
- **Update Status**: Change order status and add tracking numbers
- **Order History**: Track order progression

### Managing Users

- **User List**: View all registered customers
- **User Status**: Activate/deactivate user accounts
- **User Details**: View customer information

### Managing Banners

- **Banner List**: View all promotional banners
- **Add Banners**: Upload banner images and set display options
- **Edit Banners**: Update banner content and settings
- **Banner Preview**: See how banners will appear

## API Endpoints

### Authentication
- `POST /admin/login` - Admin login
- `GET /admin/dashboard/stats` - Dashboard statistics

### Products
- `GET /admin/products` - List products
- `POST /admin/products` - Create product
- `PUT /admin/products/:id` - Update product
- `DELETE /admin/products/:id` - Delete product

### Orders
- `GET /admin/orders` - List orders
- `GET /admin/orders/:id` - Get order details
- `PUT /admin/orders/:id/status` - Update order status

### Users
- `GET /admin/users` - List users
- `PUT /admin/users/:id/status` - Update user status

### Banners
- `GET /admin/banners` - List banners
- `POST /admin/banners` - Create banner
- `PUT /admin/banners/:id` - Update banner
- `DELETE /admin/banners/:id` - Delete banner

## File Structure

```
backend/
├── adminRoutes.js          # Admin API routes
├── admin_tables_compatible.sql  # Database setup (compatible version)
├── db.js                   # Database connection
├── server.js               # Main server file
└── uploads/                # File uploads directory

ecommerce/src/components/AdminPanel/
├── AdminPanel.tsx          # Main admin panel component
├── AdminLogin.tsx          # Login component
├── AdminDashboard.tsx      # Dashboard component
├── ProductManagement.tsx   # Product management
├── OrderManagement.tsx     # Order management
├── UserManagement.tsx      # User management
├── BannerManagement.tsx    # Banner management
└── AdminPanel.css          # Admin panel styles
```

## Files Created

### Backend Files:
1. `backend/adminRoutes.js` - Admin API routes with authentication
2. `backend/admin_tables_compatible.sql` - Database setup script

### Frontend Files:
1. `ecommerce/src/components/AdminPanel/AdminPanel.tsx` - Main admin component
2. `ecommerce/src/components/AdminPanel/AdminLogin.tsx` - Login form
3. `ecommerce/src/components/AdminPanel/AdminDashboard.tsx` - Dashboard with stats
4. `ecommerce/src/components/AdminPanel/ProductManagement.tsx` - Product CRUD
5. `ecommerce/src/components/AdminPanel/OrderManagement.tsx` - Order management
6. `ecommerce/src/components/AdminPanel/UserManagement.tsx` - User management
7. `ecommerce/src/components/AdminPanel/BannerManagement.tsx` - Banner management
8. `ecommerce/src/components/AdminPanel/AdminPanel.css` - Comprehensive styles

### Modified Files:
1. `backend/server.js` - Added admin routes import
2. `ecommerce/src/App.tsx` - Added admin route

## Customization

### Adding New Admin Features

1. Create new components in `ecommerce/src/components/AdminPanel/`
2. Add routes in `backend/adminRoutes.js`
3. Update navigation in `AdminPanel.tsx`

### Modifying Database Schema

1. Update the SQL file `admin_tables_compatible.sql`
2. Modify corresponding backend routes
3. Update frontend interfaces and components

### Styling Changes

- Modify CSS files in each component directory
- Use `AdminPanel.css` for global admin styles
- Responsive design classes are included

## Security Features

- JWT-based authentication
- Admin role verification middleware
- Password hashing with bcrypt
- Protected API endpoints
- File upload validation

## Troubleshooting

### Common Issues

1. **Database Connection Error**
   - Check database credentials in `.env`
   - Ensure MySQL service is running
   - Verify database exists

2. **Admin Login Fails**
   - Verify admin user was created in database
   - Check JWT_SECRET in environment variables
   - Clear browser localStorage

3. **File Upload Issues**
   - Check uploads directory permissions
   - Verify file size limits (5MB default)
   - Ensure image file types

4. **CORS Errors**
   - Backend CORS is configured for development
   - Update CORS settings for production

### Performance Optimization

- Enable database indexing on frequently queried columns
- Implement pagination for large datasets
- Use image compression for banner uploads
- Enable database connection pooling

## Deployment

### Production Considerations

1. **Environment Variables**
   - Use strong JWT secrets
   - Secure database credentials
   - Set appropriate file upload limits

2. **Security**
   - Enable HTTPS
   - Implement rate limiting
   - Add request validation
   - Use environment-specific configurations

3. **Database**
   - Regular backups
   - Optimize queries
   - Monitor performance

4. **File Storage**
   - Use cloud storage for production
   - Implement CDN for images
   - Regular cleanup of old files

## Support

For issues or questions:
1. Check the troubleshooting section
2. Verify database schema compatibility
3. Review console logs for errors
4. Ensure all dependencies are installed

## License

This admin panel is part of your e-commerce project. Customize and use according to your project requirements.