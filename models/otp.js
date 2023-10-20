require('dotenv').config()
const nodemailer = require('nodemailer');
const otpGenerator = require('otp-generator')
const transporter = nodemailer.createTransport({
    service: 'Gmail', // Sử dụng dịch vụ email của Gmail
    auth: {
        user: process.env.USERNAME_EMAIL, // Điền email của bạn ở đây
        pass: process.env.PASS_EMAIL, // Điền mật khẩu email của bạn ở đây
    },
});

// Hàm tạo mã OTP
const generateOTP = () => {
    return otpGenerator.generate(6, {digits: true, alphabets: false, upperCase: false, specialChars: false});
};

// Gửi email chứa mã OTP
const sendOTPByEmail = (email) => {
    const otp = generateOTP();
    let index = otp;
    const mailOptions = {
        from: process.env.USERNAME_EMAIL, // Điền email của bạn
        to: email, // Điền email của người nhận
        subject: 'Mã OTP của bạn',
        text: `Mã OTP của bạn là: ${otp}`,
    };

    // Gửi email
    transporter.sendMail(mailOptions, (error, info) => {
        if (error) {
            index = 0;
        }
    });
    return index;
};
module.exports = {sendOTPByEmail};