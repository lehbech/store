var mongoose = require("mongoose");
var validationRegx = require('./validator/schemaValidator');
var Schema = mongoose.Schema;

var storeSchema = new mongoose.Schema({
    // categoryId: [{ type: Schema.Types.ObjectId, ref: 'category' }],
    // subCategoryId: [{ type: Schema.Types.ObjectId, ref: 'subcategory' }],
    userId : [{ type: Schema.Types.ObjectId, ref: 'user' }],
    shopLicenseNumber : {type : Boolean,default:false},
    shopGSTNumber :  {type : String,default:''},
    panCardNumber : {type:String,default:''},
    state : {type:String,default:''},
    city : {type:String,default:''},
    country : {type:String,default:'India'},
    shopPlotNumber : {type:String,default:''},
    ownerName : {type:String,default:''},
    contactNo : {type:String,default:''},
    pincode : {type:String,default:''},
    address : {type:String,default:''},

    storeName: {
        type: String,
        required: true,
        validate: validationRegx.isAlphaSpace
    },
    storeImg: {
        type: Schema.Types.Mixed
    },
    addBy: {
        type: String,
        required: true,
        default: 'admin',
        validate: validationRegx.isAlphaSpace
    },
    updateBy: {
        type: String,
        required: true,
        default: 'admin',
        validate: validationRegx.isAlphaSpace
    },
    isDelete : {type :Boolean, default:false},
    active : {type :Boolean, default:true},
    created_at: {
        type: Date,
        default: Date.now

    },
    update_at: {
        type: Date,
        default: Date.now
    }

});

module.exports = storeSchema;
