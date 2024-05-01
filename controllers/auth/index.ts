import { Request, Response } from 'express';
import User from '../../models/users';
import { comparePassword, hashPassword } from '../../utils/bcrypt';
import { generateJwtToken } from '../../utils/token';

export const registerUser = async (
  req: Request,
  res: Response,
): Promise<Response<typeof User>> => {
  try {
    const { fullName, userName, email, password, confirmPassword, gender } =
      req.body;

    if (password !== confirmPassword)
      return res.status(400).json({ error: "Password don't match" });

    const user = await User.findOne({ email });

    if (user)
      return res
        .status(400)
        .json({ error: 'User with this email already exists' });

    const maleAvatar: string = `https://avatar.iran.liara.run/public/boy?username=${userName}`;
    const femaleAvatar: string = `https://avatar.iran.liara.run/public/girl?username=${userName}`;
    const hashUserPassword: string = await hashPassword(password);

    const newUser = new User({
      fullName,
      userName,
      password: hashUserPassword,
      gender,
      email,
      avatar: gender === 'male' ? maleAvatar : femaleAvatar,
    });

    await newUser.save();

    generateJwtToken(String(newUser._id), res);

    newUser.password = undefined;

    res.status(201).json(newUser);
  } catch (error) {
    console.log(error.message);
  }
};

export const loginUser = async (
  req: Request,
  res: Response,
): Promise<Response<typeof User>> => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });
    if (!user)
      res.status(400).json({ error: "User with this email don't exists" });

    const compareUserPassword: boolean = await comparePassword(
      user.password,
      password,
    );

    if (!compareUserPassword)
      res.status(400).json({ error: 'Invalid password' });

    user.password = undefined;
    generateJwtToken(String(user._id), res);

    return res.status(200).json(user);
  } catch (error) {
    console.log(error.message);
  }
};

export const logoutUser = async (
  req: Request,
  res: Response,
): Promise<void> => {
  try {
    res.cookie('access_token', '', { maxAge: 0 });
    res.status(200).json({ message: 'Log out successfully' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
