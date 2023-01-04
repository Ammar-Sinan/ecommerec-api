const Product = require("../models/product");
const wishList = require("../models/wishList");
const WishList = require("../models/wishList");

module.exports.getAllProducts = async (limit, skip, pagenumber) => {
    try {
        const products = await Product.find({ archived: false })
            .limit(limit)
            .skip(pagenumber)
        if (!products) throw new Error({ message: 'Could not fetch products!', statusCode: 50 })

        return products
    } catch (e) {
        throw e
    }
}

module.exports.getProductsByCategory = async (category) => {
    try {
        const products = await Product.find({ archived: false, category })
        if (!products) throw new Error({ message: "Could not fetch products!", statusCode: 500 })

        return products
    } catch (e) {
        throw e
    }
}

module.exports.getProduct = async (productId) => {
    try {
        const product = await Product.findById({ _id: productId })
        if (!product) throw new Error({ message: 'Product does not exist!', statusCode: 404 })

        return product
    } catch (e) {
        throw e
    }
}

module.exports.getTraderProducts = async (traderId) => {
    try {
        const products = await Product.find({ owner: traderId })
        return products
    } catch (e) {
        throw e
    }
}

module.exports.addToWishList = async (userId, productId) => {
    // work in progress
    try {
        const product = await Product.findOne({ productId }, 'title description category price')
        if (!product) throw new Error({ message: 'product does not exist!', statusCode: 404 })

        const addedProduct = {
            productId: product._id,
            title: product.title,
            category: product.category,
            description: product.description,
            price: product.price,
        }

        const isExistInWishlist = await WishList.findOne({ owner: userId, productId })
        const wishlist = await WishList.findOne({ owner: userId })

        if (!wishlist) {
            const itemInWishList = new WishList({ owner: userId, products: addedProduct })

            await itemInWishList.save()
            return itemInWishList
        } else if (isExistInWishlist) {
            const deletedFromList = wishlist.products.filter((product) => product.productId == productId)
            wishlist.products.splice(deletedFromList)
            wishlist.save()
            return wishlist
        }

        wishlist.products = wishlist.products ? [...wishlist.products, addedProduct] : [addedProduct]
        await wishlist.save()
        return wishlist
    } catch (e) {
        throw e
    }
}

module.exports.getWishList = async (userId) => {
    try {
        const wishList = await WishList.find({ owner: userId })
        if (!wishList)
            throw new Error({ message: 'WishList not found!', statusCode: 404 })

        return wishList
    } catch (e) {
        throw e
    }
}

// trader role - services

module.exports.getProducts = async (user, archived) => {
    const match = {};

    if (req.query.archived) {
        match.archived = archived === 'true'
    }
    try {
        await user.populate({
            path: 'products',
            match
        })
        return user.products
    } catch (e) {
        throw e
    }
}

module.exports.addProduct = async (productData, userId, photos) => {
    const product = new Product({
        ...productData,
        owner: userId,
        photos: photos,
    })
    try {
        await product.save({ validateBeforeSave: false });
        return product
    } catch (e) {
        throw e
    }
}

module.exports.updateProduct = async (productId, updates) => {
    try {
        const updatedProduct = await Product.findByIdAndUpdate(productId, updates, { new: true })

        await updatedProduct.save({ validateBeforeSave: false })
        return updatedProduct;
    } catch (e) {
        throw e
    }
}

module.exports.deleteProduct = async (productId) => {
    try {
        const product = await Product.findByIdAndDelete({ _id: productId })
        if (!product) throw new Error({ message: 'Product does not exist!', statusCode: 404 })

        return product
    } catch (e) {
        throw e
    }
}
