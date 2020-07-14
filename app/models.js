var mongoose = require("mongoose");
var contantObj = require("../constant");
mongoose.connect(contantObj.MONGO_URL, {
  useNewUrlParser: true,
  useCreateIndex: false,
  useUnifiedTopology: true
});

mongoose.set('runValidators', true);

var user = require('./models/user');
var category = require("./models/category");
var subCategory = require("./models/sub-category");
var product = require("./models/product");
var store = require("./models/store");
var cart = require("./models/cart");
var customercare = require("./models/customercare");
var brand = require("./models/brand");

var database = {
  "user": mongoose.model("user", user),
  "category": mongoose.model("category", category),
  "subCategory": mongoose.model("subCategory", subCategory),
  "product": mongoose.model("product", product),
  "cart": mongoose.model("cart", cart),
  "store": mongoose.model("store", store),
  "customercare": mongoose.model('customercare', customercare),
  "brand": mongoose.model('brand', brand),
}


module.exports = database;