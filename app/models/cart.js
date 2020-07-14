var mongoose = require("mongoose");
var validationRegx = require("./validator/schemaValidator");
var Schema = mongoose.Schema;

var cartSchema = new mongoose.Schema({
    productId: { type: Schema.Types.ObjectId, ref: 'product' },
    userId: { type: Schema.Types.ObjectId, ref: 'user' },
    productName: {
        type: String,
        required: true,
        validate: validationRegx.isAlphaSpace
    },
    quantity: {
        type: String,
        required: true
    },
    addBy: {
        type: String,
        required: true,
        default: 'user',
        validate: validationRegx.isAlphaSpace
    },
    updateBy: {
        type: String,
        required: true,
        default: 'user',
        validate: validationRegx.isAlphaSpace
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

module.exports = cartSchema;
