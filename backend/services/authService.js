import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { pool } from '../config/database.js';

const registerUser = async ({ name, email, password }) => {
  const [existing] = await pool.query(
    'SELECT id FROM users WHERE email = ?', [email]
  );
  if (existing.length > 0) {
    const error = new Error('Email already registered');
    error.statusCode = 409;
    throw error;
  }
  const hashedPassword = await bcrypt.hash(password, 12);
  const [result] = await pool.query(
    'INSERT INTO users (name, email, password) VALUES (?, ?, ?)',
    [name, email, hashedPassword]
  );
  const userId = result.insertId;
  const token = generateToken({ id: userId, email, name });
  return { user: { id: userId, name, email }, token };
};

const loginUser = async ({ email, password }) => {
  const [rows] = await pool.query(
    'SELECT id, name, email, password FROM users WHERE email = ?',
    [email]
  );
  if (rows.length === 0) {
    const error = new Error('Invalid email or password');
    error.statusCode = 401;
    throw error;
  }
  const user = rows[0];
  const isMatch = await bcrypt.compare(password, user.password);
  if (!isMatch) {
    const error = new Error('Invalid email or password');
    error.statusCode = 401;
    throw error;
  }
  const token = generateToken({
    id: user.id,
    email: user.email,
    name: user.name
  });
  return { user: { id: user.id, name: user.name, email: user.email }, token };
};

const generateToken = (payload) => {
  return jwt.sign(payload, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN || '7d',
  });
};

export { registerUser, loginUser };