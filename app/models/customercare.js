var mongoose = require('mongoose');
var schemaValidator = require('./validator/schemaValidator');
var Mixed = mongoose.Schema.Types.Mixed;

const collectionSchema = new mongoose.Schema({
  // fullname: {
  //   type: String,
  //   required: true,
  //   validator: schemaValidator.isAlphaNumericSpace
  // },

  // email: {
  //   type: String,
  //   required: true,
  //   validator: schemaValidator.isEmail
  // },

  // phone_number: {
  //   type: String,
  //   required: true
  // },
  
  description: {
    type: String,
    required: true,
  },
  subject: {
    type: String,
    required: true,
  },

  created_at: Date,
  updated_at: {
    type: Date,
    default: Date.now
  }
});

module.exports = collectionSchema;