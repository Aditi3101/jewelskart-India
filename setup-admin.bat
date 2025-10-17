@echo off
echo Setting up Admin Panel Database...
echo.

echo 1. Make sure MySQL is running
echo 2. Update your database credentials in backend\.env
echo 3. Run the following command in MySQL:
echo.
echo mysql -u root -p ecommerce < backend\admin_tables_compatible.sql
echo.
echo 4. Start the backend server:
echo cd backend
echo npm start
echo.
echo 5. Start the frontend:
echo cd ecommerce
echo npm run dev
echo.
echo Default admin credentials:
echo Username: admin
echo Password: admin123
echo Email: admin@example.com
echo.
pause