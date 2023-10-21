require('dotenv').config()
const nodemailer = require('nodemailer');
const otp = Math.floor(100000 + Math.random() * 900000);
const text = `STECH xin chào bạn \n Mã OTP của bạn là: ${otp} \n Vui lòng không cung cấp mã OTP cho bất kì ai`;
const transporter = nodemailer.createTransport({
    service: 'Gmail',
    auth: {
        user: process.env.USERNAME_EMAIL,
        pass: process.env.PASS_EMAIL,
    },
});

const sendOTPByEmail = (email) => {
    let index = otp;
    const mailOptions = {
        from: process.env.USERNAME_EMAIL,
        to: email,
        subject: 'STECH Xin Chào Bạn',
        text: text,
    };

    transporter.sendMail(mailOptions, (error) => {
        if (error) {
            index = 0;
        }
    });
    return index;
};
module.exports = {sendOTPByEmail};