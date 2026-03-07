import { pool } from '../config/database.js';

const createBooking = async (userId, { roomId, startDate, endDate }) => {
  const connection = await pool.getConnection();
  try {
    await connection.beginTransaction();
    const [conflicts] = await connection.query(
      `SELECT id FROM bookings 
       WHERE room_id = ? 
       AND status = 'confirmed'
       AND start_date < ? 
       AND end_date > ? 
       FOR UPDATE`,
      [roomId, endDate, startDate]
    );
    if (conflicts.length > 0) {
      await connection.rollback();
      const error = new Error('Room is not available for the selected dates');
      error.statusCode = 409;
      throw error;
    }
    const [roomRows] = await connection.query(
      'SELECT id, price_per_night FROM rooms WHERE id = ?',
      [roomId]
    );
    if (roomRows.length === 0) {
      await connection.rollback();
      const error = new Error('Room not found');
      error.statusCode = 404;
      throw error;
    }
    const nights = Math.ceil(
      (new Date(endDate) - new Date(startDate)) / (1000 * 60 * 60 * 24)
    );
    const totalPrice = nights * parseFloat(roomRows[0].price_per_night);
    const [result] = await connection.query(
      `INSERT INTO bookings 
       (user_id, room_id, start_date, end_date, total_price)
       VALUES (?, ?, ?, ?, ?)`,
      [userId, roomId, startDate, endDate, totalPrice]
    );
    await connection.commit();
    const [rows] = await pool.query(
      `SELECT b.*, r.name as room_name, r.image_url 
       FROM bookings b
       JOIN rooms r ON b.room_id = r.id 
       WHERE b.id = ?`,
      [result.insertId]
    );
    return rows[0];
  } catch (error) {
    await connection.rollback();
    throw error;
  } finally {
    connection.release();
  }
};

const getUserBookings = async (userId) => {
  const [rows] = await pool.query(
    `SELECT b.*, r.name as room_name, r.image_url, 
     r.price_per_night,
     DATEDIFF(b.end_date, b.start_date) as nights
     FROM bookings b 
     JOIN rooms r ON b.room_id = r.id
     WHERE b.user_id = ? 
     ORDER BY b.created_at DESC`,
    [userId]
  );
  return rows;
};

const cancelBooking = async (bookingId, userId) => {
  const [rows] = await pool.query(
    'SELECT id, status FROM bookings WHERE id = ? AND user_id = ?',
    [bookingId, userId]
  );
  if (rows.length === 0) {
    const error = new Error('Booking not found');
    error.statusCode = 404;
    throw error;
  }
  if (rows[0].status === 'cancelled') {
    const error = new Error('Booking already cancelled');
    error.statusCode = 400;
    throw error;
  }
  await pool.query(
    "UPDATE bookings SET status = 'cancelled' WHERE id = ?",
    [bookingId]
  );
  return { id: bookingId, status: 'cancelled' };
};

export { createBooking, getUserBookings, cancelBooking };