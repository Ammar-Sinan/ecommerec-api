const express = require('express')
const { authUser } = require('../middleware/auth')

const {
    addToCart,
    getCart,
    removeCartItem,
    removeOneQty,
    guestCart
} = require('../controllers/cartController')

const router = express.Router()

router.post('/add/:id', authUser, addToCart)
router.delete('/removeOne/:id', authUser, removeOneQty)
router.get('/myCart', authUser, getCart)
router.delete('/delete/:id', authUser, removeCartItem)
router.post('/guestCart/:id', guestCart)

module.exports = router