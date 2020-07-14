var UserController = require('./controllers/UserController');
var AdminController = require('./controllers/AdminController');
var category = require("./controllers/category");

var controllers = {
  "UserController": UserController,
  "AdminController": AdminController,
  "category": category,
}

module.exports = controllers;