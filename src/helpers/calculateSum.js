

module.exports.calculateSum = (cart) => {

    let sum = 0
    cart.products.map((item) => {
        sum += item.totalPrice
    })
    cart.subTotal = sum
    return cart
}