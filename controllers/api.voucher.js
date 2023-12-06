const VoucherModel = require("../models/model.voucher")
const UserModel = require("../models/model.user");
exports.addVoucherForOneUser = async (req, res) => {
    let userId = req.body.userId;
    let title = req.body.title;
    let content = req.body.content;
    let price = req.body.price;
    let toDate = req.body.toDate;
    let fromDate = req.body.fromDate;
    if (title == null) {
        return res.send({message: "title is required", code: 0});
    }
    if (content == null) {
        return res.send({message: "content is required", code: 0});
    }
    if (price == null) {
        return res.send({message: "price is required", code: 0});
    }
    if (toDate == null) {
        return res.send({message: "toDate is required", code: 0});
    }
    if (fromDate == null) {
        return res.send({message: "fromDate is required", code: 0});
    }
    if (userId == null) {
        return res.send({message: "userId is required", code: 0});
    }
    try {
        let voucher = new VoucherModel.voucherModel({
            userId: userId,
            title: title,
            content: content,
            price: price,
            toDate: toDate,
            fromDate: fromDate
        });
        await voucher.save();
        return res.send({message: "add voucher success", code: 1});
    } catch (e) {
        return res.send({message: e.message.toString(), code: 0});
    }
}
exports.addVoucherForAllUser = async (req, res) => {
    let title = req.body.title;
    let content = req.body.content;
    let price = req.body.price;
    let toDate = req.body.toDate;
    let fromDate = req.body.fromDate;
    if (title == null) {
        return res.send({message: "title is required", code: 0});
    }
    if (content == null) {
        return res.send({message: "content is required", code: 0});
    }
    if (price == null) {
        return res.send({message: "price is required", code: 0});
    }
    if (toDate == null) {
        return res.send({message: "toDate is required", code: 0});
    }
    if (fromDate == null) {
        return res.send({message: "fromDate is required", code: 0});
    }
    let voucherNew = new VoucherModel.voucherModel();
    try {
        let listUser = await UserModel.userModel.find();
        await Promise.all(listUser.map(async item => {
            let voucher = new VoucherModel.voucherModel({
                _id: voucherNew._id.toString(),
                userId: item._id.toString(),
                title: title,
                content: content,
                price: price,
                toDate: toDate,
                fromDate: fromDate
            });
            await voucher.save();
        }))
        return res.send({message: "add voucher success", code: 1});
    } catch (e) {
        console.log(e.message);
        return res.send({message: e.message.toString(), code: 0});
    }
}
exports.getVoucherByUserId = async (req, res) => {
    let userId = req.body.userId;
    if (userId == null) {
        return res.send({message: "userId is required", code: 0});
    }
    try {
        let listVoucher = await VoucherModel.voucherModel.find({userId: userId});
        return res.send({message: "get list voucher success", listVoucher: listVoucher, code: 1});
    } catch (e) {
        console.log(e.message);
        return res.send({message: e.message.toString(), code: 0});
    }
}
exports.deleteVoucher = async (req, res) => {
    let voucherId = req.body.voucherId;
    if (voucherId == null) {
        return res.send({message: "voucherId is required", code: 0});
    }
    try {
        await VoucherModel.voucherModel.deleteMany({_id: voucherId});
        return res.send({message: "delete voucher success", code: 1});
    } catch (e) {
        console.log(e.message);
        return res.send({message: e.message.toString(), code: 0});
    }
}
exports.editVoucher = async (req, res) => {
    let title = req.body.title;
    let content = req.body.content;
    let price = req.body.price;
    let toDate = req.body.toDate;
    let fromDate = req.body.fromDate;
    let voucherId = req.body.voucherId;
    if (voucherId == null) {
        return res.send({message: "voucherId is required", code: 0});
    }
    try {
        let voucher = await VoucherModel.voucherModel.findOne({_id: voucherId});
        let newVoucher = {
            title: voucher.title,
            content: voucher.content,
            price: voucher.price,
            toDate: voucher.toDate,
            fromDate: voucher.fromDate
        }
        if (title !== null) {
            newVoucher.title = title;
        }
        if (content !== null) {
            newVoucher.content = content;
        }
        if (price !== null) {
            newVoucher.price = price;
        }
        if (toDate !== null) {
            newVoucher.toDate = toDate;
        }
        if (fromDate !== null) {
            newVoucher.fromDate = fromDate;
        }
        await VoucherModel.voucherModel.updateMany({_id: voucherId}, {$set: newVoucher});
        return res.send({message: "edit voucher success", code: 1});
    } catch (e) {
        console.log(e.message);
        return res.send({message: e.message.toString(), code: 0});
    }
}
exports.getAllVoucher = async (req, res) => {
    try {
        let listVoucher = await VoucherModel.voucherModel.find();
        return res.send({message: "get list voucher success", listVoucher: listVoucher, code: 1});
    } catch (e) {
        console.log(e.message);
        return res.send({message: e.message.toString(), code: 0});
    }
}