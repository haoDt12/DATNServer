const UserModel = require("../models/model.user");
const UploadFile = require("../models/uploadFile");
const moment = require('moment');
const match = [
    "image/jpeg",
    "image/png",
    "image/gif",
    "image/bmp",
    "image/tiff",
    "image/webp",
    "image/svg+xml",
    "image/x-icon",
    "image/jp2",
    "image/heif"];
const emailRegex = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/;
const passwordRegex = /^(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
const phoneNumberRegex = /^(?:\+84|0)[1-9]\d{8}$/;
exports.addUser = async (req, res) => {
    let file = req.file;
    console.log(file)
    let password = req.body.password;
    let full_name = req.body.full_name;
    let phone_number = req.body.phone_number;
    let address = req.body.address;
    let email = req.body.email;
    let date = new Date();
    let date_time = moment(date).format('YYYY-MM-DD-HH:mm:ss');
    let avatar;
    if (password == null) {
        return res.send({message: "Password is required", code: 0});
    }
    if (!passwordRegex.test(password)) {
        return res.send({
            message: "Minimum password 8 characters, at least 1 capital letter, 1 number and 1 special character",
            code: 0
        });
    }
    if (phone_number == null) {
        return res.send({message: "Phone number is required", code: 0});
    }
    if (!phoneNumberRegex.test(phone_number)) {
        return res.send({message: "The phone number is not in the correct format", code: 0});
    }
    if (email == null) {
        return res.send({message: "Email is required", code: 0});
    }
    if (!emailRegex.test(email)) {
        return res.send({message: "The email is not in the correct format", code: 0});
    }
    try {
        let userPhone = await UserModel.userModel.findOne({phone_number: phone_number});
        let userEmail = await UserModel.userModel.findOne({email: email});
        if (userPhone) {
            return res.send({message: "phone number already exists", code: 0});
        }
        if (userEmail) {
            return res.send({message: "email already exists", code: 0});
        }
    } catch (e) {
        console.log(e.message);
        return res.send({message: "register user fail"});
    }
    if (file == null) {
        try {
            let user = new UserModel.userModel({
                password: password,
                full_name: full_name,
                phone_number: phone_number,
                date: date_time,
                email: email,
                address: address,
            });
            await user.save();
            return res.send({message: "Register user success", code: 1});
        } catch (e) {
            console.log(e.message);
            return res.send({message: "Add user fail", code: 0})
        }
    } else {
        if (match.indexOf(file.mimetype) === -1) {
            return res.send({message: "The uploaded file is not in the correct format", code: 0});
        }
        try {
            let user = new UserModel.userModel({
                password: password,
                full_name: full_name,
                phone_number: phone_number,
                date: date_time,
                email: email,
                address: address,
            });
            let statusCode = await UploadFile.uploadFile(req, user._id.toString(), "user", file, ".jpg");
            if (statusCode === 0) {
                return res.send({message: "Upload file fail", code: 0});
            } else {
                user.avatar = statusCode;
                await user.save();
                return res.send({message: "Register user success", code: 1});
            }
        } catch (e) {
            console.log(e.message);
            return res.send({message: "Add user fail", code: 0})
        }
    }
}
exports.editUser = async (req, res) => {
    let file = req.file;
    let password = req.body.password;
    let full_name = req.body.full_name;
    let phone_number = req.body.phone_number;
    let address = req.body.address;
    let email = req.body.email;
    if (req.body.userId == null) {
        return res.send({message: "User not found", code: 0});
    }
    try {
        let user = await UserModel.userModel.findById(req.body.userId);
        if (user == null) {
            return res.send({message: "User not found", code: 0});
        }
        if (password != null) {
            user.password = password;
        }
        if (full_name != null) {
            user.full_name = full_name;
        }
        if (phone_number != null) {
            user.phone_number = phone_number;
        }
        if (address != null) {
            user.adress = address;
        }
        if (email != null) {
            user.email = email;
        }
        if (file != null) {
            if (match.indexOf(file.mimetype) === -1) {
                return res.send({message: "The uploaded file is not in the correct format", code: 0});
            }
            const pathImgDelete = user.avatar.split("3000");
            UploadFile.deleteFile(res, pathImgDelete[1]);
            let statusCode = await UploadFile.uploadFile(req, user._id.toString(), "user", file, ".jpg");
            if (statusCode === 0) {
                return res.send({message: "Upload file fail", code: 0});
            } else {
                user.avatar = statusCode;
            }
        }
        await user.save();
        return res.send({message: "Edit user success", code: 1});
    } catch (e) {
        console.log(e.message);
        return res.send({message: "User not found", code: 0});
    }
}
exports.loginUser = (req, res) => {
    return res.send({user: req.user, token: req.token, message: "Login success", code: 1});
}
exports.getListUser = async (req, res) => {
    try {
        let listUser = await UserModel.userModel.find();
        return res.send({listUser: listUser, message: "get list user success", code: 1});
    } catch (e) {
        console.log(e.message);
        return res.send({message: "get list user fail", code: 0});
    }
}
