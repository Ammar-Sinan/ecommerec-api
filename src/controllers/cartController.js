const cartService = require('../services/cartService')

module.exports.addToCart = async (req, res) => {
    const productId = req.params.id
    const quantity = req.body.quantity

    try {
        const response = await cartService.addToCart(req.user._id, productId, quantity)
        res.status(200).send(response)
    } catch (e) {
        res.status(e.statusCode || 400).send(e.message)
    }
}

module.exports.getCart = async (req, res) => {
    try {
        const response = await cartService.getCart(req.user._id)
        res.status(200).send(response)
    } catch (e) {
        res.status(e.statusCode || 400).send(e.message)
    }
}

module.exports.removeCartItem = async (req, res) => {
    const productId = req.params.id
    try {
        const response = await cartService.removeCartItem(req.user._id, productId)
        res.status(200).send(response)
    } catch (e) {
        res.status(e.statusCode || 400).send(e.message)
    }
}

module.exports.removeOneQty = async (req, res) => {
    const productId = req.params.id
    try {
        const response = await cartService.removeOneQty(req.user._id, productId)
        res.status(200).send(response)
    } catch (e) {
        res.status(400).send(e.message)
    }
}

module.exports.guestCart = async (req, res) => {
    const productId = req.params.id
    const quantity = req.body.quantity
    try {
        const response = await cartService.guestCart(quantity, productId)
        res.status(200).send(response)
    } catch (e) {
        res.status(e.statusCode || 400).send(e.message)
    }
}



