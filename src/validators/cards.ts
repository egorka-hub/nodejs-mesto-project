import { celebrate, Joi } from 'celebrate';

const urlRegex = /^https?:\/\/(www\.)?[\w-]+(\.[\w-]+)+([/\w\-._~:/?#[\]@!$&'()*+,;=]*)?#?$/;

export const validateCreateCard = celebrate({
  body: Joi.object().keys({
    name: Joi.string().required().min(2).max(30),
    link: Joi.string().required().pattern(urlRegex),
  }),
});

export const validateCardId = celebrate({
  params: Joi.object().keys({
    cardId: Joi.string().hex().length(24).required(),
  }),
});
