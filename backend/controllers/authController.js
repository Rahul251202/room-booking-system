import { registerUser, loginUser } from '../services/authService.js';
import { sendSuccess, sendError, sendCreated } from '../utils/response.js';

const register = async (req, res) => {
  try {
    const result = await registerUser(req.body);
    return sendCreated(res, result, 'Registration successful');
  } catch (error) {
    return sendError(res, error.message, error.statusCode || 500);
  }
};

const login = async (req, res) => {
  try {
    const result = await loginUser(req.body);
    return sendSuccess(res, result, 'Login successful');
  } catch (error) {
    return sendError(res, error.message, error.statusCode || 500);
  }
};

const getMe = async (req, res) => {
  return sendSuccess(res, { user: req.user }, 'User info retrieved');
};

export { register, login, getMe };