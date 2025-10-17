import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
import adminRoutes from './adminRoutes.js';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Static for uploads
app.use('/uploads', express.static(path.join(process.cwd(), 'uploads')));
app.use('/uploads/banner', express.static(path.join(process.cwd(), 'uploads', 'banner')));

// Health check
app.get('/health', (_req, res) => {
  res.json({ ok: true, env: process.env.NODE_ENV || 'development' });
});

// Routes
app.use('/admin', adminRoutes);

const port = process.env.PORT || 5000;
app.listen(port, () => {
  console.log(`Backend server listening on http://localhost:${port}`);
});


