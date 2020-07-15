var mongoose = require('mongoose');
var schemaValidator = require('./validator/schemaValidator');

var brandSchema = new mongoose.Schema({
    brandName: {
        type: String,
        required: true,
        validate: schemaValidator.isAlphaSpace
    },
    isRequested: { type: Boolean, default: false },
    image: { type: String, default: '' },
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

module.exports = brandSchema;
