const express = require('express')
const { authUser, authRole } = require('../middleware/auth')
const validateUpdate = require('../middleware/validateUpdate')
const {
    getUserCart,
    getUserBill,
    deleteUserAccount,
    deleteProduct,
    updateProduct
} = require('../controllers/adminController')


const router = express.Router()

router.get('/cart/:id', authUser, authRole('admin'), getUserCart)
router.get('/bill/:id', authUser, authRole('admin'), getUserBill)
router.delete('/user/:id', authUser, authRole('admin'), deleteUserAccount)
router.delete('/product/:id', authUser, authRole('admin'), deleteProduct)
router.patch('/update/:id', authUser, authRole('admin'), validateUpdate, updateProduct)

module.exports = router