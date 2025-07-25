import Joi from 'joi';

export const productSchema = Joi.object({
  name: Joi.string().required(),
  image: Joi.string().required(),
  images: Joi.array().items(Joi.string()),
  video: Joi.string().optional(),
  price: Joi.number().required(),
  oldPrice: Joi.number().optional(),
  rating: Joi.number().required(),
  reviewCount: Joi.number().required(),
  category: Joi.string().required(),
  subcategory: Joi.string().required(),
  color: Joi.string().required(),
  material: Joi.string().required(),
  description: Joi.string().optional(),
  details: Joi.array().items(Joi.string()),
  newArrival: Joi.boolean().optional(),
  inventory: Joi.number().required(),
  weight: Joi.number().optional(),
  dimensions: Joi.object({
    length: Joi.number().required(),
    width: Joi.number().required(),
    height: Joi.number().required(),
  }).optional(),
  aPlusImage: Joi.string().optional(),
  variants: Joi.array().items(Joi.object()).optional(),
  slug: Joi.string().required(),
}); 