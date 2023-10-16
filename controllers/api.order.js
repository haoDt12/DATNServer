const OrderModel = require("../models/model.order");
exports.creatOrder = async (req, res, next) => {
    let userId = req.body.userId;
    let product = req.body.product;
    let price = req.body.price;
    let address = req.body.address;
    let total = req.body.total;
    let quantity = req.body.quantity;
    let status = req.body.status;
    let currentDate = new Date();
    let options = {
        weekday: 'long',
        year: 'numeric',
        month: 'long',
        day: 'numeric',
        hour: 'numeric',
        minute: 'numeric',
        second: 'numeric',
        timeZoneName: 'short'
    };
    let date_time = currentDate.toLocaleDateString("en-US", options);
    if (userId == null) {
        return res.send({message: "userId is required", code: 0});
    }
    if (product == null) {
        return res.send({message: "product is required", code: 0});
    }
    if (price == null) {
        return res.send({message: "price is required", code: 0});
    }
    if (address == null) {
        return res.send({message: "address is required", code: 0});
    }
    if (total == null) {
        return res.send({message: "total is required", code: 0});
    }
    if (quantity == null) {
        return res.send({message: "quantity is required", code: 0});
    }
    if (status == null) {
        return res.send({message: "status is required", code: 0});
    }
    if(isNaN(total)){
        return res.send({message: "total is number", code: 0});
    }
    if(isNaN(quantity)){
        return res.send({message: "quantity is number", code: 0});
    }
    try {
        let order = new OrderModel.modelOrder({
            userId : userId,
            product : product,
            price : price,
            address : address,
            total : total,
            quantity : quantity,
            status : status,
            date_time : date_time,
        })
        await order.save();
        return res.send({message: "create order success", code: 1});
    }catch (e) {
        return res.send({message: "create order fail", code: 0});
    }
}