import express from 'express';
import { body } from 'express-validator';
import { book, myBookings, cancel } from '../controllers/bookingController.js';
import { authenticate } from '../middleware/auth.js';
import { validate } from '../middleware/validate.js';

const router = express.Router();

router.use(authenticate);

router.post('/',
  [
    body('room_id').isInt({ min: 1 }).withMessage('Valid room ID required'),
    body('start_date').isDate().withMessage('Valid start date required'),
    body('end_date').isDate().withMessage('Valid end date required'),
  ],
  validate, book
);

router.get('/my', myBookings);
router.patch('/:id/cancel', cancel);

export default router;
