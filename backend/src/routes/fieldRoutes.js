import express from 'express';
import protect from '../middleware/protect.js';
import fieldController from '../controllers/fieldController.js';

const router = express.Router();

router.use(protect);

router.get('/', fieldController.getAssignedFields);
router.get('/:id', fieldController.getFieldDetails);
router.patch('/:id/stage', fieldController.updateFieldStage);
router.post('/:id/observations', fieldController.addObservation);

export default router;
