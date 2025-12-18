import express from 'express';
import jwt from 'jsonwebtoken';

export const authRouter = express.Router();

authRouter.post('/generate-token', (req, res) => {
  const token = jwt.sign(
    { userId: 'test-user-123' },
    process.env.JWT_SECRET,
    { expiresIn: '7d' }
  );
  res.json({ success: true, token });
});
