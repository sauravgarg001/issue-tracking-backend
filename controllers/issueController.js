const mongoose = require('mongoose');
const shortid = require('shortid');

//Libraries
const time = require('../libs/timeLib');
const response = require('../libs/responseLib');
const logger = require('../libs/loggerLib');
const validate = require('../libs/validationLib');
const check = require('../libs/checkLib');

//Models
const UserModel = mongoose.model('User');
const IssueModel = mongoose.model('Issue');

//Commom Functions Start-->

let getUserObjectId = (email) => {
    return new Promise((resolve, reject) => {

        UserModel.findOne({ email: email }, { _id: 1 })
            .then((user) => {
                if (check.isEmpty(user)) {
                    logger.error('No User Found', 'issueController: getUserObjectId()', 7);
                    reject(response.generate(true, 'Failed to perform action', 404, null));
                } else {
                    logger.info('User Found', 'issueController: getUserObjectId()', 10);
                    resolve(user._id);
                }
            })
            .catch((err) => {
                logger.error(err.message, 'issueController: getUserObjectId()', 10);
                reject(response.generate(true, 'Failed to perform action', 500, null));
            });
    });
};

//<--Commom Functions End

let issueController = {

    createIssue: (req, res) => {

        //Local Function Start-->

        let validateUserInput = () => {
            return new Promise((resolve, reject) => {

                if (!req.body.title || !req.body.description || !req.body.assignees) {

                    logger.error('Field Missing', 'issueController: validateUserInput()', 5);
                    reject(response.generate(true, 'One or More Parameter(s) is missing', 400, null));

                } else {
                    req.body.assignees = JSON.parse(decodeURI(req.body.assignees));

                    if (req.body.assignees.length > 0) {
                        let invalid = false;
                        for (let assignee of req.body.assignees) {
                            if (!validate.email(assignee.to.email)) {
                                invalid = true;
                                break;
                            }
                        }
                        if (invalid) {
                            logger.error('Invalid Assignee Email', 'issueController: validateUserInput()', 5);
                            reject(response.generate(true, 'Assignee email does not met the requirement', 400, null));
                        } else {
                            logger.info('User Input Validated', 'issueController: validateUserInput()', 5);
                            resolve();
                        }
                    } else {
                        logger.error('No Assignee', 'issueController: validateUserInput()', 5);
                        reject(response.generate(true, 'No assignee added!', 400, null));
                    }

                }
            });
        }

        let getAssigneeId = () => {
            return new Promise((resolve, reject) => {
                let assignees = Array();
                for (let i = 0; i < req.body.assignees.length; i++) {
                    getUserObjectId(req.body.assignees[i].to.email)
                        .then((_id) => {
                            assignees.push({ to: mongoose.Types.ObjectId(_id) });
                            if (i == req.body.assignees.length - 1) {
                                logger.info('All ObjectId Fetched', 'issueController: getAssigneeId()', 5);
                                req.body.assigneesIds = assignees;
                                resolve(req.user.email);
                            }
                        }).catch((err) => {
                            logger.error('No ObjectId Found', 'issueController: getAssigneeId()', 5);
                            reject(err);
                        });
                }
            });
        }

        let createIssue = (_id) => {
            return new Promise((resolve, reject) => {

                let newIssue = {
                    issueId: shortid.generate(),
                    title: req.body.title,
                    reporter: _id,
                    description: req.body.description,
                    assignees: req.body.assigneesIds,
                };

                IssueModel.create(newIssue)
                    .then((issue) => {
                        logger.info('Issue Created', 'issueController: createIssue', 10);
                        resolve(issue.issueId);
                    })
                    .catch((err) => {
                        logger.error(err.message, 'issueController: createIssue', 10);
                        reject(response.generate(true, 'Failed to create issue', 403, null));
                    });

            });
        }

        let saveNotification = (issueId) => {
            return new Promise((resolve, reject) => {

                for (let i = 0; i < req.body.assignees.length; i++) {

                    UserModel.findOneAndUpdate({ email: req.body.assignees[i].to.email }, {
                            $addToSet: {
                                notifications: {
                                    issueId: issueId,
                                    by: {
                                        email: req.user.email,
                                        firstName: req.user.firstName,
                                        lastName: req.user.lastName
                                    },
                                    message: `assigned you new issue with title '${req.body.title}'`
                                }
                            },
                            $set: {
                                modifiedOn: time.now()
                            }
                        }, { new: true }) //To return updated document
                        .exec()
                        .then((user) => {
                            if (check.isEmpty(user)) {
                                logger.info('No User Found', 'issueController: saveNotification');
                                reject(response.generate(true, 'Failed to perform action', 404, null));
                            } else {
                                logger.info('Notification Saved', 'issueController: saveNotification');
                                if (i == req.body.assignees.length - 1) {
                                    resolve(response.generate(false, 'Issue created', 200, { issueId: issueId }));
                                }
                            }
                        })
                        .catch((err) => {
                            logger.error(err.message, 'issueController: saveNotification', 10);
                            reject(response.generate(true, 'Failed to perform action', 500, null));
                        });
                }
            });
        }

        //<--Local Functions End

        validateUserInput()
            .then(getAssigneeId)
            .then(getUserObjectId)
            .then(createIssue)
            .then(saveNotification)
            .then((resolve) => {
                res.status(resolve.status)
                res.send(resolve);
            })
            .catch((err) => {
                res.status(err.status);
                res.send(err);
            });

    },

    getIssue: (req, res) => {

        //Local Function Start-->

        let validateUserInput = () => {
            return new Promise((resolve, reject) => {

                if (!req.query.issueId) {

                    logger.error('Field Missing', 'issueController: validateUserInput()', 5);
                    reject(response.generate(true, 'One or More Parameter(s) is missing', 400, null));

                } else {

                    logger.info('User Input Validated', 'issueController: validateUserInput()', 5);
                    resolve();

                }
            });
        }

        let findIssue = () => {
            return new Promise((resolve, reject) => {

                IssueModel.findOne({ issueId: req.query.issueId }, { _id: 0, issueId: 1, title: 1, description: 1, reporter: 1, status: 1, assignees: 1, createdOn: 1, modifiedOn: 1 })
                    .populate('reporter', '-_id email firstName lastName')
                    .populate('assignees.to', '-_id email firstName lastName')
                    .then((issue) => {
                        if (check.isEmpty(issue)) {
                            logger.error('No Issue Found', 'issueController: findIssue()', 7);
                            reject(response.generate(true, 'No issue found', 404, null));
                        } else {
                            logger.info('Issue Found', 'issueController: findIssue()', 10);
                            let issueObj = issue.toObject();
                            resolve(response.generate(false, 'Issue fetched', 200, issueObj));
                        }
                    })
                    .catch((err) => {
                        logger.error(err.message, 'issueController: findIssue()', 10);
                        reject(response.generate(true, 'Failed to fetch issue', 500, null));
                    });
            });
        }

        //<--Local Functions End

        validateUserInput()
            .then(findIssue)
            .then((resolve) => {
                res.status(200);
                res.send(resolve);
            })
            .catch((err) => {
                res.status(err.status);
                res.send(err);
            });
    },

    editIssue: (req, res) => {

        //Local Function Start-->

        let validateUserInput = () => {
            return new Promise((resolve, reject) => {
                if (!req.body.issueId) {

                    logger.error('Field Missing', 'issueController: validateUserInput()', 5);
                    reject(response.generate(true, 'One or More Parameter(s) is missing', 400, null));

                } else {
                    if (req.body.assignees) {
                        req.body.assignees = JSON.parse(decodeURI(req.body.assignees));
                        if (req.body.assignees.length && req.body.assignees.length > 0) {
                            let invalid = false;
                            for (let assignee of req.body.assignees) {
                                if (!validate.email(assignee.to.email)) {
                                    invalid = true;
                                    break;
                                }
                            }
                            if (invalid) {
                                logger.error('Invalid Assignee Email', 'issueController: validateUserInput()', 5);
                                reject(response.generate(true, 'Assignee email does not met the requirement', 400, null));
                            } else {
                                logger.info('User Input Validated', 'issueController: validateUserInput()', 5);
                                resolve();
                            }
                        } else {
                            logger.error('No Assignee', 'issueController: validateUserInput()', 5);
                            reject(response.generate(true, 'One or More Parameter(s) is missing', 400, null));
                        }
                    } else {
                        logger.info('User Input Validated', 'issueController: validateUserInput()', 5);
                        resolve();
                    }
                }
            });
        }

        let getAssigneeId = () => {
            return new Promise((resolve, reject) => {
                if (req.body.assignees && req.body.assignees.length > 0) {
                    let assignees = Array();
                    for (let i = 0; i < req.body.assignees.length; i++) {
                        getUserObjectId(req.body.assignees[i].to.email)
                            .then((_id) => {
                                let assignedOn;
                                if (req.body.assignees[i].assignedOn) {
                                    assignedOn = req.body.assignees[i].assignedOn;
                                } else {
                                    assignedOn = time.now();
                                }
                                assignees.push({ to: mongoose.Types.ObjectId(_id), assignedOn: assignedOn });
                                if (i == req.body.assignees.length - 1) {
                                    logger.info('All ObjectId Fetched', 'issueController: getAssigneeId()', 5);
                                    req.body.assigneesIds = assignees;
                                    resolve();
                                }
                            }).catch((err) => {
                                logger.error('No ObjectId Found', 'issueController: getAssigneeId()', 5);
                                reject(err);
                            });
                    }
                } else {
                    logger.info('No Assignee updated', 'issueController: getAssigneeId()', 5);
                    resolve();
                }
            });
        }

        let findIssue = (_id) => {
            return new Promise((resolve, reject) => {

                IssueModel.findOne({ issueId: req.body.issueId, $or: [{ "assignees.to": _id }, { "reporter": _id }] }, { _id: 0, issueId: 1, title: 1, description: 1, reporter: 1, status: 1, assignees: 1, createdOn: 1, modifiedOn: 1 })
                    .populate('reporter', '-_id email firstName lastName')
                    .populate('assignees.to', '-_id email firstName lastName')
                    .then((issue) => {
                        if (check.isEmpty(issue)) {
                            logger.error('No Issue Found', 'issueController: findIssue()', 7);
                            reject(response.generate(true, 'Failed to perform action', 404, null));
                        } else {
                            logger.info('Issue Found', 'issueController: findIssue()', 10);
                            let issueObj = issue.toObject();
                            resolve(issueObj);
                        }
                    })
                    .catch((err) => {
                        logger.error(err.message, 'issueController: findIssue()', 10);
                        reject(response.generate(true, 'Failed to perform action', 500, null));
                    });
            });
        }

        let symmDiff = (oldArray, newArray) => {

            let removedElements = JSON.parse(JSON.stringify(oldArray));
            let addedElements = JSON.parse(JSON.stringify(newArray));

            for (let i = 0; i < removedElements.length; i++) {
                for (let j = 0; j < addedElements.length; j++) {
                    if (removedElements[i].to.email == addedElements[j].to.email) {
                        removedElements.splice(i, 1);
                        addedElements.splice(j, 1);
                        i--;
                        break;
                    }
                }
            }

            return {
                removed: removedElements,
                added: addedElements
            }
        }

        let editIssue = (issueObj) => {
            return new Promise((resolve, reject) => {

                let data = {};
                let message = '';
                if (req.user.email == issueObj.reporter.email) {
                    if (req.body.title && req.body.title != issueObj.title) {
                        data['title'] = req.body.title;
                        if (message) {
                            message += ' ';
                        }
                        message += `changed title from '${issueObj.title}' to '${req.body.title}'`;
                    }
                    if (req.body.description && req.body.description != issueObj.description) {
                        data['description'] = req.body.description;
                        if (message) {
                            message += ' ';
                        }
                        message += `changed description from '${issueObj.description}' to '${req.body.description}'`;
                    }
                    if (req.body.status && validate.status(req.body.status) && req.body.status != issueObj.status) {
                        data['status'] = req.body.status;
                        if (message) {
                            message += ' ';
                        }
                        message += `changed status from '${issueObj.status}' to '${req.body.status}'`;
                    }
                }
                if (req.body.assigneesIds) {
                    data['assignees'] = req.body.assigneesIds;

                    let { added, removed } = symmDiff(issueObj.assignees, req.body.assignees);

                    if (!check.isEmpty(added)) {
                        if (message) {
                            message += ' ';
                        }
                        message += 'added assignee(s)';
                        for (let i = 0; i < added.length; i++) {
                            message += ` ${added[i].to.firstName} ${added[i].to.lastName}`;
                            if (i != added.length - 1) {
                                message += ',';
                            }
                        }
                    }
                    if (!check.isEmpty(removed)) {
                        if (message) {
                            message += ' ';
                        }
                        message += 'removed assignee(s)';
                        for (let i = 0; i < removed.length; i++) {
                            message += ` ${removed[i].to.firstName} ${removed[i].to.lastName}`;
                            if (i != removed.length - 1) {
                                message += ',';
                            }
                        }
                    }
                }
                if (check.isEmpty(data)) {
                    logger.error('Nothing To Update', 'issueController: editIssue', 5);
                    reject(response.generate(true, 'Nothing to update!', 400, null));
                } else {
                    data['modifiedOn'] = time.now();

                    IssueModel.findOneAndUpdate({ issueId: req.body.issueId }, {
                            $set: data
                        }, { new: true }) //To return updated document
                        .select('-_id title description reporter status assignees watchers createdOn modifiedOn')
                        .populate('reporter', '-_id email firstName lastName')
                        .populate('watchers.by', '-_id email')
                        .populate('assignees.to', '-_id email firstName lastName')
                        .exec()
                        .then((issue) => {
                            if (check.isEmpty(issue)) {
                                logger.info('No Issue Found', 'issueController: editIssue');
                                reject(response.generate(true, 'Failed to perform action', 404, null));
                            } else {
                                logger.info('Issue Updated', 'issueController: editIssue');
                                issue = issue.toObject();
                                issue['message'] = message;
                                resolve(issue);
                            }
                        })
                        .catch((err) => {
                            logger.error(err.message, 'issueController: editIssue', 10);
                            reject(response.generate(true, 'Failed to perform action', 500, null));
                        });
                }
            });

        }

        let saveNotification = (issueObj) => {
            return new Promise((resolve, reject) => {

                if (issueObj.watchers.length == 0) {
                    resolve(response.generate(false, 'Issue updated', 200, issueObj));
                } else {
                    for (let i = 0; i < issueObj.watchers.length; i++) {

                        if (issueObj.watchers[i].by.email == req.user.email) {
                            continue;
                        }
                        UserModel.findOneAndUpdate({ email: issueObj.watchers[i].by.email }, {
                                $addToSet: {
                                    notifications: {
                                        issueId: req.body.issueId,
                                        by: {
                                            email: req.user.email,
                                            firstName: req.user.firstName,
                                            lastName: req.user.lastName
                                        },
                                        message: issueObj.message
                                    }
                                },
                                $set: {
                                    modifiedOn: time.now()
                                }
                            }, { new: true }) //To return updated document
                            .exec()
                            .then((user) => {
                                if (check.isEmpty(user)) {
                                    logger.info('No User Found', 'issueController: saveNotification');
                                    reject(response.generate(true, 'Failed to perform action', 404, null));
                                } else {
                                    logger.info('Notification Saved', 'issueController: saveNotification');
                                    if (i == issueObj.watchers.length - 1) {
                                        delete issueObj.watchers;
                                        resolve(response.generate(false, 'Issue updated', 200, issueObj));
                                    }
                                }
                            })
                            .catch((err) => {
                                logger.error(err.message, 'issueController: saveNotification', 10);
                                reject(response.generate(true, 'Failed to perform action', 500, null));
                            });
                    }
                }
            });

        }

        //<--Local Functions End

        validateUserInput()
            .then(getAssigneeId)
            .then(getUserObjectId)
            .then(findIssue)
            .then(editIssue)
            .then(saveNotification)
            .then((resolve) => {
                res.status(resolve.status)
                res.send(resolve);
            })
            .catch((err) => {
                res.status(err.status);
                res.send(err);
            });
    },

    getIssues: (req, res) => {

        //Local Function Start-->

        let findIssues = () => {
            return new Promise((resolve, reject) => {

                let findQuery = {};
                if (!req.query.skip || isNaN(req.query.skip) || req.query.skip < 0) {
                    req.query.skip = 0;
                }
                if (!req.query.limit || isNaN(req.query.limit) || req.query.limit < 0) {
                    req.query.limit = 10;
                }
                if (!req.query.sort || ![
                        'title', 'description', 'reporter', 'status', 'createdOn', 'modifiedOn',
                        '-title', '-description', '-reporter', '-status', '-createdOn', '-modifiedOn'
                    ].includes(req.query.sort)) {
                    req.query.sort = 'modifiedOn';
                }
                if (req.query.searchType && [
                        'title', 'description', 'status'
                    ].includes(req.query.searchType) && req.query.search) {
                    findQuery[req.query.searchType] = { $regex: `${req.query.search}`, $options: 'i' }
                }

                IssueModel.find(findQuery, { _id: 0, issueId: 1, title: 1, description: 1, reporter: 1, status: 1, createdOn: 1, modifiedOn: 1 })
                    .sort(req.query.sort)
                    .skip(parseInt(req.query.skip))
                    .limit(parseInt(req.query.limit))
                    .populate('reporter', '-_id email firstName lastName')
                    .then((issues) => {
                        if (check.isEmpty(issues)) {
                            logger.error('No Issue Found', 'issueController: findIssues()', 7);
                            reject(response.generate(true, 'No issue found', 404, null));
                        } else {
                            logger.info('Issues Found', 'issueController: findIssues()', 10);
                            resolve(response.generate(false, 'Issues fetched', 200, issues));
                        }
                    })
                    .catch((err) => {
                        logger.error(err.message, 'issueController: findIssues()', 10);
                        reject(response.generate(true, 'Failed to fetch issues', 500, null));
                    });
            });
        }

        //<--Local Functions End

        findIssues()
            .then((resolve) => {
                res.status(200);
                res.send(resolve);
            })
            .catch((err) => {
                res.status(err.status);
                res.send(err);
            });
    },

    getIssuesCount: (req, res) => {

        //Local Function Start-->

        let findIssues = (_id) => {
            return new Promise((resolve, reject) => {

                let findQuery = {};
                if (req.query.searchType && [
                        'title', 'description', 'status'
                    ].includes(req.query.searchType) && req.query.search) {
                    findQuery[req.query.searchType] = { $regex: `${req.query.search}`, $options: 'i' }
                }

                IssueModel.count(findQuery)
                    .then((count) => {
                        logger.info('Count Fetched', 'issueController: findIssues()', 10);
                        resolve(response.generate(false, 'Issues count fetched', 200, count));
                    })
                    .catch((err) => {
                        logger.error(err.message, 'issueController: findIssues()', 10);
                        reject(response.generate(true, 'Failed to fetch issues count', 500, null));
                    });
            });
        }

        //<--Local Functions End

        getUserObjectId(req.user.email)
            .then(findIssues)
            .then((resolve) => {
                res.status(200);
                res.send(resolve);
            })
            .catch((err) => {
                res.status(err.status);
                res.send(err);
            });
    },

    getIssuesAssigned: (req, res) => {

        //Local Function Start-->

        let findIssues = (_id) => {
            return new Promise((resolve, reject) => {

                let findQuery = { "assignees.to": _id };
                if (!req.query.skip || isNaN(req.query.skip) || req.query.skip < 0) {
                    req.query.skip = 0;
                }
                if (!req.query.limit || isNaN(req.query.limit) || req.query.limit < 0) {
                    req.query.limit = 10;
                }
                if (!req.query.sort || ![
                        'title', 'description', 'reporter', 'status', 'createdOn', 'modifiedOn',
                        '-title', '-description', '-reporter', '-status', '-createdOn', '-modifiedOn'
                    ].includes(req.query.sort)) {
                    req.query.sort = 'modifiedOn';
                }
                if (req.query.searchType && [
                        'title', 'description', 'status'
                    ].includes(req.query.searchType) && req.query.search) {
                    findQuery[req.query.searchType] = { $regex: `${req.query.search}`, $options: 'i' }
                }

                IssueModel.find(findQuery, { _id: 0, issueId: 1, title: 1, description: 1, reporter: 1, status: 1, createdOn: 1, modifiedOn: 1 })
                    .sort(req.query.sort)
                    .skip(parseInt(req.query.skip))
                    .limit(parseInt(req.query.limit))
                    .populate('reporter', '-_id email firstName lastName')
                    .then((issues) => {
                        if (check.isEmpty(issues)) {
                            logger.error('No Issue Found', 'issueController: findIssues()', 7);
                            reject(response.generate(true, 'No issue found', 404, null));
                        } else {
                            logger.info('Issues Found', 'issueController: findIssues()', 10);
                            resolve(response.generate(false, 'Issues fetched', 200, issues));
                        }
                    })
                    .catch((err) => {
                        logger.error(err.message, 'issueController: findIssues()', 10);
                        reject(response.generate(true, 'Failed to fetch issues', 500, null));
                    });
            });
        }

        //<--Local Functions End

        getUserObjectId(req.user.email)
            .then(findIssues)
            .then((resolve) => {
                res.status(200);
                res.send(resolve);
            })
            .catch((err) => {
                res.status(err.status);
                res.send(err);
            });
    },

    getIssuesAssignedCount: (req, res) => {

        //Local Function Start-->

        let findIssues = (_id) => {
            return new Promise((resolve, reject) => {

                let findQuery = { "assignees.to": _id };
                if (req.query.searchType && [
                        'title', 'description', 'status'
                    ].includes(req.query.searchType) && req.query.search) {
                    findQuery[req.query.searchType] = { $regex: `${req.query.search}`, $options: 'i' }
                }

                IssueModel.count(findQuery)
                    .then((count) => {
                        logger.info('Count Fetched', 'issueController: findIssues()', 10);
                        resolve(response.generate(false, 'Assigned Issues count fetched', 200, count));
                    })
                    .catch((err) => {
                        logger.error(err.message, 'issueController: findIssues()', 10);
                        reject(response.generate(true, 'Failed to fetch issues count', 500, null));
                    });
            });
        }

        //<--Local Functions End

        getUserObjectId(req.user.email)
            .then(findIssues)
            .then((resolve) => {
                res.status(200);
                res.send(resolve);
            })
            .catch((err) => {
                res.status(err.status);
                res.send(err);
            });
    },

    getIssuesReported: (req, res) => {

        //Local Function Start-->

        let findIssues = (_id) => {

            return new Promise((resolve, reject) => {

                let findQuery = { "reporter": _id };

                if (!req.query.skip || isNaN(req.query.skip) || req.query.skip < 0) {
                    req.query.skip = 0;
                }
                if (!req.query.limit || isNaN(req.query.limit) || req.query.limit < 0) {
                    req.query.limit = 10;
                }
                if (!req.query.sort || ![
                        'title', 'description', 'assignees', 'status', 'createdOn', 'modifiedOn',
                        '-title', '-description', '-assignees', '-status', '-createdOn', '-modifiedOn'
                    ].includes(req.query.sort)) {
                    req.query.sort = 'modifiedOn';
                }
                if (req.query.searchType && [
                        'title', 'description', 'status'
                    ].includes(req.query.searchType) && req.query.search) {
                    findQuery[req.query.searchType] = { $regex: `${req.query.search}`, $options: 'i' }
                }

                IssueModel.find(findQuery, { _id: 0, issueId: 1, title: 1, description: 1, assignees: 1, status: 1, createdOn: 1, modifiedOn: 1 })
                    .sort(req.query.sort)
                    .skip(parseInt(req.query.skip))
                    .limit(parseInt(req.query.limit))
                    .populate('assignees.to', '-_id email firstName lastName')
                    .exec()
                    .then((issues) => {
                        if (check.isEmpty(issues)) {
                            logger.error('No Issue Found', 'issueController: findIssues()', 7);
                            reject(response.generate(true, 'No issue found', 404, null));
                        } else {
                            logger.info('Issues Found', 'issueController: findIssues()', 10);
                            resolve(response.generate(false, 'Issues fetched', 200, issues));
                        }
                    })
                    .catch((err) => {
                        logger.error(err.message, 'issueController: findIssues()', 10);
                        reject(response.generate(true, 'Failed to fetch issues', 500, null));
                    });
            });
        }

        //<--Local Functions End

        getUserObjectId(req.user.email)
            .then(findIssues)
            .then((resolve) => {
                res.status(200);
                res.send(resolve);
            })
            .catch((err) => {
                res.status(err.status);
                res.send(err);
            });
    },

    getIssuesReportedCount: (req, res) => {

        //Local Function Start-->

        let findIssues = (_id) => {
            return new Promise((resolve, reject) => {

                let findQuery = { "reporter": _id };
                if (req.query.searchType && [
                        'title', 'description', 'status'
                    ].includes(req.query.searchType) && req.query.search) {
                    findQuery[req.query.searchType] = { $regex: `${req.query.search}`, $options: 'i' }
                }

                IssueModel.count(findQuery)
                    .then((count) => {
                        logger.info('Count Fetched', 'issueController: findIssues()', 10);
                        resolve(response.generate(false, 'Assigned Issues count fetched', 200, count));
                    })
                    .catch((err) => {
                        logger.error(err.message, 'issueController: findIssues()', 10);
                        reject(response.generate(true, 'Failed to fetch issues count', 500, null));
                    });
            });
        }

        //<--Local Functions End

        getUserObjectId(req.user.email)
            .then(findIssues)
            .then((resolve) => {
                res.status(200);
                res.send(resolve);
            })
            .catch((err) => {
                res.status(err.status);
                res.send(err);
            });
    },

    addWatcher: (req, res) => {
        //Local Function Start-->

        let validateUserInput = () => {
            return new Promise((resolve, reject) => {
                console.log(req.body);
                if (!req.body.issueId) {

                    logger.error('Field Missing', 'issueController: validateUserInput()', 5);
                    reject(response.generate(true, 'One or More Parameter(s) is missing', 400, null));

                } else {

                    logger.info('User Input Validated', 'issueController: validateUserInput()', 5);
                    resolve(req.user.email);
                }
            });
        }

        let addWatcher = (_id) => {
            return new Promise((resolve, reject) => {

                IssueModel.findOneAndUpdate({ issueId: req.body.issueId }, {
                        $addToSet: {
                            watchers: {
                                by: _id
                            }
                        },
                        $set: { modifiedOn: time.now() }
                    }, { new: true }) //To return updated document
                    .select('-_id watchers')
                    .populate('watchers.by', '-_id email firstName lastName')
                    .exec()
                    .then((issue) => {
                        if (check.isEmpty(issue.watchers)) {
                            logger.info('No watchers', 'issueController: addWatcher');
                            reject(response.generate(true, 'Failed to perform action', 404, null));
                        } else {
                            logger.info('Added to watchers', 'issueController: addWatcher');
                            resolve(response.generate(false, 'Notifications ON related to issue', 200, issue.watchers));
                        }
                    })
                    .catch((err) => {
                        logger.error(err.message, 'issueController: addWatcher', 10);
                        reject(response.generate(true, 'Failed to perform action', 500, null));
                    });
            });

        }

        //<--Local Functions End

        validateUserInput()
            .then(getUserObjectId)
            .then(addWatcher)
            .then((resolve) => {
                res.status(resolve.status)
                res.send(resolve);
            })
            .catch((err) => {
                res.status(err.status);
                res.send(err);
            });
    },

    getWatchers: (req, res) => {

        //Local Function Start-->

        let validateUserInput = () => {
            return new Promise((resolve, reject) => {

                if (!req.query.issueId) {

                    logger.error('Field Missing', 'issueController: validateUserInput()', 5);
                    reject(response.generate(true, 'One or More Parameter(s) is missing', 400, null));

                } else {

                    logger.info('User Input Validated', 'issueController: validateUserInput()', 5);
                    resolve(req.user.email);

                }
            });
        }

        let findWatchers = (_id) => {
            return new Promise((resolve, reject) => {

                IssueModel.findOne({ issueId: req.query.issueId, 'watchers.by': _id }, { _id: 0, watchers: 1 })
                    .populate('watchers.by', '-_id email firstName lastName')
                    .then((issue) => {
                        if (check.isEmpty(issue)) {
                            logger.error('No Watcher Found', 'issueController: findWatchers()', 7);
                            reject(response.generate(true, 'Failed to fetch watchers', 404, null));
                        } else {
                            logger.info('Watchers Found', 'issueController: findWatchers()', 10);
                            resolve(response.generate(false, 'Watchers fetched', 200, issue.watchers));
                        }
                    })
                    .catch((err) => {
                        logger.error(err.message, 'issueController: findWatchers()', 10);
                        reject(response.generate(true, 'Failed to fetch watchers', 500, null));
                    });
            });
        }

        //<--Local Functions End

        validateUserInput()
            .then(getUserObjectId)
            .then(findWatchers)
            .then((resolve) => {
                res.status(200);
                res.send(resolve);
            })
            .catch((err) => {
                res.status(err.status);
                res.send(err);
            });
    },

    getWatchersCount: (req, res) => {

        //Local Function Start-->

        let validateUserInput = () => {
            return new Promise((resolve, reject) => {

                if (!req.query.issueId) {

                    logger.error('Field Missing', 'issueController: validateUserInput()', 5);
                    reject(response.generate(true, 'One or More Parameter(s) is missing', 400, null));

                } else {

                    logger.info('User Input Validated', 'issueController: validateUserInput()', 5);
                    resolve(req.user.email);

                }
            });
        }

        let getWatchersCount = (_id) => {
            return new Promise((resolve, reject) => {

                IssueModel.aggregate([
                        { $match: { issueId: req.query.issueId } },
                        { $project: { count: { $size: '$watchers' } } }
                    ])
                    .then((issue) => {
                        if (check.isEmpty(issue[0])) {
                            logger.error('No Watcher Found', 'issueController: getWatchersCount()', 7);
                            reject(response.generate(true, 'Failed to fetch watchers count', 404, null));
                        } else {
                            logger.info('Watchers Found', 'issueController: getWatchersCount()', 10);
                            resolve(response.generate(false, 'Watchers count fetched', 200, { count: issue[0].count }));
                        }
                    })
                    .catch((err) => {
                        logger.error(err.message, 'issueController: getWatchersCount()', 10);
                        reject(response.generate(true, 'Failed to fetch watchers count', 500, null));
                    });
            });
        }

        //<--Local Functions End

        validateUserInput()
            .then(getUserObjectId)
            .then(getWatchersCount)
            .then((resolve) => {
                res.status(200);
                res.send(resolve);
            })
            .catch((err) => {
                res.status(err.status);
                res.send(err);
            });
    },

    removeWatcher: (req, res) => {

        //Local Function Start-->

        let validateUserInput = () => {
            return new Promise((resolve, reject) => {
                console.log(req.body);
                if (!req.query.issueId) {

                    logger.error('Field Missing', 'issueController: validateUserInput()', 5);
                    reject(response.generate(true, 'One or More Parameter(s) is missing', 400, null));

                } else {

                    logger.info('User Input Validated', 'issueController: validateUserInput()', 5);
                    resolve(req.user.email);
                }
            });
        }

        let removeWatcher = (_id) => {
            return new Promise((resolve, reject) => {

                IssueModel.findOneAndUpdate({ issueId: req.query.issueId }, {
                        $pull: {
                            watchers: {
                                by: _id
                            }
                        },
                        $set: { modifiedOn: time.now() }
                    }, { new: true }) //To return updated document
                    .select('-_id watchers')
                    .populate('watchers.by', '-_id email firstName lastName')
                    .exec()
                    .then((issue) => {
                        if (check.isEmpty(issue)) {
                            logger.info('No watchers', 'issueController: removeWatcher');
                            reject(response.generate(true, 'Failed to perform action', 404, null));
                        } else {
                            logger.info('Removed from watchers', 'issueController: removeWatcher');
                            resolve(response.generate(false, 'Notifications OFF related to issue', 200, null));
                        }
                    })
                    .catch((err) => {
                        logger.error(err.message, 'issueController: removeWatcher', 10);
                        reject(response.generate(true, 'Failed to perform action', 500, null));
                    });
            });

        }

        //<--Local Functions End

        validateUserInput()
            .then(getUserObjectId)
            .then(removeWatcher)
            .then((resolve) => {
                res.status(resolve.status)
                res.send(resolve);
            })
            .catch((err) => {
                res.status(err.status);
                res.send(err);
            });
    },

    addComment: (req, res) => {

        //Local Function Start-->

        let validateUserInput = () => {
            return new Promise((resolve, reject) => {
                console.log(req.body);
                if (!req.body.issueId || !req.body.comment) {

                    logger.error('Field Missing', 'issueController: validateUserInput()', 5);
                    reject(response.generate(true, 'One or More Parameter(s) is missing', 400, null));

                } else {

                    logger.info('User Input Validated', 'issueController: validateUserInput()', 5);
                    resolve(req.user.email);
                }
            });
        }

        let addComment = (_id) => {
            return new Promise((resolve, reject) => {

                IssueModel.findOneAndUpdate({ issueId: req.body.issueId }, {
                        $addToSet: {
                            comments: {
                                by: _id,
                                text: req.body.comment
                            }
                        },
                        $set: { modifiedOn: time.now() }
                    }, { new: true }) //To return updated document
                    .select('-_id comments watchers')
                    .populate('watchers.by', '-_id email firstName lastName')
                    .populate('comments.by', '-_id email firstName lastName')
                    .exec()
                    .then((issue) => {
                        if (check.isEmpty(issue.comments)) {
                            logger.info('No comments', 'issueController: addComment');
                            reject(response.generate(true, 'Failed to perform action', 404, null));
                        } else {
                            logger.info('Added to comments', 'issueController: addComment');
                            resolve(issue.toObject());
                        }
                    })
                    .catch((err) => {
                        logger.error(err.message, 'issueController: addComment', 10);
                        reject(response.generate(true, 'Failed to perform action', 500, null));
                    });
            });

        }

        let saveNotification = (issueObj) => {
            return new Promise((resolve, reject) => {
                if (issueObj.watchers.length == 0) {
                    resolve(response.generate(false, 'Comment saved', 200, issueObj.comments));
                } else {
                    for (let i = 0; i < issueObj.watchers.length; i++) {

                        if (issueObj.watchers[i].by.email == req.user.email) {
                            continue;
                        }
                        UserModel.findOneAndUpdate({ email: issueObj.watchers[i].by.email }, {
                                $addToSet: {
                                    notifications: {
                                        issueId: req.body.issueId,
                                        by: {
                                            email: req.user.email,
                                            firstName: req.user.firstName,
                                            lastName: req.user.lastName
                                        },
                                        message: `commented '${req.body.comment}'`
                                    }
                                },
                                $set: {
                                    modifiedOn: time.now()
                                }
                            }, { new: true }) //To return updated document
                            .exec()
                            .then((user) => {
                                if (check.isEmpty(user)) {
                                    logger.info('No User Found', 'issueController: saveNotification');
                                    reject(response.generate(true, 'Failed to perform action', 404, null));
                                } else {
                                    logger.info('Notification Saved', 'issueController: saveNotification');
                                    if (i == issueObj.watchers.length - 1) {
                                        delete issueObj.watchers;
                                        resolve(response.generate(false, 'Comment saved', 200, issueObj.comments));
                                    }
                                }
                            })
                            .catch((err) => {
                                logger.error(err.message, 'issueController: saveNotification', 10);
                                reject(response.generate(true, 'Failed to perform action', 500, null));
                            });
                    }
                }
            });

        }

        //<--Local Functions End

        validateUserInput()
            .then(getUserObjectId)
            .then(addComment)
            .then(saveNotification)
            .then((resolve) => {
                res.status(resolve.status)
                res.send(resolve);
            })
            .catch((err) => {
                res.status(err.status);
                res.send(err);
            });
    },

    getComments: (req, res) => {

        //Local Function Start-->

        let validateUserInput = () => {
            return new Promise((resolve, reject) => {

                if (!req.query.issueId) {

                    logger.error('Field Missing', 'issueController: validateUserInput()', 5);
                    reject(response.generate(true, 'One or More Parameter(s) is missing', 400, null));

                } else {

                    logger.info('User Input Validated', 'issueController: validateUserInput()', 5);
                    resolve(req.user.email);

                }
            });
        }

        let findComments = (_id) => {
            return new Promise((resolve, reject) => {

                IssueModel.findOne({ issueId: req.query.issueId }, { _id: 0, comments: 1 })
                    .populate('comments.by', '-_id email firstName lastName')
                    .then((issue) => {
                        if (check.isEmpty(issue)) {
                            logger.error('No Comment Found', 'issueController: findComments()', 7);
                            reject(response.generate(true, 'Failed to fetch comments', 404, null));
                        } else {
                            logger.info('Comments Found', 'issueController: findComments()', 10);
                            resolve(response.generate(false, 'Comments fetched', 200, issue.comments));
                        }
                    })
                    .catch((err) => {
                        logger.error(err.message, 'issueController: findComments()', 10);
                        reject(response.generate(true, 'Failed to fetch comments', 500, null));
                    });
            });
        }

        //<--Local Functions End

        validateUserInput()
            .then(getUserObjectId)
            .then(findComments)
            .then((resolve) => {
                res.status(200);
                res.send(resolve);
            })
            .catch((err) => {
                res.status(err.status);
                res.send(err);
            });
    },

    markNotificationsAsRead: (req, res) => {

        //Local Function Start-->

        let validateUserInput = () => {
            return new Promise((resolve, reject) => {

                if (!req.body.issueId) {

                    logger.error('Field Missing', 'issueController: validateUserInput()', 5);
                    reject(response.generate(true, 'One or More Parameter(s) is missing', 400, null));

                } else {

                    logger.info('User Input Validated', 'issueController: validateUserInput()', 5);
                    resolve();

                }
            });
        }

        let markNotificationsAsRead = () => {
            return new Promise((resolve, reject) => {

                UserModel.update({
                        email: req.user.email,
                        notifications: {
                            $elemMatch: {
                                issueId: req.body.issueId,
                                read: false
                            }
                        }
                    }, {
                        $set: {
                            modifiedOn: time.now(),
                            'notifications.$.read': true
                        },
                    })
                    .then((result) => {

                        if (result.nModified == 0) {
                            logger.error('No Unread Notifications', 'User Controller: markAllNotificationsAsRead');
                            reject(response.generate(true, 'No unread notifications for this issue', 404, null));
                        } else {
                            logger.info('Notifications Updated', 'User Controller: markAllNotificationsAsRead');
                            resolve(response.generate(false, 'All notifications marked as read', 200, null));
                        }
                    })
                    .catch((err) => {
                        logger.error(err.message, 'User Controller:markAllNotificationsAsRead', 10);
                        reject(response.generate(true, 'Failed to perform action', 500, null));
                    });
            });
        }

        //<--Local Functions End

        validateUserInput()
            .then(markNotificationsAsRead)
            .then((resolve) => {
                res.status(200);
                res.send(resolve);
            })
            .catch((err) => {
                res.status(err.status);
                res.send(err);
            });
    }

}

module.exports = issueController;