var mongoose = require('mongoose');
var validationRegx = require('./validator/schemaValidator');
var Schema = mongoose.Schema;

var orderSchema = new mongoose.Schema({
    productId: {
        type: Schema.Types.ObjectId,
        ref: 'product'
    },
    userId: {
        type: Schema.Types.ObjectId,
        ref: 'user'
    },
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
    paymentType: {
        type: String,
        required: true,
        enum: ['online', 'offline'],
        default: 'offline'
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

module.exports = orderSchema;
