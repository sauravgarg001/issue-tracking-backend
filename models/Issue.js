const mongoose = require('mongoose');

let assigneeSubSchema = new mongoose.Schema({
    to: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    assignedOn: {
        type: Date,
        default: Date.now
    }
}, { _id: false });

let watcherSubSchema = new mongoose.Schema({
    by: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    watchedOn: {
        type: Date,
        default: Date.now
    }
}, { _id: false });

let commentSubSchema = new mongoose.Schema({
    by: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    text: {
        type: String,
        required: true
    },
    createdOn: {
        type: Date,
        default: Date.now
    },
    modifiedOn: {
        type: Date,
        default: Date.now
    },
}, { _id: false });

let issueSchema = new mongoose.Schema({
    issueId: {
        type: String,
        required: true,
        index: true,
        unique: true
    },
    title: {
        type: String,
        required: true
    },
    description: {
        type: String,
        required: true
    },
    reporter: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    status: {
        type: String,
        enum: ['Backlog', 'In-Progress', 'In-Test', 'Done'],
        default: 'In-Progress'
    },
    assignees: [assigneeSubSchema],
    watchers: [watcherSubSchema],
    comments: [commentSubSchema],
    attachments: [{ //public url of image of format <domain><email>__<original filename>__<createdOn>
        type: String
    }],
    createdOn: {
        type: Date,
        default: Date.now
    },
    modifiedOn: {
        type: Date,
        default: Date.now
    }
});

module.exports = mongoose.model('Issue', issueSchema);