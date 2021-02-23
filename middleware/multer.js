const multer = require('multer');
const path = require('path');

const disk = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, path.resolve(__dirname, '../tmp/img'));
    }, 
    filename: function (req, file, cb) {
        cb(null, `elbiLibrary-${file.fieldname}-${Date.now()}`);
    }
});



module.exports = {
    multer: multer,
    disk,
    validasiMulter: function (req, file, callback) {
        let ext = path.extname(file.originalname);
        if(ext !== '.png' && ext !== '.jpg' && ext !== '.gif' && ext !== '.jpeg') {
            return callback(new Error('Only images are allowed'))
        }
        callback(null, true)
    },
    limits:{
        fileSize: 1024 * 1024
    }
}