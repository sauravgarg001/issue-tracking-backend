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
    .post(auth.isAuthorized, isssueController.createIssue)
    .get(auth.isAuthorized, isssueController.getIssue)
    .put(auth.isAuthorized, isssueController.editIssue);
router.route('/all').get(auth.isAuthorized, isssueController.getIssues);
router.route('/all/count').get(auth.isAuthorized, isssueController.getIssuesCount);
router.route('/all/assigned').get(auth.isAuthorized, isssueController.getIssuesAssigned);
router.route('/all/assigned/count').get(auth.isAuthorized, isssueController.getIssuesAssignedCount);
router.route('/all/reported').get(auth.isAuthorized, isssueController.getIssuesReported);
router.route('/all/reported/count').get(auth.isAuthorized, isssueController.getIssuesReportedCount);
router.route('/watch/').post(auth.isAuthorized, isssueController.addWatcher);
router.route('/watch/all').get(auth.isAuthorized, isssueController.getWatchers);
router.route('/watch/all/count').get(auth.isAuthorized, isssueController.getWatchersCount);
router.route('/watch/').delete(auth.isAuthorized, isssueController.removeWatcher);
router.route('/comment/').post(auth.isAuthorized, isssueController.addComment);
router.route('/comment/all').get(auth.isAuthorized, isssueController.getComments);
router.route('/notifications/mark').put(auth.isAuthorized, isssueController.markNotificationsAsRead);
//Maximum 5 images at a single time
router.route('/attachments').post(upload.array('attachments', 5), auth.isAuthorized, isssueController.addAttachments);


module.exports = router;