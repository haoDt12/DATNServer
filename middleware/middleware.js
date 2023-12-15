const jwt = require("jsonwebtoken");
require("dotenv").config();
exports.authorizationToken = (req, res, next) => {
    // const token = req.header('Authorization');
    // if (!token) {
    //     return res.send({message: "wrong token", code: 0});
    // }
    // try {
    //     req.data = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);
        next();
    // } catch (e) {
    //     return res.send({message: "wrong token", code: 0});
    // }
}
exports.checkPermission = (req,res,next)=>{
    const token = req.header('Authorization');
    if (!token) {
        return res.send({message: "wrong token", code: 0});
    }
    try {
        let data = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);
        return res.send({data: data})
    } catch (e) {
        return res.send({message: "wrong token", code: 0});
    }
}