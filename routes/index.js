var express = require("express");
var router = express.Router();
const ProductModel = require("./../models/model.product");
const OrderModel = require("./../models/model.order");
const CategoryModel = require("./../models/model.category");
const CartModel = require("./../models/model.cart");
const UserModel = require("./../models/model.user");
const BannerModel = require("./../models/model.banner");
const ConversationModel = require("./../models/model.conversations");
const MessageModel = require("./../models/model.message");
const VoucherModel = require("./../models/model.voucher");

const utils_1 = require('../public/js/ultils_1');
const path = require("path");
const mongoose = require('mongoose');
// const {cartModel, CartModel} = require("../models/model.cart");
const NotificationPublicModel = require("./../models/model.notification.pulic");

/* GET home page. */
router.get("/stech.manager/home", function (req, res, next) {
  res.render("index");
});
router.get("/stech.manager/product_action", async function (req, res, next) {
  const token = req.cookies.token
  console.log(token)
  try {
    let listProduct = await ProductModel.productModel.find();
    let listCategory = await CategoryModel.categoryModel.find();

    console.log(listProduct[1].option[1].title)
    res.render("product_action", {
      products: listProduct,
      categories:listCategory,
      message: "get list product success",
      token:token,
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
    console.log(listProduct[1].option[1].title)
    res.render("product", {
      products: listProduct,
      message: "get list product success",
      code: 1
    });
  } catch (e) {
    console.log(e.message);
    res.send({ message: "product not found", code: 0 })
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
    res.send({ message: "category not found", code: 0 });
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

    let product = await ProductModel.productModel.findById(productId).populate({ path: 'category', select: 'title' });

    if (product) {
      res.render("detail_product", { detailProduct: product, message: "get product details success", code: 1 });
    } else {
      res.send({ message: "Product not found", code: 0 });
    }
  } catch (e) {
    console.error("Error fetching product details:", e.message);
    res.send({ message: "Error fetching product details", code: 0 });
  }
});
router.get("/stech.manager/detail_user", async function (req, res, next) {
  try {
    var encodedUserId = req.query.userId;
    let userId = Buffer.from(encodedUserId, 'base64').toString('utf8');
    //let productId = req.query.productId;
    console.log("Received userId from cookie:", userId);

    let user = await UserModel.userModel.findById(userId).populate({ path: 'address', select: 'city' });

    if (user) {
      res.render("detail_user", { detailUser: user, message: "get user details success", code: 1 });
      console.log(user)
    } else {
      res.send({ message: "user not found", code: 0 });
    }
  } catch (e) {
    console.error("Error fetching user details:", e.message);
    res.send({ message: "Error fetching user details", code: 0 });
  }
});

router.get('/stech.manager/user', async function (req, res, next) {
  try {
    let listUser = await UserModel.userModel.find().populate({ path: 'address', select: 'city' });
    res.render("user", {
      users: listUser,
      message: "get list user success",
      code: 1,
    });
  } catch (e) {
    console.log(e.message);
    res.send({ message: "user not found", code: 0 });
  }
});
router.get("/stech.manager/verify", function (req, res, next) {
  res.render("verify");
});
router.get("/stech.manager/profile", async function (req, res, next) {
  const id = utils_1.getCookie(req, 'Uid');
  console.log(id);
  try {
    let listprofile = await UserModel.userModel.findById(id).populate({ path: 'address', select: 'city' });
    res.render("profile", {
      profiles: listprofile,
      message: "get list profile success",
      code: 1,
    });
  } catch (e) {
    console.log(e.message);
    res.send({ message: "profile not found", code: 0 });
  }
  //tìm cart theo userId
  // res.render("profile");
  // res.render("profile");
});

router.get("/stech.manager/chat/c/:id", async function (req, res, next) {
  try {

    // Check login
    let idUserLoged = req.cookies.Uid
    if (idUserLoged == null || idUserLoged.length <= 0) {
      res.redirect('/stech.manager/login')
    }
    let ACCESS_TOKEN_SECRET = process.env.ACCESS_TOKEN_SECRET

    let encodedConversation = req.params.id
    let idConversation = req.params.id
    // let idConversation = Buffer.from(encodedConversation, 'base64').toString('utf8');
    let listConversation = await ConversationModel.conversationModel.find().populate({ path: 'user' });
    let dataUserLoged = await UserModel.userModel.find({ _id: idUserLoged }).populate({ path: 'address', select: 'city' });
    let dataMessage = await MessageModel.messageModel.find({ conversation: idConversation }).populate({ path: 'conversation' });
    let conversationNoMessage = []
    if (dataMessage.length <= 0) {
      conversationNoMessage = await ConversationModel.conversationModel.find({ _id: idConversation }).populate({ path: 'user' });
    }

    let listUserIDInChat = []
    await Promise.all(dataMessage.map((message) => {
      if (!listUserIDInChat.includes(message.senderId)) {
        listUserIDInChat.push(message.senderId);
      }
      if (!listUserIDInChat.includes(message.receiverId)) {
        listUserIDInChat.push(message.receiverId);
      }
    }));

    let dataOtherUser = []
    await Promise.all(listUserIDInChat.map(async (userID) => {
      if (userID != dataUserLoged[0]._id) {
        const userData = await UserModel.userModel.find({ _id: userID }).populate({ path: 'address', select: 'city' });
        dataOtherUser = userData
      }
    }));

    // console.log(conversationNoMessage);
    // console.log("====================");
    // console.log(dataOtherUser);
    res.render("chat", {
      conversations: listConversation.length > 0 ? listConversation : [],
      userLoged: dataUserLoged[0],
      dataMessage: dataMessage,
      dataHeaderMsg: dataMessage.length <= 0 ? conversationNoMessage : dataOtherUser,
      idConversation: idConversation,
      isOpenChat: true,
      message: "get data chat success",
      code: 1,
    });

  }
  catch (e) {
    console.log(e.message);
    res.send({ message: "conversation not found", code: 0 });
  }
});
router.get("/stech.manager/chat", async function (req, res, next) {
  try {
    // Check login
    let idUserLoged = req.cookies.Uid
    if (idUserLoged == null || idUserLoged.length <= 0) {
      return res.redirect('/stech.manager/login')
    }

    let dataUserLoged = await UserModel.userModel.find({ _id: idUserLoged }).populate({ path: 'address', select: 'city' });
    let listConversation = await ConversationModel.conversationModel.find().populate({ path: 'user' });
    let dataMessage = await MessageModel.messageModel.find().populate({ path: 'conversation' });

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
          let message = msg.message
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

    res.render("chat", {
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
    console.log(`eror get chat: ${e.message}`);
    res.send({ message: "conversation not found", code: 0 });
  }
});
router.get("/stech.manager/order", async function (req, res, next) {
  try {
    var encodedValueStatus = req.cookies.status;

    if (encodedValueStatus === undefined || Buffer.from(encodedValueStatus, 'base64').toString('utf8') == 'All') {
      let orders = await OrderModel.modelOrder.find();
      console.log('Orders:', orders);
      const ordersWithProductInfo = await Promise.all(orders.map(async order => {
        const allProductInfo = await order.getAllProductInfo();
        const userInfo = await order.getUserInfo();
        console.log('ProductInfo:', allProductInfo);
        console.log('UserInfo:', userInfo);
        return { ...order.toObject(), allProductInfo, userInfo };
      }));
      res.render("order", { orders: ordersWithProductInfo, message: "get list order success", code: 1 });
    } else {
      let valueStatus = Buffer.from(encodedValueStatus, 'base64').toString('utf8');
      let orders = await OrderModel.modelOrder.find({ status: valueStatus });
      console.log('Orders:', orders);
      const ordersWithProductInfo = await Promise.all(orders.map(async order => {
        const allProductInfo = await order.getAllProductInfo();
        const userInfo = await order.getUserInfo();
        console.log('ProductInfo:', allProductInfo);
        console.log('UserInfo:', userInfo);
        return { ...order.toObject(), allProductInfo, userInfo };
      }));
      res.render("order", { orders: ordersWithProductInfo, message: "get list order success", code: 1 });
    }

    // res.render("order", { orders: ordersWithProductInfo, message: "get list order success", code: 1 });
  } catch (e) {
    console.log(e.message);
    res.send({ message: "order not found", code: 0 })
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

      res.render("detail_order", { detailOrder: { ...order.toObject(), allProductInfo, userInfo }, message: "get order details success", code: 1 });
    } else {
      res.send({ message: "Order not found", code: 0 });
    }
  } catch (e) {
    console.error("Error fetching order details:", e.message);
    res.send({ message: "Error fetching order details", code: 0 });
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
    res.send({ message: "No order data found in the cookie", code: 0 });
  }
});
router.get("/stech.manager/cart", async function (req, res, next) {
  // const userId = req.query.userId;
  // const userId = utils_1.getCookie(req, 'Uid');

  const userId = new mongoose.Types.ObjectId(utils_1.getCookie(req, 'Uid'));

  console.log("id", userId)
  try {
    let cartUser = await CartModel.cartModel.findOne({ userId }).populate({ path: 'product', select: 'productId quantity' });;
    console.log(cartUser)
    res.render("cart", {
      carts: cartUser,
      message: "get list profile success",
      code: 1,
    })
  } catch (e) {
    console.log(e.message);
    res.send({ message: "cart not found", code: 0 })
  }
});
router.post('/updateQuantity/:productId', async (req, res) => {
  const productId = req.params.productId;
  const newQuantity = req.body.quantity;

  try {
    // Tìm và cập nhật số lượng trong cơ sở dữ liệu
    const updatedProduct = await CartModel.updateOne(
      { 'product._id': productId },
      { $set: { 'product.$.quantity': newQuantity } }
    );

    if (updatedProduct.nModified > 0) {
      // Cập nhật thành công
      res.json({ success: true, message: 'Quantity updated successfully' });
    } else {
      // Không có bản ghi nào được cập nhật (productId không tồn tại)
      res.status(404).json({ success: false, message: 'Product not found' });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: 'Error updating quantity' });
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
    res.send({ message: "user not found", code: 0 });
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
        res.send({ message: "user not found", code: 0 });
    }
});
router.get("/stech.manager/banner", async function (req, res, next) {
  try {
    let listbanner = await BannerModel.bannerModel.find();
    res.render("banner", { banners: listbanner, message: "get list banner success", code: 1 });
  } catch (e) {
    console.log(e.message);
    res.send({ message: "banner not found", code: 0 })
  }
});
router.get("/stech.manager/pay", function (req, res, next) {
  try {
    var cookieValue = req.headers.cookie.replace(/(?:(?:^|.*;\s*)selectedProducts\s*=\s*([^;]*).*$)|^.*$/, "$1");
    var listProduct = JSON.parse(decodeURIComponent(cookieValue));

    return res.render("pay",{products: listProduct})

  } catch (e) {
    console.log(e.message);
    res.send({ message: "pay not found", code: 0 })
  }
});
module.exports = router;
