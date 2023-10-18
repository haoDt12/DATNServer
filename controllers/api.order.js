const OrderModel = require("../models/model.order");
const ProductModel = require("../models/model.product");
const moment = require("moment/moment");
exports.creatOrder = async (req, res, next) => {
    let userId = req.body.userId;
    let product = req.body.product;
    let address = req.body.address;
    let status = req.body.status;
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
    if (status == null) {
        return res.send({message: "status is required", code: 0});
    }
    try {
        let total = 0;
        await Promise.all(product.map(async item => {
            let product = await ProductModel.productModel.findById(item);
            total += Number(product.price);
        }));
        let order = new OrderModel.modelOrder({
            userId: userId,
            product: product,
            address: address,
            total: total,
            status: status,
            date_time: date_time,
        })
        await order.save();
        return res.send({message: "create order success", code: 1});
    } catch (e) {
        return res.send({message: "create order fail", code: 0});
    }
}
exports.getOrderByUserId = async (res, req, next) => {
    let userId = req.body.userId;
    if (userId === null) {
        return res.send({message: "userId is required", code: 0});
    }
    try {
        let listOrder = await OrderModel.modelOrder.find({userId: userId});
        return res.send({listOrder: listOrder, message: "get list order success", code: 1});
    } catch (e) {
        console.log(e.message);
        return res.send({message: "userId is required", code: 0});
    }
}
exports.getOrder = async (res, req, next) => {
    try {
        let listOrder = await OrderModel.modelOrder.find();
        return res.send({listOrder: listOrder, message: "get list order success", code: 1});
    } catch (e) {
        console.log(e.message);
        return res.send({message: "get list order fail", code: 0});
    }
}
exports.deleteOrder = async (req, res, next) => {
    let orderId = req.body.orderId;
    if (orderId === null) {
        return res.send({message: "orderId is required", code: 0});
    }
    try {
        let listOrder = await OrderModel.modelOrder.deleteOne({_id: orderId});
        return res.send({message: "delete order success", code: 1});
    } catch (e) {
        console.log(e.message);
        return res.send({message: "get list order fail", code: 0});
    }
}