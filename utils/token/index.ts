import jwt from 'jsonwebtoken';
import { Response } from 'express';

export const generateJwtToken = (userId: string, res: Response) => {
  const token: string = jwt.sign({ userId }, process.env.ACCESS_TOKEN_SECRET, {
    expiresIn: process.env.ACCESS_TOKEN_EXPIRED_TIME,
  });

  res.cookie('access_token', token, {
    maxAge: 24 * 60 * 60 * 1000,
    httpOnly: true,
    sameSite: 'strict',
    secure: process.env.NODE_ENV !== 'development',
  });
};
