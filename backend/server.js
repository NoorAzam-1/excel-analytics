
import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import path from 'path';


import aiRouter from './src/routes/ai.js';
import authRoutes from './src/routes/auth.js';
import uploadRoutes from './src/routes/upload.js';
import parseRoutes from './src/routes/parse.js';
import adminRoutes from './src/routes/admin.js';
import historyRoutes from './src/routes/history.js';

import connectDB from './src/config/db.js';

dotenv.config();
connectDB(); 

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(helmet());
app.use(morgan('dev'));
app.use(express.json());
app.use('/uploads', express.static('uploads'));

app.use('/api/auth', authRoutes);
app.use('/api/upload', uploadRoutes);
app.use('/api/data', parseRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/ai', aiRouter);
app.use('/api/history', historyRoutes);

app.get('/api/health', (req, res) => {
  res.json({ status: 'OK', time: new Date().toISOString() });
});
app.get('/test', (req, res) => res.send('Test route works!'));

app.use((err, req, res, next) => {
  console.error('Unhandled Error:', err);
  res.status(500).json({ error: 'Internal Server Error' });
});

app.listen(PORT, () => console.log(`Server running on port ${PORT}`));


