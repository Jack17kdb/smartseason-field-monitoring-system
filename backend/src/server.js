import cors from 'cors';
import helmet from 'helmet';
import express from 'express';
import dotenv from 'dotenv';
import connectDB from './lib/db.js';
import cookieParser from 'cookie-parser';
import authRoutes from './routes/authRoutes.js';
import adminRoutes from './routes/adminRoutes.js';
import fieldRoutes from './routes/fieldRoutes.js';
import { logger, errorLogger } from './middleware/logger.js';

dotenv.config();

const PORT = process.env.PORT || 5000;
const app = express();

app.use(cors({
	origin: process.env.CLIENT_URL || "http://localhost:5173",
	credentials: true
}));

app.use(helmet({
	contentSecurityPolicies: {
		directives: {
			"default-src": ["'self'"],
			"img-src": ["'self'", "data:"],
			"connect-src": ["'self'"],
			"script-src": ["'self'", "'unsafe-inline'"]
		}
	}
}));

app.use(express.json());
app.use(express.urlencoded());
app.use(cookieParser());
app.use(logger);
app.use(errorLogger);

app.use('/api/auth', authRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/fields', fieldRoutes);

app.listen(PORT, () => {
	console.log(`Server listening on port: ${PORT}`);
	connectDB();
});
