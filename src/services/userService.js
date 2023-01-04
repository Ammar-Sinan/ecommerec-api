const User = require('../models/user')
const { getGuestCart } = require('../helpers/guestCart')

module.exports.signUp = async (userData) => {
    const user = new User(userData)
    try {
        await user.save()
        const token = await user.generateAccessToken()
        await getGuestCart(user._id)
        return user
    } catch (e) {
        throw e
    }

}