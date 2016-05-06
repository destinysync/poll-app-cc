'use strict';

var Users = require('../models/users.js');

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

			newPoll.save(function(err) {
				if (err) {
					throw err;
				}
			});
		}
		fn1(fn2);
	};

	this.myPoll = function(req, res) {
		var creatorID = req.user.github.id;
		Users
			.find({
				'github.id': creatorID
			})
			.exec(function(err, result) {
				if (err) {
					throw err;
				}
				res.json(result);
			});
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
					body += "<a href=/poll/" + result[i]._id + "><span id=" + result[i]._id +
						" class=pollListTitle>" + result[i].github.pollTitle + "</span></a><br>";
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

				function fn1(cb) {
					for (var i = 0; i < result.github.pollOptionArr.length; i++) {
						var pollOption = result.github.pollOptionArr[i];
						pollOptions += "<option value=" + pollOption.pollOptionID + ">" + pollOption.pollOption + "</option>";
					}
					cb();
				}

				function fn2() {
					pollOptions = "<form action=" + "/updateVote/" + result._id + " method='post'" + "><select name='selectpicker'>" + pollOptions + "</select><button type='submit'>Submit</button></form>";
					result = "<h3>" + result.github.pollTitle + "</h3>" + "<br>" + pollOptions;
					res.send(result);
				}
				fn1(fn2);
			});
	};

	this.updateVote = function(req, res) {
		var pollID = req.url.match(/\/updateVote\/(.*)/)[1];
		var ID = req.body.selectpicker;
		var newPollOptionArr = [];

		Users
			.findOne({
				'_id': pollID
			})
			.exec(function(err, result) {
				if (err) {
					throw err;
				}
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
							'github.pollOptionArr': newPollOptionArr
						}
					}, {
						new: true
					})
					.exec(function(err, result) {
						if (err) {
							throw err;
						}
						res.json(result.github.pollOptionArr);
					});
			});
	};
}

module.exports = ClickHandler;
