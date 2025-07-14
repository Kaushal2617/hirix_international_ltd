import Joi from 'joi';

export const cartItemSchema = Joi.object({
  userId: Joi.string().required(),
  productId: Joi.number().required(),
  name: Joi.string().required(),
  price: Joi.number().required(),
  image: Joi.string().required(),
  quantity: Joi.number().min(1).required(),
}); 