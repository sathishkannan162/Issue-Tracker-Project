let mongoose = require("mongoose");

let issueSchema = new mongoose.Schema({
    issue_title: {
        type: String,
        required: true
    },
    issue_text: {
        type: String,
        required: true
    },
    project: {
        type: String,
        required: true
    },
    created_on: {
        type: Date,
        default: new Date()
    },
    updated_on: {
        type: Date,
        default: new Date()
    },
    created_by: {
        type: String,
        required: true
    },
    assigned_to: {
        type: String,
        default: ''
    },
    open: {
        type: Boolean,
        default: true,
        required: true
    },
    status_text: {
        type: String,
        default: ''
    }
});

module.exports = mongoose.model('Issue',issueSchema);