import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';

const authMiddleware = (req, res, next) => {
  try {
    // 1. Read req.headers.authorization
    const authHeader = req.headers.authorization;

    // 2. Check header
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({ message: 'No token provided' });
    }

    // 3. Extract the token from the header
    const token = authHeader.split(' ')[1];

    // 4. Verify the token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // 5. Attach user to the request
    req.user = decoded;

    // Continue
    next();
  } catch (err) {
    console.error('JWT_ERROR', err);
    return res
      .status(401)
      .json({ message: 'Invalid, missing, or expired token' });
  }
};

export default authMiddleware;