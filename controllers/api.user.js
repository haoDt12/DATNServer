const UserModel = require("../models/model.user");
const fs = require("fs");
const path = require("path");
const {randomUUID} = require("crypto");
exports.addUser = async (req, res) => {
    let file = req.file;
    let password = req.body.password;
    let fullName = req.body.fullName;
    let phoneNumber = req.body.phoneNumber;
    let role = req.body.role;
    let address = req.body.address;
    let email = req.body.email;
    let avatar;
    validateRegisterUser(res, password, fullName, phoneNumber, role, address, email);
    if (file == null) {
        avatar = "https://inkythuatso.com/uploads/thumbnails/800/2023/03/9-anh-dai-dien-trang-inkythuatso-03-15-27-03.jpg";
        try {
            let user = new UserModel.userModel({
                avatar: avatar,
                password: password,
                fullName: fullName,
                phoneNumber: phoneNumber,
                role: role,
                address: address,
                email: email,
            });
            await user.save();
            return res.send({message: "Register user success", code: 1});
        } catch (e) {
            console.log(e.message);
            return res.send({message: "Add user fail", code: 0})
        }
    } else {
        try {
            let user = new UserModel.userModel({
                avatar: avatar,
                password: password,
                fullName: fullName,
                phoneNumber: phoneNumber,
                role: role,
                address: address,
                email: email,
            });
            await user.save();
            let statusCode = await uploadFile(req, res, user._id.toString());
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
    let fullName = req.body.fullName;
    let phoneNumber = req.body.phoneNumber;
    let role = req.body.role;
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
        if (fullName != null) {
            user.fullName = fullName;
        }
        if (phoneNumber != null) {
            user.phoneNumber = phoneNumber;
        }
        if (role != null) {
            user.role = role;
        }
        if (address != null) {
            user.adress = address;
        }
        if (email != null) {
            user.email = email;
        }
        if (file != null) {
            const pathImgDelete = user.avatar.split("3000");
            fs.unlink(path.join(__dirname, "../public" + pathImgDelete[1]), (err) => {
                if (err) {
                    console.log(err);
                } else {
                    console.log("delete success");
                }
            });
            let statusCode = await uploadFile(req, res, user._id.toString());
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

const uploadFile = (req, res, userId)=> {
    return new Promise((resolve, reject) => {
        let uploadDir = path.join(__dirname, "../public/images", userId);
        if (!fs.existsSync(uploadDir)) {
            fs.mkdirSync(uploadDir, {recursive: true});
        }
        let fileItem = req.file;
        if (!fileItem) {
            reject("0");
        }
        let filePath = path.join(uploadDir, randomUUID() + ".jpg");
        fs.rename(fileItem.path, filePath, (err) => {
            if (err) {
                console.log(err.message);
                reject("0");
            } else {
                fs.readdir(uploadDir, async (err, files) => {
                    if (err) {
                        console.log(err.message);
                        reject("0");
                    }
                    const imageUrls = files.map((file) => {
                        return `${req.protocol}://${req.get(
                            "host"
                        )}/images/${userId}/${file}`;
                    });
                    resolve(imageUrls.toString());
                });
            }
        });
    });
}

const validateRegisterUser = (res, password, fullName, phoneNumber, role, address, email) => {
    if (password == null) {
        return res.send({message: "Password is required", code: 0});
    }
    if (fullName == null) {
        return res.send({message: "Full name is required", code: 0});
    }
    if (phoneNumber == null) {
        return res.send({message: "Phone number is required", code: 0});
    }
    if (role == null) {
        return res.send({message: "role is required", code: 0});
    }
    if (address == null) {
        return res.send({message: "Address is required", code: 0});
    }
    if (email == null) {
        return res.send({message: "Email is required", code: 0});
    }
}

