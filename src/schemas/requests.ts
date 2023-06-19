import Joi from "joi";

export const initRequestSchema = Joi.object({
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

export const updateRequestSchema = Joi.object({
  location: Joi.object({
    latitude: Joi.number().required(),
    longitude: Joi.number().required()
  }).optional(),
  packageDetails: Joi.object({
    category: Joi.string().required(),
    product: Joi.string().required(),
    description: Joi.string().optional(),
    weight: Joi.number().optional(),
    quantity: Joi.number().integer().optional(),
    image: Joi.string().base64().allow("").optional(),
    value: Joi.number().optional()
  }).optional(),
  selectedVehicleType: Joi.string()
    .valid("car", "bus", "bicycle", "van", "truck", "motorcycle")
    .optional(),
  destination: Joi.object({
    latitude: Joi.number().required(),
    longitude: Joi.number().required()
  }).optional(),
  recipientName: Joi.string().optional(),
  recipientPhoneNumber: Joi.string()
    .max(50)
    .pattern(
      new RegExp(
        /^\+?\d{1,4}?[-.\s]?\(?\d{1,3}?\)?[-.\s]?\d{1,4}[-.\s]?\d{1,4}[-.\s]?\d{1,9}$/
      )
    )
    .optional(),
  phoneNumber: Joi.string()
    .max(50)
    .pattern(
      new RegExp(
        /^\+?\d{1,4}?[-.\s]?\(?\d{1,3}?\)?[-.\s]?\d{1,4}[-.\s]?\d{1,4}[-.\s]?\d{1,9}$/
      )
    )
    .optional()
});
