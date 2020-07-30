var express = require('express');
var router = express.Router();

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


module.exports = router;