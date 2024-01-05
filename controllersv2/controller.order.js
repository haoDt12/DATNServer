const OrderModel = require("../modelsv2/model.order");
const DetailOrder = require("../modelsv2/model.detailorder");
const ProductModel = require("../modelsv2/model.product");
const jwt = require("jsonwebtoken");
require("dotenv").config();
const moment = require("moment");
const CustomerModel = require("../modelsv2/model.customer");
const EmployeeModel = require("../modelsv2/model.employee");
const VoucherModel = require("../modelsv2/model.voucher");
const MapVoucherModel = require("../modelsv2/model.map_voucher_cust")

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
        let voucherPrice = 0;
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
            product.sold = (Number(product.sold) + Number(item.quantity)).toString();
            await product.save();
            await detailOrder.save();
        }));
        if (map_voucher_cus_id !== null) {
            let mapVoucher = await MapVoucherModel.mapVoucherModel.findOne({
                _id: map_voucher_cus_id,
                customer_id: data.cus._id,
                is_used: false
            });
            if (mapVoucher) {
                let voucher = VoucherModel.voucherModel.findById(mapVoucher.vocher_id);
                if (voucher) {
                    voucherPrice = Number(voucher.price);
                    mapVoucher.is_used = true;
                    await mapVoucher.save();
                }
            }
        }
        order.total_amount = total_amount - voucherPrice;
        await order.save();
        return res.send({message: "Create order success", code: 1});
    } catch (e) {
        console.log(e.message);
        return res.send({message: e.message.toString(), code: 0});
    }
}

exports.getOrderByStatus = async (req, res) => {
    let status = req.body.status;
    if (status == null) {
        return res.send({message: "status is required", code: 0})
    }
    try {
        let listDetailOrder = [];
        let data = jwt.verify(req.header('Authorization'), process.env.ACCESS_TOKEN_SECRET);
        let cus = await CustomerModel.customerModel.findById(data.cus._id);
        let order = await OrderModel.oderModel.find({
            customer_id: cus._id,
            status: status
        })
            .populate("map_voucher_cus_id")
            .populate("customer_id")
            .populate("employee_id")
            .populate("delivery_address_id")
        await Promise.all(order.map(async item => {
            let listProduct = [];
            // if(item.map_voucher_cus_id != null){
            //     item.map_voucher_cus_id.vocher_id = await VoucherModel.voucherModel.findById(item.map_voucher_cus_id.vocher_id);
            // }
            let detailOrder = await DetailOrder.detailOrderModel.find({
                order_id: item._id,
            })
                .populate("order_id")
                .populate("product_id")
            await Promise.all(detailOrder.map(async item => {
                console.log(item)
                let product = await ProductModel.productModel.findById(item.product_id);
                product.quantity = item.quantity;
                listProduct.push(product);
            }))
            listDetailOrder.push({order: item, listProduct: listProduct});
        }))
        return res.send({message: "get order success", listDetailOrder: listDetailOrder, code: 1})
    } catch (e) {
        console.log(e.message);
        return res.send({message: e.message.toString(), code: 0});
    }
}
exports.cancelOrder = async (req, res) => {
    let orderId = req.body.orderId;
    if (orderId == null) {
        return res.send({message: "order id is required", code: 0})
    }
    try {
        let order = await OrderModel.oderModel.findById(orderId);
        if (order.status !== "WaitConfirm") {
            return res.send({message: "Orders that have been sent cannot be canceled", code: 0})
        }
        if (order.map_voucher_cus_id !== null) {
            let mapVoucher = await MapVoucherModel.mapVoucherModel.findById(order.map_voucher_cus_id);
            mapVoucher.is_used = false;
            await mapVoucher.save();
        }
        order.status = "Cancel";
        await order.save();
    } catch (e) {
        console.log(e.message);
        return res.send({message: e.message.toString(), code: 0});
    }
}