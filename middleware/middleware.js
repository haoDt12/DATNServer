const UserModel = require("../models/model.user")
const jwt = require("jsonwebtoken");
require("dotenv").config();
exports.validateUser = async (req, res, next) => {
    let username = req.body.username;
    let password = req.body.password
    if (!username) {
        return res.send({message: "user name is required", code: 0});
    }
    if (!password) {
        return res.send({message: "password is required", code: 0});
    }
    try {
        let userEmail = await UserModel.userModel.findOne({email: username, password: password});
        let userPhone = await UserModel.userModel.findOne({phoneNumber: username, password: password});
        if (!userEmail && !userPhone) {
            return res.send({message: "Login fail please check your username and password", code: 0})
        }
        if (userPhone) {
            let token = jwt.sign({user: userPhone}, process.env.ACCESS_TOKEN_SECRET, {expiresIn: '900s'});
            req.user = userPhone;
            req.token = token;
            next();
        }
        if (userEmail) {
            let token = jwt.sign({user: userEmail}, process.env.ACCESS_TOKEN_SECRET, {expiresIn: '900s'});
            req.user = userEmail;
            req.token = token;
            next();
        }
    } catch (e) {
        console.log(e.message);
        return res.send({message: "user not found", code: 0})
    }
}
exports.authorizationToken = (req, res, next) => {
    const token = req.header('Authorization');
    if (!token) {
        return res.send({message: "wrong token", code: 0});
    }
    try {
        req.data = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);
        next();
    } catch (e) {
        return res.send({message: "wrong token", code: 0});
    }
}