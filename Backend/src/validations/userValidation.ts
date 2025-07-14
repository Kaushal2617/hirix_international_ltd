import Joi from 'joi';

export const addressSchema = Joi.object({
  id: Joi.number().required(),
  label: Joi.string().required(),
  address: Joi.string().required(),
  postcode: Joi.string().required(),
  phone: Joi.string().required(),
});

export const userSchema = Joi.object({
  name: Joi.string().required(),
  email: Joi.string().email().required(),
  contact: Joi.string().required(),
  addresses: Joi.array().items(addressSchema).required(),
}); 