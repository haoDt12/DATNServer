var express = require("express");
var router = express.Router();
const ProductModel = require("./../modelsv2/model.product");
const ProductVideo = require("./../modelsv2/model.productvideo");
const ProductImg = require("./../modelsv2/model.imgproduct");
const OrderModel = require("./../models/model.order");
const CategoryModel = require("./../modelsv2/model.category");
const CartModel = require("./../models/model.cart");
const CartModelv2 = require("../modelsv2/model.ProductCart");
const UserModel = require("./../models/model.user");
const BannerModel = require("./../models/model.banner");
const ConversationModel = require("./../models/model.conversations");
const MessageModel = require("./../models/model.message");
const VoucherModel = require("./../modelsv2/model.voucher");
const NotificationModel = require("./../modelsv2/model.notification");
const UploadFileFirebase = require("./../modelsv2/uploadFileFirebase")
const multer = require('multer');
const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

const utils_1 = require('../public/js/ultils_1');
const path = require("path");
const mongoose = require('mongoose');
// const {cartModel, CartModel} = require("../models/model.cart");


const crypto = require("crypto");
const CustomerModel = require("../modelsv2/model.customer");
const moment = require("moment");
const {stat} = require("fs");
const UploadFile = require("../models/uploadFile");
require("dotenv").config();

/* GET home page. */
router.get("/stech.manager/home", async function (req, res, next) {
    try {
        res.render("index");
    } catch (e) {
        console.log(e.message);
        res.send({message: "product not found", code: 0})
    }
});
router.get("/stech.manager/product_action", async function (req, res, next) {
    const token = req.cookies.token
    try {
        let listProduct = await ProductModel.productModel.find();
        let listCategory = await CategoryModel.categoryModel.find();
        res.render("product_action", {
            products: listProduct,
            categories: listCategory,
            message: "get list product success",
            token: token,
            code: 1
        });

    } catch (e) {
        console.log(e.message);
        res.send({message: "product not found", code: 0})
    }
});
router.get('/stech.manager/product', async function (req, res, next) {
    try {
        let listProduct = await ProductModel.productModel.find();

        res.render("product", {
            products: listProduct,
            message: "get list product success",
            code: 1
        });
    } catch (e) {
        console.log(e.message);
        res.send({message: "product not found", code: 0})
    }

    try {
        let listProduct = await ProductModel.productModel.find();
        res.render("product_action", {
            products: listProduct,
            message: "get list product success",
            code: 1
        });
    } catch (e) {
        console.log(e.message);
        res.render("error", {message: "product not found", code: 0});
    }

  const token = req.cookies.token
  try {
    let listProduct = await ProductModel.productModel.find();
    let listCategory = await CategoryModel.categoryModel.find();
      res.render("product_action", {
        products: listProduct,
        categories: listCategory,
        message: "get list product success",
        token: token,
        code: 1
      });
  } catch (e) {
    console.log(e.message);
    res.send({ message: "product not found", code: 0 })
  }
});
router.post("/stech.manager/AddProduct", upload.fields([{ name: "img_cover", maxCount: 1 }, { name: "video", maxCount: 1 },{ name: "list_img", maxCount: 10 }]), async function (req, res, next) {
  try {
    const name = req.body.name;
    const category_id = req.body.category_id;
    const price = req.body.price;
    const quantity = req.body.quantity;
    const color = req.body.color;
    const color_code = req.body.color_code;
    const ram = req.body.ram;
    const rom = req.body.rom;
    const description = req.body.description;

    const fileimg_cover = req.files["img_cover"];
    const filelist_img = req.files["list_img"];
    const filevideo = req.files["video"];
    const sold = req.body.sold;
    const status = req.body.status;
    let date = new Date();
    let create_time = moment(date).format("YYYY-MM-DD-HH:mm:ss");

    if (category_id == null || name == null || description == null || fileimg_cover === undefined || filelist_img === undefined || filevideo === undefined || price == null || quantity == null || color == null || color_code == null || ram == null || rom == null) {
      return res.send({message: "All fields are required", code: 0});
    }
});
router.post("/stech.manager/AddProduct", upload.fields([{name: "img_cover", maxCount: 1}, {
    name: "video",
    maxCount: 1
}, {name: "list_img", maxCount: 10}]), async function (req, res, next) {
    try {
        const name = req.body.name;
        const category_id = req.body.category_id;
        const price = req.body.price;
        const quantity = req.body.quantity;
        const color = req.body.color;
        const color_code = req.body.color_code;
        const ram = req.body.ram;
        const rom = req.body.rom;
        const description = req.body.description;

        const fileimg_cover = req.files["img_cover"];
        const filelist_img = req.files["list_img"];
        const filevideo = req.files["video"];
        const sold = req.body.sold;
        const status = req.body.status;
        let date = new Date();
        let create_time = moment(date).format("YYYY-MM-DD-HH:mm:ss");

        //
        if (category_id == null) {
            return res.send({message: "category is required", code: 0});
        }
        if (name == null) {
            return res.send({message: "name is required", code: 0});
        }
        if (description == null) {
            return res.send({message: "description is required", code: 0});
        }
        if (fileimg_cover === undefined) {
            return res.send({message: "img cover is required", code: 0});
        }
        if (filelist_img === undefined) {
            return res.send({message: "img cover is required", code: 0});
        }
        if (filevideo === undefined) {
            return res.send({message: "video is required", code: 0});
        }
        if (price == null) {
            return res.send({message: "price is required", code: 0});
        }
        if (quantity == null) {
            return res.send({message: "quantity is required", code: 0});
        }
        if (color == null) {
            return res.send({message: "color is required", code: 0});
        }
        if (color_code == null) {
            return res.send({message: "color_code is required", code: 0});
        }
        if (ram == null) {
            return res.send({message: "ram is required", code: 0});
        }
        if (rom == null) {
            return res.send({message: "rom is required", code: 0});
        }

        if (isNaN(price)) {
            return res.send({message: "price is number", code: 0});
        }
        if (isNaN(quantity)) {
            return res.send({message: "quantity is number", code: 0});
        }

        let product = new ProductModel.productModel({
            category_id: category_id,
            name: name,
            ram: ram,
            rom: rom,
            color: color,
            quantity: quantity,
            price: price,
            description: description,
            sold: sold,
            status: status,
            color_code: color_code,
            create_time: create_time,
        });
        let img_cover = await UploadFileFirebase.uploadFile(
            req,
            product._id.toString(),
            "products",
            fileimg_cover[0]
        );
        if (img_cover === 0) {
            return res.send({message: "upload file fail", code: 0});
        }
        product.img_cover = img_cover;
        //VIDEO
        let productVideo = new ProductVideo.productVideoModel({
            product_id: product._id,
        });
        let video = await UploadFileFirebase.uploadFile(
            req,
            product._id.toString(),
            "products",
            filevideo[0]
        );
        if (video === 0) {
            return res.send({message: "upload file fail", code: 0});
        }
        productVideo.video = video;
        //LIST IMG
        for (const file of filelist_img) {
            let productListImg = new ProductImg.productImgModel({
                product_id: product._id,
            });

            let img = await UploadFileFirebase.uploadFile(
                req,
                product._id.toString(),
                "products",
                file
            );

            if (img === 0) {
                return res.send({message: "upload file fail", code: 0});
            }

            productListImg.img = img;
            await productListImg.save();
        }
        await productVideo.save();
        await product.save();
        res.redirect(req.get('referer'));
    } catch (e) {
        console.log(e.message);
        res.send({message: "product not found", code: 0})
    }

    try {
        let listProduct = await ProductModel.productModel.find();
        res.render("product_action", {
            products: listProduct,
            message: "get list product success",
            code: 1
        });
    } catch (e) {
        console.log(e.message);
        res.render("error", {message: "product not found", code: 0});
    }
});
router.get('/stech.manager/product', async function (req, res, next) {
    try {
        let listProduct = await ProductModel.productModel.find();
        res.render("product", {
            products: listProduct,
            message: "get list product success",
            code: 1
        });
    } catch (e) {
        console.log(e.message);
        res.render("error", {message: "product not found", code: 0});
    }

});
router.get("/stech.manager/category", async function (req, res, next) {
    try {
        let listCategory = await CategoryModel.categoryModel.find();
        res.render("category", {
            category: listCategory,
            message: "get list category success",
            code: 1,
        });


    } catch (e) {
        console.log(e.message);
        res.send({message: "category not found", code: 0});
    }
});
router.get("/stech.manager/login", function (req, res, next) {
    res.render("login");
});
router.get("/stech.manager/register", function (req, res, next) {
    res.render("register");
});
router.get("/stech.manager/detail_product", async function (req, res, next) {
    try {
        var encodedProductId = req.query.productId;
        let productId = Buffer.from(encodedProductId, 'base64').toString('utf8');
        //let productId = req.query.productId;
        console.log("Received productId from cookie:", productId);

        let product = await ProductModel.productModel.findById(productId).populate({path: 'category', select: 'title'});

        if (product) {
            res.render("detail_product", {detailProduct: product, message: "get product details success", code: 1});
        } else {
            res.send({message: "Product not found", code: 0});
        }
    } catch (e) {
        console.error("Error fetching product details:", e.message);
        res.send({message: "Error fetching product details", code: 0});
    }
});
router.get("/stech.manager/detail_user", async function (req, res, next) {
    try {
        var encodedUserId = req.query.userId;
        let userId = Buffer.from(encodedUserId, 'base64').toString('utf8');
        //let productId = req.query.productId;
        console.log("Received userId from cookie:", userId);

        let user = await UserModel.userModel.findById(userId).populate({path: 'address', select: 'city'});

        if (user) {
            res.render("detail_user", {detailUser: user, message: "get user details success", code: 1});
            console.log(user)
        } else {
            res.send({message: "user not found", code: 0});
        }
    } catch (e) {
        console.error("Error fetching user details:", e.message);
        res.send({message: "Error fetching user details", code: 0});
    }
});

router.get('/stech.manager/user', async function (req, res, next) {
    try {

        let listUser = await UserModel.userModel.find().populate({path: 'address', select: 'city'});

        res.render("user", {
            users: listUser,
            message: "get list user success",
            code: 1,
        });

    } catch (e) {
        console.log(e.message);
        res.send({message: "user not found", code: 0});
    }
});
router.get("/stech.manager/verify", async function (req, res, next) {
    try {
        res.render("verify");

    } catch (e) {
        console.log(e.message);
        res.send({message: "profile not found", code: 0});
    }

});
router.get("/stech.manager/profile", async function (req, res, next) {
    const id = utils_1.getCookie(req, 'Uid');
    console.log(id);
    try {
        let listprofile = await UserModel.userModel.findById(id).populate({path: 'address', select: 'city'});
        res.render("profile", {
            profiles: listprofile,
            message: "get list profile success",
            code: 1,
        });

    } catch (e) {
        console.log(e.message);
        res.send({message: "profile not found", code: 0});
    }
    //tìm cart theo userId
    // res.render("profile");
    // res.render("profile");

});
router.get("/stech.manager/profile", async function (req, res, next) {
    const id = utils_1.getCookie(req, 'Uid');
    console.log(id);
    try {
        let listprofile = await UserModel.userModel.findById(id).populate({path: 'address', select: 'city'});

router.get("/stech.manager/chat/c/:id", async function (req, res, next) {
    try {
        // Check login
        let idUserLoged = req.cookies.Uid
        if (idUserLoged == null || idUserLoged.length <= 0) {
            res.redirect('/stech.manager/login')
        }

        let encodedConversation = req.params.id
        let idConversation = req.params.id
        // let idConversation = Buffer.from(encodedConversation, 'base64').toString('utf8');
        let listConversation = await ConversationModel.conversationModel.find().populate({path: 'user'});
        let dataUserLoged = await UserModel.userModel.find({_id: idUserLoged}).populate({
            path: 'address',
            select: 'city'
        });
        let dataMessage = await MessageModel.messageModel.find({conversation: idConversation}).populate({path: 'conversation'});


        // console.log("=======================");
        // console.log(dataMessage);
        let newDataMessage = []
        dataMessage.map((msg) => {

            let message = ''
            if (msg.message.length <= 0) {
                return msg.message
            }

            const algorithm = process.env.ALGORITHM;
            const ENCRYPTION_KEY = process.env.API_KEY;
            const hash = crypto.createHash("sha1");
            hash.update(ENCRYPTION_KEY)
            const digestResult = hash.digest();
            const uint8Array = new Uint8Array(digestResult);
            const keyUint8Array = uint8Array.slice(0, 16);
            const keyBuffer = Buffer.from(keyUint8Array);
            let textParts = msg.message.split(':');
            let iv = Buffer.from(textParts.shift(), 'hex');
            let encryptedText = Buffer.from(textParts.join(':'), 'hex');
            let decipher = crypto.createDecipheriv(algorithm, keyBuffer, iv);
            let decrypted = decipher.update(encryptedText, 'hex', 'utf-8');
            decrypted += decipher.final('utf8');

            message = decrypted;

            let itemMsg = {
                _id: msg._id,
                conversation: msg.conversation,
                senderId: msg.senderId,
                receiverId: msg.receiverId,
                message: message,
                filess: msg.filess,
                images: msg.images,
                video: msg.video,
                status: msg.status,
                deleted: msg.deleted,
                timestamp: msg.timestamp
            }
            newDataMessage.push(itemMsg);
        })

        // console.log("+++++++++++++++++");
        // console.log(newDataMessage);

        let dataLastMessage = []
        let latestMessages = {};
        listConversation.map((con) => {
            dataMessage.map((msg) => {
                if (con._id + "" == msg.conversation._id + "") {
                    if (!(con._id in latestMessages) || msg.timestamp > latestMessages[con._id].timestamp) {
                        latestMessages[con._id] = {
                            id: msg._id,
                            conversationID: con._id,
                            senderID: msg.senderId,
                            status: msg.status,
                            message: msg.message,
                            timestamp: msg.timestamp
                        };
                    }
                }
            })
        })

        for (let conversationID in latestMessages) {
            dataLastMessage.push(latestMessages[conversationID]);
        }

        let dataConversation = []
        listConversation.map((con) => {
            dataLastMessage.map((msg) => {
                if (con._id + "" == msg.conversationID + "") {
                    let idMessage = msg.id
                    let message = ''
                    if (msg.message.length <= 0) {
                        return msg.message
                    }
                    const algorithm = process.env.ALGORITHM;
                    const ENCRYPTION_KEY = process.env.API_KEY;
                    const hash = crypto.createHash("sha1");
                    hash.update(ENCRYPTION_KEY)
                    const digestResult = hash.digest();
                    const uint8Array = new Uint8Array(digestResult);
                    const keyUint8Array = uint8Array.slice(0, 16);
                    const keyBuffer = Buffer.from(keyUint8Array);
                    let textParts = msg.message.split(':');
                    let iv = Buffer.from(textParts.shift(), 'hex');
                    let encryptedText = Buffer.from(textParts.join(':'), 'hex');
                    let decipher = crypto.createDecipheriv(algorithm, keyBuffer, iv);
                    let decrypted = decipher.update(encryptedText, 'hex', 'utf-8');
                    decrypted += decipher.final('utf8');

                    message = decrypted

                    let time = msg.timestamp
                    let senderID = msg.senderID
                    let status = msg.status

                    dataConversation.push({
                        _id: con._id,
                        idMsg: idMessage,
                        name: con.name,
                        user: con.user,
                        timestamp: con.timestamp,
                        lastmessage: message,
                        lastSender: senderID,
                        status: status,
                        lasttime: time
                    })
                }
            })
        })

        const conversationNoMessageContent = listConversation.filter(obj1 =>
            !dataConversation.some(obj2 => obj1._id === obj2._id)
        );

        conversationNoMessageContent.map((con) => {
            dataConversation.push({
                _id: con._id,
                idMessage: "",
                name: con.name,
                user: con.user,
                timestamp: con.timestamp,
                lastmessage: "",
                lastSender: "",
                status: "",
                lasttime: ""
            })
        })

        let conversationNoMessage = []
        let listUserIDInChat = []

        if (dataMessage.length <= 0) {
            conversationNoMessage = await ConversationModel.conversationModel.find({_id: idConversation}).populate({path: 'user'});
            conversationNoMessage.map((item) => {
                item.user.map((user) => {
                    if (!listUserIDInChat.includes(user._id)) {
                        listUserIDInChat.push(user._id);
                    }
                })
            })
        } else {
            await Promise.all(dataMessage.map((message) => {
                if (!listUserIDInChat.includes(message.senderId)) {
                    listUserIDInChat.push(message.senderId);
                }
                if (!listUserIDInChat.includes(message.receiverId)) {
                    listUserIDInChat.push(message.receiverId);
                }
            }));
        }

        let dataOtherUser = []
        await Promise.all(listUserIDInChat.map(async (userID) => {
            if (userID != idUserLoged) {
                const userData = await UserModel.userModel.find({_id: userID}).populate({
                    path: 'address',
                    select: 'city'
                });
                dataOtherUser = userData
            }
        }));

        res.render("chat", {
            conversations: dataConversation.length > 0 ? dataConversation : [],
            userLoged: dataUserLoged[0],
            dataMessage: newDataMessage,
            // dataHeaderMsg: dataMessage.length <= 0 ? conversationNoMessage : dataOtherUser,
            dataHeaderMsg: dataOtherUser,
            idConversation: idConversation,
            isOpenChat: true,
            message: "get data chat success",
            code: 1,
        });

    } catch (e) {
        console.log(e.message);
        res.send({message: "conversation not found", code: 0});
    }
});
router.get("/stech.manager/chat", async function (req, res, next) {
    try {
        // Check login
        let idUserLoged = req.cookies.Uid
        if (idUserLoged == null || idUserLoged.length <= 0) {
            return res.redirect('/stech.manager/login')
        }

        let dataUserLoged = await UserModel.userModel.find({_id: idUserLoged}).populate({
            path: 'address',
            select: 'city'
        });
        let listConversation = await ConversationModel.conversationModel.find().populate({path: 'user'});
        let dataMessage = await MessageModel.messageModel.find().populate({path: 'conversation'});

        let dataLastMessage = []
        let latestMessages = {};
        listConversation.map((con) => {
            dataMessage.map((msg) => {
                if (con._id + "" == msg.conversation._id + "") {
                    if (!(con._id in latestMessages) || msg.timestamp > latestMessages[con._id].timestamp) {
                        let message = ''
                        if (msg.message.length <= 0) {
                            return msg.message
                        }
                        const ENCRYPTION_KEY = process.env.API_KEY;
                        const algorithm = process.env.ALGORITHM;
                        const hash = crypto.createHash("sha1");
                        hash.update(ENCRYPTION_KEY)
                        const digestResult = hash.digest();
                        const uint8Array = new Uint8Array(digestResult);
                        const keyUint8Array = uint8Array.slice(0, 16);
                        const keyBuffer = Buffer.from(keyUint8Array);
                        let textParts = msg.message.split(':');
                        let iv = Buffer.from(textParts.shift(), 'hex');
                        let encryptedText = Buffer.from(textParts.join(':'), 'hex');
                        let decipher = crypto.createDecipheriv(algorithm, keyBuffer, iv);
                        let decrypted = decipher.update(encryptedText, 'hex', 'utf-8');
                        decrypted += decipher.final('utf8');

                        message = decrypted;
                        latestMessages[con._id] = {
                            id: msg._id,
                            conversationID: con._id,
                            senderID: msg.senderId,
                            status: msg.status,
                            message: message,
                            images: msg.images,
                            video: msg.video,
                            timestamp: msg.timestamp
                        };
                    }
                }
            })
        })

        for (let conversationID in latestMessages) {
            dataLastMessage.push(latestMessages[conversationID]);
        }

        let dataConversation = []
        listConversation.map((con) => {
            dataLastMessage.map((msg) => {
                if (con._id + "" == msg.conversationID + "") {
                    let idMessage = msg.id
                    let message = msg.deleted ? " đã gỡ 1 tin nhắn" : msg.message.length > 0 ? msg.message : msg.images.length > 0 ? ` đã gửi ${msg.images.length} ảnh` : msg.video.length > 0 ? `Bạn đã gửi 1 video` : ''
                    let time = msg.timestamp
                    let senderID = msg.senderID
                    let status = msg.status

                    dataConversation.push({
                        _id: con._id,
                        idMsg: idMessage,
                        name: con.name,
                        user: con.user,
                        timestamp: con.timestamp,
                        lastmessage: message,
                        lastSender: senderID,
                        status: status,
                        lasttime: time
                    })
                }
            })
        })

        const conversationNoMessage = listConversation.filter(obj1 =>
            !dataConversation.some(obj2 => obj1._id === obj2._id)
        );

        conversationNoMessage.map((con) => {
            dataConversation.push({
                _id: con._id,
                idMessage: "",
                name: con.name,
                user: con.user,
                timestamp: con.timestamp,
                lastmessage: "",
                lastSender: "",
                status: "",
                lasttime: ""
            })
        })

        // console.log(dataConversation);
        // console.log("==================");
        // console.log(dataLastMessage);

        return res.render("chat", {
            conversations: dataConversation.length > 0 ? dataConversation : [],
            userLoged: dataUserLoged[0],
            dataMessage: {},
            dataLastMessage: dataLastMessage.length > 0 ? dataLastMessage : [],
            isOpenChat: false,
            idConversation: "",
            message: "get data chat success",
            code: 1,
        });


    } catch (e) {
        console.log(`error get chat: ${e.message}`);
        return res.send({message: "conversation not found", code: 0});
    }
});
router.get("/stech.manager/order", async function (req, res, next) {
    try {
        var encodedValueStatus = req.cookies.status;

        if (encodedValueStatus === undefined || Buffer.from(encodedValueStatus, 'base64').toString('utf8') == 'All') {
            let orders = await OrderModel.modelOrder.find();
            orders.reverse();
            console.log('Orders:', orders);

            const ordersWithProductInfo = await Promise.all(orders.map(async order => {
                const allProductInfo = await order.getAllProductInfo();
                const userInfo = await order.getUserInfo();
                console.log('ProductInfo:', allProductInfo);
                console.log('UserInfo:', userInfo);
                return {...order.toObject(), allProductInfo, userInfo};
            }));
            res.render("order", {orders: ordersWithProductInfo, message: "get list order success", code: 1});

        } else {
            let valueStatus = Buffer.from(encodedValueStatus, 'base64').toString('utf8');
            let orders = await OrderModel.modelOrder.find({status: valueStatus});
            orders.reverse();

            console.log('Orders:', orders);
            const ordersWithProductInfo = await Promise.all(orders.map(async order => {
                const allProductInfo = await order.getAllProductInfo();
                const userInfo = await order.getUserInfo();
                console.log('ProductInfo:', allProductInfo);
                console.log('UserInfo:', userInfo);
                return {...order.toObject(), allProductInfo, userInfo};
            }));
            res.render("order", {orders: ordersWithProductInfo, message: "get list order success", code: 1});

        }

        // res.render("order", { orders: ordersWithProductInfo, message: "get list order success", code: 1 });
    } catch (e) {
        console.log(e.message);
        res.send({message: "order not found", code: 0})
    }
});
router.get("/stech.manager/detail_order", async function (req, res, next) {
    try {
        var encodedOrderId = req.query.orderId;
        let orderId = Buffer.from(encodedOrderId, 'base64').toString('utf8');
        //let productId = req.query.productId;
        console.log("Received orderId from cookie:", orderId);

        let order = await OrderModel.modelOrder.findById(orderId);
        if (order) {
            const allProductInfo = await order.getAllProductInfo();
            const userInfo = await order.getUserInfo();
            console.log('ProductInfo:', allProductInfo);
            console.log('UserInfo:', userInfo);

            res.render("detail_order", {
                detailOrder: {...order.toObject(), allProductInfo, userInfo},
                message: "get order details success",
                code: 1
            });
        } else {
            res.send({message: "Order not found", code: 0});
        }
    } catch (e) {
        console.error("Error fetching order details:", e.message);
        res.send({message: "Error fetching order details", code: 0});

    }
});
router.get("/stech.manager/chat", async function (req, res, next) {
    try {
        // Check login
        let idUserLoged = req.cookies.Uid
        if (idUserLoged == null || idUserLoged.length <= 0) {
            return res.redirect('/stech.manager/login')
        }

    function getCookie(name) {
        const match = req.headers.cookie.match(new RegExp('(^| )' + name + '=([^;]+)'));
        if (match) return match[2];
    }

    const orderDataCookie = getCookie('dataToInvoice');

    if (orderDataCookie) {
        // Giải mã cookie để có được dữ liệu đặt hàng
        const orderData = JSON.parse(decodeURIComponent(orderDataCookie));

        // Truyền dữ liệu vào layout "invoice.pug"
        res.render("invoice", {
            guestName: orderData.guestName,
            guestPhone: orderData.guestPhone,
            guestAddress: orderData.guestAddress,
            products: orderData.product,
        });
    } else {
        // Xử lý khi không có giá trị cookie
        res.send({message: "No order data found in the cookie", code: 0});
    }
});
router.get("/stech.manager/cart", async function (req, res, next) {
    // const userId = req.query.userId;
    const userId = utils_1.getCookie(req, 'Uid');
    try {
        let cartUser = await CartModelv2.productCartModel.find({customer_id: userId})
        if (cartUser !== null){
            let dataProduct = [];
            await Promise.all(cartUser.map(async (cart) => {
                let idCart = cart.product_id;
                let item = await ProductModel.productModel.findById(idCart)
                dataProduct.push(item)
            }))
            let dataCart = [];
            await Promise.all(cartUser.map(async (cart) =>{
                dataProduct.map((product) =>{
                    if (cart.product_id.equals(product._id)) {
                        dataCart.push({
                            _id: cart._id,
                            customer_id: cart.customer_id,
                            product_id: cart.product_id,
                            product_name: product.name,
                            product_ram: product.ram,
                            product_rom: product.rom,
                            product_color: product.color,
                            product_price: product.price,
                            quantity: cart.quantity,
                            create_time: cart.create_time,
                            img_cover: product.img_cover
                        })
                    }
                })
            }))
            res.render("cart", {
                dataCart: dataCart,
                message: "get list cart success",
                code: 1,
            })

        }

    } catch (e) {
        console.log(e.message);
        res.send({message: "cart not found", code: 0})
    }
});
// router.post("/stech.manager/AddCart", async (req, res) => {
//     const userID = req.cookies.Uid;
//     const productID = req.body.productId;
//     const quantity = req.body.quantity;
//     let date = new Date();
//     let timestamp = moment(date).format('YYYY-MM-DD-HH:mm:ss');
//     let cart = new CartModelv2.productCartModel({
//         customer_id: userID,
//         product_id: productID,
//         quantity: quantity,
//         create_time: timestamp,
//     })
//     await cart.save();
//     return res.redirect('/stech.manager/cart')
// });
router.post("/stech.manager/AddCart", async (req, res) => {
    const userID = req.cookies.Uid;
    const productID = req.body.productId;
    const quantity = req.body.quantity;

    try {
        // Kiểm tra xem sản phẩm đã tồn tại trong giỏ hàng hay chưa
        const existingCartItem = await CartModelv2.productCartModel.findOne({
            customer_id: userID,
            product_id: productID,
        });

        if (existingCartItem) {
            existingCartItem.quantity = parseInt(existingCartItem.quantity);
            let gt1 = parseInt(existingCartItem.quantity);
            let gt2 = parseInt(quantity);
            console.log(gt1+ gt2)
            // Nếu sản phẩm đã tồn tại, cập nhật số lượng
            if ('quantity' in existingCartItem) {
                gt1 += gt2; // Chuyển đổi quantity thành số trước khi cộng
                console.log(gt1);
                await CartModelv2.productCartModel.findByIdAndUpdate(existingCartItem._id, { $set: { quantity: gt1 } });
            } else {
                console.error('Error adding to cart: "quantity" property not found in existingCartItem');
            }
        } else {
            // Nếu sản phẩm chưa tồn tại, tạo mới một item trong giỏ hàng
            let date = new Date();
            let timestamp = moment(date).format('YYYY-MM-DD-HH:mm:ss');
            const cart = new CartModelv2.productCartModel({
                customer_id: userID,
                product_id: productID,
                quantity: parseInt(quantity), // Chuyển đổi quantity thành số
                create_time: timestamp,
            });

            await cart.save();
        }

        return res.redirect('/stech.manager/cart');
    } catch (error) {
        console.error('Error adding to cart:', error.message);
        return res.redirect('/stech.manager/cart'); // Xử lý lỗi và chuyển hướng về trang giỏ hàng
    }
});

router.post('/apiv2/editCartV2/:cartId', async (req, res) => {
    const userId = req.body.userId;
    const productId = req.body.productId;
    const quantity = req.body.quantity;
    const cartId = req.params.cartId;

    try {
        // TODO: Thực hiện cập nhật quantity trong MongoDB sử dụng cartId
        // Ví dụ:
        const result = await CartModelv2.productCartModel.updateOne({ _id: cartId }, { quantity: quantity });

        if (result.nModified > 0) {
            return res.json({ success: false, message: 'Failed to update quantity' });
        } else {
            return res.json({ success: true, message: 'Quantity updated successfully' });
        }
    } catch (error) {
        console.error('Error updating quantity:', error.message);
        return res.json({ success: false, message: 'Error updating quantity' });
    }
});

const deleteProductFromCart = async (customerId, cartId) => {
    try {
        // Gọi model để xoá sản phẩm từ giỏ hàng trong CSDL
        const result = await CartModelv2.productCartModel.deleteOne({
            customer_id: customerId,
            _id: cartId,
        });
        console.log(customerId)
        if (result.deletedCount > 0) {
            // Sản phẩm đã được xoá thành công
            return { success: true, message: 'Product removed from cart successfully' };
        } else {
            // Không có sản phẩm nào được xoá (productId không tồn tại trong giỏ hàng của người dùng)
            return { success: false, message: 'Product not found in the cart' };
        }
    } catch (error) {
        console.error('Error deleting product from cart:', error.message);
        return { success: false, message: 'Error deleting product from cart' };
    }
};
router.post('/stech.manager/DeleteCart', async (req, res) => {
    const userID = req.cookies.Uid;
    const cartId = req.body.cartId;
    if (!userID){
        console.error('UserID not found in cookies');
    }else {
        console.log(userID)
    }
    try {
        const result = await deleteProductFromCart(userID, cartId);
        // Xử lý kết quả và trả về phản hồi cho người dùng
        if (result.success) {
            res.redirect('/stech.manager/cart'); // Chuyển hướng về trang giỏ hàng sau khi xoá
        } else {
            // Xử lý lỗi (có thể chuyển hướng hoặc hiển thị thông báo)
            res.redirect('/stech.manager/cart'); // Chuyển hướng về trang giỏ hàng nếu có lỗi
        }
    } catch (error) {
        console.error('Error handling deleteFromCart:', error.message);
        res.redirect('/stech.manager/cart'); // Chuyển hướng về trang giỏ hàng nếu có lỗi
    }
});
router.get("/stech.manager/notification", async function (req, res, next) {
    try {
        let listNotification = await NotificationPublicModel.notificationPublicModel.find();

        res.render("notification", {
            notifications: listNotification,
            message: "get list notification success",
            code: 1,
        });

    } catch (e) {
        console.log(e.message);
        res.send({message: "user not found", code: 0});
    }
});
router.get("/stech.manager/voucher", async function (req, res, next) {
    try {
        let listVoucher = await VoucherModel.voucherModel.find();

        res.render("voucher", {
            vouchers: listVoucher,
            message: "get list voucher success",
            code: 1,
        });


    } catch (e) {
        console.log(e.message);
        res.send({message: "user not found", code: 0});
=======
        let dataUserLoged = await UserModel.userModel.find({_id: idUserLoged}).populate({
            path: 'address',
            select: 'city'
        });
        let listConversation = await ConversationModel.conversationModel.find().populate({path: 'user'});
        let dataMessage = await MessageModel.messageModel.find().populate({path: 'conversation'});

        let dataLastMessage = []
        let latestMessages = {};
        listConversation.map((con) => {
            dataMessage.map((msg) => {
                if (con._id + "" == msg.conversation._id + "") {
                    if (!(con._id in latestMessages) || msg.timestamp > latestMessages[con._id].timestamp) {
                        let message = ''
                        if (msg.message.length <= 0) {
                            return msg.message
                        }
                        const ENCRYPTION_KEY = process.env.API_KEY;
                        const algorithm = process.env.ALGORITHM;
                        const hash = crypto.createHash("sha1");
                        hash.update(ENCRYPTION_KEY)
                        const digestResult = hash.digest();
                        const uint8Array = new Uint8Array(digestResult);
                        const keyUint8Array = uint8Array.slice(0, 16);
                        const keyBuffer = Buffer.from(keyUint8Array);
                        let textParts = msg.message.split(':');
                        let iv = Buffer.from(textParts.shift(), 'hex');
                        let encryptedText = Buffer.from(textParts.join(':'), 'hex');
                        let decipher = crypto.createDecipheriv(algorithm, keyBuffer, iv);
                        let decrypted = decipher.update(encryptedText, 'hex', 'utf-8');
                        decrypted += decipher.final('utf8');

                        message = decrypted;
                        latestMessages[con._id] = {
                            id: msg._id,
                            conversationID: con._id,
                            senderID: msg.senderId,
                            status: msg.status,
                            message: message,
                            images: msg.images,
                            video: msg.video,
                            timestamp: msg.timestamp
                        };
                    }
                }
            })
        })

        for (let conversationID in latestMessages) {
            dataLastMessage.push(latestMessages[conversationID]);
        }

        let dataConversation = []
        listConversation.map((con) => {
            dataLastMessage.map((msg) => {
                if (con._id + "" == msg.conversationID + "") {
                    let idMessage = msg.id
                    let message = msg.deleted ? " đã gỡ 1 tin nhắn" : msg.message.length > 0 ? msg.message : msg.images.length > 0 ? ` đã gửi ${msg.images.length} ảnh` : msg.video.length > 0 ? `Bạn đã gửi 1 video` : ''
                    let time = msg.timestamp
                    let senderID = msg.senderID
                    let status = msg.status

                    dataConversation.push({
                        _id: con._id,
                        idMsg: idMessage,
                        name: con.name,
                        user: con.user,
                        timestamp: con.timestamp,
                        lastmessage: message,
                        lastSender: senderID,
                        status: status,
                        lasttime: time
                    })
                }
            })
        })

        const conversationNoMessage = listConversation.filter(obj1 =>
            !dataConversation.some(obj2 => obj1._id === obj2._id)
        );

        conversationNoMessage.map((con) => {
            dataConversation.push({
                _id: con._id,
                idMessage: "",
                name: con.name,
                user: con.user,
                timestamp: con.timestamp,
                lastmessage: "",
                lastSender: "",
                status: "",
                lasttime: ""
            })
        })

        // console.log(dataConversation);
        // console.log("==================");
        // console.log(dataLastMessage);

        return res.render("chat", {
            conversations: dataConversation.length > 0 ? dataConversation : [],
            userLoged: dataUserLoged[0],
            dataMessage: {},
            dataLastMessage: dataLastMessage.length > 0 ? dataLastMessage : [],
            isOpenChat: false,
            idConversation: "",
            message: "get data chat success",
            code: 1,
        });


    } catch (e) {
        console.log(`error get chat: ${e.message}`);
        return res.send({message: "conversation not found", code: 0});
    }
});
router.get("/stech.manager/order", async function (req, res, next) {
    try {
        var encodedValueStatus = req.cookies.status;

        if (encodedValueStatus === undefined || Buffer.from(encodedValueStatus, 'base64').toString('utf8') == 'All') {
            let orders = await OrderModel.modelOrder.find();
            orders.reverse();
            console.log('Orders:', orders);
            let userId = req.cookies.Uid;
            let user = await UserModel.userModel.findById(userId);
            if (user.role === "Admin") {
                const ordersWithProductInfo = await Promise.all(orders.map(async order => {
                    const allProductInfo = await order.getAllProductInfo();
                    const userInfo = await order.getUserInfo();
                    console.log('ProductInfo:', allProductInfo);
                    console.log('UserInfo:', userInfo);
                    return {...order.toObject(), allProductInfo, userInfo};
                }));
                res.render("order", {orders: ordersWithProductInfo, message: "get list order success", code: 1});
            } else {
                res.render("error");
            }

        } else {
            let valueStatus = Buffer.from(encodedValueStatus, 'base64').toString('utf8');
            let orders = await OrderModel.modelOrder.find({status: valueStatus});

            let userId = req.cookies.Uid;
            let user = await UserModel.userModel.findById(userId);
            if (user.role === "Admin") {
                console.log('Orders:', orders);
                const ordersWithProductInfo = await Promise.all(orders.map(async order => {
                    const allProductInfo = await order.getAllProductInfo();
                    const userInfo = await order.getUserInfo();
                    console.log('ProductInfo:', allProductInfo);
                    console.log('UserInfo:', userInfo);
                    return {...order.toObject(), allProductInfo, userInfo};
                }));
                res.render("order", {orders: ordersWithProductInfo, message: "get list order success", code: 1});
            } else {
                res.render("error");
            }

        }

        // res.render("order", { orders: ordersWithProductInfo, message: "get list order success", code: 1 });
    } catch (e) {
        console.log(e.message);
        res.send({message: "order not found", code: 0})
    }
});
router.get("/stech.manager/detail_order", async function (req, res, next) {
    try {
        var encodedOrderId = req.query.orderId;
        let orderId = Buffer.from(encodedOrderId, 'base64').toString('utf8');
        //let productId = req.query.productId;			
        console.log("Received orderId from cookie:", orderId);

        let order = await OrderModel.modelOrder.findById(orderId);
        if (order) {
            const allProductInfo = await order.getAllProductInfo();
            const userInfo = await order.getUserInfo();
            console.log('ProductInfo:', allProductInfo);
            console.log('UserInfo:', userInfo);

            res.render("detail_order", {
                detailOrder: {...order.toObject(), allProductInfo, userInfo},
                message: "get order details success",
                code: 1
            });
        } else {
            res.send({message: "Order not found", code: 0});
        }
    } catch (e) {
        console.error("Error fetching order details:", e.message);
        res.send({message: "Error fetching order details", code: 0});
    }
});
router.get("/stech.manager/invoice", function (req, res, next) {

    function getCookie(name) {
        const match = req.headers.cookie.match(new RegExp('(^| )' + name + '=([^;]+)'));
        if (match) return match[2];
    }

    const orderDataCookie = getCookie('dataToInvoice');

    if (orderDataCookie) {
        // Giải mã cookie để có được dữ liệu đặt hàng
        const orderData = JSON.parse(decodeURIComponent(orderDataCookie));

        // Truyền dữ liệu vào layout "invoice.pug"
        res.render("invoice", {
            guestName: orderData.guestName,
            guestPhone: orderData.guestPhone,
            guestAddress: orderData.guestAddress,
            products: orderData.product,
        });
    } else {
        // Xử lý khi không có giá trị cookie
        res.send({message: "No order data found in the cookie", code: 0});
    }
});
router.get("/stech.manager/cart", async function (req, res, next) {
    // const userId = req.query.userId;
    // const userId = utils_1.getCookie(req, 'Uid');

    const userId = new mongoose.Types.ObjectId(utils_1.getCookie(req, 'Uid'));

    console.log("id", userId)
    try {
        let cartUser = await CartModel.cartModel.findOne({userId}).populate({
            path: 'product',
            select: 'productId quantity'
        });
        ;
        console.log(cartUser)

            res.render("cart", {
                carts: cartUser,
                message: "get list profile success",
                code: 1,
            })


    } catch (e) {
        console.log(e.message);
        res.send({message: "cart not found", code: 0})
    }
});
router.post('/updateQuantity/:productId', async (req, res) => {
    const productId = req.params.productId;
    const newQuantity = req.body.quantity;

    try {
        // Tìm và cập nhật số lượng trong cơ sở dữ liệu
        const updatedProduct = await CartModel.updateOne(
            {'product._id': productId},
            {$set: {'product.$.quantity': newQuantity}}
        );

        if (updatedProduct.nModified > 0) {
            // Cập nhật thành công
            res.json({success: true, message: 'Quantity updated successfully'});
        } else {
            // Không có bản ghi nào được cập nhật (productId không tồn tại)
            res.status(404).json({success: false, message: 'Product not found'});
        }
    } catch (error) {
        console.error(error);
        res.status(500).json({success: false, message: 'Error updating quantity'});
    }
});
router.get("/stech.manager/banner", async function (req, res, next) {
    try {
        let listbanner = await BannerModel.bannerModel.find();

        res.render("banner", {banners: listbanner, message: "get list banner success", code: 1});


    } catch (e) {
        console.log(e.message);
        res.send({message: "banner not found", code: 0})
    }
});
router.get("/stech.manager/pay", function (req, res, next) {
    try {
        var cookieValue = req.headers.cookie.replace(/(?:(?:^|.*;\s*)selectedProducts\s*=\s*([^;]*).*$)|^.*$/, "$1");
        var listProduct = JSON.parse(decodeURIComponent(cookieValue));

        return res.render("pay", {products: listProduct})

    } catch (e) {
        console.log(e.message);
        res.send({message: "pay not found", code: 0})
    }
});
router.get("/stech.manager/edit_product_action", async function (req, res, next) {

    var cookieValue = req.headers.cookie.replace(/(?:(?:^|.*;\s*)productId\s*=\s*([^;]*).*$)|^.*$/, "$1");
    var productId = JSON.parse(decodeURIComponent(cookieValue));
    const token = req.cookies.token
    try {

        let productSelected = await ProductModel.productModel.findById(productId);
        let listCategory = await CategoryModel.categoryModel.find();

        res.render("edit_product_action",
            {
                products: productSelected,
                categories: listCategory,
                message: "get list product success",
                token: token,
                code: 1
            })
    } catch (e) {
        console.log(e.message);
        res.send({message: "product not found", code: 0})
    }

});

//Voucher
router.get("/stech.manager/voucher", async function (req, res, next) {
    try {
        let listVoucher = await VoucherModel.voucherModel.find();
        res.render("voucher", {
            vouchers: listVoucher,
            message: "get list voucher success",
            code: 1,
        });
    } catch (e) {
        console.log(e.message);
        res.send({message: "user not found", code: 0});
    }
});

    res.render("edit_product_action",
      {
        products: productSelected,
        categories: listCategory,
        message: "get list product success",
        code: 1
      })
  } catch (e) {
    console.log(e.message);
    res.send({ message: "product not found", code: 0 })
  }
router.post("/stech.manager/createVoucher", async function (req, res, next) {
    try {
        let name = req.body.name;
        let content = req.body.content;
        let price = req.body.price;
        let toDate = req.body.toDate;
        let fromDate = req.body.fromDate;
        let date = new Date();
        let create_time = moment(date).format("YYYY-MM-DD-HH:mm:ss");

        if (name == null) {
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
        if (create_time == null) {
            return res.send({message: "create_time is required", code: 0});
        }

        let voucher = new VoucherModel.voucherModel({
            name: name,
            content: content,
            price: price,
            toDate: formatDateTime(toDate),
            fromDate: formatDateTime(fromDate),
            create_time: create_time,
        });
        await voucher.save();
        res.redirect(req.get('referer'));
    } catch (e){
        console.log(e.message);
        res.send({message: "create voucher fail", code: 0});
    }
});
router.post("/stech.manager/updateVoucher",async function(req, res, next) {
    try {
        let name = req.body.name;
        let content = req.body.content;
        let price = req.body.price;
        let toDate = req.body.toDate;
        let fromDate = req.body.fromDate;
        let voucherId = req.body.voucherId;
        if (voucherId == null) {
            return res.send({message: "voucherId is required", code: 0});
        }
        try {
            let voucher = await VoucherModel.voucherModel.findById(voucherId);
            let newVoucher = {
                name: voucher.name,
                content: voucher.content,
                price: voucher.price,
                toDate: formatDateTime(voucher.toDate),
                fromDate: formatDateTime(voucher.fromDate),
                create_time: voucher.create_time,
            }
            if (name !== null) {
                newVoucher.name = name;
            }
            if (content !== null) {
                newVoucher.content = content;
            }
            if (price !== null) {
                newVoucher.price = price;
            }
            if (toDate !== null) {
                newVoucher.toDate = formatDateTime(toDate);
            }
            if (fromDate !== null) {
                newVoucher.fromDate = formatDateTime(fromDate);
            }
            await VoucherModel.voucherModel.updateMany({_id: voucherId}, {$set: newVoucher});
            res.redirect(req.get('referer'));
        } catch (e) {
            console.log(e.message);
            return res.send({message: e.message.toString(), code: 0});
        }
    }catch (e) {
        console.log(e.message);
        res.send({message: "create voucher fail", code: 0});
    }
})
function formatDateTime(dateTimeString) {
    var selectedDate = new Date(dateTimeString);

    // Lấy các thành phần của ngày và giờ
    var year = selectedDate.getFullYear();
    var month = (selectedDate.getMonth() + 1).toString().padStart(2, '0');
    var day = selectedDate.getDate().toString().padStart(2, '0');
    var hour = selectedDate.getHours().toString().padStart(2, '0');
    var minute = selectedDate.getMinutes().toString().padStart(2, '0');
    var second = selectedDate.getSeconds().toString().padStart(2, '0');

    // Định dạng lại theo "YYYY-MM-DD HH:mm:ss"
    var formattedDate = `${year}-${month}-${day}-${hour}:${minute}:${second}`;

    return formattedDate;
}

router.post("/stech.manager/deleteVoucher", async function(req, res, next) {
    let voucherId = req.body.voucherId;
    if(voucherId === null){
        return res.send({message:"voucher id is required", code: 0 })
    }
    try {
        let voucher = await VoucherModel.voucherModel.findById(voucherId);
        if(!voucher){
            return res.send({message:"voucher not found", code: 0 })
        }
        await VoucherModel.voucherModel.deleteMany({_id: voucherId});
        res.redirect(req.get('referer'));
    } catch (e) {
        console.log(e.message);
        return res.send({message: e.message.toString(), code: 0});
    }
});

//Notification
router.get("/stech.manager/notification", async function (req, res, next) {
    try {
        let listNotification = await NotificationModel.notificationModel.find();

        res.render("notification", {
            notifications: listNotification,
            message: "get list notification success",
            code: 1,
        });


    } catch (e) {
        console.log(e.message);
        res.send({message: "notification not found", code: 0});
    }
});

router.post("/stech.manager/createNotification", upload.fields([{name: "img", maxCount: 1}]), async function(req, res, next) {
    const img = req.files["img"];
    let title = req.body.title;
    let content = req.body.content;
    let date = new Date();
    let create_time = moment(date).format("YYYY-MM-DD-HH:mm:ss");

    if (title == null) {
        return res.send({message: "title is required", code: 0});
    }
    if (content == null) {
        return res.send({message: "content is required", code: 0});
    }
    try {
        let notification = new NotificationModel.notificationModel({
            title: title,
            content: content,
            create_time: create_time,
        });
        let imgNoti = await UploadFileFirebase.uploadFileNotifi(
            req,
            notification._id.toString(),
            "img",
            "notifications",
            img[0]
        );
        if (imgNoti === 0) {
            return res.send({message: "upload file img fail", code: 0});
        }
        notification.img = imgNoti;
        await notification.save();
        res.redirect(req.get('referer'));
    } catch (e) {
        return res.send({message: e.message.toString(), code: 0});
    }

});

router.post("/stech.manager/updateNotification", upload.fields([{name: "img", maxCount: 1}]), async function(req, res, next) {
    const img = req.files["img"];
    let title = req.body.title;
    let content = req.body.content;
    let notificationId = req.body.notificationId;

    if (notificationId == null) {
        return res.send({message: "notificationId is required", code: 0});
    }
    try {
        let notification = await NotificationModel.notificationModel.findById(notificationId);
        let newNotification = {
            title: notification.title,
            content: notification.content,
            img: notification.img,
            create_time: notification.create_time,
        }
        if (title != null) {
            newNotification.title = title;
        }
        if (content != null) {
            newNotification.content = content;
        }
        if (img != null) {
            const productFirebase = `notifications/${notificationId}`;
            await UploadFileFirebase.deleteFolderAndFiles(res, productFirebase);

            let imgNoti = await UploadFileFirebase.uploadFileNotifi(
                req,
                notification._id.toString(),
                "img",
                "notifications",
                img[0]
            );
            if (imgNoti === 0) {
                return res.send({message: "upload file img fail", code: 0});
            }
            newNotification.img = imgNoti;
        }

        await NotificationModel.notificationModel.updateMany({_id: notificationId}, {$set: newNotification});
        res.redirect(req.get('referer'));
    } catch (e) {
        console.log(e.message);
        return res.send({message: e.message.toString(), code: 0});
    }
});

router.post("/stech.manager/deleteNotification", async function (req, res, next) {
    try {
        let notificationId = req.body.NotifiId;
        if (notificationId == null) {
            return res.send({message: "notificationId is required", code: 0});
        }

        await NotificationModel.notificationModel.deleteMany({_id: notificationId});

        const productFirebase = `notifications/${notificationId}`;
        await UploadFileFirebase.deleteFolderAndFiles(res, productFirebase);

        res.redirect(req.get('referer'));

    } catch (e) {
        console.log(e.message);
        return res.send({message: e.message.toString(), code: 0});
    }
})
module.exports = router;
