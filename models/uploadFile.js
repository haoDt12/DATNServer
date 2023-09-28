const fs = require("fs");
const path = require("path");
const {randomUUID} = require("crypto");
exports.uploadFile = (req, res, id, folder) => {
    return new Promise((resolve, reject) => {
        let uploadDir = path.join(__dirname, `../public/images/${folder}`, id);
        if (!fs.existsSync(uploadDir)) {
            fs.mkdirSync(uploadDir, {recursive: true});
        }
        let fileItem = req.file;
        if (!fileItem) {
            return reject("0");
        }
        let filePath = path.join(uploadDir, randomUUID() + ".jpg");
        fs.rename(fileItem.path, filePath, (err) => {
            if (err) {
                console.log(err.message);
                return reject("0");
            } else {
                fs.readdir(uploadDir, async (err, files) => {
                    if (err) {
                        console.log(err.message);
                        return reject("0");
                    }
                    const imageUrls = files.map((file) => {
                        return `${req.protocol}://${req.get(
                            "host"
                        )}/images/${folder}/${id}/${file}`;
                    });
                    return resolve(imageUrls.toString());
                });
            }
        });
    });
}
exports.deleteFile = (res, pathImgDelete) => {
    fs.unlink(path.join(__dirname, "../public" + pathImgDelete), (err) => {
        if (err) {
            console.log(err);
            return res.send({message: "Delete file fail", code: 0});
        } else {
            console.log("delete success");
        }
    });
}