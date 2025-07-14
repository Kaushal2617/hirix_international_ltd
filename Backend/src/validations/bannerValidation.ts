import Joi from 'joi';

export const bannerSchema = Joi.object({
  imageUrl: Joi.string().required(),
  mobileImageUrl: Joi.string().optional(),
  type: Joi.string().valid('hero', 'mini').required(),
  category: Joi.string().optional(),
  link: Joi.string().optional(),
  title: Joi.string().optional(),
}); 