import { celebrate, Joi } from 'celebrate';

const urlRegex = /^https?:\/\/(www\.)?[\w-]+(\.[\w-]+)+([/\w\-._~:/?#[@!$&'()*+,;=]*)?#?$/;

export const validateUserSignup = celebrate({
  body: Joi.object().keys({
    name: Joi.string().min(2).max(30),
    about: Joi.string().min(2).max(200),
    avatar: Joi.string().pattern(urlRegex),
    email: Joi.string().required().email(),
    password: Joi.string().required(),
  }),
});

export const validateUserSignin = celebrate({
  body: Joi.object().keys({
    email: Joi.string().required().email(),
    password: Joi.string().required(),
  }),
});
