const UserModel = require("../models/model.user")
const jwt = require("jsonwebtoken");
require("dotenv").config();
const Otp = require("../models/otp");
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