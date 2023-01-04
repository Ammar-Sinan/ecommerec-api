const mongoose = require('mongoose')
const validator = require('validator')
const jwt = require('jsonwebtoken')
const bcrypt = require('bcrypt')
const Product = require('./product')
require('dotenv').config()

const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        lowercase: true
    },
    password: {
        type: String,
        required: true,
        minlength: 8
    },
    email: {
        type: String,
        required: true,
        trim: true,
        unique: true,
        validate(value) {
            if (!validator.isEmail(value)) {
                throw new Error('Email is Invalid')
            }
        }
    },
    role: {
        type: String,
        default: 'basic',
        enum: ['basic', 'trader', 'admin']

    },
    avatar: {
        type: Buffer
    },
    age: {
        type: Number,
        default: 0,

    },
    tokens: [{
        token: {
            type: String,
            required: true
        }
    }],
}, {
    timestamps: true
})

userSchema.virtual('products', {
    ref: 'Product',
    localField: '_id',
    foreignField: 'owner'
})

userSchema.methods.generateAccessToken = async function () {
    const user = this

    const token = jwt.sign({ _id: user._id }, process.env.ACESS_TOKEN)
    user.tokens = user.tokens.concat({ token })
    await user.save()

    return token
}


userSchema.statics.authenticateUsers = async function (email, password) {
    const user = await User.findOne({ email })
    if (!user) {
        throw new Error('Unable to log in')
    }

    const isMatch = await bcrypt.compare(password, user.password)

    if (!isMatch) {
        throw new Error('Unable to login')
    }

    return user
}

userSchema.pre('save', async function (next) {
    const user = this

    if (user.isModified('password')) {
        user.password = await bcrypt.hash(user.password, 8)
    }
    next()
})

userSchema.pre('remove', async function (next) {
    const user = this
    await Product.deleteMany({ owner: user._id })
    next()
})

const User = mongoose.model('User', userSchema)

module.exports = User
