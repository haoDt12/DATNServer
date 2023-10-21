const UserModel = require("../models/model.user");
const AddressModel = require("../models/model.address");
const moment = require('moment');
exports.addAddress = async (req, res, next) => {
    let userId = req.body.userId;
    let name = req.body.name;
    let detail = req.body.detail;
    let phone_number = req.body.phone_number;
    let date = new Date();
    let date_time = moment(date).format('YYYY-MM-DD-HH:mm:ss');
    const phoneNumberRegex = /^(?:\+84|0)[1-9]\d{8}$/;
    if (name == null) {
        return res.send({message: "name is required", code: 0});
    }
    if (detail == null) {
        return res.send({message: "detail is required", code: 0});
    }
    if (phone_number == null) {
        return res.send({message: "phone_number is required", code: 0});
    }
    if (!phoneNumberRegex.test(phone_number)) {
        return res.send({message: "The phone number is not in the correct format", code: 0});
    }
    if (userId == null) {
        return res.send({message: "userId is required", code: 0});
    }
    try {
        let user = await UserModel.userModel.findById(userId);
        if (!user) {
            return res.send({message: "add address fail", code: 0});
        }
        let addAddress = new AddressModel.modelAddress({
            name: name,
            detail: detail,
            phone_number: phone_number,
            date:date_time,
        })
        let currentAddress = user.address;
        currentAddress.push(addAddress._id.toString());
        user.address = currentAddress;
        await user.save();
        await addAddress.save();
        return res.send({message: "add address success", code: 1});
    } catch (e) {
        console.log(e.message);
        res.send({message: "add address fail", code: 0});
    }
}
exports.editAddress = async (req, res, next) => {
    let name = req.body.name;
    let detail = req.body.detail;
    let phone_number = req.body.phone_number;
    let addressId = req.body.addressId;
    const phoneNumberRegex = /^(?:\+84|0)[1-9]\d{8}$/;
    if (addressId == null) {
        res.send({message: "addressId is required", code: 0});
    }
    try {
        let editAddress = await AddressModel.modelAddress.findById(addressId);
        if (!editAddress) {
            return res.send({message: "edi address fail", code: 0})
        }
        if (name != null) {
            editAddress.name = name;
        }
        if (detail != null) {
            editAddress.detail = detail;
        }
        if (phone_number != null) {
            if (!phoneNumberRegex.test(phone_number)) {
                return res.send({message: "The phone number is not in the correct format", code: 0});
            }
            editAddress.phone_number = phone_number;
        }
        await editAddress.save();
        return res.send({message: "edit address success", code: 1});
    } catch (e) {
        console.log(e.message);
        res.send({message: "edit address fail", code: 0});
    }
}
exports.deleteAddress = async (req, res, next) => {
    let addressId = req.body.addressId;
    let userId = req.body.userId;
    if (addressId == null) {
        res.send({message: "addressId is required", code: 0});
    }
    if (userId == null) {
        return res.send({message: "userId is required", code: 0});
    }
    try {
        let user = await UserModel.userModel.findById(userId);
        if (!user) {
            return res.send({message: "delete address fail", code: 0});
        }
        let currentAddress = user.address;
        user.address = currentAddress.filter(item => item !== addressId);
        await AddressModel.modelAddress.deleteOne({_id: addressId});
        await user.save();
        return res.send({message: "delete address success", code: 1});
    } catch (e) {
        console.log(e.message);
        res.send({message: "delete address fail", code: 0});
    }
}