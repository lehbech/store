var lang = require('../lang');
var models = require('../models');
var helpers = require('../helpers');
var bcrypt = require('bcryptjs');
var mongoose = require('mongoose');
const { GoogleSpreadsheet } = require('google-spreadsheet');

var methods = {
  /**
   * @typedef login
   * @property {string} email.required - email - eg: admin@mailinator.com
   * @property {string} password.required - password - eg: admin@123
   */
  /**
   * Request to Issue JWT token for Users
   * @group Admin
   * @route POST /admin/login
   * @param {login.model} login.body.required
   */
  login: async function (req, res) {
    try {
      var response = await models.user.findOne({
        email: req.body.email
      });

      if (response && bcrypt.compareSync(req.body.password, response.password)) {
        var issueToken = helpers.jwt.issueJWT({
          id: response._id,
          username: response.username,
          email: response.email,
          role: response.role
        });

        if (!response.active) {
          throw ({
            status: 400,
            message: lang.user.message.error.active
          });
        } else {
          res.json({
            status: res.statusCode,
            message: lang.user.message.success.login,
            data: {
              token: issueToken
            }
          });
        }

      } else {
        throw ({
          status: 400,
          message: lang.user.message.error.login
        });
      }
    } catch (err) {
      res.json({
        status: err.status,
        message: err.message
      });
    }
  },

  /**
   * @typedef changeAdminPassword
   * @property {String} currentPassword.required - Current Admin Password - eg: 123123123
   * @property {String} password.required - Admin Password - eg: 123123123
   * @property {String} confirmPassword.required - Admin Password Confirm - eg: 123123123
   */
  /**
   * Request to change the password for the account
*    @group Admin
   * @route POST /admin/changeAdminPassword
   * @param {changeAdminPassword.model} changeAdminPassword.body.required
   * @security JWT
   */
  changeAdminPassword: async function (req, res) {
    try {
      var user = helpers.jwt.verifyJWT(req.headers.authorization);

      var check = await models.user.findOne({
        _id: user.id
      }, {
        password: 1
      });

      if (bcrypt.compareSync(req.body.currentPassword, check.password)) {
        if (req.body.password == req.body.confirmPassword) {
          var response = await models.user.findOneAndUpdate({
            _id: user.id
          }, {
            $set: {
              password: bcrypt.hashSync(req.body.password, 10)
            }
          })

          if (response) {
            res.json({
              status: res.statusCode,
              message: lang.user.message.success.changePassword
            });
          } else {
            throw ({
              status: res.statusCode,
              message: lang.user.message.error.changePassword
            });
          }
        } else {
          throw ({
            status: res.statusCode,
            message: lang.user.message.error.matchPassword
          });
        }
      } else {
        throw ({
          status: 400,
          message: "current password is incorrect"
        })
      }

    } catch (err) {
      res.json({
        status: err.status,
        message: err.message
      });
    }
  },
  /**
  * Request to Upload an Image to Amazon S3
  * @group Admin
  * @route POST /admin/image-upload
  * @param {file} image.formData
  * @security JWT
  */
  imageUpload: async function (req, res, next) {
    var user = helpers.jwt.verifyJWT(req.headers.authorization);

    console.log(req.files);

    res.json({
      status: res.statusCode,
      message: lang.user.message.success.imageUpload,
      data: {
        image: 'upload/' + req.files[0].filename
      }
    });
  },
  /**
     * @typedef addCategory
     * @property {string} categoryName.required - Category Name is require - eg: website
     */
  /**
   * Request to add category
   * @group AdminCategory
   * @route POST /admin/addCategory
   * @param {addCategory.model} addCategory.body.required
   * @security JWT
   */

  addCategory: async function (req, res) {
    try {
      let checkData = await models.category.findOne({ categoryName: req.body.categoryName })
      if (checkData) {
        throw ({
          status: 400,
          message: "Category With This Name Is Already Present. Please Try A New Category Name."
        })

      }

      var response = await new models.category({
        categoryName: req.body.categoryName
      }).save();
      console.log(response);
      if (response) {
        res.json({
          status: res.statusCode,
          message: "Category Successfuly Created.",
          data: response
        });
      } else {
        throw ({
          status: 400,
          message: "Error In Creation Created."
        })
      }
    } catch (err) {
      res.json({
        status: 400,
        message: err.message
      });
    }
  },
  /**
   * request to get category
   * @group AdminCategory
   * @route GET /admin/getCategory
   * @security JWT
   */
  getAllCategory: async function (req, res) {
    try {
      var response = await models.category.find();

      if (response) {
        res.json({
          status: 200,
          message: 'successfully find category',
          data: response
        });
      }
      else {
        res.json({
          status: 400,
          message: 'Error In find all created'
        });
      }
    }
    catch (err) {
      res.json({
        status: err.status,
        message: err.message
      });
    }
  },
  /**
   *
   * @typedef getCategoryById
   * @property {String} id.required - Give category by id - eg: 5e48f29bcbd7373f70edc64e
   */
  /**
   * request to get category by id
   *  @group AdminCategory
   * @route POST /admin/getCategoryById
   * @param {getCategoryById.model} getCategoryById.body.required
   * @security JWT
   */

  getCategoryById: async function (req, res) {
    try {
      var response = await models.category.findById(req.body.id);
      if (response) {
        res.json({
          status: 200,
          message: 'successfully find category',
          data: response
        });
      }
      else {
        res.json({
          status: 200,
          message: 'category not found with this id',

        });
      }
    }
    catch (err) {
      res.json({
        status: err.status,
        message: err.message
      })
    }
  },


  /**
    *@typedef deleteCategory
    */
  /**
   * @route DELETE /admin/deleteCategory
   * @group AdminCategory
   * @param {string} id.query.required - id of category - eg: 5e045be4f9b0a433fd7f4b88
   * @security JWT
   */
  deleteCategory: async function (req, res) {
    try {
      var response = await models.category.deleteOne({ _id: mongoose.Types.ObjectId(req.query.id) });
      if (response) {
        res.json({
          status: 200,
          message: "successfully delete category",
          data: response
        })
      }
      else {
        res.json({
          status: 400,
          message: "Category not delete by this id"
        })
      }
    }
    catch (err) {
      res.json({
        status: err.status,
        message: err.message
      })
    }
  },
  /**
   * @typedef updateCategory
   * @property {String} id.required -category id is required -eg: 5e48f29bcbd7373f70edc64e
   * @property {String} categoryName.required - updated category name is required -eg: mobile
   */
  /**
   * Request to update category name
   * @group AdminCategory
   * @route PUT /admin/updateCategory
   * @param {updateCategory.model} updateCategory.body.required
   * @security JWT
   */
  updateCategory: async function (req, res) {
    try {
      var checkCategoryName = await models.category.findOne({
        categoryName: req.body.categoryName
      })
      if (checkCategoryName) {
        throw ({
          status: 400,
          message: "Category name is allready present,try other name"
        })
      }
      else {
        var updateCAtegoryName = await models.category.findOneAndUpdate({
          _id: mongoose.Types.ObjectId(req.body.id)
        },
          {
            $set: {
              categoryName: req.body, categoryName
            }
          }
        );

        if (updateCAtegoryName) {
          res.json({
            status: 200,
            message: "Category name is successfully updated"
          })
        }
        else {
          res.json({
            status: 400,
            message: "Unable to Update category name."

          })
        }
      }
    }
    catch (err) {
      res.json({
        status: err.status,
        message: err.message
      })
    }
  },
  /**
     * @typedef addSubCategory
     * @property {string} categoryId.required -  category Id is require - eg: 5e48f29bcbd7373f70edc64e
     * @property {string} subCategoryName.required - sub category Name is require - eg: flipkart
     */
  /**
   * Request to add sub category
   * @group AdminSubCategory
   * @route POST /admin/addSubCategory
   * @param {addSubCategory.model} addSubCategory.body.required
   * @security JWT
   */

  addSubCategory: async function (req, res) {
    try {
      let checkData = await models.subCategory.findOne({ subCategoryName: req.body.subCategoryName })
      if (checkData) {
        throw ({
          status: 400,
          message: "subCategory With This Name Is Already Present. Please Try A New subCategory Name."
        })

      }

      var response = await new models.subCategory({
        categoryId: req.body.categoryId,
        subCategoryName: req.body.subCategoryName
      }).save();
      console.log(response);
      if (response) {
        res.json({
          status: res.statusCode,
          message: "subCategory Successfuly Created.",
          data: response
        });
      } else {
        throw ({
          status: 400,
          message: "Error In Creation Created."
        })
      }
    } catch (err) {
      res.json({
        status: 400,
        message: err.message
      });
    }
  },
  /**
   * request to get subCategory
   * @group AdminSubCategory
   * @route GET /admin/getsubCategory
   * @security JWT
   */
  getAllsubCategory: async function (req, res) {
    try {
      var response = await models.subCategory.find();

      if (response) {
        res.json({
          status: 200,
          message: 'successfully find subCategory',
          data: response
        });
      }
      else {
        res.json({
          status: 400,
          message: 'Error In find all created'
        });
      }
    }
    catch (err) {
      res.json({
        status: err.status,
        message: err.message
      });
    }
  },
  /**
   *
   * @typedef getsubCategoryById
   * @property {String} id.required - Give subCategory by id - eg: 5e48f29bcbd7373f70edc64e
   */
  /**
   * request to get subCategory by id
   *  @group AdminSubCategory
   * @route POST /admin/getsubCategoryById
   * @param {getsubCategoryById.model} getsubCategoryById.body.required
   * @security JWT
   */

  getsubCategoryById: async function (req, res) {
    try {
      var response = await models.subCategory.findById(req.body.id);
      if (response) {
        res.json({
          status: 200,
          message: 'successfully find subCategory',
          data: response
        });
      }
      else {
        res.json({
          status: 200,
          message: 'subCategory not found with this id',

        });
      }
    }
    catch (err) {
      res.json({
        status: err.status,
        message: err.message
      })
    }
  },

  /**
     *@typedef deletesubCategory
     */
  /**
   * @route DELETE /admin/deletesubCategory
   * @group AdminSubCategory
   * @param {string} id.query.required - id of Sub category - eg: 5e045be4f9b0a433fd7f4b88
   * @security JWT
   */
  deletesubCategory: async function (req, res) {
    try {
      var response = await models.subCategory.deleteOne({ _id: mongoose.Types.ObjectId(req.query.id) });
      if (response) {
        res.json({
          status: 200,
          message: "successfully delete subCategory",
          data: response
        })
      }
      else {
        res.json({
          status: 400,
          message: "subCategory not delete by this id"
        })
      }
    }
    catch (err) {
      res.json({
        status: err.status,
        message: err.message
      })
    }
  },
  /**
   * @typedef updatesubCategory
   * @property {String} id.required -subCategory id is required -eg: 5e48f29bcbd7373f70edc64e
   * @property {String} subCategoryName.required - updated subCategory name is required -eg: mobile
   */
  /**
   * Request to update subCategory name
   * @group AdminSubCategory
   * @route PUT /admin/updatesubCategory
   * @param {updatesubCategory.model} updatesubCategory.body.required
   * @security JWT
   */
  updatesubCategory: async function (req, res) {
    try {
      var checksubCategoryName = await models.subCategory.findOne({
        subCategoryName: req.body.subCategoryName
      })
      if (checksubCategoryName) {
        throw ({
          status: 400,
          message: "subCategory name is allready present,try other name"
        })
      }
      else {
        var updatesubCAtegoryName = await models.subCategory.findOneAndUpdate({
          _id: mongoose.Types.ObjectId(req.body.id)
        },
          {
            $set: {
              subCategoryName: req.body.subCategoryName
            }
          }
        );

        if (updatesubCAtegoryName) {
          res.json({
            status: 200,
            message: "subCategory name is successfully updated"
          })
        }
        else {
          res.json({
            status: 400,
            message: "Unable to Update subCategory name."

          })
        }
      }
    }
    catch (err) {
      res.json({
        status: err.status,
        message: err.message
      })
    }
  },
  /**
     * @typedef addProduct
     * @property {string} productName.required - product Name is require - eg: xyz
     * @property {string} categoryID.required - category id is require - eg: xyz
     * @property {string} subCategoryId.required - subCategoryId is require - eg: xyz
     * @property {string} productImage.required - product Image is require - eg: xyz
     */
  /**
   * Request to add product
   * @group AdminProduct
   * @route POST /admin/addProduct
   * @param {addProduct.model} addProduct.body.required
   * @security JWT
   */

  addproduct: async function (req, res) {
    try {
      let checkData = await models.product.findOne({ productName: req.body.productName })
      if (checkData) {
        throw ({
          status: 400,
          message: "product With This Name Is Already Present. Please Try A New product Name."
        })

      }

      var response = await new models.product({
        categoryID: req.body.categoryID,
        subCategoryId: req.body.subCategoryId,
        productImage: req.body.productImage,
        productName: req.body.productName
      }).save();
      if (response) {
        res.json({
          status: res.statusCode,
          message: "product Successfuly Created.",
          data: response
        });
      } else {
        throw ({
          status: 400,
          message: "Error In Creation Created."
        })
      }
    } catch (err) {
      res.json({
        status: 400,
        message: err.message
      });
    }
  },
  /**
   * request to get product
   * @group AdminProduct
   * @route GET /admin/getproduct
   * @security JWT
   */
  getAllproduct: async function (req, res) {
    try {
      var response = await models.product.find();

      if (response) {
        res.json({
          status: 200,
          message: 'successfully find product',
          data: response
        });
      }
      else {
        res.json({
          status: 400,
          message: 'Error In find all created'
        });
      }
    }
    catch (err) {
      res.json({
        status: err.status,
        message: err.message
      });
    }
  },
  /**
   *
   * @typedef getproductById
   * @property {String} id.required - Give product by id - eg: 5e48f29bcbd7373f70edc64e
   */
  /**
   * request to get product by id
   *  @group AdminProduct
   * @route POST /admin/getproductById
   * @param {getproductById.model} getproductById.body.required
   * @security JWT
   */

  getproductById: async function (req, res) {
    try {
      var response = await models.product.findById(req.body.id);
      if (response) {
        res.json({
          status: 200,
          message: 'successfully find product',
          data: response
        });
      }
      else {
        res.json({
          status: 200,
          message: 'product not found with this id',

        });
      }
    }
    catch (err) {
      res.json({
        status: err.status,
        message: err.message
      })
    }
  },

  /**
    *@typedef deleteproduct
    */
  /**
   * @route DELETE /admin/deleteproduct
   * @group AdminProduct
   * @param {string} id.query.required - id of product - eg: 5e045be4f9b0a433fd7f4b88
   * @security JWT
   */
  deleteproduct: async function (req, res) {
    try {
      var response = await models.product.deleteOne({ _id: mongoose.Types.ObjectId(req.query.id) });
      if (response) {
        res.json({
          status: 200,
          message: "successfully delete product",
          data: response
        })
      }
      else {
        res.json({
          status: 400,
          message: "product not delete by this id"
        })
      }
    }
    catch (err) {
      res.json({
        status: err.status,
        message: err.message
      })
    }
  },
  /**
   * @typedef updateproduct
   * @property {String} id.required -product id is required -eg: 5e48f29bcbd7373f70edc64e
   * @property {string} productName.required - product Name is require - eg: xyz
   * @property {string} categoryID.required - category id is require - eg: xyz
   * @property {string} subCategoryId.required - subCategoryId is require - eg: xyz
   * @property {string} productImage.required - product Image is require - eg: xyz
   */
  /**
   * Request to update product name
   * @group AdminProduct
   * @route PUT /admin/updateproduct
   * @param {updateproduct.model} updateproduct.body.required
   * @security JWT
   */
  updateproduct: async function (req, res) {
    try {
      var checkproductName = await models.product.findOne({
        productName: req.body.productName
      })
      if (checkproductName) {
        throw ({
          status: 400,
          message: "product name is allready present,try other name"
        })
      }
      else {
        var updateproductName = await models.product.findOneAndUpdate({
          _id: mongoose.Types.ObjectId(req.body.id)
        },
          {
            $set: {
              productName: req.body.productName,
              categoryID: req.body.categoryID,
              subCategoryId: req.body.subCategoryId,
              productImage: req.body.productImage
            }
          }
        );

        if (updateproductName) {
          res.json({
            status: 200,
            message: "product name is successfully updated"
          })
        }
        else {
          res.json({
            status: 400,
            message: "Unable to Update product name."

          })
        }
      }
    }
    catch (err) {
      res.json({
        status: err.status,
        message: err.message
      })
    }
  },
/*
  * @property {string} categoryID.required - category id is require - eg: xyz
  * @property {string} subCategoryId.required - subCategoryId is require - eg: xyz
  */
  /**
     * @typedef addstore
     * @property {string} storeName.required - store Name is require - eg: xyz
    
     * @property {string} storeImage.required - store Image is require - eg: xyz
     * 
      * @property {boolean} shopLicenseNumber.required - store Image is require - eg: true
      * @property {string} panCardNumber.required - store Image is require - eg: xyz
      *  * @property {string} state.required - store Image is require - eg: xyz
      *  * @property {string} city.required - store Image is require - eg: xyz
      *  * @property {string} shopPlotNumber.required - store Image is require - eg: xyz
      *  * @property {string} ownerName.required - store Image is require - eg: xyz
      *  * @property {string} ownerName.required - store Image is require - eg: xyz
      *  * @property {string} pincode.required - store Image is require - eg: xyz
      *  * @property {string} address.required - store Image is require - eg: xyz

     */
  /**
   * Request to add store
   * @group Adminstore
   * @route POST /admin/addstore
   * @param {addstore.model} addstore.body.required
   * @security JWT
   */

  addstore: async function (req, res) {
    try {
      let checkData = await models.store.findOne({ storeName: req.body.storeName })
      if (checkData) {
        throw ({
          status: 400,
          message: "store With This Name Is Already Present. Please Try A New store Name."
        })

      }

     


      var response = await new models.store({
        // categoryID: req.body.categoryID,
        // subCategoryId: req.body.subCategoryId,
        storeImage: req.body.storeImage,
        storeName: req.body.storeName,

        shopLicenseNumber : req.body.shopLicenseNumber,
        panCardNumber : req.body.panCardNumber,
        state : req.body.state,
        city : req.body.city,
        shopPlotNumber : req.body.shopPlotNumber,
        ownerName : req.body.ownerName,
        contactNo : req.body.contactNo,
        pincode : req.body.pincode,
        address : req.body.address,

      }).save();
      if (response) {
        res.json({
          status: res.statusCode,
          message: "store Successfuly Created.",
          data: response
        });
      } else {
        throw ({
          status: 400,
          message: "Error In Creation Created."
        })
      }
    } catch (err) {
      res.json({
        status: 400,
        message: err.message
      });
    }
  },
  /**
   * request to get store
   * @group Adminstore
   * @route GET /admin/getstore
   * @security JWT
   */
  getAllstore: async function (req, res) {
    try {
      var response = await models.store.find();

      if (response) {
        res.json({
          status: 200,
          message: 'successfully find store',
          data: response
        });
      }
      else {
        res.json({
          status: 400,
          message: 'Error In find all created'
        });
      }
    }
    catch (err) {
      res.json({
        status: err.status,
        message: err.message
      });
    }
  },
  /**
   *
   * @typedef getstoreById
   * @property {String} id.required - Give store by id - eg: 5e48f29bcbd7373f70edc64e
   */
  /**
   * request to get store by id
   *  @group Adminstore
   * @route POST /admin/getstoreById
   * @param {getstoreById.model} getstoreById.body.required
   * @security JWT
   */

  getstoreById: async function (req, res) {
    try {
      var response = await models.store.findById(req.body.id);
      if (response) {
        res.json({
          status: 200,
          message: 'successfully find store',
          data: response
        });
      }
      else {
        res.json({
          status: 200,
          message: 'store not found with this id',

        });
      }
    }
    catch (err) {
      res.json({
        status: err.status,
        message: err.message
      })
    }
  },

  /**
    *@typedef deletestore
    */
  /**
   * @route DELETE /admin/deletestore
   * @group Adminstore
   * @param {string} id.query.required - id of store - eg: 5e045be4f9b0a433fd7f4b88
   * @security JWT
   */
  deletestore: async function (req, res) {
    try {
      var response = await models.store.deleteOne({ _id: mongoose.Types.ObjectId(req.query.id) });
      if (response) {
        res.json({
          status: 200,
          message: "successfully delete store",
          data: response
        })
      }
      else {
        res.json({
          status: 400,
          message: "store not delete by this id"
        })
      }
    }
    catch (err) {
      res.json({
        status: err.status,
        message: err.message
      })
    }
  },
  /**
   * @typedef updatestore
   * @property {String} id.required -store id is required -eg: 5e48f29bcbd7373f70edc64e
   * @property {string} storeName.required - store Name is require - eg: xyz
   * @property {string} categoryID.required - category id is require - eg: xyz
   * @property {string} subCategoryId.required - subCategoryId is require - eg: xyz
   * @property {string} storeImage.required - store Image is require - eg: xyz
   */
  /**
   * Request to update store name
   * @group Adminstore
   * @route PUT /admin/updatestore
   * @param {updatestore.model} updatestore.body.required
   * @security JWT
   */
  updatestore: async function (req, res) {
    try {
      var checkstoreName = await models.store.findOne({
        storeName: req.body.storeName
      })
      if (checkstoreName) {
        throw ({
          status: 400,
          message: "store name is allready present,try other name"
        })
      }
      else {
        var updatestoreName = await models.store.findOneAndUpdate({
          _id: mongoose.Types.ObjectId(req.body.id)
        },
          {
            $set: {
              storeName: req.body.storeName,
              categoryID: req.body.categoryID,
              subCategoryId: req.body.subCategoryId,
              storeImage: req.body.storeImage
            }
          }
        );

        if (updatestoreName) {
          res.json({
            status: 200,
            message: "store name is successfully updated"
          })
        }
        else {
          res.json({
            status: 400,
            message: "Unable to Update store name."

          })
        }
      }
    }
    catch (err) {
      res.json({
        status: err.status,
        message: err.message
      })
    }
  },
  /**
     * @typedef addcart
     * @property {string} productName.required - product Name is require - eg: xyz
     * @property {string} productId.required - product id is require - eg: xyz
     * @property {string} userId.required - user Id is require - eg: xyz
     * @property {string} quantity.required - quantity is require - eg: xyz
     */
  /**
   * Request to add cart
   * @group Usercart
   * @route POST /user/addcart
   * @param {addcart.model} addcart.body.required
   * @security JWT
   */

  addcart: async function (req, res) {
    try {
      let checkData = await models.cart.findOne({ productId: req.body.productId })
      if (checkData) {
        throw ({
          status: 400,
          message: "This product is allready added."
        })

      }

      var response = await new models.cart({
        productId: req.body.productId,
        userId: req.body.userId,
        productName: req.body.productName,
        quantity: req.body.quantity
      }).save();
      if (response) {
        res.json({
          status: res.statusCode,
          message: "Product is added in your cart.",
          data: response
        });
      } else {
        throw ({
          status: 400,
          message: "Error In Creation Created."
        })
      }
    } catch (err) {
      res.json({
        status: 400,
        message: err.message
      });
    }
  },
  /**
   * request to get cart
   * @group Usercart
   * @route GET /user/getcart
   * @security JWT
   */
  getAllcart: async function (req, res) {
    try {
      var response = await models.cart.find();

      if (response) {
        res.json({
          status: 200,
          message: 'successfully find cart',
          data: response
        });
      }
      else {
        res.json({
          status: 400,
          message: 'Error In find all created'
        });
      }
    }
    catch (err) {
      res.json({
        status: err.status,
        message: err.message
      });
    }
  },
  /**
   *
   * @typedef getcartById
   * @property {String} id.required - Give cart by id - eg: 5e48f29bcbd7373f70edc64e
   */
  /**
   * request to get cart by id
   *  @group Usercart
   * @route POST /user/getcartById
   * @param {getcartById.model} getcartById.body.required
   * @security JWT
   */

  getcartById: async function (req, res) {
    try {
      var response = await models.cart.findById(req.body.id);
      if (response) {
        res.json({
          status: 200,
          message: 'successfully find cart',
          data: response
        });
      }
      else {
        res.json({
          status: 200,
          message: 'cart not found with this id',

        });
      }
    }
    catch (err) {
      res.json({
        status: err.status,
        message: err.message
      })
    }
  },
  /**
    *
    * @typedef getcartUserId
    * @property {String} userId.required - Give User by user - eg: 5e48f29bcbd7373f70edc64e
    */
  /**
   * request to get cart by id
   *  @group Usercart
   * @route POST /user/getcartByUserId
   * @param {getcartUserId.model} getcartUserId.body.required
   * @security JWT
   */

  getcartUserId: async function (req, res) {
    try {
      var response = await models.cart.find({ userId: req.body.userId });
      if (response) {
        res.json({
          status: 200,
          message: 'successfully find cart',
          data: response
        });
      }
      else {
        res.json({
          status: 200,
          message: 'cart not found with this id',

        });
      }
    }
    catch (err) {
      res.json({
        status: err.status,
        message: err.message
      })
    }
  },
  /**
    *@typedef deletecart
    */
  /**
   * @route DELETE /user/deletecart
   * @group Usercart
   * @param {string} id.query.required - id of cart - eg: 5e045be4f9b0a433fd7f4b88
   * @security JWT
   */
  deletecart: async function (req, res) {
    try {
      var response = await models.cart.deleteOne({ _id: mongoose.Types.ObjectId(req.query.id) });
      if (response) {
        res.json({
          status: 200,
          message: "successfully delete cart",
          data: response
        })
      }
      else {
        res.json({
          status: 400,
          message: "cart not delete by this id"
        })
      }
    }
    catch (err) {
      res.json({
        status: err.status,
        message: err.message
      })
    }
  },
  /**
   * @typedef updatecart
   * @property {string} productName.required - product Name is require - eg: xyz
     * @property {string} productId.required - product id is require - eg: xyz
      * @property {string} id.required - id is require - eg: xyz
     * @property {string} quantity.required - quantity is require - eg: xyz
   */
  /**
   * Request to update cart name
   * @group Usercart
   * @route PUT /user/updatecart
   * @param {updatecart.model} updatecart.body.required
   * @security JWT
   */

  updatecart: async function (req, res) {
    try {
      var checkcartName = await models.cart.findOne({
        productId: req.body.productId
      })
      // if (checkcartName) {
      //   throw ({
      //     status: 400,
      //     message: "Product is allready present,try other product"
      //   })
      // }
      // else {
        var updatecartName = await models.cart.findOneAndUpdate({
          _id: mongoose.Types.ObjectId(req.body.id)
        },
          {
            $set: {
              productName: req.body.productName,
              quantity: req.body.quantity
            }
          }
        );

        if (updatecartName) {
          res.json({
            status: 200,
            message: "cart is successfully updated"
          })
        }
        else {

          var newupdatecartName = await models.cart.findOneAndUpdate({
            productId: mongoose.Types.ObjectId(req.body.productId)
          },
            {
              $set: {
                productName: req.body.productName,
                quantity: req.body.quantity
              }
            }
          );
          if(newupdatecartName){
             res.json({
            status: 200,
            message: "cart is successfully updated"
          })
          }else{
            var response = await new models.cart({
              productId: req.body.productId,
              userId: req.body.userId,
              productName: req.body.productName,
              quantity: req.body.quantity
            }).save();
            if (response) {
              res.json({
                status: res.statusCode,
                message: "Product is added in your cart.",
                data: response
              });
            } else {
              throw ({
                status: 400,
                message: "Error In Creation Created."
              })
            }
          }

          
          // res.json({
          //   status: 400,
          //   message: "Unable to Update cart name."
          // })
        }
      // }
    }
    catch (err) {
      res.json({
        status: err.status,
        message: err.message
      })
    }
  },


  // FOR BRAND **********************************************************

  /**
     * @typedef addBrand
     * @property {string} brandName.required - Brand Name is require - eg: website
     */
  /**
   * Request to add brand
   * @group AdminBrand
   * @route POST /admin/addBrand
   * @param {addBrand.model} addBrand.body.required
   * @security JWT
   */

  addBrand: async function (req, res) {
    try {
      let checkData = await models.brand.findOne({ brandName: req.body.brandName })
      if (checkData) {
        throw ({
          status: 400,
          message: "Brand With This Name Is Already Present. Please Try A New Brand Name."
        })

      }

      var response = await new models.brand({
        brandName: req.body.brandName,
        isRequested : true
      }).save();
      console.log(response);
      if (response) {
        res.json({
          status: res.statusCode,
          message: "Brand Successfuly Created.",
          data: response
        });
      } else {
        throw ({
          status: 400,
          message: "Error In Creation Created."
        })
      }
    } catch (err) {
      res.json({
        status: 400,
        message: err.message
      });
    }
  },
  /**
   * request to get brand
   * @group AdminBrand
   * @route GET /admin/getBrand
   * @security JWT
   */
  getAllBrand: async function (req, res) {
    try {
      var response = await models.brand.find({isRequested:true});

      if (response) {
        res.json({
          status: 200,
          message: 'successfully find brand',
          data: response
        });
      }
      else {
        res.json({
          status: 400,
          message: 'Error In find all created'
        });
      }
    }
    catch (err) {
      res.json({
        status: err.status,
        message: err.message
      });
    }
  },
  /**
   *
   * @typedef getBrandById
   * @property {String} id.required - Give brand by id - eg: 5e48f29bcbd7373f70edc64e
   */
  /**
   * request to get brand by id
   *  @group AdminBrand
   * @route POST /admin/getBrandById
   * @param {getBrandById.model} getBrandById.body.required
   * @security JWT
   */

  getBrandById: async function (req, res) {
    try {
      var response = await models.brand.findById(req.body.id);
      if (response) {
        res.json({
          status: 200,
          message: 'successfully find brand',
          data: response
        });
      }
      else {
        res.json({
          status: 200,
          message: 'brand not found with this id',

        });
      }
    }
    catch (err) {
      res.json({
        status: err.status,
        message: err.message
      })
    }
  },


  /**
    *@typedef deleteBrand
    */
  /**
   * @route DELETE /admin/deleteBrand
   * @group AdminBrand
   * @param {string} id.query.required - id of brand - eg: 5e045be4f9b0a433fd7f4b88
   * @security JWT
   */
  deleteBrand: async function (req, res) {
    try {
      var response = await models.brand.deleteOne({ _id: mongoose.Types.ObjectId(req.query.id) });
      if (response) {
        res.json({
          status: 200,
          message: "successfully delete brand",
          data: response
        })
      }
      else {
        res.json({
          status: 400,
          message: "Brand not delete by this id"
        })
      }
    }
    catch (err) {
      res.json({
        status: err.status,
        message: err.message
      })
    }
  },
  /**
   * @typedef updateBrand
   * @property {String} id.required -brand id is required -eg: 5e48f29bcbd7373f70edc64e
   * @property {String} brandName.required - updated brand name is required -eg: mobile
   */
  /**
   * Request to update brand name
   * @group AdminBrand
   * @route PUT /admin/updateBrand
   * @param {updateBrand.model} updateBrand.body.required
   * @security JWT
   */
  updateBrand: async function (req, res) {
    try {
      var checkBrandName = await models.brand.findOne({
        brandName: req.body.brandName
      })
      if (checkBrandName) {
        throw ({
          status: 400,
          message: "Brand name is allready present,try other name"
        })
      }
      else {
        var updateCAtegoryName = await models.brand.findOneAndUpdate({
          _id: mongoose.Types.ObjectId(req.body.id)
        },
          {
            $set: {
              brandName: req.body, brandName
            }
          }
        );

        if (updateCAtegoryName) {
          res.json({
            status: 200,
            message: "Brand name is successfully updated"
          })
        }
        else {
          res.json({
            status: 400,
            message: "Unable to Update brand name."

          })
        }
      }
    }
    catch (err) {
      res.json({
        status: err.status,
        message: err.message
      })
    }
  },


  /**
   * Request to Activate/deactivate store
   * @group AdminBrand
   * @route GET /user/approveBrand
   * @param {String} id.query - Store ID
   * @security JWT
   */
  approveBrand : async function (req, res) {
    // var issueToken = helpers.jwt.verifyJWT(req.headers['authorization']);
    // console.log(req.headers['authorization'],issueToken)
    try {
      var response = await models.brand.findOneAndUpdate({
        _id: req.query.id
      }, {
        $set: {
          isRequested: true,
        }
      });

      if (response) {
        res.json({
          status: res.statusCode,
          message: req.body.status ? "Your brand approve successfully" : "Your brand approve successfully!"
        });
      } else {
        res.json({
          status: res.statusCode,
          message: lang.user.message.error.activate
        })
      }
    } catch (err) {
      res.json({
        status: err.status,
        message: err.message
      });
    }
  },

  /**
   * Request to Activate/deactivate store
   * @group AdminBrand
   * @route GET /uploadProduct
   * @param {String} id.query - Store ID
   * @security JWT
   */
  uploadProduct : async function (req, res) {
    // var issueToken = helpers.jwt.verifyJWT(req.headers['authorization']);
    // console.log(req.headers['authorization'],issueToken)
        try {
            const doc = new GoogleSpreadsheet('1X4XKSoFuSjEHwG-uNRdxGMevCwr5-73lFwY4h86-4b8');
            // https://docs.google.com/spreadsheets/d/1SJv8Oqin75_6LyRR4dGp735qDG4zPGknZmVCeigaMHI/edit?ts=5ed47eeb#gid=0
            doc.useApiKey('AIzaSyDxdLSrzbRmIJLA6iDYAjTWNiFqi-gSu5s');
            await doc.loadInfo(); // loads document properties and worksheets
            console.log(doc.title);
            
            const sheet = doc.sheetsByIndex[0]; // or use doc.sheetsById[id]
            console.log(sheet.title);
            const rows = await sheet.getRows(); // can pass in { limit, offset }
            var resdata = [];  
            for(let item of rows){
              let productRes = null
              if(item['Product Name']!=null){
             
            if(item['Category']){
              var responseCat = await models.category.findOne({categoryName:item['Category']});
             }
              if(item['Subcategory']){
                var responseSub = await models.subCategory.findOne({subCategoryName:item['Subcategory']});
              }
              if(item['Brand']){
                var responsebrand = await models.brand.findOne({brandName:item['Brand']});
              }
              
              console.log('kkkkkkkkkkkkkkkkkkkkkkkkkk',responseCat,responseSub);

              if(responseCat){
                catId = responseCat._id;
                
              }else{
               let newCatRes =  new models.category({
                  categoryName: item['Category']
                }).save();
                catId= newCatRes._id;
              }

              if(responseSub){
                subcatId = responseSub._id;
              }else{
                let newSubcatId =  new models.subCategory({
                  subCategoryName: item['Subcategory']
                }).save();
                subcatId= newSubcatId._id;
              }

              if(responsebrand){
                brandId = responsebrand._id;
              }else{
                let newBrandId =  new models.brand({
                  brandName: item['Brand']
                }).save();
                brandId= newSubcatId._id;
              }

              var obj = {
                mrp:item['MRP Price'],
                sellingPrice:item['Selling Price'],
                currency:item['Currency'],
                brand:brandId ? brandId : null,
                weight:item['Weight'],
                unit:item['Unit'],
                quantity:item['Quantity'],
                containerType:item['Container Type'],
                minQuantity:item['Min Quantity'],
                productImage:item['Image'] ,
                productName : item['Product Name'],
                subCategoryId : subcatId ? subcatId : null,
                categoryID : catId ? catId : null,
                isDelete:false
              }
              
              var productCat = await models.product.findOne({productName:item['Product Name']});
             
              if(productCat){
                await models.product.deleteOne({_id: productCat._id});
              }
              productRes = await new models.product(obj).save();
              resdata.push(productRes);
              console.log('iiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiii',obj,productCat,resdata)
              // console.log('kkkkkkkkkkkkkkkkkkkkkkkkkk',item['Product Name'],responseCat,responseSub,catId,subcatId);
            }
           
          }
          res.json({
            status: res.status,
            message: 'Upload successfully',
            data:resdata
          });
        } catch (err) {
          res.json({
            status: err.status,
            message: err.message
          });
        }
  },


    /**
   * Request to upload category
   * @group AdminBrand
   * @route GET /uploadCategory
   */
  uploadCategory : async function (req, res) {
    // var issueToken = helpers.jwt.verifyJWT(req.headers['authorization']);
    // console.log(req.headers['authorization'],issueToken)
        try {
            const doc = new GoogleSpreadsheet('1x2hOY6S_uXeBrQzDetUVzuJyGXG0ocunNpJg2_GbNbg');
            // https://docs.google.com/spreadsheets/d/1SJv8Oqin75_6LyRR4dGp735qDG4zPGknZmVCeigaMHI/edit?ts=5ed47eeb#gid=0
            doc.useApiKey('AIzaSyDxdLSrzbRmIJLA6iDYAjTWNiFqi-gSu5s'); 
            await doc.loadInfo(); // loads document properties and worksheets
            console.log(doc.title);
            
            const sheet = doc.sheetsByIndex[0]; // or use doc.sheetsById[id]
            console.log(sheet.title);
            const rows = await sheet.getRows(); // can pass in { limit, offset }
            var resdata = [];  
            for(let item of rows){
              let productRes = null
              if(item['Category Name']!=null){
                var responseCat= null;    
            if(item['Category Name']){
              responseCat = await models.category.findOne({categoryName:item['Category Name']});
             }
              if(item['Subcategory Name']){
                var responseSub = await models.subCategory.findOne({subCategoryName:item['Subcategory Name']});
              }
              if(item['Brand']){
                var responsebrand = await models.brand.findOne({brandName:item['Brand']});
              }
              
             

              if(responseCat && responseCat._id){
                catId = responseCat._id;
                console.log('i matched',responseCat)
              }else{
               let newCatRes = await new models.category({
                  categoryName: item['Category Name'],
                  image : item['Image'],
                }).save();
                catId= newCatRes._id;
                
              }
              resdata.push(responseCat);

              if(responseSub){
                subcatId = responseSub._id;
              }else{
                let newSubcatId = await new models.subCategory({
                  subCategoryName: item['Subcategory Name'],
                  categoryId:catId  ?catId :null,
                  image : item['subcat_Image'],
                }).save();
                subcatId= newSubcatId._id;
              }

              resdata.push(responseSub);

              if(responsebrand){
                brandId = responsebrand._id;
              }else{
                let newBrandId = await new models.brand({
                  brandName: item['Brand'],
                  image : item['brand_Image'],
                }).save();
                brandId= newBrandId._id;
              }
              resdata.push(responsebrand);

              console.log('(((((((((((((((((((((((((((((((((((((((((((((',catId,subcatId,brandId)

              // var catobj = {
              //   categoryName:item['Category Name'],
              //   image : item['Image'],
              // }
              // var cat1 = await models.category.findOne({categoryName:item['Category Name']});
              // if(cat1){
              //   await models.category.deleteOne({_id: cat1._id});
              // }
              // catRes = await new models.category(catobj).save();
              // resdata.push(catRes);

              console.log('kkkkkkkkkkkkkkkkkkkkkkkkkk',catId,subcatId,brandId,item['Category Name'],item['Subcategory Name']);


              // var subcatobj = {
              //   subCategoryName:item['Subcategory Name'],
              //   image : item['subcat_Image'],
              //   categoryId:catId  ?catId :null
              // }
              // var subcat1 = await models.subCategory.findOne({subCategoryName:item['Subcategory Name']});
              // if(subcat1){
              //   await models.subCategory.deleteOne({_id: subcat1._id});
              // }
              // subcatRes = await new models.subCategory(subcatobj).save();
              // resdata.push(subcatRes);

             

              // var brandObj = {
              //   brandName:item['Brand'],
              //   image : item['brand_Image'],
              //   // categoryId:catId  ?catId :null
              // }
              // var brand1 = await models.brand.findOne({brandName:item['Brand']});
              // if(brand1){
              //   await models.brand.deleteOne({_id: brand1._id});
              // }
              // brandRes = await new models.brand(brandObj).save();
              // resdata.push(brandRes);

              // console.log('iiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiii',obj,productCat,resdata)
            }
           
          }
          res.json({
            status: res.status,
            message: 'Upload successfully',
            data:resdata
          });
        } catch (err) {
          res.json({
            status: err.status,
            message: err.message
          });
        }
  },


  

  /**
   * Request to get list
   * @group getAllProductList
   * @route GET /getAllProductList
   */
  getAllProductList : async function (req, res) {
    // var issueToken = helpers.jwt.verifyJWT(req.headers['authorization']);
    // console.log(req.headers['authorization'],issueToken)
    try {
      var response = await models.product.find({isDelete:false});

      if (response) {
        res.json({
          status: res.statusCode,
          message:  "Your list",
          data:response
        });
      } else {
        res.json({
          status: res.statusCode,
          message: lang.user.message.error.activate
        })
      }
    } catch (err) {
      res.json({
        status: err.status,
        message: err.message
      });
    }
  },



}

module.exports = methods;