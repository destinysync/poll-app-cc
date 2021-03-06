'use strict';

var Users = require('../models/users.js');
var randomColor = require('../common/randColors.js');
var updateColorArr = require('../common/updateColorArr.js');


function ClickHandler() {

    this.getClicks = function(req, res) {
        Users
            .findOne({
                'github.id': req.user.github.id
            }, {
                '_id': false
            })
            .exec(function(err, result) {
                if (err) {
                    throw err;
                }

                res.json(result.nbrClicks);
            });
    };

    this.addClick = function(req, res) {
        Users
            .findOneAndUpdate({
                'github.id': req.user.github.id
            }, {
                $inc: {
                    'nbrClicks.clicks': 1
                }
            })
            .exec(function(err, result) {
                if (err) {
                    throw err;
                }

                res.json(result.nbrClicks);
            });
    };

    this.resetClicks = function(req, res) {
        Users
            .findOneAndUpdate({
                'github.id': req.user.github.id
            }, {
                'nbrClicks.clicks': 0
            })
            .exec(function(err, result) {
                if (err) {
                    throw err;
                }
                res.json(result.nbrClicks);
            });
        res.end();
    };

    this.addPoll = function(req, res) {
        var pollTitle = req.body.pollTitle,
            creatorID = req.user.github.id,
            pollOption = req.body.pollOption,
            pollOptionArr = [];

        function fn1(cb) {
            var pollOptionNew = pollOption.split('\r').join("").split('\n');
            for (var i = 0; i < pollOptionNew.length; i++) {
                var item = {};
                item = {
                    pollOption: pollOptionNew[i],
                    pollOptionVote: 0,
                    pollOptionID: i + 1
                };
                pollOptionArr.push(item);
            }
            cb();
        }

        function fn2() {
            var newPoll = new Users();

            newPoll.github.id = creatorID;
            newPoll.github.pollTitle = pollTitle;
            newPoll.github.pollOptionArr = pollOptionArr;
            newPoll.github.colorArr = randomColor(pollOptionArr);
            newPoll.github.votedIPs = [];
            newPoll.save(function(err, newPoll) {
                if (err) {
                    throw err;
                }
                res.redirect("/poll/" + newPoll._id);
            });
        }
        fn1(fn2);
    };

    this.myPoll = function(req, res) {

        if (req.user !== undefined) {
            var creatorID = req.user.github.id;
            Users
                .find({
                    'github.id': creatorID
                })
                .exec(function(err, result) {
                    if (err) {
                        throw err;
                    }
                    result = result.filter(function(val) {
                        return val.github.pollTitle !== undefined;
                    });
                    var body = '';
                    for (var i = 0; i < result.length; i++) {
                        body += "<a href=/poll/" + result[i]._id + "><button type='button' class='btn btn-default' id=" + result[i]._id +
                            " class=pollListTitle>" + result[i].github.pollTitle + "</button></a><br>";
                    }
                    res.send(body);
                });
        }


    };

    this.allPoll = function(req, res) {
        Users
            .find({})
            .exec(function(err, result) {
                if (err) {
                    throw err;
                }
                result = result.filter(function(val) {
                    return val.github.pollTitle !== undefined;
                });
                var body = '';
                for (var i = 0; i < result.length; i++) {
                    body += "<a href=/poll/" + result[i]._id + "><button type='button' class='btn btn-default' id=" + result[i]._id +
                        " class=pollListTitle>" + result[i].github.pollTitle + "</button></a><br>";
                }
                res.send(body);
            });
    };

    this.pollContent = function(req, res) {
        var pollID = req.url.match(/\/poll\/(.*)/)[1];
        Users
            .findOne({
                _id: pollID
            })
            .exec(function(err, result) {
                if (err) {
                    throw err;
                }
                var pollOptions = '';
                var currentPollTitle = result.github.pollTitle;

                function fn1(cb) {
                    for (var i = 0; i < result.github.pollOptionArr.length; i++) {
                        var pollOption = result.github.pollOptionArr[i];
                        pollOptions += "<option value=" + pollOption.pollOptionID + ">" + pollOption.pollOption + "</option>";
                    }
                    cb();
                }

                function fn2() {
                    if (req.isAuthenticated()) {
                        var createPollOption = "<option value=create>Create My Own Option</option>";
                    }
                    else {
                        createPollOption = "";
                    }

                    pollOptions = "<form method='post'" + "><select name='selectpicker' id='selectpicker'>" + pollOptions + createPollOption + "</select><br><div class=createInput></div><br></form><input type='submit'><br><br>";
                    var reqURI = encodeURIComponent(req.url + "&text=" + currentPollTitle);
                    var twitterShareButton = '<input type="submit" value="Share On Twitter" id="twitterShareButton" onclick="popupTwittWindow()">';
                    result = "<h3>" + result.github.pollTitle + "</h3>" + "<h5>I'd like to vote for ...</h5>" + pollOptions + twitterShareButton;
                    if (req.isAuthenticated()) {
                        res.render('pollcontentL', {
                            pollContent: result,
                            displayName: req.user.github.displayName
                        });
                    }
                    else {
                        res.render('pollcontent', {
                            pollContent: result
                        });
                    }
                }
                fn1(fn2);
            });
    };

    this.ifMyPoll = function(req, res) {
        var pollID = req.url.match(/\/ifMyPoll\/(.*)/)[1];
        Users
            .findOne({
                _id: pollID
            })
            .exec(function(err, result) {
                if (err) {
                    return console.error(err);
                }
                if (req.user.github.id == result.github.id) {
                    res.json('true');
                }
            });

    };

    this.removeMyPoll = function(req, res) {
        var pollID = req.url.match(/\/removeMyPoll\/(.*)/)[1];
        Users
            .remove({
                _id: pollID
            }, function(err) {
                if (err) {
                    return console.error(err);
                }
                res.json('removed');
            });
    };

    this.pollContentChar = function(req, res) {

        var pollID = req.url.match(/\/poll\/(.*)/)[1];
        Users
            .findOne({
                _id: pollID
            })
            .exec(function(err, result) {
                if (err) {
                    throw err;
                }
                var headTtile = result.github.pollTitle;
                var pollOptions = [];
                var charData = [];
                var arr = result.github.pollOptionArr;
                var colorArr = result.github.colorArr;

                function fn1(cb) {
                    for (var i = 0; i < arr.length; i++) {
                        pollOptions.push(arr[i].pollOption);
                        charData.push(arr[i].pollOptionVote);
                    }
                    cb();
                }

                function fn2() {
                    res.json([pollOptions, charData, headTtile, colorArr]);
                }
                fn1(fn2);
            });
    };

    this.updateVote = function(req, res) {
        var createOptionCode = req.url.indexOf('createOption');
        var visitorIP = req.headers['x-forwarded-for'];
        var pollID = req.url.match(/\/poll\/(.*)\?\=.*/)[1];
        var votedOptionID = '';

        function getVoteOptionID() {
            if (createOptionCode === -1) {
                votedOptionID = req.url.match(/\?\=(.*)/)[1];
            }
            else {
                votedOptionID = req.url.match(/createOption\=(.*)/)[1];
            }
        }

        getVoteOptionID();

        if (createOptionCode === -1) {
            var ID = votedOptionID;
            var newPollOptionArr = [];
            Users
                .findOne({
                    '_id': pollID
                })
                .exec(function(err, result) {
                    if (err) {
                        throw err;
                    }

                    if (result.github.votedIPs.indexOf(visitorIP) !== -1) {
                        res.send('voted');
                    }
                    else {
                        var votedIPs = result.github.votedIPs;
                        votedIPs.push(visitorIP);
                        var arr = result.github.pollOptionArr;
                        newPollOptionArr = arr.map(function(val) {
                            for (var i = 0; i < arr.length; i++) {
                                if (val.pollOptionID == ID) {
                                    var obj = {
                                        pollOptionID: val.pollOptionID,
                                        pollOptionVote: val.pollOptionVote + 1,
                                        pollOption: val.pollOption
                                    };
                                    return obj;
                                }
                                else {
                                    return val;
                                }
                            }
                        });
                        Users
                            .findOneAndUpdate({
                                '_id': pollID
                            }, {
                                $set: {
                                    'github.pollOptionArr': newPollOptionArr,
                                    'github.votedIPs': votedIPs
                                }
                            }, {
                                new: true
                            })
                            .exec(function(err, result) {
                                if (err) {
                                    throw err;
                                }
                                var data = [];
                                var pollOptions = [];
                                var arr = result.github.pollOptionArr;
                                var colorArr = result.github.colorArr;

                                function fn1(cb) {
                                    for (var i = 0; i < arr.length; i++) {
                                        data.push(arr[i].pollOptionVote);
                                        pollOptions.push(arr[i].pollOption);
                                    }
                                    cb();
                                }

                                function fn2() {
                                    res.json([pollOptions, data, colorArr]);
                                }
                                fn1(fn2);
                            });
                    }
                });
        }
        else {
            newPollOptionArr = [];
            Users
                .findOne({
                    '_id': pollID
                })
                .exec(function(err, result) {
                    if (err) {
                        throw err;
                    }

                    if (result.github.votedIPs.indexOf(visitorIP) !== -1) {
                        res.send('voted');
                    }
                    else {
                        var colorArr = updateColorArr(result.github.colorArr);
                        var votedIPs = result.github.votedIPs;
                        votedIPs.push(visitorIP);
                        newPollOptionArr = result.github.pollOptionArr;
                        newPollOptionArr.push({
                            pollOptionID: newPollOptionArr.length + 1,
                            pollOptionVote: 1,
                            pollOption: votedOptionID

                        });
                        Users
                            .findOneAndUpdate({
                                '_id': pollID
                            }, {
                                $set: {
                                    'github.pollOptionArr': newPollOptionArr,
                                    'github.votedIPs': votedIPs,
                                    'github.colorArr': colorArr
                                }
                            }, {
                                new: true
                            })
                            .exec(function(err, result) {
                                if (err) {
                                    throw err;
                                }
                                var colorArr = result.github.colorArr;
                                var data = [];
                                var pollOptions = [];
                                var arr = result.github.pollOptionArr;

                                function fn1(cb) {
                                    for (var i = 0; i < arr.length; i++) {
                                        data.push(arr[i].pollOptionVote);
                                        pollOptions.push(arr[i].pollOption);
                                    }
                                    cb();
                                }

                                function fn2() {
                                    res.json([pollOptions, data, colorArr]);
                                }
                                fn1(fn2);
                            });
                    }
                });
        }
    };
}

module.exports = ClickHandler;
