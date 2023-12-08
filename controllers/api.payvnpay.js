let $ = require('jquery');
const moment = require('moment');
const OrderModel = require("../models/model.order");
const Cart = require("../models/model.cart");
const ProductModel = require("../models/model.product");
const querystring = require("qs");
const crypto = require("crypto");
require("dotenv").config();
const sessionConfig = require('../models/session.config');
let mUserId;
let mProduct;
let mAddress;
let mDate_time;
let ipAddress = process.env.IP_ADDRESS;
exports.createPaymentUrl = async (req, res) => {

    process.env.TZ = 'Asia/Ha_Noi';
    let userId = req.body.userId;
    let product = req.body.product;
    let address = req.body.address;
    let date = new Date();
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
            if (!product) {
                return res.send({message: "product not found", code: 0});
            }
            let quantity = Number(product.quantity);
            let sold = Number(product.sold);
            if (quantity !== 0) {
                newQuantity = quantity - 1;
                newShold = sold + 1;
                product.quantity = newQuantity.toString();
                product.sold = newShold.toString();
                await product.save();
            } else {
                return res.send({message: "product is out of stock ", code: 0});
            }
            let feesArise = 0;
            item.option.map(item => {
                if(item.feesArise){
                    feesArise += Number(item.feesArise);
                }
            })
            total += ((Number(product.price) + Number(feesArise))) * Number(item.quantity);
        }));
        let createDate = moment(date).format('YYYYMMDDHHmmss');
        let date_time = moment(date).format('YYYY-MM-DD-HH:mm:ss');
        let ipAddr = req.headers['x-forwarded-for'] ||
            req.connection.remoteAddress ||
            req.socket.remoteAddress ||
            req.connection.socket.remoteAddress;

        let tmnCode = process.env.VNP_TMN_CODE;
        let secretKey = process.env.VNP_HASH_SECRET;
        let vnpUrl = process.env.VNP_URL;
        let returnUrl = process.env.VNP_RETURN_URL;
        let orderId = moment(date).format('DDHHmmss');
        let bankCode = req.body.bankCode;
        let locale = req.body.language;
        if (locale === null || locale === '') {
            locale = 'vn';
        }
        let currCode = 'VND';
        let vnp_Params = {};
        vnp_Params['vnp_Version'] = '2.1.0';
        vnp_Params['vnp_Command'] = 'pay';
        vnp_Params['vnp_TmnCode'] = tmnCode;
        vnp_Params['vnp_Locale'] = locale;
        vnp_Params['vnp_CurrCode'] = currCode;
        vnp_Params['vnp_TxnRef'] = orderId;
        vnp_Params['vnp_OrderInfo'] = 'Thanh toan cho ma GD:' + orderId;
        vnp_Params['vnp_OrderType'] = 'other';
        vnp_Params['vnp_Amount'] = total * 100;
        vnp_Params['vnp_ReturnUrl'] = returnUrl;
        vnp_Params['vnp_IpAddr'] = ipAddr;
        vnp_Params['vnp_CreateDate'] = createDate;
        if (bankCode !== null && bankCode !== '') {
            vnp_Params['vnp_BankCode'] = bankCode;
        }
        vnp_Params = sortObject(vnp_Params);
        let querystring = require('qs');
        let signData = querystring.stringify(vnp_Params, {encode: false});
        let crypto = require("crypto");
        let hmac = crypto.createHmac("sha512", secretKey);
        let signed = hmac.update(new Buffer(signData, 'utf-8')).digest("hex");
        vnp_Params['vnp_SecureHash'] = signed;
        vnpUrl += '?' + querystring.stringify(vnp_Params, {encode: false});
        mUserId = userId;
        mProduct = product;
        mAddress = address;
        mDate_time = date_time;
        console.log(mDate_time);
        console.log(vnpUrl)
        return res.send({message: "get url success", code: 1, url: vnpUrl});
    } catch (e) {
        console.log(e.message);
        return res.send({message: "create order fail", code: 0});
    }
}

exports.payFail = (req, res) => {
    return res.send({message: "pay fail", code: 0});
}
exports.paySuccess = async (req, res) => {
    return res.send({message: "pay success", code: 1});

}
exports.vnpayReturn = async (req, res) => {
    let vnp_Params = req.query;
    let secureHash = vnp_Params['vnp_SecureHash'];
    delete vnp_Params['vnp_SecureHash'];
    delete vnp_Params['vnp_SecureHashType'];
    vnp_Params = sortObject(vnp_Params);
    let tmnCode = process.env.VNP_TMN_CODE;
    let secretKey = process.env.VNP_HASH_SECRET;
    let querystring = require('qs');
    let signData = querystring.stringify(vnp_Params, {encode: false});
    let crypto = require("crypto");
    let hmac = crypto.createHmac("sha512", secretKey);
    let signed = hmac.update(new Buffer(signData, 'utf-8')).digest("hex");
    if (secureHash === signed) {
        let code = vnp_Params['vnp_ResponseCode'];
        if (code === "00") {
            try {
                await Promise.all(mProduct.map(async item => {
                    let product = await ProductModel.productModel.findById(item.productId);
                    if (!product) {
                        return res.redirect(`http://${ipAddress}:3000/api/payFail`);
                    }
                }));
                let order = new OrderModel.modelOrder({
                    userId: mUserId,
                    product: mProduct,
                    addressId: mAddress,
                    total: 0,
                    date_time: mDate_time,
                })
                let cart = await Cart.cartModel.findOne({userId: mUserId});
                if (!cart) {
                    return res.redirect(`http://${ipAddress}:3000/api/payFail`);
                }
                let currentProduct = cart.product;
                let newProduct = currentProduct.filter(item1 => !mProduct.some(item2 => item2.productId.toString() === item1.productId.toString()));
                console.log(newProduct)
                cart.product = newProduct;
                await cart.save();
                await order.save();
                return res.redirect(`http://${ipAddress}:3000/api/paySuccess`);
            } catch (e) {
                console.log(e.message);
                return res.redirect(`http://${ipAddress}:3000/api/payFail`);
            }
        } else {
            return res.redirect(`http://${ipAddress}:3000/api/payFail`);
        }
    } else {
        return res.redirect(`http://${ipAddress}:3000/api/payFail`);
    }
}

function sortObject(obj) {
    let sorted = {};
    let str = [];
    let key;
    for (key in obj) {
        if (obj.hasOwnProperty(key)) {
            str.push(encodeURIComponent(key));
        }
    }
    str.sort();
    for (key = 0; key < str.length; key++) {
        sorted[str[key]] = encodeURIComponent(obj[str[key]]).replace(/%20/g, "+");
    }
    return sorted;
}
