require('dotenv').config()
const stripe = require('stripe')(process.env.STRIPE_TEST_API_KEY)
const Cart = require('../models/cart')
const Checkout = require('../models/check-out')

module.exports.shoppingBill = async (userId, { address, phoneNumber }) => {
    try {
        await Cart.findOneAndUpdate({ owner: userId, status: 'pending' }, { status: 'checkedOut' }, { new: true })

        if (!phoneNumber || !address) throw new Error({ message: 'phone number and address are required', statusCode: 400 })

        const checkout = new Checkout({ address, phoneNumber, active: true, owner: userId })
        await checkout.save()
        return checkout
    } catch (e) {
        throw e
    }
}

module.exports.getBills = async (userId) => {
    try {
        const checkoutBills = await Checkout.find({ owner: userId, active: false }, 'address phoneNumber')
        if (!checkoutBills) throw new Error({ message: 'No previous bills were found!', statusCode: 404 })
        return checkoutBills
    } catch (e) {
        throw e
    }
}

module.exports.payment = async (userId) => {
    const homePage = 'http://localhost:3000';
    try {
        await Checkout.findOneAndUpdate({ owner: userId }, { active: false })
        const cart = await Cart.findOne({ owner: userId, status: 'checkedOut' }, 'products')
        if (!cart) throw new Error({ message: 'Card does not exist' })

        const session = await stripe.checkout.sessions.create({
            line_items: cart.products.map((item) => {
                return {
                    price_data: {
                        currency: 'usd',
                        product_data: {
                            name: item.title,
                        },
                        unit_amount: item.price * 100
                    },
                    quantity: item.quantity
                }
            }),
            mode: 'payment',
            success_url: `${homePage}`,
            cancel_url: `${homePage}`,
        });

        console.log(session.url)
        return session.url
        //res.redirect(303, session.url)
    } catch (e) {
        throw e
    }

}