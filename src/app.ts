import express from 'express';
import mongoose from 'mongoose';
import cookieParser from 'cookie-parser';
import routes from './routes';
import errorHandler from './errors/errorHandler';
import { login, createUser } from './controllers/users';
import auth from './middlewares/auth';
import { requestLogger, errorLogger } from './middlewares/logger';
import { validateUserSignup, validateUserSignin } from './validators/users';

const { PORT = 3000 } = process.env;

const app = express();

mongoose.connect('mongodb://localhost:27017/mestodb')
  .then(() => {
    console.log('Connected to MongoDB');

    app.listen(PORT, () => {
      console.log(`App listening on port ${PORT}`);
    });
  })
  .catch((err) => {
    console.error('MongoDB connection error:', err);
  });

app.use(express.json());
app.use(cookieParser());

app.use(requestLogger);

app.post('/signin', validateUserSignin, login);
app.post('/signup', validateUserSignup, createUser);

app.use(auth);

app.use(routes);

app.use(errorLogger);

app.use(errorHandler);
