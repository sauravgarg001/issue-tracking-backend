const socketio = require('socket.io');
const mongoose = require('mongoose');

//Libraries
const token = require("./tokenLib");
const redis = require("./redisLib");
const check = require("./checkLib");
const logger = require("./loggerLib");

//Models
const IssueModel = mongoose.model('Issue');

let setServer = (server) => {

    let io = socketio.listen(server);

    let myIo = io.of('/'); //Namespaces '/' -> for creating multilple RTC in single website with different namspace

    myIo.on('connection', (socket) => { //All events should be inside this connection

        //socket.emit("<event name>",<data>)  -> triggering an event on client side
        //scoket.on("<event name", <callback function>) -> listening to an event from client side

        //-------------------------------------------------
        socket.emit("verifyUser", "");
        //-------------------------------------------------
        socket.on('set-user', (data) => {
            let authToken = data.authToken;
            token.verifyTokenFromDatabase(authToken)
                .then((user) => {

                    console.log("User Verified");

                    let currentUser = user.data;
                    socket.userId = currentUser.userId // setting socket user id to identify it further
                    socket.email = currentUser.email // setting socket user id to identify it further

                    let key = socket.email
                    let value = socket.userId

                    redis.getAllUsersInAHash('onlineUsers')
                        .then((result) => {

                            let timeout = 0;
                            if (result[key]) { //check whether user is already logged somewhere
                                myIo.emit('auth-error@' + result[key], { status: 500, error: 'Already logged somewhere!', authToken: authToken });
                                timeout = 500;
                            }

                            setTimeout(function() {

                                redis.setANewOnlineUserInHash("onlineUsers", key, value)
                                    .then((res) => {

                                        console.log(`${socket.email} is connected`);
                                        socket.room = 'edIssueTrackingTool' // joining chat room.
                                        socket.join(socket.room)
                                    })
                                    .catch((err) => {
                                        logger.error(err, 'set-user event: setANewOnlineUserInHash', 10);
                                    });

                            }, timeout);

                        })
                        .catch((err) => {
                            logger.error(err, 'set-user event: getAllUsersInAHash', 10);
                        });
                }).catch((err) => {
                    logger.error(("Authentication error:" + err), 'set-user event: verifyTokenFromDatabase', 10);
                    socket.emit('auth-error', { status: 500, error: 'Incorrect auth token!' });
                });
        });
        //-------------------------------------------------
        socket.on('disconnect', () => { // disconnect the user from socket
            console.log(`${socket.email} is disconnected`);
            if (socket.email) {
                redis.deleteUserFromHash('onlineUsers', socket.email);
            }
        });
        //-------------------------------------------------
        socket.on('issue', (data) => {

            let issue = data.issue;
            if (data.userId == socket.userId) {

                redis.getAllUsersInAHash('onlineUsers')
                    .then((result) => {

                        //issues-assigned event emit for assignees
                        if (!check.isEmpty(issue.assignees)) {
                            for (let i = 0; i < issue.assignees.length; i++) {
                                if (result[issue.assignees[i].to.email]) {
                                    socket.to(socket.room).broadcast.emit('issues-assigned@' + result[issue.assignees[i].to.email]);
                                }
                            }
                        } else {
                            logger.error('No assignees', 'issue event', 10);
                        }

                        //issues-reported event emit for reporter
                        if (!check.isEmpty(issue.reporter)) {
                            if (result[issue.reporter.email]) {
                                socket.to(socket.room).broadcast.emit('issues-reported@' + result[issue.reporter.email]);
                            }
                        } else {
                            logger.error('No reported', 'issue event', 10);
                        }

                        //issues and issue event emit for all users
                        for (const userId of Object.values(result)) {
                            socket.to(socket.room).broadcast.emit('issues@' + userId);
                            socket.to(socket.room).broadcast.emit('issue@' + userId, { issueId: issue.issueId });
                        }

                        //notifications event emit for watchers
                        getWatchers(issue.issueId)
                            .then((watchers) => {
                                for (const watcher of watchers) {
                                    if (watcher.by.email != socket.email && result[watcher.by.email]) {
                                        socket.to(socket.room).broadcast.emit('notifications@' + result[watcher.by.email]);
                                    }
                                }
                            })
                            .catch((err) => {
                                logger.error(err, 'issue event: getWatchers', 10);
                            });
                    })
                    .catch((err) => {
                        logger.error(err, 'issue event: getAllUsersInAHash', 10);
                    });

            } else {
                logger.error("Authentication error", 'issue event', 10);
                socket.emit('auth-error', { status: 500, error: 'Incorrect auth token!' });
            }
        });
        //-------------------------------------------------
        socket.on('comment', (data) => {
            let issueId = data.issueId;
            if (data.userId == socket.userId) {

                redis.getAllUsersInAHash('onlineUsers')
                    .then((result) => {

                        //comments event emit for all users
                        for (const userId of Object.values(result)) {
                            socket.to(socket.room).broadcast.emit('comments@' + userId, { issueId: issueId });
                        }

                        //notifications event emit for watchers
                        getWatchers(issueId)
                            .then((watchers) => {
                                for (const watcher of watchers) {
                                    if (watcher.by.email != socket.email && result[watcher.by.email]) {
                                        socket.to(socket.room).broadcast.emit('notifications@' + result[watcher.by.email]);
                                    }
                                }
                            })
                            .catch((err) => {
                                logger.error(err, 'issue event: getWatchers', 10);
                            });
                    })
                    .catch((err) => {
                        logger.error(err, 'issue event: getAllUsersInAHash', 10);
                    });

            } else {
                logger.error("Authentication error", 'issue event', 10);
                socket.emit('auth-error', { status: 500, error: 'Incorrect auth token!' });
            }
        });
        //-------------------------------------------------
        socket.on('watcher', (data) => {
            let issueId = data.issueId;
            if (data.userId == socket.userId) {

                redis.getAllUsersInAHash('onlineUsers')
                    .then((result) => {

                        //watchers-count event emit for all users
                        for (const userId of Object.values(result)) {
                            socket.to(socket.room).broadcast.emit('watchers-count@' + userId, { issueId: issueId });
                        }

                        //watchers event emit for watchers
                        getWatchers(issueId)
                            .then((watchers) => {

                                for (const watcher of watchers) {
                                    if (result[watcher.by.email]) {
                                        socket.to(socket.room).broadcast.emit('watchers@' + result[watcher.by.email], { issueId: issueId });
                                    }
                                }
                            })
                            .catch((err) => {
                                logger.error(err, 'issue event: getWatchers', 10);
                            });
                    })
                    .catch((err) => {
                        logger.error(err, 'issue event: getAllUsersInAHash', 10);
                    });

            } else {
                logger.error("Authentication error", 'issue event', 10);
                socket.emit('auth-error', { status: 500, error: 'Incorrect auth token!' });
            }
        });
    });
}

/* Database operations are kept outside of socket.io code. */
let getWatchers = (issueId) => {
    return new Promise((resolve, reject) => {
        IssueModel.findOne({ issueId: issueId })
            .select('-_id watchers')
            .populate('watchers.by', '-_id email firstName lastName')
            .then((user) => {
                user = user.toObject();
                console.log(user);

                resolve(user.watchers);
            }).catch((err) => {
                reject(err.message);
            });
    });
}

module.exports = {
    setServer: setServer
}