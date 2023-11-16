const UserModel = require("../models/model.user");
const NotificationModel = require("../models/model.notification");
const matchImg = [
    "image/jpeg",
    "image/png",
    "image/gif",
    "image/bmp",
    "image/tiff",
    "image/webp",
    "image/svg+xml",
    "image/x-icon",
    "image/jp2",
    "image/heif"
];
exports.getListNotification = async (req, res) => {
    let userId = req.body.userId;
    try {
        let listNotification = await NotificationModel.modelNotification.find();
        let listNotifiById = await listNotification.findById(userId);
        res.send({product: listNotifiById, message: "get list notification success", code: 1})
    } catch (e) {
        console.log(e.message);
        return res.send({message: "get list notification fail", code: 0});
    }
}
exports.addNotification = async (req, res, next) => {
    let userId = req.body.userId;
    let title = req.body.title;
    let image = req.body.image;
    let type = req.body.type;
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
    if(title == null){
        return res.send({message: "title is required", code: 0});
    }
    if(image == null){
        return res.send({message: "image is required", code: 0});
    }
    if(time == null){
        return res.send({message: "time is required", code: 0});
    }
    if(type == null){
        return res.send({message: "type is required", code: 0});
    }
    if(userId == null){
        return res.send({message: "UserId is required", code: 0});
    }

    try {
        let user = await UserModel.userModel.findById(userId);
        if(!user) {
            return res.send({message: "add notification fail", code: 0});
        }
        let addNotification = new NotificationModel.modelNotification({
            userId: userId,
            title: title,
            image: image,
            time: date_time,
            type: type,
        })
        await addNotification.save();
        return res.send({message: "add notification success", code: 1});
        
    } catch (e) {
        console.log(e.message);
        res.send({message: "add notification fail", code: 0});
    }
}
exports.deleteNotification = async (req, res) => {
    let idNotifi = req.body.idNotifi;
    if(idNotifi == null){
        return res.send({message: "notification not found", code: 0});
    }
    try {
        let notification = await NotificationModel.modelNotification.findById(idNotifi);
        if (!notification) {
            return res.send({message: "notification not found", code: 0});
        }
        await NotificationModel.modelNotification.deleteOne({_id: idNotifi});
        return res.send({message: "Delete notification success", code: 1});
    } catch (e) {
        console.log(e);
        return res.send({message: "notification not found", code: 0});
    }
}