const Cart = require('../models/cart')
const Checkout = require('../models/check-out')
const Product = require('../models/product')
const User = require('../models/user')

module.exports.getUserCart = async (req, res) => {
    const userId = req.params.id
    try {
        const userCart = await Cart.findOne({ owner: userId })

        if (!userCart) {
            return res.status(404).send()
        }
        res.status(200).send(userCart)
    } catch (e) {
        res.status(400).send()
    }
}

module.exports.getUserBill = async (req, res) => {
    const userId = req.params.id
    try {
        const userBill = await Checkout.findOne({ owner: userId })

        if (!userBill) {
            return res.status(404).send()
        }
        res.status(200).send(userBill)
    } catch (e) {
        res.status(400).send()
    }
}

module.exports.deleteUserAccount = async (req, res) => {
    const _id = req.params.id
    try {
        const user = await User.findByIdAndDelete({ _id })
        if (!user) return res.status(404).send()
        res.status(200).send()
    } catch (e) {
        res.status(400).send()
    }
}

module.exports.deleteProduct = async (req, res) => {
    const _id = req.params.id
    try {
        const product = await Product.findByIdAndDelete({ _id })
        if (!product) return res.status(404).send()
        res.status(200).send()
    } catch (e) {
        res.status(400).send()
    }
}

module.exports.updateProduct = async (req, res) => {
    try {
        const updatedProduct = await Product.findByIdAndUpdate(req.params.id, req.body, { new: true })
        await updatedProduct.save({ validateBeforeSave: false })
        res.status(200).send(updatedProduct)
    } catch (e) {
        res.status(400).send()
    }
}