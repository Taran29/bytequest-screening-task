import mongoose from "mongoose";
import Joi from "joi";

const productSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    maxlength: 100
  },
  description: {
    type: String,
    required: true,
    maxlength: 800,
  },
  category: {
    type: String,
    required: true,
    maxlength: 30,
  },
  price: {
    type: Number,
    required: true,
  },
  stock: {
    type: Number,
    required: true,
  },
  images: [String]
})

productSchema.index({ title: 1 })

const Product = mongoose.model('product', productSchema)

//Custom validator to help with sending better error messages
const validateProduct = (product) => {
  const schema = Joi.object({
    title: Joi.string().required().max(100),
    description: Joi.string().required().max(800),
    category: Joi.string().required().max(30),
    price: Joi.number().required(),
    stock: Joi.number().required(),
    images: Joi.array().items(Joi.string().uri())
  })

  return schema.validate(product)
}

//Custom validator to validate incoming objects for updation
const validateProductUpdate = (product) => {
  const schema = Joi.object({
    title: Joi.string().max(100),
    description: Joi.string().max(800),
    category: Joi.string().max(30),
    price: Joi.number(),
    stock: Joi.number(),
    images: Joi.array().items(Joi.string().uri())
  })

  return schema.validate(product)
}

export {
  Product,
  validateProduct,
  validateProductUpdate
}