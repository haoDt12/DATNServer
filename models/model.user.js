const db = require("./database");
const userSchema = db.mongoose.Schema(
    {
        avatar: {type: String, required: false},
        email: {type: String, required: true},
        password: {type: String, required: true},
        fullName: {type: String, required: true},
        phoneNumber: {type: String, required: true},
        role: {type: String, required: true},
        address: {type: String, required: true}
    },
    {
        collection: "User",
    }
);
const userModel = db.mongoose.model("user", userSchema);
module.exports = {userModel};