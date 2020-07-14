var mongoose = require("mongoose");
var validatorReqx = require("./validator/schemaValidator");
var Schema = mongoose.Schema;
var Mixed = mongoose.Schema.Types.Mixed;
var productSchema = new mongoose.Schema({
    categoryID: [{ type: Schema.Types.ObjectId, ref: 'category' }],
    subCategoryId: [{ type: Schema.Types.ObjectId, ref: 'subcategory',default: '' }],
    brand: [{ type: Schema.Types.ObjectId, ref: 'subcategory',default: '' }],
    productName: {
        type: String,
        required: true,
        validate: validatorReqx.isAlphaSpace
    },
    productImage: {
        type: Mixed
    },
    mrp:{type:String,default:''},
    sellingPrice:{type:String,default:''},
    currency:{type:String,default:''},
   
    weight:{type:String,default:''},
    unit:{type:String,default:''},
    quantity:{type:String,default:''},
    containerType:{type:String,default:''},
    minQuantity:{type:String,default:''},
    isDelete : {type:Boolean,default:false},
    addBy: {
        type: String,
        required: true,
        default: 'admin',
        validate: validatorReqx.isAlphaSpace
    },
    updateBy: {
        type: String,
        required: true,
        default: 'admin',
        validate: validatorReqx.isAlphaSpace
    },
    created_at: {
        type: Date,
        default: Date.now

    },
    update_at: {
        type: Date,
        default: Date.now
    }

});

module.exports = productSchema;