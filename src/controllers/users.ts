import { Request, Response, NextFunction } from 'express';
import User from '../models/user';
import NotFoundError from '../errors/NotFoundError';
import BadRequestError from '../errors/BadRequestError';

// возвращает всех пользователей
export const getUsers = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const users = await User.find({});
    return res.send(users);
  } catch (err) {
    return next(err);
  }
};

// возвращает пользователя по _id
export const getUserById = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { userId } = req.params;
    const user = await User.findById(userId);

    if (!user) {
      throw new NotFoundError('Пользователь не найден');
    }

    return res.send(user);
  } catch (err: any) {
    if (err.name === 'CastError') {
      return next(new BadRequestError('Некорректный id пользователя'));
    }
    return next(err);
  }
};

// создаёт пользователя
export const createUser = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { name, about, avatar } = req.body;
    const user = await User.create({ name, about, avatar });
    return res.status(201).send(user);
  } catch (err: any) {
    if (err.name === 'ValidationError') {
      return next(new BadRequestError('Некорректные данные при создании пользователя'));
    }
    return next(err);
  }
};

// обновляет профиль
export const updateProfile = async (
  req: Request & { user?: { _id: string } },
  res: Response,
  next: NextFunction,
) => {
  try {
    const { name, about } = req.body;
    const user = await User.findByIdAndUpdate(
      req.user?._id,
      { name, about },
      { new: true, runValidators: true },
    );

    if (!user) {
      throw new NotFoundError('Пользователь не найден');
    }

    return res.send(user);
  } catch (err: any) {
    if (err.name === 'ValidationError') {
      return next(new BadRequestError('Некорректные данные при обновлении профиля'));
    }
    return next(err);
  }
};

// обновляет аватар
export const updateAvatar = async (
  req: Request & { user?: { _id: string } },
  res: Response,
  next: NextFunction,
) => {
  try {
    const { avatar } = req.body;
    const user = await User.findByIdAndUpdate(
      req.user?._id,
      { avatar },
      { new: true, runValidators: true },
    );

    if (!user) {
      throw new NotFoundError('Пользователь не найден');
    }

    return res.send(user);
  } catch (err: any) {
    if (err.name === 'ValidationError') {
      return next(new BadRequestError('Некорректные данные при обновлении аватара'));
    }
    return next(err);
  }
};
