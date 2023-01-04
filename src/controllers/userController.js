const sharp = require('sharp')
const User = require('../models/user')
const { getGuestCart } = require('../helpers/guestCart')

const LocalStorage = require('node-localstorage').LocalStorage
localStorage = new LocalStorage('./scratch')

const userService = require('../services/userService')

module.exports.signUp = async (req, res) => {

    try {
        const response = await userService.signUp(req.body)
        res.status(200).send(response)
    } catch (e) {
        res.status(400).send(e.message)
    }

    //     const user = new User(req.body)
    //     try {
    //         await user.save()
    //         const token = await user.generateAccessToken()
    //         await getGuestCart(user._id)
    //         res.status(201).send({ user, token })
    //     } catch (e) {
    //         res.status(400).send()

    //     }
}

module.exports.logIn = async (req, res) => {
    try {
        const user = await User.authenticateUsers(req.body.email, req.body.password)
        const token = await user.generateAccessToken()
        await getGuestCart(user._id)
        res.send({ user, token })
    } catch (e) {
        res.status(401).send(e.message)
    }

}

module.exports.getProfile = async (req, res) => {
    try {
        res.status(200).send(req.user)
    } catch (e) {
        res.status(400).send(e.message)
    }
}

module.exports.uploadAvatar = async (req, res, next) => {
    const buffer = await sharp(req.file.buffer).resize(350, 350).png().toBuffer()

    try {
        req.user.avatar = buffer
        await req.user.save()
        res.status(200).send()
    } catch (e) {
        next(e)
        res.status(400).send()
        console.log(e)
    }
}

module.exports.getAvatar = async (req, res) => {
    const _id = req.user._id

    try {
        const user = await User.findById({ _id })

        if (!user || !user.avatar) {
            return res.sendStatus(404)
        }
        res.set('Content-Type', 'image/png')
        res.status(200).send(user.avatar)
    } catch (e) {
        res.status(400).send()
    }
}

module.exports.deleteAvatar = async (req, res) => {
    req.user.avatar = undefined

    try {
        await req.user.save()
        res.sendStatus(200)
    } catch (e) {
        res.sendStatus(400)
    }
}

module.exports.updateUser = async (req, res) => {
    const updates = Object.keys(req.body)
    const validUpdates = ['name', 'email', 'password', 'age', 'avatar']

    const isValid = updates.every((update) => validUpdates.includes(update))

    if (!isValid) {
        res.status(400).send('Invalid update!')
    }

    try {
        updates.forEach((update) => req.user[update] = req.body[update])
        await req.user.save()
        res.status(202).send()
    } catch (e) {
        res.status(400).send()
    }
}


module.exports.logout = async (req, res) => {
    req.user.tokens = req.user.tokens.filter((token) => token.token !== req.token)

    try {
        await req.user.save()
        res.status(200).send(req.user)
    } catch (e) {
        res.status(400).send()
    }
}

module.exports.logoutAll = async (req, res) => {
    req.user.tokens = []
    try {
        await req.user.save()
        res.status(200).send(req.user)
    } catch (e) {
        res.status(400).send()
    }
}

module.exports.deleteAccount = async (req, res) => {
    try {
        await req.user.remove()
        res.status(200).send()
    } catch (e) {
        res.status(400).send()
    }

}
