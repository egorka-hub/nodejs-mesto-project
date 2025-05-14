import { Request, Response, NextFunction } from 'express';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';

import User from '../models/user';

import NotFoundError from '../errors/NotFoundError';
import BadRequestError from '../errors/BadRequestError';
import UnauthorizedError from '../errors/UnauthorizedError';
import ConflictError from '../errors/ConflictError';
import HttpStatus from '../errors/HttpStatus';

const { NODE_ENV, JWT_SECRET = 'dev-secret' } = process.env;

// возвращает всех пользователей
export const getUsers = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const users = await User.find({});
    return res.send(users);
  } catch (err: unknown) {
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
  } catch (err: unknown) {
    if (err instanceof Error && err.name === 'CastError') {
      return next(new BadRequestError('Некорректный id пользователя'));
    }
    return next(err);
  }
};

// создаёт пользователя
export const createUser = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const {
      name,
      about,
      avatar,
      email,
      password,
    } = req.body;

    const hash = await bcrypt.hash(password, 10);

    const user = await User.create({
      name,
      about,
      avatar,
      email,
      password: hash,
    });

    const userWithoutPassword = user.toObject();
    delete userWithoutPassword.password;

    return res.status(HttpStatus.Created).send(userWithoutPassword);
  } catch (err: unknown) {
    if (
      typeof err === 'object' && err !== null && 'code' in err && (err as { code: number }).code === 11000
    ) {
      return next(new ConflictError('Пользователь с таким email уже существует'));
    }

    if (err instanceof Error && err.name === 'ValidationError') {
      return next(new BadRequestError('Некорректные данные при создании пользователя'));
    }

    return next(err);
  }
};

// контроллер login
export const login = async (req: Request, res: Response, next: NextFunction) => {
  const { email, password } = req.body;

  try {
    const user = await User.findUserByCredentials(email, password);

    const token = jwt.sign(
      { _id: user._id },
      NODE_ENV === 'production' ? JWT_SECRET : 'dev-secret',
      { expiresIn: '7d' },
    );

    res
      .cookie('jwt', token, {
        httpOnly: true,
        sameSite: 'strict',
        maxAge: 7 * 24 * 60 * 60 * 1000,
      })
      .send({ message: 'Авторизация успешна' });
  } catch (err: unknown) {
    next(new UnauthorizedError('Неправильные почта или пароль'));
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
  } catch (err: unknown) {
    if (err instanceof Error && err.name === 'ValidationError') {
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
  } catch (err: unknown) {
    if (err instanceof Error && err.name === 'ValidationError') {
      return next(new BadRequestError('Некорректные данные при обновлении аватара'));
    }
    return next(err);
  }
};
