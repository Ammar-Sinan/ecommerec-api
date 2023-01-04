const express = require('express')
const multer = require('multer')
const { authUser, authRole } = require('../middleware/auth')
const validateUpdate = require('../middleware/validateUpdate')
const {
    getAllProducts,
    getProductsByCategory,
    getProduct,
    getTraderProducts,
    // trader methods =>
    getProducts,
    addProduct,
    updateProduct,
    deleteProduct,
    addtoWishList,
    getWishList
} = require('../controllers/productController')

const router = express.Router()

const upload = multer({
    fileFilter: (req, file, cb) => {
        console.log(file)
        if (file.mimetype == 'image/png' || file.mimetype == 'image/jpg' || file.mimetype == 'image/jpeg') {
            cb(null, true)
        } else {
            cb(null, false)
        }
    },
    limits: {
        fileSize: 1024 * 1024 * 2
    }
})

router.get('/all', getAllProducts)
router.get('/category', authUser, getProductsByCategory)
router.get('/:id', authUser, getProduct)
router.get('/trader/:id', authUser, getTraderProducts)
router.post('/add-to-wishList/:id', authUser, addtoWishList)
router.get('/wish-list', authUser, getWishList)


// trader routes
router.get('/myProducts', authUser, authRole('trader'), getProducts)
router.post('/add', authUser, authRole('trader'), upload.array('photos', 10), addProduct)
router.patch('/update/:id', authUser, authRole('trader'), validateUpdate, updateProduct)
router.delete('/delete/:id', authUser, authRole('trader'), deleteProduct)

module.exports = router