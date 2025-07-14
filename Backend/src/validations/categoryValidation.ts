import Joi from 'joi';

export const categorySchema = Joi.object({
  name: Joi.string().required(),
  slug: Joi.string().required(),
  image: Joi.string().optional(),
  items: Joi.number().optional(),
  link: Joi.string().required(),
}); 