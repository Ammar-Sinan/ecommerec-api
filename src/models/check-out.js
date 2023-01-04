const mongoose = require('mongoose')

const checkoutSchema = new mongoose.Schema({

    owner: {
        type: mongoose.Schema.Types.ObjectId,
        required: true
    },
    address: {
        type: String
    },
    phoneNumber: {
        type: String
    },
    active: {
        type: Boolean,
        default: false
    }
}, { timestamps: true })

const checkout = mongoose.model('checkout', checkoutSchema)

module.exports = checkout