import { Request, Response, NextFunction } from 'express';
import mongoose from 'mongoose';
import Card from '../models/card';
import NotFoundError from '../errors/NotFoundError';
import BadRequestError from '../errors/BadRequestError';
import ForbiddenError from '../errors/ForbiddenError';

// возвращает все карточки
export const getCards = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const cards = await Card.find({});
    return res.send(cards);
  } catch (err: unknown) {
    return next(err);
  }
};

// создаёт карточку
export const createCard = async (
  req: Request & { user?: { _id: string } },
  res: Response,
  next: NextFunction,
) => {
  try {
    const { name, link } = req.body;
    const owner = req.user?._id;
    const card = await Card.create({ name, link, owner });
    return res.status(201).send(card);
  } catch (err: unknown) {
    if (err instanceof mongoose.Error.ValidationError) {
      return next(new BadRequestError('Некорректные данные при создании карточки'));
    }
    return next(err);
  }
};

// удаляет карточку по идентификатору
export const deleteCard = async (
  req: Request & { user?: { _id: string } },
  res: Response,
  next: NextFunction,
) => {
  try {
    const { cardId } = req.params;
    const card = await Card.findById(cardId);

    if (!card) {
      throw new NotFoundError('Карточка не найдена');
    }

    if (card.owner.toString() !== req.user?._id) {
      throw new ForbiddenError('Вы не можете удалить чужую карточку');
    }

    await card.deleteOne();

    return res.send({ message: 'Карточка удалена' });
  } catch (err: unknown) {
    if (err instanceof mongoose.Error.CastError) {
      return next(new BadRequestError('Некорректный id карточки'));
    }
    return next(err);
  }
};

// поставить лайк карточке
export const likeCard = async (
  req: Request & { user?: { _id: string } },
  res: Response,
  next: NextFunction,
) => {
  try {
    const card = await Card.findByIdAndUpdate(
      req.params.cardId,
      { $addToSet: { likes: req.user?._id } },
      { new: true },
    );

    if (!card) {
      throw new NotFoundError('Карточка не найдена');
    }

    return res.send(card);
  } catch (err: unknown) {
    if (err instanceof mongoose.Error.CastError) {
      return next(new BadRequestError('Некорректный id карточки'));
    }
    return next(err);
  }
};

// убрать лайк карточки
export const dislikeCard = async (
  req: Request & { user?: { _id: string } },
  res: Response,
  next: NextFunction,
) => {
  try {
    const card = await Card.findByIdAndUpdate(
      req.params.cardId,
      { $pull: { likes: req.user?._id } },
      { new: true },
    );

    if (!card) {
      throw new NotFoundError('Карточка не найдена');
    }

    return res.send(card);
  } catch (err: unknown) {
    if (err instanceof mongoose.Error.CastError) {
      return next(new BadRequestError('Некорректный id карточки'));
    }
    return next(err);
  }
};
