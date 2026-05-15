import express, { Express, Request, Response, NextFunction } from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser';

import authRoutes from './routes/auth.routes';
import taskRoutes from './routes/task.routes';
import timeLogRoutes from './routes/timeLog.routes';
import summaryRoutes from './routes/summary.routes';

const app: Express = express();

const allowedOrigins = (process.env.FRONTEND_URL || 'http://localhost:3000')
  .split(',')
  .map(o => o.trim());

app.use(cors({
  origin: (origin, callback) => {
    // Allow requests with no origin (mobile apps, curl, server-to-server)
    if (!origin) return callback(null, true);
    if (allowedOrigins.includes(origin)) return callback(null, true);
    return callback(new Error('Not allowed by CORS'));
  },
  credentials: true
}));

app.use(express.json());
app.use(cookieParser());

// Simple health check route
app.get('/health', (req: Request, res: Response) => {
  res.status(200).json({ status: 'ok' });
});

app.use('/api/auth', authRoutes);
app.use('/api/tasks', taskRoutes);
app.use('/api/timelogs', timeLogRoutes);
app.use('/api/summary', summaryRoutes);

// We will add routes here later

// Basic error handler
app.use((err: any, req: Request, res: Response, next: NextFunction) => {
  console.error(err);
  const status = err.statusCode || 500;
  const message = err.message || 'Internal Server Error';
  res.status(status).json({ error: message });
});

export default app;
