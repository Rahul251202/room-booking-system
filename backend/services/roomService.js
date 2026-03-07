import { pool } from '../config/database.js';

const getAllRooms = async () => {
  const [rows] = await pool.query(
    'SELECT id, name, description, price_per_night, capacity, image_url, amenities FROM rooms WHERE is_active = TRUE'
  );
  return rows.map((room) => ({
    ...room,
    amenities: typeof room.amenities === 'string'
      ? JSON.parse(room.amenities)
      : room.amenities,
  }));
};

const getRoomById = async (roomId) => {
  const [rows] = await pool.query(
    `SELECT id, name, description, price_per_night, 
     capacity, image_url, amenities 
     FROM rooms WHERE id = ? AND is_active = TRUE`,
    [roomId]
  );
  if (rows.length === 0) {
    const error = new Error('Room not found');
    error.statusCode = 404;
    throw error;
  }
  const room = rows[0];
  return {
    ...room,
    amenities: typeof room.amenities === 'string'
      ? JSON.parse(room.amenities)
      : room.amenities,
  };
};

const checkRoomAvailability = async (roomId, startDate, endDate) => {
  const [roomRows] = await pool.query(
    'SELECT id FROM rooms WHERE id = ? AND is_active = TRUE',
    [roomId]
  );
  if (roomRows.length === 0) {
    const error = new Error('Room not found');
    error.statusCode = 404;
    throw error;
  }
  const [conflicts] = await pool.query(
    `SELECT id FROM bookings 
     WHERE room_id = ? 
     AND status = 'confirmed'
     AND start_date < ? 
     AND end_date > ?`,
    [roomId, endDate, startDate]
  );
  return { available: conflicts.length === 0 };
};

export { getAllRooms, getRoomById, checkRoomAvailability };