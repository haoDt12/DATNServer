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

const utils_1 = require('../public/js/ultils_1');
const path = require("path");
const mongoose = require('mongoose');
// const {cartModel, CartModel} = require("../models/model.cart");
const NotificationPublicModel = require("./../models/model.notification.pulic");

/* GET home page. */
router.get("/stech.manager/home", function (req, res, next) {
  res.render("index");
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
router.get("/stech.manager/chat", async function (req, res, next) {
  try {
    // Check login
    let idUserLoged = req.cookies.Uid
    if (idUserLoged == null || idUserLoged.length <= 0) {
      res.redirect('/stech.manager/login')
    }

    let listConversation = await ConversationModel.conversationModel.find().populate({ path: 'user' });
    let dataUserLoged = await UserModel.userModel.find({ _id: idUserLoged }).populate({ path: 'address', select: 'city' });
    let dataMessage = await MessageModel.messageModel.find().populate({ path: 'conversation' });
    let selectedConversationId = req.query.selectedConversationId
    if (selectedConversationId) {
      dataMessage = dataMessage.filter(element => element.conversation._id == selectedConversationId);
    }
    console.log(listConversation);
    res.render("chat", {
      conversations: listConversation.length > 0 ? listConversation : [],
      userLoged: dataUserLoged[0],
      dataMessage: dataMessage,
      message: "get data chat success",
      code: 1,
    });


  } catch (e) {
    console.log(e.message);
    res.send({ message: "conversation not found", code: 0 });
  }
});
router.get("/stech.manager/order", async function (req, res, next) {
  try {
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

    var encodedValueStatus = req.cookies.status;

    if (encodedValueStatus === undefined) {
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
  res.render("invoice");
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
router.get("/stech.manager/banner", async function (req, res, next) {
  try {
    let listbanner = await BannerModel.bannerModel.find();
    res.render("banner", { banners: listbanner, message: "get list banner success", code: 1 });
  } catch (e) {
    console.log(e.message);
    res.send({ message: "banner not found", code: 0 })
  }
});
module.exports = router;
