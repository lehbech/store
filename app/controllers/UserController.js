var lang = require('../lang');
var models = require('../models');
var helpers = require('../helpers');
var bcrypt = require('bcryptjs');
var contantObj = require("../../constant");
var methods = {
  /**
   * Request for Base URL of the API and for Testing if API is Live
   * @group Users
   * @route GET /
   */
  welcome: function (req, res) {
    try {
      res.json({
        status: res.statusCode,
        message: lang.user.message.success.userwelcome
      });
    } catch (err) {
      res.json({
        status: err.status,
        message: err.message
      });
    }
  },
  /**
   * @typedef Login
   * @property {string} email.required - email address of the user - eg: user@mailinator.com
   * @property {string} password.required - password for user - eg: 123456
   */
  /**
   * Request to Issue JWT token for Users
   * @group Users
   * @route POST /user/login
   * @param {Login.model} login.body.required
   */
  login: async function (req, res) {
    try {
      var response = await models.user.findOne({
        email: req.body.email
      });

      console.log('req.body.password', req.body.password);

      if (response) {
        console.log('req.body.password', req.body.password);
        if (!response.active) {
          throw ({
            status: 400,
            message: lang.user.message.error.active
          });
        } else {
          console.log('not', req.body.password,response);
          bcrypt.compare(req.body.password, response.password, (err, result) => {
            console.log('bcryPt error', err);
            console.log('bcryPt result', result,response.password);

            if (err || (err == null && !result)) {
              res.json({
                status: 400,
                message: lang.user.message.error.emailPwdNotMatched
              });
            }
            if (result) {
              console.log('result=>', result);
              var issueToken = helpers.jwt.issueJWT(response);
              res.json({
                status: res.statusCode,
                message: lang.user.message.success.login,
                data: {
                  token: issueToken,
                  userId : response._id
                }
              });
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
   * @typedef Register
   * @property {string} fullname.required - fullname for user - eg: user Makol
   * @property {string} username.required - username for user - eg: userm
   * @property {string} email.required - email address of the user - eg: user@mailinator.com
   * @property {string} password.required - password of the user - eg: 123123123
   * @property {string} address.required - address of the user - eg: address in gurugram
   * @property {string} city.required - city of the user - eg: gurugram
   * @property {string} state.required - state of the user - eg: delhi
   * @property {string} country.required - country of the user - eg: india
   * @property {number} postal_code.required - postal code of the user - eg: 141414
   * @property {number} phone_number.required - phone number of the use - eg: 9876543210
   */
  /**
   * Request to Register a New User
   * @group Users
   * @route POST /user/register
   * @param {Register.model} register.body.required
   */
  register: async function (req, res) {
    try {
      var nonce = await helpers.jwt.generateNonce();

      var response = await new models.user({
        fullname: req.body.fullname,
        username: req.body.username,
        email: req.body.email,
        password: bcrypt.hashSync(req.body.password, 10),
        address: req.body.address,
        city: req.body.city,
        state: req.body.state,
        country: req.body.country,
        postal_code: req.body.postal_code,
        phone_number: req.body.phone_number,
        nonce: nonce,
        created_at: Date.now()
      }).save();

      if (response) {
        res.json({
          status: res.statusCode,
          message: lang.user.message.success.register,
          data: response
        });
      } else {
        throw ({
          status: 400,
          message: lang.user.message.error.register
        })
      }
    } catch (err) {
      res.json({
        status: err.status,
        message: err.message
      });
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
      * * @property {string} shopGSTNumber.required - store Image is require - eg: xyz 
      *  * @property {string} ownerName.required - store Image is require - eg: xyz
      *  * @property {string} ownerName.required - store Image is require - eg: xyz
      *  * @property {string} pincode.required - store Image is require - eg: xyz
      *  * @property {string} address.required - store Image is require - eg: xyz

     */
  /**
   * Request to add store
   * @group Users
   * @route POST /user/addstore
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

        shopGSTNumber : req.body.shopGSTNumber,
        shopLicenseNumber : req.body.shopLicenseNumber,
        panCardNumber : req.body.panCardNumber,
        state : req.body.state,
        city : req.body.city,
        shopPlotNumber : req.body.shopPlotNumber,
        ownerName : req.body.ownerName,
        contactNo : req.body.contactNo,
        pincode : req.body.pincode,
        address : req.body.address,
        userId : req.query.id

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
   * @group Users
   * @route GET /user/getstore
   * @security JWT
   */
  getAllstore: async function (req, res) {
    try {
      var response = await models.store.find({userId:req.query.id,isDelete:false});

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
   * Request to Get single store
   * @group Users
   * @route GET /user/getStoreById
   * @param {String} id.query - Store ID
   * @security JWT
   */
  getStoreById : async function (req, res) {
    var issueToken = helpers.jwt.verifyJWT(req.headers['authorization']);
    console.log(req.headers['authorization'],issueToken)
    try {
      var response = await models.store.findOne({
        _id: req.query.id
      });

      if (response) {
        res.json({
          status: res.statusCode,
          message:  "Your store get successfully",
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

 /**
   * Request to Delete store
   * @group Users
   * @route DELETE /user/deleteStore
   * @param {String} id.query - Store ID
   * @security JWT
   */
  deleteStore : async function (req, res) {
    var issueToken = helpers.jwt.verifyJWT(req.headers['authorization']);
    console.log(req.headers['authorization'],issueToken)
    try {
      var response = await models.store.findOneAndUpdate({
        _id: req.query.id
      }, {
        $set: {
          isDelete: true,
        }
      });

      if (response) {
        res.json({
          status: res.statusCode,
          message:  "Your store deleted successfully" 
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
   * @group Users
   * @route GET /user/activatedeactivatestore
   * @param {String} id.query - Store ID
   * @security JWT
   */
  activatedeactivate : async function (req, res) {
    // var issueToken = helpers.jwt.verifyJWT(req.headers['authorization']);
    // console.log(req.headers['authorization'],issueToken)
    try {
      var response = await models.store.findOneAndUpdate({
        _id: req.query.id
      }, {
        $set: {
          active: req.body.status,
        }
      });

      if (response) {
        res.json({
          status: res.statusCode,
          message: req.body.status ? "Your store activate successfully" : "Your store deactivate successfully!"
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
   * @typedef Resend
   * @property {String} email.required - User Email Address - eg: user@mailinator.com
   */
  /**
   * Request to resent the activation email for the user
   * @group Users
   * @route POST /user/resend-activation-email
   * @param {Resend.model} resend.body.required
   */
  resendEmail: async function (req, res) {
    try {
      var nonce = await helpers.jwt.generateNonce();

      var response = await models.user.findOneAndUpdate({
        email: req.body.email
      }, {
        $set: {
          nonce: nonce
        }
      });

      if (response) {
        var mailResponse = await helpers.mailer.welcomeEmail(response.email, {
          username: response.username,
          link: contantObj.APP_URL + contantObj.APP_ACTIVATION_ENDPOINT + "?id=" + nonce
        });

        res.json({
          status: res.statusCode,
          message: lang.user.message.success.resendEmail
        });
      } else {
        res.json({
          status: res.statusCode,
          message: lang.user.message.error.resendEmail
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
   * Request to update user profile
   * @group Users
   * @param {Register.model} register.body.required
   * @route POST /user/updateProfile
   * @param {String} id.query - user ID
    * @security JWT
   */
  updateProfile: async function (req, res) {
    console.log('trest0',req.body,req.query)
    try {
      var response = await models.user.findOneAndUpdate({
        _id: req.query.id
      },{
        $set : {
          fullname : req.body.fullname,
          username : req.body.username,
          address : req.body.address,
          city : req.body.city,
          state : req.body.state,
          country : req.body.country,
          postal_code : req.body.postal_code,
          phone_number : req.body.phone_number,
        }
      });

      if (response) {
        res.json({
          status: res.statusCode,
          data: response,
          message: 'Profile update Successfully!'
        });
      } else {
        res.json({
          status: res.statusCode,
          message: 'Error in updating'
        })
      }
    } catch (err) {
      res.json({
        status: err.status,
        message: err.message
      });
    }
  },

  // * @property {string} fullname.required - fullname for user - eg: user Makol
  // * @property {string} email.required - email address of the user - eg: user@mailinator.com
  // * @property {number} phone_number.required - phone number of the use - eg: 9876543210
  // * 

  /**
   * @typedef Customercare
   * @property {string} subject.required - subject of the user - eg: subject
   * @property {string} description.required - description of the user - eg: descriptiondescription
   */
   /**
   * Request to receive customer feedback
   * @group Users
   * @route POST /user/customercare
    * @param {Customercare.model} customercare.body.required
   */
  receivecustomercare: async function (req, res) {
    try {
      var response = await new models.customercare({
          // fullname : req.body.fullname,
          // email : req.body.email,
          subject : req.body.subject,
          description : req.body.description,
          // phone_number : req.body.phone_number,
      }).save();

      if (response) {
        res.json({
          status: res.statusCode,
          data: response,
          message: 'We have received your query Successfully! We will get back to you soon!'
        });
      } else {
        res.json({
          status: res.statusCode,
          message: 'Error in reciveing'
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
   * Request to get user profile
   * @group Users
   * @route GET /user/getProfile
   * @param {String} id.query - user ID
    * @security JWT
   */
  getProfile: async function (req, res) {
    try {
      var response = await models.user.findOne({
        _id: req.query.id
      });

      if (response) {
        res.json({
          status: res.statusCode,
          data: response,
          message: 'Profile Fetch Successfully!'
        });
      } else {
        res.json({
          status: res.statusCode,
          message: 'Error in fetching'
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
   * Request to Activate a New User
   * @group Users
   * @route GET /user/activate
   * @param {String} id.query - Activation ID
   */
  activate: async function (req, res) {
    try {
      var response = await models.user.findOneAndUpdate({
        nonce: req.query.id
      }, {
        $set: {
          active: true,
          nonce: ''
        }
      });

      if (response) {
        res.json({
          status: res.statusCode,
          message: lang.user.message.success.activate
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
   * Request to Activate a New User
   * @group Users
   * @route POST /user/searchProduct
   * @param {String} id.query - product name
   */
  searchProduct: async function (req, res) {
    try {
      var response = await models.product.findOneAndUpdate({
        productName : req.body.productName
      });

      if (response) {
        res.json({
          status: res.statusCode,
          message: "product get succesfully!",
          data:  response
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
   * Request to Activate a New User
   * @group Users
   * @route GET /user/activate
   * @param {String} id.query - Activation ID
   */
  activate: async function (req, res) {
    try {
      var response = await models.user.findOneAndUpdate({
        nonce: req.query.id
      }, {
        $set: {
          active: true,
          nonce: ''
        }
      });

      if (response) {
        res.json({
          status: res.statusCode,
          message: lang.user.message.success.activate
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
   * @typedef ResetPassword
   * @property {String} email.required - User Email Address - eg: user@mailinator.com
   */
  /**
   * Request to reset the password for the account
   * @group Users
   * @route POST /user/reset-password
   * @param {ResetPassword.model} resetPassword.body.required
   */
  resetPassword: async function (req, res) {
    try {
      var nonce = await helpers.jwt.generateNonce();

      var response = await models.user.findOneAndUpdate({
        email: req.body.email
      }, {
        $set: {
          nonce: nonce
        }
      });

      if (response) {
        var mailResponse = await helpers.mailer.resetPassword(response.email, {
          username: response.username,
          link: contantObj.APP_URL + contantObj.APP_CHANGE_PASSWORD_ENDPOINT + "?id=" + nonce
        });

        res.json({
          status: res.statusCode,
          message: lang.user.message.success.resetPassword
        });
      } else {
        res.json({
          status: res.statusCode,
          message: lang.user.message.error.resetPassword
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
   * @typedef ChangePassword
   * @property {string} id.required - Reset Access Token - eg: asergyakljdskvnaspdjfskghgkdghdf
   * @property {String} password.required - User Password - eg: 123123123
   * @property {String} confirmPassword.required - User Password - eg: 123123123
   */
  /**
   * Request to change the password for the account
   * @group Users
   * @route POST /user/change-password
   * @param {ChangePassword.model} changePassword.body.required
   */
  changePassword: async function (req, res) {
    try {
      if (req.body.password == req.body.confirmPassword) {
        var response = await models.user.findOneAndUpdate({
          nonce: req.body.id
        }, {
          $set: {
            password: bcrypt.hashSync(req.body.password, 10),
            nonce: ''
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
    } catch (err) {
      res.json({
        status: err.status,
        message: err.message
      });
    }
  },
  /**
   * @typedef VerifyToken
   * @property {string} email.required - email address of the user - eg: user@mailinator.com
   * @property {string} password.required - password of the user - eg: 123123123
   */
  /**
   * Request for Verification of the JWT Token
   * @group Users
   * @route POST /user/verifyToken/
   * @param {VerifyToken.model} verifyToken.body.required
   * @security JWT
   */
  verifyToken: function (req, res) {
    try {
      if (req.headers.authorization && helpers.jwt.verifyJWT(req.headers.authorization)) {
        res.json({
          status: res.statusCode,
          message: lang.user.message.success.verifyToken
        });
      } else {
        throw ({
          status: 400,
          message: lang.user.message.error.verifyToken
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
   * @typedef orderconfirm
   * @property {string} productId.required - product id  - eg: asergyakljdskvnaspdjfskghgkdghdf
   * @property {string} productName.required - productName is required  - eg: tv
   * @property {string} quantity.required - quantity is required  - eg: 1
   * @property {string} mobile.required - mobile number is required  - eg: 7859997840
   * @property {string} price.required - product price is required  - eg: 150
   */
  /**
   * Request to change the password for the account
   * @group order
   * @route POST /user/orderconfirm
   * @param {orderconfirm.model} orderconfirm.body.required
   *   @security JWT
   */
  orderconfirm: async function (req, res) {
    try {
      const orderData = {
        productName: req.body.productName,
        productId: req.body.productId,
        quantity: req.body.quantity,
        mobile: req.body.mobile,
        price: req.body.price

      }
      helpers.smsSend.smsSend(req.body.mobile);
      res.json({
        status: 200,
        message: 'successfully order confirmed'
      });

    } catch (err) {
      res.json({
        status: err.status,
        message: err.message
      });
    }
  },




   /**
   * Request to get state
   * @group State & City
   * @route GET /getState
   */
  getState: async function (req, res) {
    try {
      var response = helpers.state;

      if (response) {
        res.json({
          status: res.statusCode,
          data: response,
        });
      } else {
        res.json({
          status: res.statusCode,
          message: 'Error in fetching'
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
   * Request to get city
   * @group State & City
   * @route GET /getCities
   */
  getCities: async function (req, res) {
    try {
      var response = helpers.city;

      if (response) {
        res.json({
          status: res.statusCode,
          data: response,
        });
      } else {
        res.json({
          status: res.statusCode,
          message: 'Error in fetching'
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
   * request to get category
   * @group UserCategory
   * @route GET /getAllCategory
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
   * request to get category
   * @group UserCategory
   * @route GET /getAllSubCategory
   */
  getAllSubCategory: async function (req, res) {
    try {
      const options = {
        path: 'categoryId',
        options: {
          retainNullValues: false 
        }
      };
      
      var response = await models.subCategory.find().populate(options);

      if (response) {
        var data= [];
        let catArray = [];
        let subArray = [];
        for(let item of response){
          if(!item.categoryId){
            console.log('do nothinggggggggggggggggggggggg',item)
          }
          else{
          console.log('itemmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmm',item)
          let status = catArray.findIndex((item1)=>{return item1._id==item.categoryId._id});
         
          if(status==-1){
            let obj = {_id:item._id,subCategoryName:item.subCategoryName,created_at:item.created_at,image:item.image};
            
            let status1 = subArray.findIndex((item1)=>{return item1._id==item._id});
            if(status1==-1) {
              var obj1= {
                _id:  item.categoryId._id,
                categoryName : item.categoryId.categoryName,
                image:item.categoryId.image,
                created_at : item.categoryId.created_at,
                subcategory:  [obj]
              }
              catArray.push(obj1)
            }
            // catArray.push(item.categoryId)
            // console.log('sssssssssssssssssssssssssssssss',status,JSON.stringify(catArray))
          }else{
            let newObj = catArray[status].subcategory;  
            let obj3 = {_id:item._id,subCategoryName:item.subCategoryName,created_at:item.created_at,image:item.image};
            newObj.push(obj3) 
            // console.log('letttttttttttttttttttttt',status,newObj)
            catArray.splice(status,1)
            var obj4= {
              _id: item.categoryId._id,
              categoryName : item.categoryId.categoryName,
              image:item.categoryId.image,
              created_at : item.categoryId.created_at,
              subcategory:  newObj
            }
            catArray.push(obj4)
          } 
         }
        }
        res.json({
          status: 200,
          message: 'successfully find category',
          // data: response,
          data:catArray
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
   * request to get brand
   * @group UserBrand
   * @route GET /getAllBrand
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
     * @typedef addBrand
     * @property {string} brandName.required - Brand Name is require - eg: website
     */
  /**
   * Request to add brand
   * @group UserBrand
   * @route POST /user/requestBrand
   * @param {addBrand.model} addBrand.body.required
   * @security JWT
   */

  requestBrand: async function (req, res) {
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
        isRequested : false
      }).save();
      console.log(response);
      if (response) {
        res.json({
          status: res.statusCode,
          message: "Brand Successfuly Requested.",
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
  

}

module.exports = methods;