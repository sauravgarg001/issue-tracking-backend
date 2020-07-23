var express = require('express');
var router = express.Router();

//Controllers
const userController = require("../controllers/userController");

//Middlewares
const auth = require('../middlewares/auth')

/**
    * @apiGroup users
    * @apiVersion  1.0.0
    * @api {post} /api/v1/users/signup to create a new user account.
    * 
    * @apiParam {string} firstName first name of user. (body params) (required)
    * @apiParam {string} lastName last name of user. (body params) (required)
    * @apiParam {string} mobileNumber mobile number of user. (body params) (required)
    * @apiParam {string} email email address of user. (body params) (required)
    * @apiParam {string} password password of user's account. (body params) (required)
    * @apiParam {string} countryCode country code of user's mobile number. (body params) (required)
    *
    * @apiSuccess {object} myResponse shows error status, message, http status code, result.
    * 
    * @apiSuccessExample {object} Success-Response:
        {
         "error": false,
         "message": "User created",
         "status": 200,
         "data": null
       }
  */
router.route('/signup').post(userController.signUp);

/**
    * @apiGroup users
    * @apiVersion  1.0.0
    * @api {post} /api/v1/users/login to login into user's account.
    * 
    * @apiParam {string} email email address of user. (body params) (required)
    * @apiParam {string} password password of user's account. (body params) (required)
    *
    * @apiSuccess {object} myResponse shows error status, message, http status code, result.
    * 
    * @apiSuccessExample {object} Success-Response:
        {
         "error": false,
         "message": "Login Successful",
         "status": 200,
         "data": {
                "userId": "xxTb61m4F",
                "authToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJqd3RpZCI6Im8zMlh5cVpjcSIsImlhdCI6MTU5NTQ4MzU0Mzk1MCwiZXhwIjoxNTk1NTY5OTQzLCJzdWIiOiJhdXRoVG9rZW4iLCJpc3MiOiJpbmN1YkNoYXQiLCJkYXRhIjp7InVzZXJJZCI6Ik1iY3pENW9DZyIsImZpcnN0TmFtZSI6IlNhdXJhdiIsImxhc3ROYW1lIjoiR2FyZyIsImVtYWlsIjoic2F1cmF2Z2FyZzAwMUBnbWFpbC5jb20iLCJtb2JpbGVOdW1iZXIiOjc2OTYyNTY0MDAsImNvdW50cnlDb2RlIjoiOTEifX0.K_gZEgEUvBPOUSRvN_e6tPVf-UKuvzPL387hlKvE_ig"
         }
       }
  */
router.route('/login').post(userController.login);

/**
    * @apiGroup users
    * @apiVersion  1.0.0
    * @api {post} /api/v1/users/logout to log out from user's account.
    * 
    * @apiParam {string} authToken authToken of user. (body params) (required)
    *
    * @apiSuccess {object} myResponse shows error status, message, http status code, result.
    * 
    * @apiSuccessExample {object} Success-Response:
        {
         "error": false,
         "message": "Logged Out Successfully",
         "status": 200,
         "data": null
       }
  */
router.route('/logout').post(auth.isAuthorized, userController.logout);

/**
    * @apiGroup users
    * @apiVersion  1.0.0
    * @api {get} /api/v1/users/all to get details of all users.
    * 
    * @apiParam {string} authToken authToken of user. (query params) (required)
    *
    * @apiSuccess {object} myResponse shows error status, message, http status code, result.
    * 
    * @apiSuccessExample {object} Success-Response:
        {
         "error": false,
         "message": "All User Details Found",
         "status": 200,
         "data": [
            {
                email: "abc@gmail.com"
                firstName: "ABC"
                lastName: "DEF"
            },
            {
                email: "xyz@gmail.com"
                firstName: "XYZ"
                lastName: "123"
            },
            .........................
         ]
       }
  */
router.route('/all').get(auth.isAuthorized, userController.getUsers);

/**
    * @apiGroup users
    * @apiVersion  1.0.0
    * @api {get} /api/v1/users/ to get details of user.
    * 
    * @apiParam {string} authToken authToken of user. (query params) (required)
    *
    * @apiSuccess {object} myResponse shows error status, message, http status code, result.
    * 
    * @apiSuccessExample {object} Success-Response:
        {
         "error": false,
         "message": "User Details Found",
         "status": 200,
         "data": {
            email: "abc@gmail.com"
            firstName: "ABC"
            lastName: "978"
            mobileNumber: 9876543210,
            countryCode: '91'
        }
       }
  */
router.route('/').get(auth.isAuthorized, userController.getUser);

/**
    * @apiGroup users
    * @apiVersion  1.0.0
    * @api {post} /api/v1/users/forgot/password to send OTP to user's registered email address.
    *
    * @apiParam {string} email email address of user. (body params) (required)
    *
    * @apiSuccess {object} myResponse shows error status, message, http status code, result.
    * 
    * @apiSuccessExample {object} Success-Response:
        {
         "error": false,
         "message": "OTP send to registered email",
         "status": 200,
         "data":null
       }
  */
router.route('/forgot/password').post(userController.forgotPassword);

/**
    * @apiGroup users
    * @apiVersion  1.0.0
    * @api {post} /api/v1/users/forgot/password to send OTP to user's registered email address.
    *
    * @apiParam {string} email email address of user. (body params) (required)
    * @apiParam {string} OTP OTP of user. (body params) (required)
    * @apiParam {string} newPassword new password of user account. (body params) (required)
    *
    * @apiSuccess {object} myResponse shows error status, message, http status code, result.
    * 
    * @apiSuccessExample {object} Success-Response:
        {
         "error": false,
         "message": "Password changed",
         "status": 200,
         "data":null
       }
  */
router.route('/change/password').put(userController.changePassword);

module.exports = router;