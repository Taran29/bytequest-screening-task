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
    maxlength: 300,
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

const Product = mongoose.model('product', productSchema)

//Custom validator to help with sending better error messages
const validateProduct = (product) => {
  const schema = Joi.object({
    title: Joi.string().required().max(100),
    description: Joi.string().required().max(300),
    category: Joi.string().required().max(30),
    price: Joi.number().required(),
    stock: Joi.number().required(),
    images: Joi.array().items(Joi.string())
  })

  return schema.validate(product)
}

export {
  Product,
  validateProduct
}