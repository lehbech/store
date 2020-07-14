var mongoose = require("mongoose");
var schemaValidator = require('./validator/schemaValidator');


var categotySchema = new mongoose.Schema({
    categoryName: {
        type: String,
        required: true,
        validate: schemaValidator.isAlphaSpace
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

module.exports = categotySchema;