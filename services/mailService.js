const nodemailer = require('nodemailer');
require("dotenv").config();

// 관리자 정보
const email = {
    host: "localhost:4000",
    service: 'naver',
    auth: {
        user: process.env.NODE_EMAIL,
        pass: process.env.NODE_PASSWORD
    }
};

const send = async (option) => {
    nodemailer.createTransport(email).sendMail(option, (err, info) => {
        if (err) return console.log(err);
        else return info.response;
    });
};

let mail_data = {
    from: 'junhyeok403@naver.com',
    to: 'junhyeok403@naver.com',
    subject: '텍스트',
    html: '노드JS'
}

module.exports = {
    email: email,
    mail_data: mail_data
}