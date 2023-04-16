import Joi from "joi";

export const productSchema = Joi.object({
  title: Joi.string().required(),
  description: Joi.string().required(),
  price: Joi.number().required(),
  count: Joi.number().required(),
  shortDescription: Joi.string(),
  imgUrl: Joi.string()
});
