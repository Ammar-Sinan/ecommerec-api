const express = require('express')
const { authUser } = require('../middleware/auth')
const {
    shoppingBill,
    getBills,
    payment
} = require('../controllers/checkoutController')

const router = express.Router()

router.post('/', authUser, shoppingBill)
router.get('/bill', authUser, getBills)
router.post('/create-checkout-session', authUser, payment)

module.exports = router