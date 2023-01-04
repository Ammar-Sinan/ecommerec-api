const express = require('express')
const multer = require('multer')
const { authUser } = require('../middleware/auth')
const confirmationEmail = require('../emails/welcomeEmail')
const {
    signUp,
    logIn,
    getProfile,
    uploadAvatar,
    getAvatar,
    deleteAvatar,
    updateUser,
    logout,
    logoutAll,
    deleteAccount,
} = require('../controllers/userController')

const router = express.Router()

const upload = multer({
    fileFilter: (req, file, cb) => {
        if (file.mimetype === 'image/png' || file.mimetype === 'image/jpg' || file.mimetype === 'image/jpeg') {
            return cb(null, true)
        } else {
            return cb(null, false)
        }
    },
    limits: {
        fileSize: 1024 * 1024 * 2
    }
})

router.post('/signup', signUp)
router.post('/login', logIn)
router.get('/me', authUser, getProfile)
router.post('/me/avatar', authUser, upload.single('pp'), uploadAvatar)
router.get('/me/avatar', authUser, getAvatar)
router.delete('/me/avatar', authUser, deleteAvatar)
router.put('/update', authUser, updateUser)
router.post('/logout', authUser, logout)
router.post('/logoutAll', authUser, logoutAll)
router.delete('/delete', authUser, deleteAccount)


module.exports = router


