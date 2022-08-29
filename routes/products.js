import express from 'express'
import { Product, validateProduct, validateProductUpdate } from '../models/product.js'

const router = express.Router()

//Shows equivalent of page number 1
router.get('/', async (req, res) => {
  const pageSize = 5
  try {
    const products = await Product
      .find()
      .sort({ title: 1 })
      .limit(pageSize)

    res.status(200).send({
      message: 'Products found successfully.',
      products: products
    })
  } catch (ex) {
    res.status(502).send({ message: 'Could not connect to the database right now. Please try again later.' })
  }
})

router.get('/page', async (req, res) => {
  let pageNumber = parseInt(req.query.pageNumber)
  if (isNaN(pageNumber)) {
    return res.status(400).send({ message: 'Page number needs to be a number.' })
  }

  const pageSize = 5

  try {
    const products = await Product
      .find()
      .sort({ title: 1 })
      .skip((pageNumber - 1) * pageSize)
      .limit(pageSize)

    res.status(200).send({
      message: `Products found successfully for page ${pageNumber}`,
      products: products
    })
  } catch (ex) {
    res.status(502).send({ message: 'Could not connect to the database right now. Please try again later.' })
  }
})

//Get specific product information
router.get('/:id', async (req, res) => {
  try {
    const product = await Product.findById(req.params.id)
    if (!product) {
      return res.status(400).send({ message: 'Product with given ID does not exist.' })
    }

    res.status(200).send({
      message: 'Product found successfully.',
      product: product,
    })
  } catch (ex) {
    res.status(502).send({ message: 'Could not connect to the database right now. Please try again later.' })
  }
})

router.post('/', async (req, res) => {
  //Validating incoming request body before DB call
  const { error } = validateProduct(req.body)
  if (error) {
    return res.status(400).send({ message: error.details[0].message })
  }

  const product = new Product({
    title: req.body.title,
    description: req.body.description,
    category: req.body.category,
    price: req.body.price,
    stock: req.body.stock,
    images: req.body.images,
  })

  try {
    await product.save()
    res.status(200).send({ message: `${product.title} saved successfully` })
  } catch (ex) {
    res.status(502).send({ message: 'Could not connect to the database right now. Please try again later.' })
  }
})

router.put('/:id', async (req, res) => {
  //Validating incoming request body for updating existing object
  const { error } = validateProductUpdate(req.body)
  if (error) {
    return res.status(400).send({ message: error.details[0].message })
  }

  try {
    const result = await Product.findByIdAndUpdate(req.params.id, req.body, { returnOriginal: true })
    res.status(200).send({ message: `${result.title} updated successfully.` })
  } catch (ex) {
    res.status(502).send({ message: 'Could not connect to the database right now. Please try again later.' })
  }
})

router.delete('/:id', async (req, res) => {
  try {
    const result = await Product.findByIdAndDelete(req.params.id)
    if (!result) {
      return res.status(400).send({ message: 'Product with given ID does not exist.' })
    }
    res.status(200).send({ message: `${result.title} has been deleted.` })
  } catch (ex) {
    res.status(502).send({ message: 'Could not connect to the database right now. Please try again later.' })
  }
})

export default router