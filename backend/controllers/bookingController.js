import { createBooking, getUserBookings, cancelBooking } from '../services/bookingService.js';
import { sendSuccess, sendError, sendCreated } from '../utils/response.js';

const book = async (req, res) => {
  try {
    const booking = await createBooking(req.user.id, {
      roomId: req.body.room_id,
      startDate: req.body.start_date,
      endDate: req.body.end_date,
    });
    return sendCreated(res, { booking }, 'Booking confirmed');
  } catch (error) {
    return sendError(res, error.message, error.statusCode || 500);
  }
};

const myBookings = async (req, res) => {
  try {
    const bookings = await getUserBookings(req.user.id);
    return sendSuccess(res, { bookings }, 'Bookings retrieved');
  } catch (error) {
    return sendError(res, error.message, 500);
  }
};

const cancel = async (req, res) => {
  try {
    const result = await cancelBooking(req.params.id, req.user.id);
    return sendSuccess(res, result, 'Booking cancelled');
  } catch (error) {
    return sendError(res, error.message, error.statusCode || 500);
  }
};

export { book, myBookings, cancel };