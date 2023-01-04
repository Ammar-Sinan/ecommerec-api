const wishList = require("../models/wishList");
const productService = require("../services/productService");

module.exports.getAllProducts = async (req, res) => {
  const limit = parseInt(req.query.limit) || 10
  const skip = parseInt(req.query.skip) || 1
  const pagenumber = (skip - 1) * limit
  try {
    const response = await productService.getAllProducts(limit, skip, pagenumber)
    res.status(200).send(response)
  } catch (e) {
    res.status(e.statusCode || 400).send(e.message)
  }
}

module.exports.getProductsByCategory = async (req, res) => {
  const category = req.query.cat
  try {
    const response = await productService.getProductsByCategory(category)
    res.status(200).send(response)
  } catch (e) {
    res.status(e.statusCode || 400).send(e.message)
  }
}

module.exports.getProduct = async (req, res) => {
  try {
    const response = await productService.getProduct(req.params.id)
    res.status(200).send(response)
  } catch (e) {
    res.status(e.statusCode || 400).send(e.message)
  }
}

module.exports.getTraderProducts = async (req, res) => {
  try {
    const response = await productService.getTraderProducts(req.params.id)
    res.status(200).send(response)
  } catch (e) {
    res.status(400).send(e.message)
  }
}

module.exports.addtoWishList = async (req, res) => {
  try {
    const userId = req.user._id
    const productId = req.params.id
    const response = await productService.addToWishList(userId, productId)
    res.status(200).send(response)
  } catch (e) {
    res.status(e.statusCode || 400).send(e.message)
  }
}

module.exports.getWishList = async (req, res) => {
  try {
    const response = await productService.getWishList(req.user._id)
    res.status(200).send(response)
  } catch (e) {
    res.status(e.statusCode || 400).send(e.message)
  }
}

// trader rolde - controllers

module.exports.getProducts = async (req, res) => {
  const match = {}
  // try {
  //     const response = await productService.getProducts(req.user, req.query.archived)
  //     res.status(200).send(response)
  // } catch (e) {
  //     res.status(400).send(e.message)
  // }

  if (req.query.archived) {
    match.archived = req.query.archived === 'true'
  }
  try {
    await req.user.populate({
      path: "products",
      match
    })
    res.status(200).send(req.user.products)
  } catch (e) {
    res.status(401).send()
  }
}

module.exports.addProduct = async (req, res) => {
  try {
    const response = await productService.addProduct(req.body, req.user._id, req.files)
    res.status(200).send(response)
  } catch (e) {
    res.status(400).send(e.message)
  }
};

module.exports.updateProduct = async (req, res) => {
  try {
    const response = await productService.updateProduct(
      req.params.id,
      req.body
    )
    res.status(200).send(response)
  } catch (e) {
    res.status(400).send(e.message)
  }
}

module.exports.deleteProduct = async (req, res) => {
  try {
    const response = await productService.deleteProduct(req.params.id)
    res.status(200).send(response)
  } catch (e) {
    res.status(e.statusCode || 400).send(e.message)
  }
}
