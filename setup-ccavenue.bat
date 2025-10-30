@echo off
echo ========================================
echo   CCAvenue Payment Gateway Setup
echo ========================================
echo.

echo 1. Installing Backend Dependencies...
cd backend
call npm install express mysql2 dotenv cors crypto body-parser nodemailer bcrypt jsonwebtoken multer pdfkit
echo ✅ Backend dependencies installed!
echo.

echo 2. Installing Frontend Dependencies...
cd ../ecommerce
call npm install axios
echo ✅ Frontend dependencies installed!
echo.

echo 3. Setting up Database...
cd ../backend
echo Please run this SQL command in your MySQL:
echo CREATE DATABASE IF NOT EXISTS jewelskart;
echo USE jewelskart;
echo SOURCE database-setup.sql;
echo.

echo 4. Starting Applications...
echo.
echo Please open 3 separate terminals and run:
echo.
echo Terminal 1 (Backend):
echo cd backend && npm start
echo.
echo Terminal 2 (Frontend):
echo cd ecommerce && npm run dev
echo.
echo Terminal 3 (ngrok):
echo ngrok http 5000
echo.
echo 5. Update .env file with your ngrok URL!
echo.
echo ✅ Setup complete! Check CCAVENUE_SETUP_GUIDE.md for detailed instructions.
pause