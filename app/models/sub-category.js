var mongoose = require("mongoose");
var Schema = mongoose.Schema;
var schemaValidator = require("./validator/schemaValidator");
var subCategorySchema = new mongoose.Schema({
    categoryId: { type: Schema.Types.ObjectId, ref: "category" },
    subCategoryName: {
        type: String,
        required: true,
        // validate: schemaValidator.isAlphaOnly
    },
    image : { type:String, default:''},
    addBy: {
        type: String,
        default: 'admin'
    },
    updateBy: {
        type: String,
        default: 'admin'
    },
    created_at: {
        type: Date,
        default: Date.now
    },
    updated_at: {
        type: Date,
        default: Date.now
    }
});

module.exports = subCategorySchema;