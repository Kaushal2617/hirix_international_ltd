import Joi from 'joi';

export const reviewSchema = Joi.object({
  productId: Joi.string().required(),
  userId: Joi.string().required(),
  rating: Joi.number().min(1).max(5).required(),
  comment: Joi.string().required(),
  images: Joi.array().items(Joi.string()).optional(),
  createdAt: Joi.date().optional(),
}); 