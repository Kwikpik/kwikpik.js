import Joi from "joi";

const requestsSchema = Joi.object({
  latitude: Joi.number().required(),
  longitude: Joi.number().required(),
  category: Joi.string().required(),
  product: Joi.string().required(),
  description: Joi.string().optional(),
  weight: Joi.number().optional(),
  quantity: Joi.number().integer().optional(),
  image: Joi.string().base64().allow("").optional(),
  destinationLatitude: Joi.number().required(),
  destinationLongitude: Joi.number().required(),
  vehicleType: Joi.string()
    .valid("car", "bus", "bicycle", "van", "truck", "motorcycle")
    .required(),
  recipientName: Joi.string().required(),
  recipientPhoneNumber: Joi.string()
    .max(50)
    .pattern(
      new RegExp(
        /^\+?\d{1,4}?[-.\s]?\(?\d{1,3}?\)?[-.\s]?\d{1,4}[-.\s]?\d{1,4}[-.\s]?\d{1,9}$/
      )
    )
    .required(),
  packageValue: Joi.number().optional(),
  phoneNumber: Joi.string()
    .max(50)
    .pattern(
      new RegExp(
        /^\+?\d{1,4}?[-.\s]?\(?\d{1,3}?\)?[-.\s]?\d{1,4}[-.\s]?\d{1,4}[-.\s]?\d{1,9}$/
      )
    )
    .required()
});

export default requestsSchema;
