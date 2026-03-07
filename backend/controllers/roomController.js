import { getAllRooms, getRoomById, checkRoomAvailability } from '../services/roomService.js';
import { sendSuccess, sendError } from '../utils/response.js';

const listRooms = async (req, res) => {
  try {
    const rooms = await getAllRooms();
    return sendSuccess(res, { rooms }, 'Rooms retrieved');
  } catch (error) {
    return sendError(res, error.message, 500);
  }
};

const getRoom = async (req, res) => {
  try {
    const room = await getRoomById(req.params.id);
    return sendSuccess(res, { room }, 'Room retrieved');
  } catch (error) {
    return sendError(res, error.message, error.statusCode || 500);
  }
};

const checkAvailability = async (req, res) => {
  try {
    const { start_date, end_date } = req.query;
    const result = await checkRoomAvailability(
      req.params.id, start_date, end_date
    );
    return sendSuccess(
      res, result, result.available ? 'Available' : 'Not available'
    );
  } catch (error) {
    return sendError(res, error.message, error.statusCode || 500);
  }
};

export { listRooms, getRoom, checkAvailability };