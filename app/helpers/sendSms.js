
var constant = require("../../constant");
var accountSid = constant.accountSid; // Your Account SID from www.twilio.com/console
var authToken = constant.authToken;   // Your Auth Token from www.twilio.com/console

var twilio = require('twilio');
var client = new twilio(accountSid, authToken);


var obj = {
    smsSend: function (mobile, price) {
        // console.log('sms function working');

        client.messages.create({
            body: 'Your order confirmed with us, total amount : ' + price + 'rs, we will deliver soon',
            to: '+91' + mobile,  // Text this number
            from: '+14242197830' // From a valid Twilio number
        })
            .then((message) => console.log('message=>', message))
            .catch((error) => {
                console.log(error);

            });
    }
}

module.exports = obj;
