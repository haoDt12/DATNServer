const ProductCart = require("../modelsv2/model.ProductCart");
const moment = require("moment");
const Product = require("../modelsv2/model.product");
exports.addCard = async (req, res) => {
  const { customer_id, product_id, quantity } = req.body;
  let date = new Date();
  const date_time = moment(date).format("YYYY-MM-DD-HH:mm:ss");
  if (customer_id === null) {
    return res.send({ message: "customer_id is required", code: 0 });
  }
  if (product_id === null) {
    return res.send({ message: "product_id is required", code: 0 });
  }
  if (quantity === null) {
    return res.send({ message: "quantity is required", code: 0 });
  }
  try {
    const myCart = await ProductCart.productCartModel.findOne({
      customer_id,
      product_id,
    });
    if (myCart) {
      const productWhereId = await Product.productModel.findById({
        _id: req.body.product_id,
      });
      if (
        Number(myCart.quantity) + Number(quantity) >
        productWhereId.quantity
      ) {
        return res.send({ message: "Số lượng hàng hiện không đủ", code: 1 });
      } else {
        myCart.quantity = Number(myCart.quantity) + Number(quantity);
        await myCart.save();
        return res.send({ message: "Cập nhập số lượng thành công", code: 1 });
      }
    } else {
      const productWhereId = await Product.productModel.findById({
        _id: req.body.product_id,
      });
      if (Number(quantity) > Number(productWhereId.quantity)) {
        return res.send({ message: "Số lượng hàng hiện không đủ", code: 1 });
      } else {
        const ProC = new ProductCart.productCartModel();
        ProC.customer_id = customer_id;
        ProC.product_id = product_id;
        ProC.quantity = quantity;
        ProC.date_time = date_time;
        await ProC.save();
        return res.send({ message: "Thêm vào giỏ hàng thành công", code: 1 });
      }
    }
  } catch (error) {
    console.log("Error: " + error.message);
    return res.send({ message: error.message.toString(), code: 0 });
  }
};
exports.getCartByIdCustomer = async (req, res) => {
  const { customer_id } = req.body;
  if (customer_id === null) {
    return res.send({ message: "customer_id is required", code: 0 });
  }
  try {
    const CartCustomer = await ProductCart.productCartModel
      .find({
        customer_id,
      })
      .populate("product_id");
    if (CartCustomer) {
      return res.send({
        message: "Lấy giỏ hàng thành công",
        productCart: CartCustomer,
        code: 1,
      });
    } else {
      return res.send({ message: "Người dùng chưa có giỏ hàng", code: 0 });
    }
  } catch (error) {
    console.log("Error: " + error.message);
    return res.send({ message: error.message.toString(), code: 0 });
  }
};

exports.updateCart = async (req, res) => {
  const { customer_id, product_id, calculation } = req.body;
  if (customer_id === null) {
    return res.send({ message: "customer_id is required", code: 0 });
  }
  if (product_id === null) {
    return res.send({ message: "product_id is required", code: 0 });
  }
  if (calculation === null) {
    return res.send({ message: "calculation is required", code: 0 });
  }
  if (calculation !== "reduce" && calculation !== "increase") {
    return res.send({ message: "cacaluation invalid", code: 0 });
  }
  try {
    const myCart = await ProductCart.productCartModel.findOne({
      customer_id,
      product_id,
    });
    if (myCart) {
      if (calculation === "reduce") {
        myCart.quantity = Number(myCart.quantity) - 1;
        if (Number(myCart.quantity) == 0) {
          await ProductCart.productCartModel.findOneAndDelete({
            customer_id,
            product_id,
          });
          return res.send({
            message: "Xóa khỏi giỏ hàng thành công",
            code: 1,
          });
        }
        await myCart.save();
        return res.send({
          message: "Giảm số lượng thành công",
          code: 1,
        });
      } else if (calculation === "increase") {
        const productWhereId = await Product.productModel.findById({
          _id: req.body.product_id,
        });

        if (myCart.quantity === productWhereId.quantity) {
          return res.send({
            message: "Số lượng sản phẩm hiện tại không đủ",
            code: 1,
          });
        } else {
          myCart.quantity = Number(myCart.quantity) + 1;
          await myCart.save();
          return res.send({
            message: "Tăng số lượng thành công",
            code: 1,
          });
        }
      }
    } else {
      return res.send({
        message: "Không tìm thấy sản phẩm trong giỏ hàng",
        code: 0,
      });
    }
  } catch (error) {
    console.log("Error: " + error.message);
    return res.send({ message: error.message.toString(), code: 0 });
  }
};
