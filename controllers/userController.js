const mongoose = require('mongoose');
const shortid = require('shortid');

//Libraries
const time = require('../libs/timeLib');
const password = require('../libs/passwordLib');
const response = require('../libs/responseLib');
const logger = require('../libs/loggerLib');
const validate = require('../libs/validationLib');
const check = require('../libs/checkLib');
const token = require('../libs/tokenLib');
const mail = require('../libs/mailLib');

//Models
const UserModel = mongoose.model('User');
const AuthModel = mongoose.model('Auth');

//Commom Functions Start-->

let getUserObjectId = (email) => {
    return new Promise((resolve, reject) => {

        UserModel.findOne({ email: email }, { _id: 1 })
            .then((user) => {
                if (check.isEmpty(user)) {
                    logger.error('No User Found', 'userController: getUserObjectId()', 7);
                    reject(response.generate(true, 'Failed to perform action', 404, null));
                } else {
                    logger.info('User Found', 'userController: getUserObjectId()', 10);
                    resolve(user._id);
                }
            })
            .catch((err) => {
                logger.error(err.message, 'userController: getUserObjectId()', 10);
                reject(response.generate(true, 'Failed to perform action', 500, null));
            });
    });
};

//<--Commom Functions End

let userController = {

    signUp: (req, res) => {

        //Local Function Start-->

        let validateUserInput = () => {
            return new Promise((resolve, reject) => {

                if (!req.body.email || !req.body.mobileNumber || !req.body.password || !req.body.firstName || !req.body.lastName || !req.body.countryCode) {

                    logger.error('Field Missing', 'userController: validateUserInput()', 5);
                    reject(response.generate(true, 'One or More Parameter(s) is missing', 400, null));

                } else if (!validate.email(req.body.email)) {

                    logger.error('Invalid Email Field', 'userController: validateUserInput()', 5);
                    reject(response.generate(true, 'Email does not met the requirement', 400, null));

                } else if (!validate.mobileNumber(req.body.mobileNumber, req.body.countryCode)) {

                    logger.error('Invalid Mobile Number', 'userController: validateUserInput()', 5);
                    reject(response.generate(true, 'Email does not met the requirement', 400, null));

                } else if (!validate.password(req.body.password)) {

                    logger.error('Invalid Password', 'userController: validateUserInput()', 5);
                    reject(response.generate(true, 'Password does not met the requirement', 400, null));

                } else {

                    logger.info('User Input Validated', 'userController: validateUserInput()', 5);
                    resolve();

                }
            });
        }

        let createUser = () => {
            return new Promise((resolve, reject) => {

                let newUser = {
                    userId: shortid.generate(),
                    firstName: req.body.firstName,
                    lastName: req.body.lastName,
                    email: req.body.email.toLowerCase(),
                    mobileNumber: req.body.mobileNumber,
                    password: password.hashpassword(req.body.password),
                    countryCode: req.body.countryCode
                };

                UserModel.create(newUser)
                    .then((user) => {
                        logger.info('User Created', 'userController: createUser', 10);
                        resolve(response.generate(false, 'User created', 200, null));
                    })
                    .catch((err) => {
                        logger.error(err.message, 'userController: createUser', 10);
                        reject(response.generate(true, 'Failed to create user', 403, null));
                    });

            });
        }

        //<--Local Functions End

        validateUserInput(req, res)
            .then(createUser)
            .then((resolve) => {
                res.status(resolve.status)
                res.send(resolve);
            })
            .catch((err) => {
                res.status(err.status);
                res.send(err);
            });

    },

    login: (req, res) => {

        //Local Function Start-->

        let validateUserInput = () => {
            return new Promise((resolve, reject) => {

                if (!req.body.email || !req.body.password) {

                    logger.error('Field Missing', 'userController: validateUserInput()', 5);
                    reject(response.generate(true, 'One or More Parameter(s) is missing', 400, null));

                } else if (!validate.email(req.body.email)) {

                    logger.error('Invalid Email Field', 'userController: validateUserInput()', 5);
                    reject(response.generate(true, 'Email does not met the requirement', 400, null));

                } else if (!validate.password(req.body.password)) {

                    logger.error('Invalid Password', 'userController: validateUserInput()', 5);
                    reject(response.generate(true, 'Password does not met the requirement', 400, null));

                } else {

                    logger.info('User Input Validated', 'userController: validateUserInput()', 5);
                    resolve();

                }
            });
        }

        let findUser = () => {
            return new Promise((resolve, reject) => {

                UserModel.findOne({ email: req.body.email }, { _id: 0, userId: 1, email: 1, password: 1, firstName: 1, lastName: 1, mobileNumber: 1, countryCode: 1 })
                    .then((user) => {
                        if (check.isEmpty(user)) {
                            logger.error('No User Found', 'userController: findUser()', 7);
                            reject(response.generate(true, 'Account does not exists!', 404, null));
                        } else {
                            logger.info('User Found', 'userController: findUser()', 10);
                            let userObj = user.toObject();
                            resolve(userObj);
                        }
                    })
                    .catch((err) => {
                        logger.error(err.message, 'userController: findUser()', 10);
                        reject(response.generate(true, 'Login failed', 500, null));
                    });
            });
        }

        let validatePassword = (userObj) => {
            return new Promise((resolve, reject) => {

                password.comparePassword(req.body.password, userObj.password)
                    .then((isMatch) => {
                        if (isMatch) {
                            logger.info('Password validated', 'userController: validatePassword()', 10);
                            delete userObj.password;
                            resolve(userObj);
                        } else {
                            logger.error('Login Failed Due To Invalid Password', 'userController: validatePassword()', 10);
                            reject(response.generate(true, 'Wrong password, Login failed', 400, null));
                        }
                    })
                    .catch((err) => {
                        logger.error(err.message, 'userController: validatePassword()', 10);
                        reject(response.generate(true, 'Login failed', 500, null));
                    });
            });
        }

        let generateToken = (user) => {
            return new Promise((resolve, reject) => {
                token.generateToken(user)
                    .then((tokenDetails) => {
                        logger.info('Token Generated', 'userController: generateToken()', 10);
                        tokenDetails.userId = user.userId;
                        resolve(tokenDetails);
                    })
                    .catch((err) => {
                        logger.error(err.message, 'userController: generateToken()', 10);
                        reject(response.generate(true, 'Login failed', 500, null));
                    });
            });
        }

        let saveToken = (tokenDetails) => {
            let newAuthToken = new AuthModel({
                userId: tokenDetails.userId,
                authToken: tokenDetails.token,
                tokenSecret: tokenDetails.tokenSecret,
                tokenGenerationTime: time.now()
            });
            return new Promise((resolve, reject) => {
                AuthModel.create(newAuthToken)
                    .then((token) => {
                        logger.info('Token Saved', 'userController: saveToken()', 10);
                        let data = {
                            authToken: token.authToken,
                            userId: token.userId
                        }
                        resolve(data);
                    })
                    .catch((err) => {
                        logger.error(err.message, 'userController: saveToken()', 10);
                        req.user = { userId: tokenDetails.userId };
                        userController.logout(req, res);
                        reject(response.generate(true, 'Failed you may be login somewhere else, Try Again!', 500, null));
                    });
            });
        }

        //<--Local Functions End

        validateUserInput(req, res)
            .then(findUser)
            .then(validatePassword)
            .then(generateToken)
            .then(saveToken)
            .then((resolve) => {
                res.status(200);
                res.send(response.generate(false, 'Login Successful', 200, resolve));
            })
            .catch((err) => {
                res.status(err.status);
                res.send(err);
            });
    },

    logout: (req, res) => {

        AuthModel.findOneAndDelete({ userId: req.user.userId })
            .then((result) => {
                if (check.isEmpty(result)) {
                    logger.info('User already Logged out', 'userController: logout()', 10);
                    res.status(500);
                    res.send(response.generate(true, 'Already logged out', 500, null))
                } else {
                    logger.info('User Logged out', 'userController: logout()', 10);
                    res.status(200);
                    res.send(response.generate(false, 'Logged out successfully', 200, null));
                }
            })
            .catch((err) => {
                logger.error(err.message, 'user Controller: logout()', 10);
                res.status(500);
                res.send(response.generate(true, 'Failed to perform action', 500, null));
            });
    },

    getUsers: (req, res) => {

        UserModel.find({
                userId: { $ne: req.user.userId }
            }, { _id: 0, firstName: 1, lastName: 1, email: 1 })
            .then((users) => {
                if (check.isEmpty(users)) {
                    logger.info('No User Found', 'User Controller: getUsers()');
                    res.status(404);
                    res.send(response.generate(true, 'No User Found', 404, null));
                } else {
                    logger.info('Users Found', 'User Controller: getUsers()');
                    res.status(200);
                    res.send(response.generate(false, 'All users details fetched', 200, users));
                }
            })
            .catch((err) => {
                logger.error(err.message, 'User Controller: getUsers()', 10);
                res.status(500);
                res.send(response.generate(true, 'Failed to perform action', 500, null));
            });
    },

    getUser: (req, res) => {

        delete req.user.userId;
        logger.info('User Details Fetched', 'User Controller: getUser()', 10);
        res.status(200);
        res.send(response.generate(false, 'User details fetched', 200, req.user));
    },

    deleteUser: (req, res) => {

        UserModel.findOneAndDelete({ 'userId': req.user.userId })
            .then((result) => {
                if (check.isEmpty(result)) {
                    logger.info('No User Found', 'User Controller: deleteUser');
                    res.status(404);
                    res.send(response.generate(true, 'No User Found', 404, null));
                } else {
                    logger.info('User Deleted', 'User Controller: deleteUser');
                    res.status(200);
                    res.send(response.generate(false, 'Deleted the user successfully', 200, null));
                }
            })
            .catch((err) => {
                res.status(err.status);
                logger.error(err.message, 'User Controller: deleteUser', 10);
                res.send(response.generate(true, 'Failed To delete user', 500, null));
            });
    },

    editUser: (req, res) => {
        let data = {};
        if (req.body.firstName)
            data['firstName'] = req.body.firstName;
        if (req.body.lastName)
            data['lastName'] = req.body.lastName;
        if (req.body.mobileNumber && req.body.countryCode && validate.mobileNumber(req.body.mobileNumber, req.body.countryCode)) {
            data['mobileNumber'] = req.body.mobileNumber;
            data['countryCode'] = req.body.countryCode
        }
        if (req.body.email && validate.email(email))
            data['email'] = req.body.email;
        if (req.body.password && validate.password(password))
            data['password'] = req.body.password;
        req.body['modifiedOn'] = time.now();

        UserModel.findOneAndUpdate(req.user.userId, {
                $set: data
            }, { new: true }) //To return updated document
            //.update({ 'userId': req.user.userId }, req.body) //Alternative
            .select('-_id firstName lastName email mobileNumber countryCode')
            .exec()
            .then((user) => {
                if (check.isEmpty(user)) {
                    logger.info('No User Found', 'User Controller: editUser');
                    res.status(404);
                    res.send(response.generate(true, 'No user found', 404, null));
                } else {
                    logger.info('User Updated', 'User Controller: editUser');
                    res.status(200);
                    res.send(response.generate(false, 'User details edited', 200, user));
                }
            })
            .catch((err) => {
                logger.error(err.message, 'User Controller:editUser', 10);
                res.status(500);
                res.send(response.generate(true, 'Failed To edit user details', 500, null));
            });
    },

    forgotPassword: (req, res) => {

        if (check.isEmpty(req.body.email) || !validate.email(req.body.email)) {
            logger.error('Email Field Not Valid', 'userController: forgotPassword()', 5);
            res.status(400);
            res.send(response.generate(true, 'Invalid email!', 400, null));
        } else {
            UserModel.findOne({ 'email': req.body.email })
                .then((user) => {
                    if (check.isEmpty(user)) {
                        logger.info('No User Found', 'userController: forgotPassword()');
                        res.status(404);
                        res.send(response.generate(true, 'Email is not registered', 404, null));
                    } else {
                        logger.info('User Found', 'userController: forgotPassword()');
                        let OTP = password.createOTP();
                        let data = {
                            to: req.body.email,
                            subject: 'Forgot Password OTP',
                            text: `Dear ${user.firstName} ${user.lastName} your One Time Password(OTP) is ${OTP}, use it to change the existing password for Issue Tracking Tool Application.`
                        }
                        mail.sendMail(data)
                            .then((msg) => {
                                logger.info(msg, 'userController: sendMail : forgotPassword()');
                                user.modifiedOn = time.now();
                                user.OTP = password.hashpassword(OTP.toString());
                                user.save(function(err) {
                                    if (err) {
                                        res.status(500);
                                        logger.error(err.message, 'userController: forgotPassword()', 10);
                                        res.send(response.generate(true, 'Failed to perform action', 500, null));
                                    } else {
                                        res.status(200);
                                        logger.info('OTP saved', 'userController: forgotPassword()', 10);
                                        res.send(response.generate(false, 'OTP send to registered email', 200, null));
                                    }
                                });
                            })
                            .catch((err) => {
                                res.status(500);
                                logger.error(err, 'userController: forgotPassword()', 10);
                                res.send(response.generate(true, 'Failed to perform operation', 500, null));
                            });
                    }
                })
                .catch((err) => {
                    res.status(500);
                    logger.error(err.message, 'userController: forgotPassword()', 10);
                    res.send(response.generate(true, 'Failed to perform operation', 500, null));
                });
        }
    },

    changePassword: (req, res) => {

        //Local Function Start-->

        let validateParams = () => {
            return new Promise((resolve, reject) => {
                if (check.isEmpty(req.body.email) || check.isEmpty(req.body.OTP) || check.isEmpty(req.body.newPassword)) {
                    logger.error('Parameters Missing', 'userController: changePassword(): validateParams()', 9);
                    reject(response.generate(true, 'parameters missing.', 403, null));
                } else if (!validate.email(req.body.email) || !validate.password(req.body.newPassword)) {
                    logger.error('Invalid Email Parameter', 'userController: changePassword(): validateParams()', 9);
                    reject(response.generate(true, 'parameters invalid.', 403, null));
                } else {
                    logger.info('Parameters Validated', 'userController: changePassword(): validateParams()', 9);
                    resolve();
                }
            });
        }

        let findUser = () => {
            return new Promise((resolve, reject) => {

                UserModel.findOne({ email: req.body.email })
                    .then((user) => {
                        if (check.isEmpty(user)) {
                            logger.error('No User Found', 'userController: findUser()', 7);
                            reject(response.generate(true, 'Account does not exists!', 404, null));
                        } else {
                            logger.info('User Found', 'userController: findUser()', 10);
                            resolve(user);
                        }
                    })
                    .catch((err) => {
                        logger.error(err.message, 'userController: findUser()', 10);
                        res.send(response.generate(true, 'Failed to perform operation', 500, null));
                    });
            });
        }

        let validatePassword = (user) => {
            return new Promise((resolve, reject) => {
                password.comparePassword(req.body.OTP, user.OTP)
                    .then((isMatch) => {
                        if (isMatch) {
                            logger.info('Password validated', 'userController: validatePassword()', 10);
                            user.password = password.hashpassword(req.body.newPassword);
                            user.OTP = undefined;
                            user.modifiedOn = time.now();
                            user.save(function(err) {
                                if (err) {
                                    logger.error(err.message, 'userController: validatePassword()', 10);
                                    resolve(response.generate(true, 'Failed to perform action', 500, null));
                                } else {
                                    logger.info('Password Changed', 'userController: validatePassword()', 10);
                                    resolve(response.generate(false, 'Password changed', 200, null));
                                }
                            });
                        } else {
                            logger.error('Wrong OTP', 'userController: validatePassword()', 10);
                            reject(response.generate(true, 'Wrong OTP!', 400, null));
                        }
                    })
                    .catch((err) => {
                        logger.error(err.message, 'userController: validatePassword()', 10);
                        reject(response.generate(true, 'Login Failed', 500, null));
                    });
            });
        }

        //<--Local Functions End

        findUser(req, res)
            .then(validateParams)
            .then(findUser)
            .then(validatePassword)
            .then((apiResponse) => {
                res.status(apiResponse.status);
                res.send(apiResponse);
            })
            .catch((err) => {
                res.status(err.status);
                res.send(err);
            });
    }

}

module.exports = userController;