require('dotenv').config()
const stripe = require('stripe')(process.env.STRIPE_TEST_API_KEY)
const Checkout = require('../models/check-out')
const Cart = require('../models/cart')
const checkoutService = require('../services/checkoutService')

module.exports.shoppingBill = async (req, res) => {
    try {
        const reposne = await checkoutService.shoppingBill(req.user._id, req.body)
        res.status(200).send(reposne)
    } catch (e) {
        res.status(400).send(e.message)
    }
}

module.exports.getBills = async (req, res) => {
    try {
        const response = await checkoutService.getBills(req.user._id)
        res.status(200).send(response)
    } catch (e) {
        res.status(e.statusCode || 400).send(e.message)
    }
}

module.exports.payment = async (req, res) => {
    try {
        const response = await checkoutService.payment(req.user._id)
        res.redirect(response)
    } catch (e) {
        res.status(statusCode || 400).send(e.message)
    }

}