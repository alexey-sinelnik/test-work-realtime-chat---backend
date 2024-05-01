import { Response } from 'express';
import User from '../../models/users';
import { IGetUserAuthInfoRequest } from '../../common/interfaces/request';

export const getUsers = async (req: IGetUserAuthInfoRequest, res: Response) => {
  try {
    const loggedUserId = req.user._id;
    const filteredUsers = await User.find({
      _id: { $ne: loggedUserId },
    }).select('-password');

    res.status(200).json(filteredUsers);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
