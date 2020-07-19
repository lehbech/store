var express = require('express');
var router = express.Router();
var controllers = require('./app/controllers');
var helpers = require('./app/helpers');
var localFileStorage = require('./app/helpers/localFileStorage');
// var s3Upload = helpers.aws.s3Init();
var s3Upload = localFileStorage.upload();
// var s3Upload = localFileStorage.upload();
//     ____              __
//    / __ \____  __  __/ /____  _____
//   / /_/ / __ \/ / / / __/ _ \/ ___/
//  / _, _/ /_/ / /_/ / /_/  __(__  )
// /_/ |_|\____/\__,_/\__/\___/____/

router.get('/', controllers.UserController.welcome);
router.post('/user/login', controllers.UserController.login);
router.post('/user/register', controllers.UserController.register);
router.post('/user/resend-activation-email', controllers.UserController.resendEmail);
router.get('/user/activate', controllers.UserController.activate);
router.get('/user/getProfile', controllers.UserController.getProfile);
router.put('/user/updateProfile', controllers.UserController.updateProfile);
router.post('/user/customercare', controllers.UserController.receivecustomercare);
router.post('/user/addstore', controllers.UserController.addstore);
router.get('/user/getstore', controllers.UserController.getAllstore);
router.post('/user/activatedeactivatestore', controllers.UserController.activatedeactivate);
router.delete('/user/deleteStore', controllers.UserController.deleteStore);
router.get('/user/getStoreById', controllers.UserController.getStoreById);
router.post('/user/searchProduct', controllers.UserController.searchProduct);
router.get('/getAllCategory', controllers.UserController.getAllCategory);
router.get('/getAllSubCategory', controllers.UserController.getAllSubCategory);

router.get('/getAllBrand', controllers.UserController.getAllBrand);
router.post('/user/requestBrand', controllers.UserController.requestBrand);

router.post('/user/reset-password', controllers.UserController.resetPassword);
router.post('/user/change-password', controllers.UserController.changePassword);
router.post('/user/verifyToken', controllers.UserController.verifyToken);

router.get('/getState', controllers.UserController.getState);
router.get('/getCities', controllers.UserController.getCities);

// JWT Secured
router.post('/admin/login', controllers.AdminController.login);
router.post('/admin/image-upload', s3Upload.array('image', 1), controllers.AdminController.imageUpload);
router.post('/admin/changeAdminPassword', controllers.AdminController.changeAdminPassword);

router.post('/admin/addBrand', controllers.AdminController.addBrand);
router.get('/admin/getBrand', controllers.AdminController.getAllBrand);
router.post('/admin/getBrandById', controllers.AdminController.getBrandById);
router.delete('/admin/deleteBrand', controllers.AdminController.deleteBrand);
router.put('/admin/updateBrand', controllers.AdminController.updateBrand);
router.get('/admin/approveBrand', controllers.AdminController.approveBrand);
router.get('/uploadProduct', controllers.AdminController.uploadProduct);
router.get('/getAllProductList', controllers.AdminController.getAllProductList);

router.get('/uploadCategory', controllers.AdminController.uploadCategory);

router.post('/admin/addCategory', controllers.AdminController.addCategory);
router.get('/admin/getCategory', controllers.AdminController.getAllCategory);
router.post('/admin/getCategoryById', controllers.AdminController.getCategoryById);
router.delete('/admin/deleteCategory', controllers.AdminController.deleteCategory);
router.put('/admin/updateCategory', controllers.AdminController.updateCategory);

router.post('/admin/addSubCategory', controllers.AdminController.addSubCategory);
router.get('/admin/getsubCategory', controllers.AdminController.getAllsubCategory);
router.post('/admin/getsubCategoryById', controllers.AdminController.getsubCategoryById);
router.delete('/admin/deletesubCategory', controllers.AdminController.deletesubCategory);
router.put('/admin/updatesubCategory', controllers.AdminController.updatesubCategory);

router.post('/admin/addproduct', controllers.AdminController.addproduct);
router.get('/admin/getproduct', controllers.AdminController.getAllproduct);
router.post('/admin/getproductById', controllers.AdminController.getproductById);
router.delete('/admin/deleteproduct', controllers.AdminController.deleteproduct);
router.put('/admin/updateproduct', controllers.AdminController.updateproduct);

router.post('/admin/addstore', controllers.AdminController.addstore);
router.get('/admin/getstore', controllers.AdminController.getAllstore);
router.post('/admin/getstoreById', controllers.AdminController.getstoreById);
router.delete('/admin/deletestore', controllers.AdminController.deletestore);
router.put('/admin/updatestore', controllers.AdminController.updatestore);

router.post('/user/addcart', controllers.AdminController.addcart);
router.get('/user/getcart', controllers.AdminController.getAllcart);
router.post('/user/getcartById', controllers.AdminController.getcartById);
router.post('/user/getcartByUserId', controllers.AdminController.getcartUserId);
router.delete('/user/deletecart', controllers.AdminController.deletecart);
router.put('/user/updatecart', controllers.AdminController.updatecart);

/*
 ** Admin Routes
 */
router.get('/admin/productcount', controllers.AdminController.getProductCount);
router.get('/admin/paymentcount', controllers.AdminController.getpaymentCount);
router.get('/admin/maxminsellingproduct', controllers.AdminController.getMostSellingProduct);
router.get('/admin/sellingcount', controllers.AdminController.sellingcount);

module.exports = router;
