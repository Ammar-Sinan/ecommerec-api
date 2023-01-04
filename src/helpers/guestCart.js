const LocalStorage = require('node-localstorage').LocalStorage
localStorage = new LocalStorage('./scratch')
const Cart = require('../models/cart')

module.exports.getGuestCart = async (userId) => {

    const cart = JSON.parse(localStorage.getItem('cart'))

    try {
        const guestCart = await Cart({ products: cart, owner: userId })
        await guestCart.save()
        localStorage.clear()
    } catch (e) {
        throw new Error('could not get guest cart')
    }

}

