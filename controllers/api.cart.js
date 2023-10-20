const ProductModel = require("../models/model.product");
const CartModel = require("../models/model.cart");
const moment = require("moment/moment");
const OrderModel = require("../models/model.order");
exports.addCart = async (req, res) => {
    let userId = req.body.userId;
    let product = req.body.product;
    let date = new Date();
    let date_time = moment(date).format('YYYY-MM-DD-HH:mm:ss');
    if (userId == null) {
        return res.send({message: "userId is required", code: 0});
    }
    if (product === undefined) {
        return res.send({message: "product is required", code: 0});
    }
    try {
        let total = 0;
        let productFind = await ProductModel.productModel.findById(product.productId);
        total += productFind.price * product.quantity;
        let cart = new CartModel.cartModel({
            userId: userId,
            product: product,
            total: total,
            date_time: date_time,
        })
        await cart.save();
        return res.send({message: "add cart success", code: 1});
    } catch (e) {
        console.log(e.message);
        return res.send({message: "add cart fail", code: 0});
    }
}
exports.getCartByUserId = async (req, res) => {
    let userId = req.body.userId;
    console.log(userId);
    if (userId === null) {
        return res.send({message: "userId is required", code: 0});
    }
    try {
        let listCart = await CartModel.cartModel.find({userId: userId}).populate("product");
        return res.send({listCart: listCart, message: "get list cart success", code: 1});
    } catch (e) {
        console.log(e.message);
        return res.send({message: "get list cart fail", code: 0});
    }
}
exports.getCartByCartId = async (req, res) => {
    let cartId = req.body.cartId;
    if (cartId === null) {
        return res.send({message: "cartId is required", code: 0});
    }
    try {
        let cart = await CartModel.cartModel.findById(cartId).populate("product");
        return res.send({cart: cart, message: "get cart success", code: 1});
    } catch (e) {
        console.log(e.message);
        return res.send({message: "get cart fail", code: 0});
    }
}
exports.getCart = async (req, res) => {
    try {
        let listCart = await CartModel.cartModel.find().populate("product");
        return res.send({listCart: listCart, message: "get list cart success", code: 1});
    } catch (e) {
        console.log(e.message);
        return res.send({message: "get list cart fail", code: 0});
    }
}
exports.deleteCart = async (req, res) => {
    let cartId = req.body.cartId;
    if (cartId === null) {
        return res.send({message: "orderId is required", code: 0});
    }
    try {
        await CartModel.cartModel.deleteOne({_id: cartId});
        return res.send({message: "delete cart success", code: 1});
    } catch (e) {
        console.log(e.message);
        return res.send({message: "get list cart fail", code: 0});
    }
}
exports.editCart = async (req, res) => {
    let userId = req.body.userId;
    let product = req.body.product
    let cartId = req.body.cartId;
    try {
        let cart = new OrderModel.modelOrder.findById(cartId);
        if (userId !== null) {
            cart.userId = userId;
        }
        if (product !== undefined) {
            let total = 0;
            let productFind = await ProductModel.productModel.findById(product.productId);
            total += product.price * productFind.quantity;
            cart.product = product;
            cart.total = total;
        }
        await cart.save();
        return res.send({message: "edit cart success", code: 1});
    } catch (e) {
        console.log(e.message);
        return res.send({message: "edit cart fail", code: 0});
    }
}