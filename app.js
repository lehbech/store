var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var logger = require('morgan');
var cors = require('cors');
var dotenv = require('dotenv').config();

var app = express();
var models = require('./app/models');
var helpers = require('./app/helpers');
var lang = require('./app/lang');
var contantObj = require('./constant');
var debug = require('debug')('boilerplate:server');
var http = require('http');
// Swagger Init
const expressSwagger = require('express-swagger-generator')(app);
expressSwagger({
    swaggerDefinition: {
        info: {
            title: contantObj.SWAGGER_TITLE,
            description: contantObj.SWAGGER_DESCRIPTION,
            version: contantObj.SWAGGER_VERSION
        },
        host: '',
        consumes: ['application/json'],
        produces: ['application/json'],
        schemes: ['http', 'https'],
        securityDefinitions: {
            JWT: {
                type: 'apiKey',
                in: 'header',
                name: 'Authorization',
                description: 'Authentication Token for Grocery Store API'
            }
        }
    },
    basedir: __dirname, //app absolute path
    files: ['./app/controllers/*.js'] //Path to the API handle folder
});

// Get port from environment and store in Express.
var port = normalizePort(process.env.PORT || 3000);
app.set('port', port);
console.log('i am here....', port);

// Express Settings
app.use(logger('combined'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

// CORS Addtiion
app.use(cors());
app.options('*', cors());

// File Upload Limits
app.use(bodyParser.json({ limit: '128mb' }));
app.use(bodyParser.urlencoded({ limit: '128mb', extended: true }));

// Routes Init
app.use('/', jwtCheck);
app.use('/', require('./routes'));

async function jwtCheck(req, res, next) {
    try {
        var pathArray = [
            '/',
            '/uploadProduct',
            '/uploadCategory',
            '/getAllProductList',
            '/getAllCategory',
            '/getAllSubCategory',
            '/getAllBrand',
            '/getState',
            '/getCities',
            '/admin/login',
            '/user/check-user',
            '/user/login',
            '/user/register',
            '***TEST***',
            '/admin/paymentcount',
            '/admin/paymentcount',
            '/admin/maxminsellingproduct',
            '/admin/sellingcount'
        ];

        if (pathArray.includes(req.path)) {
            next();
        } else {
            if (req.headers.authorization) {
                var user = helpers.jwt.verifyJWT(req.headers.authorization);
                if (user.role == 'admin') {
                    if (req.path.includes('admin')) {
                        var response = true;
                    } else {
                        res.json({
                            status: 400,
                            message: lang.user.message.jwt.userRoutes
                        });
                    }
                } else if (user.role == 'user') {
                    if (req.path.includes('admin')) {
                        res.json({
                            status: 400,
                            message: lang.user.message.jwt.adminRoutes
                        });
                    } else {
                        var response = await models.user.findOne({
                            _id: user.id
                        });
                    }
                } else {
                    res.json({
                        status: 400,
                        message: lang.user.message.jwt.roleVerification
                    });
                }

                if (response) {
                    next();
                } else {
                    res.json({
                        status: 400,
                        message: lang.user.message.jwt.verification
                    });
                }
            } else {
                res.json({
                    status: 400,
                    message: lang.user.message.jwt.headers
                });
            }
        }
    } catch (err) {
        res.json({
            status: 400,
            message: 'Authentication Token has expired. Please logout and login again to continue'
        });
    }
}

// catch 404 and forward to error handler
app.use(function(req, res, next) {
    next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
    res.status(err.status ? err.status : 400 || 500).send({
        status: err.status ? err.status : 400,
        message: err.message
    });
});

// Normalize a port into a number, string, or false.
function normalizePort(val) {
    var port = parseInt(val, 10);

    if (isNaN(port)) {
        // named pipe
        return val;
    }

    if (port >= 0) {
        // port number
        return port;
    }

    return false;
}

// Event listener for HTTP server "error" event.

function onError(error) {
    console.log('Server', error);
    if (error.syscall !== 'listen') {
        throw error;
    }

    var bind = typeof port === 'string' ? 'Pipe ' + port : 'Port ' + port;

    // handle specific listen errors with friendly messages
    switch (error.code) {
        case 'EACCES':
            console.error(bind + ' requires elevated privileges');
            process.exit(1);
            break;
        case 'EADDRINUSE':
            console.error(bind + ' is already in use');
            process.exit(1);
            break;
        default:
            throw error;
    }
}

// Event listener for HTTP server "listening" event.
function onListening() {
    var addr = server.address();
    var bind = typeof addr === 'string' ? 'pipe ' + addr : 'port ' + addr.port;
    debug('Listening on ' + bind);
}

/* Server createion */

var server = http.createServer(app);
server.listen(port);
server.on('error', onError);
server.on('listening', onListening);

module.exports = app;
