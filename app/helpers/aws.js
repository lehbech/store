var awsSDK = require("aws-sdk");
var multer = require("multer");
var multerS3 = require("multer-s3");
var axios = require("axios");
var path = require("path");
var lang = require("../lang");

awsSDK.config.update({
    secretAccessKey: process.env.AWS_S3_SECRET,
    accessKeyId: process.env.AWS_S3_KEY,
    region: process.env.AWS_S3_REGION
});

var aws = {
    s3Init: function () {
        var s3 = new awsSDK.S3();

        var s3Upload = multer({
            fileFilter: (req, file, cb) => {
                const filetypes = /jpeg|jpg|png/;
                const extname = filetypes.test(path.extname(file.originalname).toLowerCase());
                const mimetype = filetypes.test(file.mimetype);

                if (mimetype && extname) {
                    return cb(null, true);
                } else {
                    return cb(new Error(lang.user.message.error.imageType));
                }
            },
            // storage: multerS3({
            //     s3: s3,
            //     bucket: process.env.AWS_S3_BUCKET,
            //     contentType: multerS3.AUTO_CONTENT_TYPE,
            //     key: function (req, file, cb) {
            //         var filename = file.originalname.split(' ').join('_');
            //         cb(null, Date.now() + "_" + filename);
            //     }
            // })
        });

        return s3Upload;
    }
}

module.exports = aws;