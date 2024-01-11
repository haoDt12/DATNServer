const EmployeeModel = require("../modelsv2/model.employee");
const {sendOTPByEmail} = require("../models/otp");
const AdminModel = require("../modelsv2/model.admin");
const jwt = require("jsonwebtoken");
exports.loginEmployee = async (req, res)=>{
    try {
        let email = req.body.email;
        let pass = req.body.password;
        if (email == null) {
            return res.send({message: "email is required", code: 0});
        }
        if (pass == null) {
            return res.send({message: "password is required", code: 0});
        }

        let adminEmail = await EmployeeModel.employeeModel.findOne({email: email, password: pass});
        if (!adminEmail) {
            return res.send({
                message: "Login fail please check your Email and Password",
                code: 0,
            });
        }
        if (adminEmail.status =="banned") {
            return res.send({
                message: "The account has been blocked and cannot log in",
                code: 0,
            });
        }

        if (adminEmail) {
            let index = sendOTPByEmail(adminEmail.email);
            if (index === 0) {
                return res.send({message: "Verify admin fail", code: 0});
            } else {
                adminEmail.otp = index;
                await adminEmail.save();
                return res.send({
                    message: "Please verify your account",
                    id: adminEmail._id,
                    code: 1,
                });
            }
        }
    } catch (e) {
        console.log(e.message);
        return res.send({message: e.message.toString(), code: 0});
    }
}
exports.verifyOtpLoginEmployee = async (req, res) => {
    let cusId = req.body.employeeId;
    let otp = req.body.otp;
    if (otp == null) {
        return res.send({message: "otp is required", code: 0});
    }
    try {
        let cus = await EmployeeModel.employeeModel
            .findOne({_id: cusId, otp: otp})
        if (cus) {
            let token = jwt.sign({cus: cus}, process.env.ACCESS_TOKEN_SECRET, {
                expiresIn: "86400s",
            });
            cus.otp = null;
            await cus.save();
            return res.send({
                cus: cus,
                token: token,
                message: "Login success",
                code: 1,
            });
        } else {
            return res.send({message: "otp wrong", code: 0});
        }
    } catch (e) {
        console.log(e.message);
        return res.send({message: e.message.toString(), code: 0});
    }
}