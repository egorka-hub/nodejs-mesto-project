import express, { Request, Response, NextFunction } from 'express';
import mongoose from 'mongoose';
import userRouter from './routes/users';
import cardRouter from './routes/cards';
import errorHandler from './errors/errorHandler';

const { PORT = 3000 } = process.env;

const app = express();

mongoose.connect('mongodb://localhost:27017/mestodb')
  .then(() => {
    console.log('Connected to MongoDB');
  })
  .catch((err) => {
    console.error('MongoDB connection error:', err);
  });

app.use(express.json());

// временное решение авторизации
app.use((req: Request & { user?: { _id: string } }, res: Response, next: NextFunction) => {
  req.user = { _id: '681b53e3ab22535f7be39c98' };
  next();
});

app.use('/users', userRouter);
app.use('/cards', cardRouter);

app.use(errorHandler);

app.listen(PORT, () => {
  console.log(`App listening on port ${PORT}`);
});
