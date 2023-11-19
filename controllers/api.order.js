const OrderModel = require("../models/model.order");
const ProductModel = require("../models/model.product");
const Cart = require("../models/model.cart");
const moment = require("moment/moment");
exports.creatOrder = async (req, res) => {
    let userId = req.body.userId;
    let product = req.body.product;
    let address = req.body.address;
    let date = new Date();
    let date_time = moment(date).format('YYYY-MM-DD-HH:mm:ss');
    if (userId == null) {
        return res.send({message: "userId is required", code: 0});
    }
    if (product === undefined) {
        return res.send({message: "product is required", code: 0});
    }
    if (address == null) {
        return res.send({message: "address is required", code: 0});
    }
    try {
        let total = 0;
        await Promise.all(product.map(async item => {
            let product = await ProductModel.productModel.findById(item.productId);
            total += product.price * item.quantity;
        }));
        let order = new OrderModel.modelOrder({
            userId: userId,
            product: product,
            addressId: address,
            total: total,
            date_time: date_time,
        })
        await order.save();
        let cart = await Cart.cartModel.find({userId: userId});
        if (cart) {
            let currentProduct = cart[0].product;
            let newProduct = [];
            console.log(currentProduct);
            await Promise.all(currentProduct.map(item => {
                product.map(data => {
                    if (item.productId.toString() !== data.productId.toString()) {
                        newProduct.push(item)
                    }
                })
            }));
            cart[0].product = newProduct;
            await cart[0].save();
        }
        return res.send({message: "create order success", code: 1});
    } catch (e) {
        console.log(e.message);
        return res.send({message: "create order fail", code: 0});
    }
}
exports.getOrderByUserId = async (req, res) => {
    let userId = req.body.userId;
    console.log(userId);
    if (userId === null) {
        return res.send({message: "userId is required", code: 0});
    }
    try {
        let listOrder = await OrderModel.modelOrder.find({userId: userId}).populate("product").populate("addressId");
        return res.send({listOrder: listOrder, message: "get list order success", code: 1});
    } catch (e) {
        console.log(e.message);
        return res.send({message: "get list order fail", code: 0});
    }
}
exports.getOrderByOrderId = async (req, res) => {
    let orderId = req.body.orderId;
    if (orderId === null) {
        return res.send({message: "orderId is required", code: 0});
    }
    try {
        let order = await OrderModel.modelOrder.findById(orderId).populate("product").populate("addressId");
        return res.send({order: order, message: "get order success", code: 1});
    } catch (e) {
        console.log(e.message);
        return res.send({message: "get order fail", code: 0});
    }
}
exports.getOrder = async (req, res) => {
    try {
        let listOrder = await OrderModel.modelOrder.find().populate("product").populate("addressId");
        return res.send({listOrder: listOrder, message: "get list order success", code: 1});
    } catch (e) {
        console.log(e.message);
        return res.send({message: "get list order fail", code: 0});
    }
}
exports.deleteOrder = async (req, res) => {
    let orderId = req.body.orderId;
    if (orderId === null) {
        return res.send({message: "orderId is required", code: 0});
    }
    try {
        await OrderModel.modelOrder.deleteOne({_id: orderId});
        return res.send({message: "delete order success", code: 1});
    } catch (e) {
        console.log(e.message);
        return res.send({message: "get list order fail", code: 0});
    }
}
exports.editOrder = async (req, res) => {
    let orderId = req.body.orderId;
    let userId = req.body.userId;
    let product = req.body.product;
    let addressId = req.body.addressId;
    let status = req.body.status;
    try {
        let order = await OrderModel.modelOrder.findById(orderId);
        if (userId !== null) {
            order.userId = userId;
        }
        if (product !== undefined) {
            let total = 0;
            await Promise.all(product.map(async item => {
                let product = await ProductModel.productModel.findById(item.productId);
                total += product.price * item.quantity;
            }));
            order.product = product;
            order.total = total;
        }
        if (addressId !== null) {
            order.addressId = addressId;
        }
        if (status !== null) {
            order.status = status;
        }

        console.log(order);
        await order.save();
        return res.send({message: "edit order success", code: 1});
    } catch (e) {
        console.log(e.message);
        return res.send({message: "edit order fail", code: 0});
    }
}