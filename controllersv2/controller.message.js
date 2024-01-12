const ConversationModel = require("../modelsv2/model.conversation");
const MessageModel = require("../modelsv2/model.message");
const fs = require("fs");
const path = require("path");
const UploadFileFirebase = require("../modelsv2/uploadFileFirebase");
const moment = require("moment-timezone");
const { get } = require("http");
const crypto = require("crypto");
require("dotenv").config();

const matchImg = [
    "image/*",
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
    let date = new Date();
    let specificTimeZone = 'Asia/Ha_Noi';
    let timestamp = moment(date).tz(specificTimeZone).format("YYYY-MM-DD-HH:mm:ss")

    // console.log(req.body);
    // console.log(req.files);
    let conversationID = req.body.conversation_id;
    let senderID = req.body.sender_id;
    let contentMessage = req.body.message;
    let messageType = req.body.message_type;

    let fileUpload = req.files;


    if (conversationID == null) {
        return res.send({ message: "conversation is required", code: 0, time: timestamp });
    }
    if (senderID == null || senderID.length == 0) {
        return res.send({ message: "senderId is required", code: 0, time: timestamp });
    }

    if (timestamp == null) {
        return res.send({ message: "error get time", code: 0, time: timestamp });
    }
    if (contentMessage == null && fileUpload == null) {
        return res.send({ message: "no data", code: 0, time: timestamp })
    }

    // TODO Mã hoá tin nhắn
    let messageEncrypted = ''
    const algorithm = 'aes-128-cbc';
    const IV_LENGTH = 16;
    const ENCRYPTION_KEY = process.env.API_KEY;
    const hash = crypto.createHash("sha1");
    hash.update(ENCRYPTION_KEY)
    const digestResult = hash.digest();
    // Chuyển đổi kết quả digest thành Uint8Array
    const uint8Array = new Uint8Array(digestResult);
    // Sử dụng slice từ Uint8Array.prototype
    const keyUint8Array = uint8Array.slice(0, 16);
    // Chuyển đổi kết quả Uint8Array về Buffer nếu cần
    const keyBuffer = Buffer.from(keyUint8Array);

    let iv = crypto.randomBytes(IV_LENGTH);
    let cipher = crypto.createCipheriv(algorithm, keyBuffer, iv);
    let encrypted = cipher.update(contentMessage, 'utf8', 'hex');
    encrypted += cipher.final('hex');
    messageEncrypted = iv.toString('hex') + ':' + encrypted;


    let message = new MessageModel.messageModel({
        conversation_id: conversationID,
        sender_id: senderID,
        message_type: messageType,
        message: messageEncrypted,
        created_at: timestamp
    });

    try {
        await message.save()
        // console.log(`message: ${message}`);
        return res.send({ dataMessage: message, message: "chat success", code: 1, time: timestamp });
    } catch (e) {
        console.log(e);
        return res.send({ message: "add message fail", code: 0, time: timestamp });
    }
};

exports.getListMessage = async (req, res) => {

};
exports.getMessageById = async (req, res) => {

};

exports.getMessageByIDConversation = async (req, res) => {
    let date = new Date();
    let specificTimeZone = 'Asia/Ha_Noi';
    let timestamp = moment(date).tz(specificTimeZone).format("YYYY-MM-DD-HH:mm:ss")

    let conversationID = req.body.conversationID;
    if (conversationID == null || conversationID.length <= 0) {
        return res.send({ message: "conversationID is required" })
    }

    try {
        const dataMessage = await MessageModel.messageModel.find({ conversation_id: conversationID })
        if (!dataMessage) {
            return res.send({ message: "message not found", code: 0, time: timestamp });
        }
        return res.send({ dataMessage: dataMessage, message: "get message success", code: 1, time: timestamp })
    } catch (e) {
        console.log(e.message);
        return res.send({ message: "get message fail", code: 0, time: timestamp });
    }
}
exports.getMessageLatest = async (req, res) => {
    let date = new Date();
    let specificTimeZone = 'Asia/Ha_Noi';
    let timestamp = moment(date).tz(specificTimeZone).format("YYYY-MM-DD-HH:mm:ss")

    let conversationIDs = req.body.conversationIDs;
    if (conversationIDs == null || conversationIDs.length <= 0) {
        return res.send({ message: "conversationIDs is required" })
    }


    try {
        const latestMessages = [];
        for (const conversationId of conversationIDs) {
            // Tìm tin nhắn mới nhất cho conversation hiện tại
            const latestMessage = await MessageModel.messageModel.findOne({ conversation: conversationId })
                .sort({ timestamp: -1 })
                .populate("conversation")
                // .populate("conversation", "name") // Populate thông tin của conversation (chỉ lấy trường "name")
                .exec();

            if (latestMessage) {
                latestMessages.push(latestMessage);
            }
        }
        return res.send({ dataMessage: latestMessages, message: "get conversation + message success", code: 1, time: timestamp })
    } catch (e) {
        console.log(e.message);
        return res.send({ message: "get message fail", code: 0, time: timestamp });
    }
};

exports.deleteMessage = async (req, res) => {
    let date = new Date();
    let specificTimeZone = 'Asia/Ha_Noi';
    let timestamp = moment(date).tz(specificTimeZone).format("YYYY-MM-DD-HH:mm:ss")

    let idMessage = req.body.msgID;
    let userLoggedID = req.body.userLoggedID;
    if (idMessage == null || idMessage.length <= 0) {
        return res.send({ message: "idMessage is required" })
    }

    try {
        let message = await MessageModel.messageModel.findById({ _id: idMessage });
        if (message.sender_id != userLoggedID) {
            return res.send({ message: "You can only delete your messages", code: 0 });
        }
        else {
            let message = await MessageModel.messageModel.findByIdAndUpdate(idMessage, { deleted_at: timestamp });
            if (!message) {
                return res.send({ message: "message not found", code: 0 })
            }
            return res.send({ message: message._id, code: 1 });
        }
    } catch (e) {
        console.log(e.message);
        return res.send({ message: e.message.toString(), code: 0, time: timestamp });
    }
};

exports.updateStatusMessage = async (req, res) => {
    let date = new Date();
    let specificTimeZone = 'Asia/Ha_Noi';
    let timestamp = moment(date).tz(specificTimeZone).format("YYYY-MM-DD-HH:mm:ss")

    let idMessage = req.body.msgID;
    let status = req.body.status;
    if (idMessage == null || idMessage.length <= 0) {
        return res.send({ message: "idMessage is required" })
    }
    if (status == null || status.length <= 0) {
        return res.send({ message: "status is required" })
    }
    let newStatus = '';
    switch (status) {
        case "unseen":
            newStatus = "seen"
            break;

        default:
            newStatus = status
            break;
    }

    try {
        let messageUpdate = await MessageModel.messageModel.findByIdAndUpdate(idMessage, { status: newStatus });
        if (!messageUpdate) {
            return res.send({ message: "message not found" })
        }
        return res.send({ message: "update status message success", code: 1, time: timestamp })
    } catch (e) {
        console.log(e.message);
        return res.send({ dataMessage: messageUpdate, message: e.message.toString(), code: 0, time: timestamp });
    }
};
exports.editMessage = async (req, res) => {

}