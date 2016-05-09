'use strict';

var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var User = new Schema({
    github: {
        id: String,
        displayName: String,
        username: String,
        pollTitle: String,
        pollOptionArr: Array,
        colorArr: Array,
        votedIPs: Array
    },
    nbrClicks: {
        clicks: Number
    }
});

module.exports = mongoose.model('User', User);
