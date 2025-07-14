import Joi from 'joi';

export const orderItemSchema = Joi.object({
  productId: Joi.string().required(),
  name: Joi.string().required(),
  price: Joi.number().required(),
  quantity: Joi.number().min(1).required(),
});

export const orderSchema = Joi.object({
  userId: Joi.string().required(),
  items: Joi.array().items(orderItemSchema).required(),
  total: Joi.number().required(),
  status: Joi.string().required(),
  shippingAddress: Joi.string().required(),
  createdAt: Joi.date().optional(),
  updatedAt: Joi.date().optional(),
}); 