import express from 'express';
import protect from '../middleware/protect.js';
import adminProtect from '../middleware/adminProtect.js';
import adminController from '../controllers/adminController.js';

const router = express.Router();

router.use(protect);
router.use(adminProtect);

router.post('/field', adminController.createField);
router.get('/fields', adminController.getAllFields);
router.get('/dashboard', adminController.getDashboardStats);
router.get('/agents', adminController.getAgents);
router.patch('/field/:id/assign', adminController.assignField);

export default router;
