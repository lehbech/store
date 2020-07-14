var jsonwebtoken = require('jsonwebtoken');
var randomstring = require('randomstring');
var contantObj = require("../../constant")
var jwt = {
  issueJWT: function (user) {
    console.log("user", user);

    var payload = {
      id: user.id,
      email: user.email,
      username: user.username,
      role: user.role
    }
    console.log("payload", payload);

    var options = {
      audience: contantObj.JWT_AUDIENCE,// 'NoDeGeNeRaToR',// contantObj.JWT_AUDIENCE,
      expiresIn: contantObj.JWT_EXPIRY,//'10h',// contantObj.JWT_EXPIRY,
    }
    console.log("options", options);

    var jwtToken = jsonwebtoken.sign(payload, contantObj.JWT_KEY, options);
    return jwtToken;
  },
  verifyJWT: function (bearer) {
    var token = bearer.split(" ")[1];

    var verify = jsonwebtoken.verify(token, contantObj.JWT_KEY, {
      audience: contantObj.JWT_AUDIENCE
    });

    return verify;
  },
  generateNonce: function () {
    return randomstring.generate({
      length: 32,
      charset: 'alphabetic',
      readable: true
    });
  }
}

module.exports = jwt;