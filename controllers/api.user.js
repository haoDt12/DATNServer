const UserModel = require("../models/model.user");
const UserTempModel = require("../models/model.user.temp");
const UploadFile = require("../models/uploadFile");
const moment = require('moment');
const {sendOTPByEmail, senOtpPhoneNumber} = require("../models/otp");
const jwt = require("jsonwebtoken");
const axios = require('axios');
require("dotenv").config();
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
        if (file == null) {
            let userTemp = new UserTempModel.userTemModel({
                password: password,
                full_name: full_name,
                phone_number: phone_number,
                date: date_time,
                email: email,
                address: address,
            });
            let index = sendOTPByEmail(email);
            if (index === 0) {
                return res.send({message: "Register user fail", code: 0});
            } else {
                userTemp.otp = index;
                await userTemp.save();
                return res.send({message: "Please verify your account", id: userTemp._id, code: 1});
            }
        } else {
            if (match.indexOf(file.mimetype) === -1) {
                return res.send({message: "The uploaded file is not in the correct format", code: 0});
            }
            let userTemp = new UserTempModel.userTemModel({
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
                let index = sendOTPByEmail(email);
                if (index === 0) {
                    return res.send({message: "Register user fail", code: 0});
                } else {
                    userTemp.avatar = statusCode;
                    userTemp.otp = index;
                    await userTemp.save();
                    return res.send({message: "Please verify your account", id: userTemp._id, code: 1});
                }
            }
        }
    } catch (e) {
        console.log(e.message);
        return res.send({message: "register user fail"});
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
exports.loginUser = async (req, res) => {
    let username = req.body.username;
    let password = req.body.password
    if (!username) {
        return res.send({message: "user name is required", code: 0});
    }
    if (!password) {
        return res.send({message: "password is required", code: 0});
    }
    try {
        let userEmail = await UserModel.userModel.findOne({
            email: username,
            password: password
        }).populate("address");
        let userPhone = await UserModel.userModel.findOne({
            phone_number: username,
            password: password,
        }).populate("address");
        if (!userEmail && !userPhone) {
            return res.send({message: "Login fail please check your username and password", code: 0})
        }
        if (userPhone) {
            const otp = Math.floor(100000 + Math.random() * 900000);
            const apiKey = process.env.API_KEY;
            const baseUrl = process.env.BASE_URL;
            const text = `STECH xin chào bạn \n Mã OTP của bạn là: ${otp} \n Vui lòng không cung cấp mã OTP cho bất kì ai`;
            const  to = formatPhoneNumber(username);
            const headers = {
                'Authorization': `App ${apiKey}`,
                'Content-Type': 'application/json',
            };

            const payload = {
                messages: [
                    {
                        destinations: [{to}],
                        text,
                    },
                ],
            };

            // Gửi tin nhắn OTP bằng InfoBip REST API
            axios.post(baseUrl, payload, {headers})
                .then(async (response) => {
                    userPhone.otp = otp;
                    await userPhone.save();
                    return res.send({message: "Please verify your account", id: userPhone._id, code: 1});
                })
                .catch((error) => {
                    console.error(error.message);
                    return res.send({message: "Fail send code", code: 0});
                });
        }
        if (userEmail) {
            let index = sendOTPByEmail(userEmail.email);
            if (index === 0) {
                return res.send({message: "Verify user fail", code: 0});
            } else {
                userEmail.otp = index;
                await userEmail.save();
                return res.send({message: "Please verify your account", id: userEmail._id, code: 1});
            }
        }
    } catch (e) {
        console.log(e.message);
        return res.send({message: "user not found", code: 0})
    }
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
exports.verifyOtpRegister = async (req, res) => {
    let userTempId = req.body.userTempId;
    let otp = req.body.otp;
    if (userTempId === null) {
        return res.send({message: "userTempId is required", code: 0});
    }
    if (otp === null) {
        return res.send({message: "otp is required", code: 0});
    }
    try {
        let userTemp = await UserTempModel.userTemModel.findOne({_id: userTempId, otp: otp});
        if (userTemp) {
            let user = new UserModel.userModel({
                password: userTemp.password,
                full_name: userTemp.full_name,
                phone_number: userTemp.phone_number,
                date: userTemp.date,
                email: userTemp.email,
                address: userTemp.address,
            })
            user.otp = null;
            await user.save();
            await UserTempModel.userTemModel.deleteMany({email: userTemp.email});
            return res.send({message: "verify user success", code: 0});
        } else {
            return res.send({message: "otp wrong", code: 0});
        }
    } catch (e) {
        console.log(e.message);
        return res.send({message: "verify user fail", code: 0});

    }
}
exports.verifyOtpLogin = async (req, res) => {
    let userId = req.body.userId;
    let otp = req.body.otp;
    let user = await UserModel.userModel.findOne({_id: userId, otp: otp});
    if (user) {
        let token = jwt.sign({user: user}, process.env.ACCESS_TOKEN_SECRET, {expiresIn: '900s'});
        user.otp = null;
        await user.save();
        return res.send({user: user, token: token, message: "Login success", code: 1});
    } else {
        return res.send({message: "otp wrong", code: 0});
    }
}
const formatPhoneNumber = (phoneNumber) =>{
    // Loại bỏ tất cả các ký tự không phải số từ chuỗi
    const numericPhoneNumber = phoneNumber.replace(/\D/g, '');

    if (numericPhoneNumber.startsWith('0')) {
        return `84${numericPhoneNumber.slice(1)}`;
    }

    return numericPhoneNumber;
}
