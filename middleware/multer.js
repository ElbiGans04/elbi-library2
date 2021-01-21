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
    disk
}