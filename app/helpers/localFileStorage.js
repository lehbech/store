var multer = require("multer");
const path = require('path');
var lang = require("../lang");
var uploadFilePath = './public/upload';
var fileUpload = {

    upload: function () {


        var s3Upload = multer({
            storage: multer.diskStorage({
                destination: uploadFilePath,
                filename: function (req, file, callback) {
                    //..
                    callback(null, file.fieldname + '-' + Date.now() + path.extname(file.originalname));
                }
            }),
            fileFilter: (req, file, cb) => {
                const filetypes = /jpeg|jpg|png/;
                const extname = filetypes.test(path.extname(file.originalname).toLowerCase());
                const mimetype = filetypes.test(file.mimetype);

                if (mimetype && extname) {
                    return cb(null, true);
                } else {
                    return cb(new Error(lang.user.message.error.imageType));
                }
            }
        });

        return s3Upload;
    }
}
module.exports = fileUpload;