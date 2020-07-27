var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
const mongoose = require('mongoose');
const helmet = require('helmet');

//Config
const appConfig = require('./config/configApp');

//Models
const UserModel = require('./models/User');
const AuthModel = require('./models/Auth');
const IssueModel = require('./models/Issue');

var app = express();

//Middlewares
const routeLoggerMiddleware = require('./middlewares/routeLogger');
const globalErrorMiddleware = require('./middlewares/globalErrorHandler');

app.use(logger(appConfig.environment));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
app.use(routeLoggerMiddleware.logIp);
app.use(globalErrorMiddleware.globalErrorHandler);
app.use(helmet());

//Routes
var indexRouter = require('./routes/index');
var userRouter = require('./routes/user');
var issueRouter = require('./routes/issue');
app.use(`${appConfig.apiVersion}/`, indexRouter);
app.use(`${appConfig.apiVersion}/users`, userRouter);
app.use(`${appConfig.apiVersion}/issues`, issueRouter);

//Mongoose connection
const connect = mongoose.connect(appConfig.db.url, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useCreateIndex: true,
    useFindAndModify: false
});
connect.then((db) => {
    console.log("Mongoose connection successfully opened");
}, (err) => { console.log(err); });

module.exports = app;