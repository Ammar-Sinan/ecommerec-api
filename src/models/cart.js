const mongoose = require('mongoose')
const Product = require('./product')

const cartSchema = new mongoose.Schema({
    owner: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: 'User'
    },
    products: [{
        productId: {
            type: mongoose.Schema.Types.ObjectId,
            required: true
        },
        quantity: {
            type: Number,
            min: 1
        },
        price: {
            type: Number,
            require: true
        },
        title: {
            type: String
        },
        category: {
            type: String
        },
        description: {
            type: String
        },
        totalPrice: {
            type: Number
        }
    }],
    status: {
        type: String,
        default: 'pending',
        enum: ['pending', 'checkedOut']
    },
    subTotal: {
        type: Number
    }
}, { timestamps: true })

const Cart = mongoose.model('Cart', cartSchema)

module.exports = Cart