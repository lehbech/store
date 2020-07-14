var validate = require("mongoose-validator");

var schemaValidator = {
  "isAlpha": [
    validate({
      validator: "isLength",
      arguments: [5, 100],
      message: "Should be between {ARGS[0]} and {ARGS[1]} characters"
    }),
    validate({
      validator: "isAlpha",
      passIfEmpty: true,
      message: "Should contain alphabets characters only"
    })
  ],
  "isAlphaOnly": [
    validate({
      validator: "isAlpha",
      passIfEmpty: true,
      message: "Should contain alphabets characters only"
    })
  ],
  "isAlphaSpace": [
    validate({
      validator: "matches",
      arguments: /^[a-zA-Z ]*$/,
      message: "Should contain alphabets characters only with whitespace"
    })
  ],
  "isAlphaNumeric": [
    validate({
      validator: "isLength",
      arguments: [2, 30],
      message: "Should be between {ARGS[0]} and {ARGS[1]} characters"
    }),
    validate({
      validator: "isAlphanumeric",
      message: "Should contain alpha-numeric characters only"
    })
  ],
  "isAlphaNumericSpace": [
    validate({
      validator: "matches",
      arguments: /^[a-zA-Z ]*$/,
      message: "Should contain alphabets characters only with whitespace"
    }),
    validate({
      validator: "isAlphanumeric",
      message: "Should contain alpha-numeric characters only"
    })
  ],
  "isUsername": [
    validate({
      validator: "isLength",
      arguments: [2, 30],
      message: "Should be between {ARGS[0]} and {ARGS[1]} characters"
    }),
    validate({
      validator: "matches",
      arguments: /^[a-zA-Z0-9_.]*$/,
      message: "Should contain alphabets characters with allowed character as underscore and a dot"
    })
  ],
  "isEmail": [
    validate({
      validator: "isEmail",
      message: "Entered Email is not valid"
    }),
    validate({
      validator: "normalizeEmail"
    })
  ],
  "isUrl": [
    validate({
      validator: "isURL",
      passIfEmpty: true,
      message: "Should contain a valid URL"
    })
  ],
  "isPostalCode": [
    validate({
      validator: "isPostalCode",
      arguments: "any",
      message: "Entered Postal Code is not a valid"
    })
  ],
  "isPhone": [
    validate({
      validator: "isNumeric",
      passIfEmpty: true,
      arguments: "any",
      message: "Enter Phone Number should be numeric"
    }),
    validate({
      validator: "isLength",
      passIfEmpty: true,
      arguments: [10, 16],
      message: "Should be between {ARGS[0]} and {ARGS[1]} characters"
    }),
    validate({
      validator: "isMobilePhone",
      passIfEmpty: true,
      arguments: "any",
      message: "Entered Phone Number is not a valid"
    })
  ]
}

module.exports = schemaValidator;