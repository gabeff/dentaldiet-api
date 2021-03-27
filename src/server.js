const AdminBro = require('admin-bro')
const AdminBroMongoose = require('@admin-bro/mongoose')
const AdminBroExpress = require('@admin-bro/express')

AdminBro.registerAdapter(AdminBroMongoose);

const express = require('express');
const path = require('path');
const mongoose = require('mongoose');
const cors = require('cors');
const bodyParser = require('body-parser');
const fileUpload = require('express-fileupload');
const logger = require('morgan');
require('dotenv').config();
const cookieParser = require('cookie-parser');

const routes = require('./routes');

const app = express();
const { CLIENT_ORIGIN } = require('./config');

const server = require('http').Server(app);

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

mongoose.set('useFindAndModify', false);
mongoose.set('useCreateIndex', true);

const run = async () => {
    const mongooseDb = await mongoose.connect(`${process.env.DB_PREFIX}://${process.env.DB_USER}:${process.env.DB_PASS}@${process.env.DB_HOST}`, {
        useNewUrlParser: true,
        useUnifiedTopology: true
    });

    const adminBro = new AdminBro({
        databases: [mongooseDb],
        rootPath: '/admin',
        locale: {
            language: 'pt-BR',
        },
        branding: {
            companyName: 'Dental Diet',
            logo: '/public/logo192.png'
        },
    });

    const router = AdminBroExpress.buildAuthenticatedRouter(adminBro, {
        authenticate: async (email, password) => {
          if (password === process.env.ADMIN_PASS) {
              return true
          } else {
              return false
          }
        },
        cookiePassword: process.env.ADMIN_PASS,
    });

    app.use(adminBro.options.rootPath, router);

    const whitelist = ['http://localhost:3000', 
                        'https://dental-diet.web.app']

    app.use(logger('dev'));
    app.use(cors({
        "origin": whitelist, 
        // "origin": "http://localhost:3000",
        "credentials": true,
        "exposedHeaders": ["Uid", "Access-Token"]
    }));
    app.use(bodyParser.json());
    app.use(bodyParser.urlencoded({ extended: true }));
    app.use(fileUpload());
    app.use('/public', express.static(__dirname + '/public'));
    app.use('/favicon.ico', express.static('public/favicon.ico'));
    app.use(cookieParser());

    app.use(express.json());
    app.use(routes);

    // catch 404 and forward to error handler
    app.use(function (req, res, next) {
        const err = new Error('Not Found');
        err.status = 404;
        next(err);
    });

    // error handler
    app.use(function (err, req, res, next) {
        // set locals, only providing error in development
        res.locals.message = err.message;
        res.locals.error = req.app.get('env') === 'development' ? err : {};

        // render the error page
        res.status(err.status || 500);
        res.render('error');
    });

    server.listen(process.env.PORT || 8080, () => {
        const host = server.address().address;
        const port = server.address().port;

        console.log(`listening at ${process.env.CLIENT_ORIGIN}:${port}`);
    });
}

run();