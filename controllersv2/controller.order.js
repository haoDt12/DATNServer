const OrderModel = require("../modelsv2/model.order");
const DetailOrder = require("../modelsv2/model.detailorder");
const ProductModel = require("../modelsv2/model.product");
const ProductCartModel = require("../modelsv2/model.ProductCart");
const jwt = require("jsonwebtoken");
require("dotenv").config();
const moment = require("moment");
const mongoose = require('mongoose');
const CustomerModel = require("../modelsv2/model.customer");
const EmployeeModel = require("../modelsv2/model.employee");
const ProductImg = require("../modelsv2/model.imgproduct");

exports.createOrder = async (req, res) => {
    let list_order = req.body.list_order;
    let map_voucher_cus_id = req.body.map_voucher_cus_id;
    let employee_id = req.body.employee_id;
    let delivery_address_id = req.body.delivery_address_id;
    let date = new Date();
    let create_time = moment(date).format("YYYY-MM-DD-HH:mm:ss");
    if (delivery_address_id == null) {
        return res.send({message: "Delivery address id is required", code: 0});
    }
    if (list_order == null || list_order.length === 0) {
        return res.send({message: "list order is required", code: 0});
    }
    try {
        let errorOccurred = false;
        let total_amount = 0;
        let data = jwt.verify(req.header('Authorization'), process.env.ACCESS_TOKEN_SECRET);
        let cus = await CustomerModel.customerModel.findById(data.cus._id);
        await Promise.all(list_order.map(async item => {
            let product = await ProductModel.productModel.findById(item.product_id);
            if (Number(product.quantity) < Number(item.quantity)) {
                errorOccurred = true;
            }
        }));
        if (errorOccurred) {
            return res.send({message: "Product quantity is out of stock", code: 0});
        }
        let order = new OrderModel.oderModel({
            map_voucher_cus_id: map_voucher_cus_id,
            customer_id: cus._id,
            employee_id: employee_id,
            delivery_address_id: delivery_address_id,
            create_time: create_time,
        });
        await Promise.all(list_order.map(async item => {
            let detailOrder = new DetailOrder.detailOrderModel({
                order_id: order._id,
                product_id: item.product_id,
                quantity: item.quantity,
            });
            let product = await ProductModel.productModel.findById(item.product_id);
            total_amount = total_amount + (Number(product.price) * Number(item.quantity));
            product.quantity = (Number(product.quantity) - Number(item.quantity)).toString();
            await product.save();
            await detailOrder.save();
        }));
        order.total_amount = total_amount;
        await order.save();
        return res.send({message: "Create order success", code: 1});
    } catch (e) {
        console.log(e.message);
        return res.send({message: e.message.toString(), code: 0});
    }
}
exports.createOrderGuest = async (req, res) => {
    let list_order = req.body.list_order;
    let arrIdCart = req.body.arrIdCart;
    let employee_id = req.body.employee_id;
    let guest_name = req.body.guest_name;
    let guest_phoneNumber = req.body.guest_phoneNumber;
    let guest_address = req.body.guest_address;

    let date = new Date();
    let create_time = moment(date).format("YYYY-MM-DD-HH:mm:ss");
    if (list_order == null || list_order.length === 0) {
        return res.send({message: "list order is required", code: 0});
    }
    try {
        let errorOccurred = false;
        let total_amount = 0;
        let listproduct = JSON.parse(list_order);
        await Promise.all(listproduct.map(async item => {
            let product = await ProductModel.productModel.findById(item.product_id);
            if (Number(product.quantity) < Number(item.quantity)) {
                errorOccurred = true;
            }
        }));
        if (errorOccurred) {
            return res.send({message: "Product quantity is out of stock", code: 0});
        }
        let order = new OrderModel.oderModel({
            employee_id: employee_id,
            create_time: create_time,
            guest_name: guest_name,
            guest_phoneNumber: guest_phoneNumber,
            guest_address: guest_address,
        });
        let listProduct = JSON.parse(list_order);
        await Promise.all(listProduct.map(async item => {
            let detailOrder = new DetailOrder.detailOrderModel({
                order_id: order._id,
                product_id: item.product_id,
                quantity: item.quantity,
            });
            let product = await ProductModel.productModel.findById(item.product_id);
            total_amount = total_amount + (Number(product.price) * Number(item.quantity));
            product.quantity = (Number(product.quantity) - Number(item.quantity)).toString();
            await product.save();
            await detailOrder.save();
        }));

        await Promise.all(arrIdCart.map(async item => {
            const itemId = new mongoose.Types.ObjectId(item);
            await ProductCartModel.productCartModel.findByIdAndDelete(itemId);
        }))
        order.total_amount = total_amount;
        await order.save();
        return res.send({message: "Create order success", code: 1});
    } catch (e) {
        console.log(e.message);
        return res.send({message: e.message.toString(), code: 0});
    }
}
exports.getOderByUser = async (req, res) => {
    try {
        let listOrder = [];
        let data = jwt.verify(req.header('Authorization'), process.env.ACCESS_TOKEN_SECRET);
        let cus = await CustomerModel.customerModel.findById(data.cus._id);
        let order = await OrderModel.oderModel.find({customer_id: cus._id})
            .populate("map_voucher_cus_id")
            .populate("customer_id")
            .populate("employee_id")
            .populate("delivery_address_id");
        await Promise.all(order.map(async item => {
            let detailOrder = await DetailOrder.detailOrderModel.find({order_id: item._id}).populate("order_id").populate("product_id");
            listOrder.push({detailOrder: detailOrder});
        }))
        return res.send({message: "get order success", dataOrder: listOrder, code: 1})
    } catch (e) {
        console.log(e.message);
        return res.send({message: e.message.toString(), code: 0});
    }
}