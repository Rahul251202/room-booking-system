import express from 'express';
import { listRooms, getRoom, checkAvailability } from '../controllers/roomController.js';
import { authenticate } from '../middleware/auth.js';

const router = express.Router();

router.get('/', listRooms);
router.get('/:id', getRoom);
router.get('/:id/availability', authenticate, checkAvailability);

export default router;