const jwt = require('jsonwebtoken')
const User = require('../models/user')
require('dotenv').config()


const authUser = async (req, res, next) => {

    try {
        const token = req.header('Authorization').replace('Bearer ', '')
        const validtoken = jwt.verify(token, process.env.ACESS_TOKEN)
        const user = await User.findOne({ _id: validtoken._id, 'tokens.token': token })

        if (!user) return res.sendStatus(401)

        req.token = token
        req.user = user
        next()
    } catch (e) {
        res.sendStatus(403)
    }
}

function authRole(role) {
    return (req, res, next) => {
        if (req.user.role !== role) {
            return res.status(401).send('Not allowed')
        }
        next()
    }
}

module.exports = { authUser, authRole }
