const mongoose = require('mongoose')

const productSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true,
    },
    category: {
        type: String,
        required: true
    },
    description: {
        type: String,
    },
    archived: {
        type: Boolean,
        default: false
    },
    price: {
        type: Number,
        required: true
    },
    photos: [{
        photo: {
            type: Buffer
        }
    }],
    owner: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    }
})



const Product = mongoose.model('Product', productSchema)

module.exports = Product