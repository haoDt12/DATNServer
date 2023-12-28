const admin = require('firebase-admin');
const { v4: uuidv4 } = require('uuid');

// Cấu hình Firebase Admin SDK
if (admin.apps.length === 0) {
    const serviceAccount = require('../serviceaccountkey/datn-789e4-firebase-adminsdk-nbmof-b859cb4d1d.json');
    admin.initializeApp({
        credential: admin.credential.cert(serviceAccount),
    });
}

const bucket = admin.storage().bucket('gs://datn-789e4.appspot.com');

exports.uploadFile = async (req, id, folder, fileItem) => {
    return new Promise(async (resolve, reject) => {
        try {
            if (!fileItem) {
                return reject("0");
            }

            const destinationPath = `${folder}/${id}/${uuidv4()}`;
            const file = bucket.file(destinationPath);

            await file.save(fileItem.buffer, {
                metadata: { contentType: fileItem.mimetype },
            });
            const token = uuidv4();
            const encodedPath = encodeURIComponent(destinationPath);
            const imageUrl = `https://firebasestorage.googleapis.com/v0/b/${bucket.name}/o/${encodedPath}?alt=media&token=${token}`;

            resolve(imageUrl);
        } catch (e) {
            console.log(e.message);
            reject("0");
        }
    });
};

exports.uploadFiles = async (req, id, folder, files, fileExtension) => {
    return new Promise(async (resolve, reject) => {
        try {
            if (!files || !Array.isArray(files) || files.length === 0) {
                return reject("0");
            }

            const uploadedUrls = [];

            for (const fileItem of files) {
                if (!fileItem) {
                    continue;
                }

                const destinationPath = `${folder}/${id}/${uuidv4()}`;
                const file = bucket.file(destinationPath);

                await file.save(fileItem.buffer, {
                    metadata: { contentType: fileItem.mimetype },
                });

                const token = uuidv4();
                const encodedPath = encodeURIComponent(destinationPath);
                const imageUrl = `https://firebasestorage.googleapis.com/v0/b/${bucket.name}/o${encodedPath}?alt=media&token=${token}`;
                uploadedUrls.push(imageUrl);
            }

            resolve(uploadedUrls);
        } catch (error) {
            console.error(error.message);
            return reject("0");
        }
    });
};