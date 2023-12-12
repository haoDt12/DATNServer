const ConversationModel = require("../models/model.conversations");
const MessageModel = require("../models/model.message");
const fs = require("fs");
const path = require("path");
const UploadFile = require("../models/uploadFile");
const moment = require('moment');
const { get } = require("http");
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
    "image/heif",
    "image/jfif",
];
const matchVideo = [
    "video/mp4",
    "video/x-msvideo",
    "video/x-matroska",
    "video/quicktime",
    "video/x-ms-wmv",
    "video/x-flv",
    "video/webm",
    "video/3gpp",
    "video/ogg",
    "video/mpeg",
];
exports.addMessage = async (req, res) => {
    let conversation = req.body.conversation;
    let senderId = req.body.senderId;
    let receiverId = req.body.receiverId;
    let contentMessage = req.body.message;
    let date = new Date();
    let timestamp = moment(date).format("YYYY-MM-DD-HH:mm:ss");

    if (conversation == null) {
        return res.send({ message: "conversation is required", code: 0 });
    }
    if (senderId == null || senderId.length == 0) {
        return res.send({ message: "senderId is required", code: 0 });
    }
    if (receiverId == null || receiverId.length == 0) {
        return res.send({ message: "receiverId is required", code: 0 });
    }
    if (contentMessage == null || contentMessage.length == 0) {
        return res.send({ message: "message is required", code: 0 });
    }
    if (timestamp == null) {
        return res.send({ message: "error get time", code: 0 });
    }

    // Add send File

    let message = new MessageModel.messageModel({
        conversation: conversation,
        senderId: senderId,
        receiverId: receiverId,
        message: contentMessage,
        status: "unseen",
        deleted: false,
        timestamp: timestamp
    });

    try {
        await message.save()
        // console.log(`message: ${message}`);
        return res.send({ dataMessage: message, message: "add message success", code: 1 });
    } catch (e) {
        console.log(e);
        return res.send({ message: "add message fail", code: 0 });
    }


};
exports.getListMessage = async (req, res) => {

};
exports.getMessageById = async (req, res) => {

};
exports.deleteMessage = async (req, res) => {

};

exports.updateStatusMessage = async (req, res) => {
    let idMessage = req.body.idMsg;
    let status = req.body.status;
    if (idMessage == null || idMessage.length <= 0) {
        return res.send({ message: "idMessage is required" })
    }
    if (status == null || status.length <= 0) {
        return res.send({ message: "status is required" })
    }

    try {
        let message = await MessageModel.messageModel.findByIdAndUpdate(idMessage, { status: status });
        if (!message) {
            return res.send({ message: "message not found" })
        }
        res.send({ message: "update status message success", code: 1 })
    } catch (e) {
        console.log(e.message);
        return res.send({ message: e.message.toString(), code: 0 });
    }
};
exports.editMessage = async (req, res) => {

}