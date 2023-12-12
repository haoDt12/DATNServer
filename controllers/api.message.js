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
    let date = new Date();
    let timestamp = moment(date).format("YYYY-MM-DD-HH:mm:ss");

    let conversation = req.body.conversation;
    let senderId = req.body.senderId;
    let receiverId = req.body.receiverId;
    let contentMessage = req.body.message;
    let fileUpload;
    let imageUpload;
    let videoUpload;

    try {
        // if (req.files["filess"]) {
        fileUpload = req.files["filess"];
        // }
        // if (req.files["images"]) {
        console.log("+++++++++++++++");
        imageUpload = req.files["images"];
        // }
        // if (req.files["video"]) {
        videoUpload = req.files["video"];
        // }

    } catch (e) {
        console.log(`api.message: ${e.message} at ${timestamp}`);
        return res.send({ message: "error read fields file upload", code: 0 });
    }

    console.log("============");
    console.log(imageUpload);

    let isSendFile = false;
    let isSendImage = false;
    let isSendVideo = false;
    if (fileUpload !== undefined) {
        isSendFile = true;
    }
    if (imageUpload !== undefined) {
        isSendImage = true;
    }
    if (videoUpload !== undefined) {
        isSendVideo = true;
    }

    if (conversation == null) {
        return res.send({ message: "conversation is required", code: 0 });
    }
    if (senderId == null || senderId.length == 0) {
        return res.send({ message: "senderId is required", code: 0 });
    }
    if (receiverId == null || receiverId.length == 0) {
        return res.send({ message: "receiverId is required", code: 0 });
    }

    if (timestamp == null) {
        return res.send({ message: "error get time", code: 0 });
    }

    if (contentMessage == null || contentMessage.length == 0) {
        if (!isSendFile && !isSendImage && !isSendVideo) {
            console.log("send message or file or image or video");
            console.log(isSendFile, isSendImage, isSendVideo);
            return res.send({ message: "send message or file or image or video", code: 0 });
        }
        else {
            console.log("anony erorr api message");
        }
    }

    let isFormat = true;
    if (isSendFile) {
        // check file
    }
    if (isSendImage) {
        imageUpload.map((item) => {
            if (matchImg.indexOf(item.mimetype) === -1) {
                isFormat = false;
            }
        });
    }
    if (isSendVideo) {
        if (matchVideo.indexOf(videoUpload[0].mimetype) === -1) {
            isFormat = false;
        }
    }

    if (isFormat === false) {
        return res.send({
            message: "The uploaded file is not in the correct format",
            code: 0,
        });
    }



    let message = new MessageModel.messageModel({
        conversation: conversation,
        senderId: senderId,
        receiverId: receiverId,
        message: contentMessage,
        status: "unseen",
        deleted: false,
        video: "",
        timestamp: timestamp
    });
    console.log(isSendFile, isSendImage, isSendVideo);
    if (!isSendFile && !isSendImage && !isSendVideo) {
        // send no message
    }
    else {
        if (isSendFile) {
            try {
                let list_file = await UploadFile.uploadFiles(
                    req,
                    message._id.toString(),
                    `messages/${message.conversation}/files`,
                    fileUpload,
                    ".json"
                );
                if (list_file === 0) {
                    return res.send({ message: "upload file fail", code: 0 });
                }
                message.filess = list_file;
            } catch (e) {
                console.log(e);
                return res.send({ message: e.message.toString(), code: 0 });
            }
        }
        if (isSendImage) {
            try {
                let list_img = await UploadFile.uploadFiles(
                    req,
                    message._id.toString(),
                    `messages/${message.conversation}/images`,
                    imageUpload,
                    ".jpg"
                );
                if (list_img === 0) {
                    return res.send({ message: "upload image fail", code: 0 });
                }
                message.images = list_img;
            } catch (e) {
                console.log(e);
                return res.send({ message: e.message.toString(), code: 0 });
            }
        }
        if (isSendVideo) {
            try {
                let video = await UploadFile.uploadFile(
                    req,
                    message._id.toString(),
                    `messages/${message.conversation}/videos`,
                    videoUpload[0],
                    ".mp4"
                );
                if (video === 0) {
                    return res.send({ message: "upload video fail", code: 0 });
                }
                message.video = video;
            } catch (e) {
                console.log(e);
                return res.send({ message: e.message.toString(), code: 0 });
            }
        }
    }

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