const Cart = require('../models/cart')
const Product = require('../models/product')
const LocalStorage = require('node-localstorage').LocalStorage
localStorage = new LocalStorage('./scratch')
const { calculateSum } = require('../helpers/calculateSum')

module.exports.addToCart = async (userId, productId, quantity) => {
    try {
        const product = await Product.findOne({ _id: productId }, 'title category description price')
        if (!product) throw new Error({ message: 'product does not exist!', statusCode: 404 })

        const addedProduct = {
            productId,
            title: product.title,
            category: product.category,
            description: product.description,
            quantity,
            price: product.price,
            totalPrice: product.price
        }

        const isCartExist = await Cart.findOne({ owner: userId, status: 'pending' })

        if (isCartExist) {

            const product = isCartExist.products?.filter((product) => product.productId == productId)

            if (product?.length) {
                product[0].quantity++

                // calculate Total price for each product, based on quantity
                product[0].totalPrice = product[0].quantity * product[0].price

                // calculate subTotal for all the products in Cart.
                calculateSum(isCartExist)

                await isCartExist.save()
                return isCartExist
            } else {
                isCartExist.products = isCartExist.products ? [...isCartExist.products, addedProduct] : [addedProduct]
                await isCartExist.save()
                return isCartExist
            }

        }
        const newProduct = new Cart({ owner: userId, products: addedProduct })
        calculateSum(newProduct)

        await newProduct.save()
        return newProduct
    } catch (e) {
        throw e
    }
}

module.exports.getCart = async (userId) => {
    try {
        const userCart = await Cart.findOne({ owner: userId, status: 'pending' })
        if (!userCart) throw new Error({ message: 'Cart does not exist!', statusCode: 404 })

        return userCart
    } catch (e) {
        throw e
    }
}

module.exports.removeCartItem = async (userId, productId) => {
    try {
        const cartItems = await Cart.findOne({ owner: userId, 'products.productId': productId, status: 'pending' })
        if (!cartItems) throw new Error({ message: 'Cart does not exist!', statusCode: 404 })

        const deletedItem = cartItems.products.filter((product) => product.productId == productId)

        const deletedIndex = cartItems.products.indexOf(deletedItem)
        cartItems.products.splice(deletedIndex)

        const newCart = await cartItems.save()
        return newCart
    } catch (e) {
        throw e
    }
}

module.exports.removeOneQty = async (userId, productId) => {
    try {
        const itemInCart = await Cart.findOne({ owner: userId, productId, status: 'pending' }, 'products')
        if (!itemInCart) throw new Error({ message: 'Product does not exist!', statusCode: 404 })
        itemInCart.products[0].quantity--
        await itemInCart.save()

        return itemInCart
    } catch (e) {
        throw e
    }
}

module.exports.guestCart = async (quantity, productId) => {
    var cartItems = JSON.parse(localStorage.getItem('cart')) || []
    try {
        const product = await Product.findOne({ _id: productId }, 'title category price description')
        if (!product) throw new Error({ message: 'Product does not exist!', statusCode: 404 })

        if (cartItems.length) {
            const indexOfItem = cartItems.findIndex((item) => item.productId == productId)

            if (indexOfItem > -1) {
                cartItems[indexOfItem].quantity++
                localStorage.setItem('cart', JSON.stringify(cartItems))
                return cartItems
            }
        }

        const addedItem = {
            productId,
            quantity,
            title: product.title,
            price: product.price,
            category: product.category,
            description: product.description
        }

        cartItems.push(addedItem)
        localStorage.setItem('cart', JSON.stringify(cartItems))
        return cartItems
    } catch (e) {
        throw e
    }
}