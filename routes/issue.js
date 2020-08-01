var express = require('express');
var multer = require('multer');
const shortid = require('shortid');
var router = express.Router();

var storage = multer.diskStorage({
    destination: function(req, file, cb) {
        cb(null, './public/uploads/')
    },
    filename: function(req, file, cb) {
        cb(null, shortid.generate() + '__' + Date.now() + '__' + file.originalname);
    }
});

var upload = multer({ storage: storage })

//Controllers
const isssueController = require("../controllers/issueController");

//Middlewares
const auth = require('../middlewares/auth')


router.route('/')
    /**
        * @apiGroup issues
        * @apiVersion  1.0.0
        * @api {post} /api/v1/issues/ to create a new issue.
        *
        * @apiParam {string} authToken authToken of user. (body params) (required)
        * @apiParam {string} title title of issue. (body params) (required)
        * @apiParam {string} description description of issue. (body params) (required)
        * @apiParam {object} assignees users to whom the issue has been assigned. (body params) (required)
        *
        * @apiSuccess {object} myResponse shows error status, message, http status code, result.
        * 
        * @apiSuccessExample {object} Success-Response:
            {
            "error": false,
            "message": "Issue created",
            "status": 200,
            "data": {
                issueId:'tVQzI9_sj'
            }
          }
      */
    .post(auth.isAuthorized, isssueController.createIssue)
    /**
        * @apiGroup issues
        * @apiVersion  1.0.0
        * @api {get} /api/v1/issues/ to fetch an issue.
        *
        * @apiParam {string} authToken authToken of user. (query params) (required)
        * @apiParam {string} issueId of issue. (query params) (required)
        *
        * @apiSuccess {object} myResponse shows error status, message, http status code, result.
        * 
        * @apiSuccessExample {object} Success-Response:
            {
                "error": false,
                "message": "Issue fetched",
                "status": 200,
                "data": {
                    "status": "In-Progress",
                    "attachments": [],
                    "issueId": "tVQzI9_sj",
                    "title": "Abc",
                    "reporter": {
                    "firstName": "Xyz",
                    "lastName": "mno",
                    "email": "xyzmno@gmail.com"
                    },
                    "description": "<p>abc def</p>",
                    "assignees": [
                    {
                        "assignedOn": "2020-08-01T11:51:04.490Z",
                        "to": {
                        "firstName": "abc",
                        "lastName": "def",
                        "email": "abcdef@gmail.com"
                        },
                        ...........
                    }
                    ],
                    "createdOn": "2020-08-01T11:51:04.491Z",
                    "modifiedOn": "2020-08-01T11:51:04.492Z"
                }
            }
      */
    .get(auth.isAuthorized, isssueController.getIssue)
    /**
        * @apiGroup issues
        * @apiVersion  1.0.0
        * @api {put} /api/v1/issues/ to update an issue.
        *
        * @apiParam {string} authToken authToken of user. (body params) (required)
        * @apiParam {string} issueId issueId of issue. (body params) (required)
        * @apiParam {string} status status of issue. (body params) (optional)
        * @apiParam {string} title title of issue. (body params) (optional)
        * @apiParam {string} description description of issue. (body params) (optional)
        * @apiParam {object} assignees users to whom the issue has been assigned. (body params) (optional)
        * @apiParam {object} attachments attachments of issue. (body params) (optional)
        *
        * @apiSuccess {object} myResponse shows error status, message, http status code, result.
        * 
        * @apiSuccessExample {object} Success-Response:
            {
                "error": false,
                "message": "Issue updated",
                "status": 200,
                "data": {
                    "status": "In-Progress",
                    "attachments": [],
                    "issueId": "tVQzI9_sj",
                    "title": "Abc2",
                    "reporter": {
                    "firstName": "Abc",
                    "lastName": "def",
                    "email": "abcdef@gmail.com"
                    },
                    "description": "<p>abc def</p>",
                    "assignees": [
                    {
                        "assignedOn": "2020-08-01T11:51:04.490Z",
                        "to": {
                        "firstName": "xyz",
                        "lastName": "mno",
                        "email": "xyzmno@gmail.com"
                        }
                    },
                    ...........
                    ],
                    "createdOn": "2020-08-01T11:51:04.491Z",
                    "modifiedOn": "2020-08-01T12:00:52.000Z"
                }
            }
      */
    .put(auth.isAuthorized, isssueController.editIssue);

/**
    * @apiGroup issues
    * @apiVersion  1.0.0
    * @api {get} /api/v1/issues/all to fetch all issues.
    *
    * @apiParam {string} authToken authToken of user. (query params) (required)
    * @apiParam {number} limit maximum number of issues fetched. (query params) (optional)
    * @apiParam {string} sort field according to which issues which be sorted. (query params) (optional)
    * @apiParam {number} skip number of issues to skip. (query params) (optional)
    * @apiParam {string} searchType field according to which the issues will filtered upon search. (query params) (optional)
    * @apiParam {string} search the string according to which issues are filtered. (query params) (optional)
    *
    * @apiSuccess {object} myResponse shows error status, message, http status code, result.
    * 
    * @apiSuccessExample {object} Success-Response:
        {
            "error": false,
            "message": "Issues fetched",
            "status": 200,
            "data": [
                {
                "status": "Done",
                "issueId": "qOJMB0PxA",
                "title": "Test",
                "reporter": {
                    "firstName": "Abc",
                    "lastName": "Def",
                    "email": "abcdef@gmail.com"
                },
                "description": "Test 123",
                "createdOn": "2020-07-29T19:26:12.150Z",
                "modifiedOn": "2020-07-31T19:12:14.000Z"
                },
                .....
            ]
        }
    */
router.route('/all').get(auth.isAuthorized, isssueController.getIssues);
/**
    * @apiGroup issues
    * @apiVersion  1.0.0
    * @api {get} /api/v1/issues/all/count to fetch number of issues.
    *
    * @apiParam {string} authToken authToken of user. (query params) (required)
    * @apiParam {string} searchType field according to which the issues will filtered upon search. (query params) (optional)
    * @apiParam {string} search the string according to which issues are filtered. (query params) (optional)
    *
    * @apiSuccess {object} myResponse shows error status, message, http status code, result.
    * 
    * @apiSuccessExample {object} Success-Response:
        {
            "error": false,
            "message": "Issues count fetched",
            "status": 200,
            "data": 15
        }
    */
router.route('/all/count').get(auth.isAuthorized, isssueController.getIssuesCount);
/**
    * @apiGroup issues
    * @apiVersion  1.0.0
    * @api {get} /api/v1/issues/all/assigned to fetch all assigned issues to user.
    *
    * @apiParam {string} authToken authToken of user. (query params) (required)
    * @apiParam {number} limit maximum number of issues fetched. (query params) (optional)
    * @apiParam {string} sort field according to which issues which be sorted. (query params) (optional)
    * @apiParam {number} skip number of issues to skip. (query params) (optional)
    * @apiParam {string} searchType field according to which the issues will filtered upon search. (query params) (optional)
    * @apiParam {string} search the string according to which issues are filtered. (query params) (optional)
    *
    * @apiSuccess {object} myResponse shows error status, message, http status code, result.
    * 
    * @apiSuccessExample {object} Success-Response:
        {
            "error": false,
            "message": "Issues fetched",
            "status": 200,
            "data": [
                {
                "status": "Done",
                "issueId": "qOJMB0PxA",
                "title": "Test",
                "reporter": {
                    "firstName": "Abc",
                    "lastName": "Def",
                    "email": "abcdef@gmail.com"
                },
                "description": "Test 123",
                "createdOn": "2020-07-29T19:26:12.150Z",
                "modifiedOn": "2020-07-31T19:12:14.000Z"
                },
                .....
            ]
        }
    */
router.route('/all/assigned').get(auth.isAuthorized, isssueController.getIssuesAssigned);
/**
    * @apiGroup issues
    * @apiVersion  1.0.0
    * @api {get} /api/v1/issues/all/assigned/count to fetch number of issues assigned to user.
    *
    * @apiParam {string} authToken authToken of user. (query params) (required)
    * @apiParam {string} searchType field according to which the issues will filtered upon search. (query params) (optional)
    * @apiParam {string} search the string according to which issues are filtered. (query params) (optional)
    *
    * @apiSuccess {object} myResponse shows error status, message, http status code, result.
    * 
    * @apiSuccessExample {object} Success-Response:
        {
            "error": false,
            "message": "Issues count fetched",
            "status": 200,
            "data": 15
        }
    */
router.route('/all/assigned/count').get(auth.isAuthorized, isssueController.getIssuesAssignedCount);
/**
    * @apiGroup issues
    * @apiVersion  1.0.0
    * @api {get} /api/v1/issues/all/reported to fetch all reported issues by user.
    *
    * @apiParam {string} authToken authToken of user. (query params) (required)
    * @apiParam {number} limit maximum number of issues fetched. (query params) (optional)
    * @apiParam {string} sort field according to which issues which be sorted. (query params) (optional)
    * @apiParam {number} skip number of issues to skip. (query params) (optional)
    * @apiParam {string} searchType field according to which the issues will filtered upon search. (query params) (optional)
    * @apiParam {string} search the string according to which issues are filtered. (query params) (optional)
    *
    * @apiSuccess {object} myResponse shows error status, message, http status code, result.
    * 
    * @apiSuccessExample {object} Success-Response:
        {
  "error": false,
  "message": "Issues fetched",
  "status": 200,
  "data": [
        {
            "status": "In-Progress",
            "issueId": "KzbTYsqH2",
            "title": "Test 3",
            "description": "Test 3",
            "assignees": [
                {
                "assignedOn": "2020-07-29T19:02:03.695Z",
                "to": {
                    "firstName": "xyz",
                    "lastName": "mno",
                    "email": "xyzmno@gmail.com"
                }
                },
                {
                "assignedOn": "2020-07-29T19:02:03.695Z",
                "to": {
                    "firstName": "abc",
                    "lastName": "def",
                    "email": "abcdef@gmail.com"
                }
                }
            ],
            "createdOn": "2020-07-29T19:02:03.696Z",
            "modifiedOn": "2020-07-29T19:02:03.696Z"
        },
        ..............
    ]
    */
router.route('/all/reported').get(auth.isAuthorized, isssueController.getIssuesReported);
/**
    * @apiGroup issues
    * @apiVersion  1.0.0
    * @api {get} /api/v1/issues/all/reported/count to fetch number of issues reported by user.
    *
    * @apiParam {string} authToken authToken of user. (query params) (required)
    * @apiParam {string} searchType field according to which the issues will filtered upon search. (query params) (optional)
    * @apiParam {string} search the string according to which issues are filtered. (query params) (optional)
    *
    * @apiSuccess {object} myResponse shows error status, message, http status code, result.
    * 
    * @apiSuccessExample {object} Success-Response:
        {
            "error": false,
            "message": "Issues count fetched",
            "status": 200,
            "data": 15
        }
    */
router.route('/all/reported/count').get(auth.isAuthorized, isssueController.getIssuesReportedCount);
/**
    * @apiGroup issues
    * @apiVersion  1.0.0
    * @api {post} /api/v1/issues/watch/ to add new watcher to issue.
    *
    * @apiParam {string} authToken authToken of user. (body params) (required)
    * @apiParam {string} issueId issueId of issue. (body params) (required)
    *
    * @apiSuccess {object} myResponse shows error status, message, http status code, result.
    * 
    * @apiSuccessExample {object} Success-Response:
        {
            "error": false,
            "message": "Notifications ON related to issue",
            "status": 200,
            "data": [
                {
                    "watchedOn": "2020-08-01T15:41:20.802Z",
                    "by": {
                        "firstName": "abc",
                        "lastName": "def",
                        "email": "abcdef@gmail.com"
                    }
                },
                ......
            ]
        }
    */
router.route('/watch/').post(auth.isAuthorized, isssueController.addWatcher);
/**
    * @apiGroup issues
    * @apiVersion  1.0.0
    * @api {get} /api/v1/issues/watch/all to fetch all watchcers of issue.
    *
    * @apiParam {string} authToken authToken of user. (query params) (required)
    * @apiParam {string} issueId issueId of issue. (query params) (required)
    *
    * @apiSuccess {object} myResponse shows error status, message, http status code, result.
    * 
    * @apiSuccessExample {object} Success-Response:
        {
            "error": false,
            "message": "Watchers fetched",
            "status": 200,
            "data": [
                {
                "watchedOn": "2020-08-01T15:41:20.802Z",
                    "by": {
                        "firstName": "abc",
                        "lastName": "def",
                        "email": "abcdef@gmail.com"
                    },
                    ......
                }
            ]
        }
    */
router.route('/watch/all').get(auth.isAuthorized, isssueController.getWatchers);
/**
    * @apiGroup issues
    * @apiVersion  1.0.0
    * @api {get} /api/v1/issues/watch/all/count to fetch number of watchcers of issue.
    *
    * @apiParam {string} authToken authToken of user. (query params) (required)
    * @apiParam {string} issueId issueId of issue. (query params) (required)
    *
    * @apiSuccess {object} myResponse shows error status, message, http status code, result.
    * 
    * @apiSuccessExample {object} Success-Response:
        {
            "error": false,
            "message": "Watchers count fetched",
            "status": 200,
            "data": {
                "count": 1
            }
        }
    */
router.route('/watch/all/count').get(auth.isAuthorized, isssueController.getWatchersCount);
/**
    * @apiGroup issues
    * @apiVersion  1.0.0
    * @api {delete} /api/v1/issues/watch/ to delete watcher of issue.
    *
    * @apiParam {string} authToken authToken of user. (body params) (required)
    * @apiParam {string} issueId issueId of issue. (body params) (required)
    *
    * @apiSuccess {object} myResponse shows error status, message, http status code, result.
    * 
    * @apiSuccessExample {object} Success-Response:
        {
            "error": false,
            "message": "Notifications OFF related to issue",
            "status": 200,
            "data": null
        }
    */
router.route('/watch/').delete(auth.isAuthorized, isssueController.removeWatcher);
/**
    * @apiGroup issues
    * @apiVersion  1.0.0
    * @api {post} /api/v1/issues/comment/ to add new comment to issue.
    *
    * @apiParam {string} authToken authToken of user. (body params) (required)
    * @apiParam {string} issueId issueId of issue. (body params) (required)
    * @apiParam {string} comment comment to issue. (body params) (required)
    *
    * @apiSuccess {object} myResponse shows error status, message, http status code, result.
    * 
    * @apiSuccessExample {object} Success-Response:
        {
            "error": false,
            "message": "Comment saved",
            "status": 200,
            "data": [
                {
                "createdOn": "2020-08-01T15:48:25.614Z",
                "modifiedOn": "2020-08-01T15:48:25.614Z",
                "by": {
                    "firstName": "abc",
                    "lastName": "def",
                    "email": "abcdef@gmail.com"
                },
                "text": "<p>test comment 1</p>"
                },
                ......
            ]
        }
    */
router.route('/comment/').post(auth.isAuthorized, isssueController.addComment);
/**
    * @apiGroup issues
    * @apiVersion  1.0.0
    * @api {get} /api/v1/issues/comment/all to fetch all comments on issue.
    *
    * @apiParam {string} authToken authToken of user. (query params) (required)
    * @apiParam {string} issueId issueId of issue. (query params) (required)
    *
    * @apiSuccess {object} myResponse shows error status, message, http status code, result.
    * 
    * @apiSuccessExample {object} Success-Response:
        {
            "error": false,
            "message": "Comments fetched",
            "status": 200,
            "data": [
                {
                "createdOn": "2020-08-01T15:48:25.614Z",
                "modifiedOn": "2020-08-01T15:48:25.614Z",
                "by": {
                    "firstName": "abc",
                    "lastName": "def",
                    "email": "abcdef@gmail.com"
                },
                "text": "<p>test comment 1</p>"
                },
                .....
            ]
        }
    */
router.route('/comment/all').get(auth.isAuthorized, isssueController.getComments);
/**
    * @apiGroup issues
    * @apiVersion  1.0.0
    * @api {put} /api/v1/issues/notifications/mark to mark notifications related to issue as read.
    *
    * @apiParam {string} authToken authToken of user. (body params) (required)
    * @apiParam {string} issueId issueId of issue. (body params) (required)
    *
    * @apiSuccess {object} myResponse shows error status, message, http status code, result.
    * 
    * @apiSuccessExample {object} Success-Response:
        {
        "error": false,
        "message": "All notifications marked as read",
        "status": 200,
        "data": null
        }
    */
router.route('/notifications/mark').put(auth.isAuthorized, isssueController.markNotificationsAsRead);
/**
    * @apiGroup issues
    * @apiVersion  1.0.0
    * @api {post} /api/v1/issues/attachments to add attachments to issue.
    *
    * @apiParam {string} authToken authToken of user. (body formdata params) (required)
    * @apiParam {string} issueId issueId of issue. (body formdata params) (required)
    * @apiParam {object} attachments attachments of issue. (body formdata params) (required)
    *
    * @apiSuccess {object} myResponse shows error status, message, http status code, result.
    * 
    * @apiSuccessExample {object} Success-Response:
        {
            "error": false,
            "message": "Files uploaded successfully",
            "status": 200,
            "data": [
                "http://localhost:3000/uploads/GnDkjjHLY__1596297923059__121453.jpg",
                "http://localhost:3000/uploads/c2oinE3oK__1596297923064__182677.jpg"
            ]
        }
    */
//Maximum 5 images at a single time
router.route('/attachments').post(upload.array('attachments', 5), auth.isAuthorized, isssueController.addAttachments);


module.exports = router;