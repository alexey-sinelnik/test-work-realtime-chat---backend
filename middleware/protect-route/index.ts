import jwt from 'jsonwebtoken';
import { NextFunction, Response } from 'express';
import User from '../../models/users';
import { IGetUserAuthInfoRequest } from '../../common/interfaces/request';
import { IJwtPayload } from '../../common/interfaces/jwt';

export const protectedRoute = async (
  req: IGetUserAuthInfoRequest,
  res: Response,
  next: NextFunction,
) => {
  try {
    const token = req.cookies['access_token'];
    if (!token)
      return res.status(401).json({ error: 'Unauthorized, no token provided' });
    const { userId } = jwt.verify(
      token,
      process.env.ACCESS_TOKEN_SECRET,
    ) as IJwtPayload;

    if (!userId)
      return res.status(401).json({ error: 'Unauthorized, invalid token' });

    req.user = await User.findById(userId).select('-password');
    next();
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
