import { validationResult } from 'express-validator';
import { sendError } from '../utils/response.js';

const validate = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    const formattedErrors = errors.array().map((err) => ({
      field: err.path,
      message: err.msg,
    }));
    return sendError(res, 'Validation failed', 422, formattedErrors);
  }
  next();
};

export { validate };