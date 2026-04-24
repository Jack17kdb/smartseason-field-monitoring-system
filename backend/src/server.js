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
import path, { dirname } from 'path';
import { fileURLToPath } from 'url';

dotenv.config();

const PORT = process.env.PORT || 5000;
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const app = express();

app.use(cors({
	origin: process.env.CLIENT_URL || "http://localhost:5173",
	credentials: true
}));

app.use(helmet({
	contentSecurityPolicy: {
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

if(process.env.NODE_ENV === 'production'){
	app.use(express.static(path.join(__dirname, "../../frontend/dist")));

	app.get('*all', (req, res) => {
		res.sendFile(path.join(__dirname, "../../frontend", "dist", "index.html"));
	})
};

app.listen(PORT, () => {
	console.log("Serving from:", path.join(__dirname, "../../frontend/dist"));
	console.log(`Server listening on port: ${PORT}`);
	connectDB();
});
