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
			for (var i = 0; i < pollOption.length; i++) {
				if (pollOption[i] !== '\r' && pollOption[i] !== '\n')
					pollOptionArr.push(pollOption[i]);
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
	
	this.pollContent = function (req, res) {
		var pollID = req.url.match(/\/poll\/(.*)/)[1];
		Users
		.find({
				_id: pollID
			})
			.exec(function(err, result) {
				if (err) {
					throw err;
				}
				res.send(result[0].github.pollTitle);
			});
	};
}

module.exports = ClickHandler;
