const db = require("../models/database");
const orderSchema = db.mongoose.Schema({
    map_voucher_cus_id: {
        type: db.mongoose.Schema.Types.ObjectId,
        ref: "map_voucher_cust",
        required: false,
        default: null
    },
    customer_id: {type: db.mongoose.Schema.Types.ObjectId, ref: "customer", required: true},
    employee_id: {type: db.mongoose.Schema.Types.ObjectId, ref: "employees", required: false, default: null},
    delivery_address_id: {type: db.mongoose.Schema.Types.ObjectId, ref: "delivery_address", required: true},
    status: {type: String, required: true, default: "WaitConfirm"},
    total_amount: {type: String, required: true, default: "0"},
    create_time: {type: String, required: true},
}, {
    collection: "Orders"
});
const oderModel = db.mongoose.model("orders", orderSchema);
module.exports = {oderModel};