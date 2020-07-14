var mongoose = require('mongoose');
var schemaValidator = require('./validator/schemaValidator');
var Mixed = mongoose.Schema.Types.Mixed;

const collectionSchema = new mongoose.Schema({
  fullname: {
    type: String,
    required: true,
    validator: schemaValidator.isAlphaNumericSpace
  },
  username: {
    type: String,
    required: true,
    validator: schemaValidator.isUsername
  },
  email: {
    type: String,
    required: true,
    validator: schemaValidator.isEmail
  },
  password: {
    type: String,
    required: true
  },
  address: {
    type: String,
    required: true
  },
  city: {
    type: String,
    required: true,
    validator: schemaValidator.isAlphaSpace
  },
  state: {
    type: String,
    required: true,
    validator: schemaValidator.isAlphaSpace
  },
  country: {
    type: String,
    required: true
  },
  postal_code: {
    type: String,
    required: true
  },
  phone_number: {
    type: String,
    required: true
  },
  role: {
    type: String,
    default: "user"
  },
  active: {
    type: Boolean,
    default: false
  },
  disabled: {
    type: Boolean,
    default: false
  },
  nonce: String,
  created_at: Date,
  updated_at: {
    type: Date,
    default: Date.now
  }
});

module.exports = collectionSchema;