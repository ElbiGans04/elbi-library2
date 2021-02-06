const nodemailer = require('nodemailer');
module.exports = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: 'elbijr2@gmail.com',
        pass: 'elbiakunyoutube04'
    }
});