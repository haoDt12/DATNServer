const BannerModel = require("../models/model.banner");
const UploadFile = require("../models/uploadFile");
const match = [
    "image/jpeg",
    "image/*",
    "image/png",
    "image/gif",
    "image/bmp",
    "image/tiff",
    "image/webp",
    "image/svg+xml",
    "image/x-icon",
    "image/jp2",
    "image/heif",
];
exports.addBanner = async (req, res) => {
    let file = req.file;
    console.log(file);
    if (file == null) {
        return res.send({message: "image is required", code: 0});
    }
    if (match.indexOf(file.mimetype) === -1) {
        return res.send({
            message: "The uploaded file is not in the correct format",
            code: 0,
        });
    }
    try {
        let banner = new BannerModel.bannerModel();
        let statusCode = await UploadFile.uploadFile(req, banner._id.toString(), "banner", file, ".jpg");
        if (statusCode === 0) {
            return res.send({message: "Upload file fail", code: 0});
        } else {
            banner.img = statusCode;
        }
        await banner.save();
        return res.send({message: "Add banner success", code: 1});
    } catch (e) {
        console.log(e);
        return res.send({message: "Add banner fail", code: 0});
    }
}
exports.editBanner = async (req, res) => {
    let bannerId = req.body.bannerId;
    let file = req.file;
    if (bannerId == null) {
        return res.send({message: "banner id is required", code: 0});
    }
    try {
        let banner = await BannerModel.bannerModel.findById(bannerId);
        if(!banner){
            return res.send({message: "banner not found", code: 0});
        }
        let pathDelete = banner.img.split("app");
        if (file !== null) {
            if (match.indexOf(file.mimetype) === -1) {
                return res.send({
                    message: "The uploaded file is not in the correct format",
                    code: 0,
                });
            }
            UploadFile.deleteFile(res, pathDelete);
            let statusCode = await UploadFile.uploadFile(req, banner._id.toString(), "banner", file, ".jpg");
            if (statusCode === 0) {
                return res.send({message: "Upload file fail", code: 0});
            } else {
                banner.img = statusCode;
            }
        }
        await banner.save();
        return res.send({message: "Edit banner success", code: 1});
    } catch (e) {
        console.log(e);
        return res.send({message: "Edit banner fail", code: 0});
    }
}
exports.deleteBanner = async (req, res) => {
    let bannerId = req.body.bannerId;
    if (bannerId == null) {
        return res.send({message: "banner id is required", code: 0});
    }
    try {
        let banner = await BannerModel.bannerModel.findById(bannerId);
        if(!banner){
            return res.send({message: "banner not found", code: 0});
        }
        let pathDelete = banner.img.split("app")[1];
        UploadFile.deleteFile(res, pathDelete);
        await BannerModel.bannerModel.deleteOne({_id: bannerId});
        return res.send({message: "delete banner success", code: 1});
    } catch (e) {
        return res.send({message: "delete banner fail", code: 0});
    }
}
exports.getLisBanner = async (req, res) => {
    try {
        let banner = await BannerModel.bannerModel.find();
        return res.send({message: "get list banner success", code: 1, banner: banner});
    } catch (e) {
        console.log(e)
        return res.send({message: "get list banner fail", code: 0});
    }
}