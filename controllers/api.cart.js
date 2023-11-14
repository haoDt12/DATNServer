const ProductModel = require("../models/model.product");
const CartModel = require("../models/model.cart");
const moment = require("moment/moment");
const OrderModel = require("../models/model.order");
exports.addCart = async (req, res) => {
  let userId = req.body.userId;
  let productId = req.body.productId;
  let quantity = req.body.quantity;
  let color = req.body.color;
  let price = req.body.price;
  let imgCover = req.body.imgCover;
  let title = req.body.title;
  let ram_rom = req.body.ram_rom;
  let date = new Date();
  let date_time = moment(date).format("YYYY-MM-DD-HH:mm:ss");
  if (userId == null) {
    return res.send({ message: "userId is required", code: 0 });
  }
  if (title == "") {
    return res.send({ message: "title is required", code: 0 });
  }
  if (imgCover == null) {
    return res.send({ message: "imgCover is required", code: 0 });
  }
  if (price == null) {
    return res.send({ message: "price is required", code: 0 });
  }
  // if (product === undefined) {
  //   return res.send({ message: "cart is empty", code: 0 });
  // }
  try {
    let myCart = await CartModel.cartModel.findOne({ userId: userId });
    if (myCart) {
      const index = myCart.product.findIndex(
        (id) =>
          id.productId === productId &&
          id.color === color &&
          id.ram_rom === ram_rom
      );

      if (index == -1) {
        myCart.product.push({
          productId: productId,
          quantity: quantity,
          color: color,
          title: title,
          ram_rom: ram_rom,
          price: price,
          imgCover: imgCover,
        });
        await myCart.save();
        return res.send({ message: "add cart success", code: 1 });
      } else {
        myCart.product[index].quantity =
          myCart.product[index].quantity + Number(quantity);
        await myCart.save();
        return res.send({ message: "update quantity success", code: 1 });
      }
    } else {
      let objCart = new CartModel.cartModel();
      objCart.userId = userId;
      objCart.product.push({
        productId: productId,
        quantity: quantity,
        color: color,
        title: title,
        ram_rom: ram_rom,
        price: price,
        imgCover: imgCover,
      });
      objCart.date_time = date_time;
      await objCart.save();
      return res.send({ message: "Create cart and add cart success", code: 1 });
    }
  } catch (e) {
    console.log(e.message);
    return res.send({ message: "add cart fail", code: 0 });
  }
};
exports.getCartByUserId = async (req, res) => {
  let userId = req.body.id;
  console.log(userId);
  if (userId === null) {
    return res.send({ message: "userId is required", code: 0 });
  }
  try {
    let listCart = await CartModel.cartModel.findOne({ userId: userId });

    return res.send({
      listCart: listCart.product,
      message: "get list cart success",
      code: 1,
    });
  } catch (e) {
    console.log(e.message);
    return res.send({ message: "get list cart fail", code: 0 });
  }
};
exports.getCartByCartId = async (req, res) => {
  let cartId = req.body.cartId;
  if (cartId === null) {
    return res.send({ message: "cartId is required", code: 0 });
  }
  try {
    let cart = await CartModel.cartModel.findOne(cartId);
    return res.send({ cart: cart, message: "get cart success", code: 1 });
  } catch (e) {
    console.log(e.message);
    return res.send({ message: "get cart fail", code: 0 });
  }
};
exports.getCart = async (req, res) => {
  try {
    let listCart = await CartModel.cartModel.find().populate("product");
    return res.send({
      listCart: listCart,
      message: "get list cart success",
      code: 1,
    });
  } catch (e) {
    console.log(e.message);
    return res.send({ message: "get list cart fail", code: 0 });
  }
};
exports.deleteCart = async (req, res) => {
  let cartId = req.body.cartId;
  let userId = req.body.userId;
  let productId = req.body.productId;
  if (cartId === null) {
    return res.send({ message: "orderId is required", code: 0 });
  }
  try {
    const objCart = await CartModel.cartModel.findOne({ userId: userId });
    if (objCart) {
      const index = objCart.product.findIndex(
        (id) => id.productId === productId
      );
      if (index == -1) {
        return res.send({ message: "No product found in your cart", code: 0 });
      } else {
        objCart.product.splice(index, 1);
        await objCart.save();
        if (objCart.product.length == 0) {
          await CartModel.cartModel.findOneAndDelete({
            userId: userId,
          });
          return res.send({
            message:
              "delete product in your cart and remove your cart success ",
            code: 1,
          });
        }
        return res.send({
          message: "delete product in your cart success",
          code: 1,
        });
      }
    }
  } catch (e) {
    console.log(e.message);
    return res.send({ message: "get list cart fail", code: 0 });
  }
};
exports.editCart = async (req, res) => {
  let userId = req.body.userId;
  let productId = req.body.productId;
  let caculation = req.body.caculation;
  if (caculation == null) {
    return res.send({ message: "cacaluation is required", code: 0 });
  }
  if (caculation != "reduce" && caculation != "increase") {
    return res.send({ message: "cacaluation invalid", code: 0 });
  }
  try {
    let cart = await CartModel.cartModel.findOne({ userId: userId });
    if (cart) {
      const index = cart.product.findIndex(
        (idProduct) => idProduct.productId === productId
      );
      if (index == -1) {
        return res.send({
          message: "No product found in your  cart ",
          code: 0,
        });
      } else {
        if (caculation == "reduce") {
          cart.product[index].quantity =
            Number(cart.product[index].quantity) - 1;
          if (cart.product[index].quantity == 0) {
            cart.product.splice(index, 1);
            await cart.save();
            if (cart.product.length == 0) {
              await CartModel.cartModel.findOneAndDelete({
                userId: userId,
              });
              return res.send({
                message: "delete your cart",
                code: 1,
              });
            }
            return res.send({
              message:
                "reduct quantity product and remove product in your  cart success",
              code: 1,
            });
          }
          await cart.save();
          return res.send({
            message: "reduct quantity product in your  cart success",
            code: 1,
          });
        } else if (caculation == "increase") {
          cart.product[index].quantity =
            Number(cart.product[index].quantity) + 1;
          await cart.save();
          return res.send({
            message: "increase quantity product in your  cart success",
            code: 1,
          });
        }
      }
    } else {
      console.log(e.message);
      return res.send({ message: "No found product in you cart ", code: 0 });
    }
  } catch (e) {
    console.log(e.message);
    return res.send({ message: "edit cart fail", code: 0 });
  }
};
