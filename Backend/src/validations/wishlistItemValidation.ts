import Joi from 'joi';

export const wishlistItemSchema = Joi.object({
  userId: Joi.string().required(),
  productId: Joi.string().required(),
  name: Joi.string().required(),
  price: Joi.number().required(),
  image: Joi.string().required(),
  inStock: Joi.boolean().required(),
}); 