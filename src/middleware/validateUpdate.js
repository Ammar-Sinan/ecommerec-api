const Product = require('../models/product')

const validateUpdate = async (req, res, next) => {
    const updates = Object.keys(req.body)
    const productId = req.params.id
    const product = await Product.findById({ _id: productId, owner: req.user.role === 'admin' ? undefined : req.user._id })
    if (!product) return res.status(404).send()

    const allowedUpdates = ['title', 'description', 'archived']
    const isValidOperation = updates.every((update) => allowedUpdates.includes(update))

    if (!isValidOperation) {
        return res.status(400).send('Invalid updates!')

    } else if (req.body.title == null && req.body.price == null) {
        return res.status(400).send()
    }
    next()
}

module.exports = validateUpdate