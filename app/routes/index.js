'use strict';

var path = process.cwd();
var ClickHandler = require(path + '/app/controllers/clickHandler.server.js');

module.exports = function(app, passport) {

	function isLoggedIn(req, res, next) {
		if (req.isAuthenticated()) {
			return next();
		}
		else {
			res.redirect('/login');
		}
	}

	var clickHandler = new ClickHandler();

	app.route('/')
		.get(isLoggedIn, function(req, res) {
			res.render(path + '/public/index.ejs', {
				displayName: req.user.github.displayName,
			});
		});

	app.route('/login')
		.get(function(req, res) {
			res.render(path + '/public/login.ejs');
		});


	app.route('/logout')
		.get(function(req, res) {
			req.logout();
			res.redirect('/login');
		});

	app.route('/profile')
		.get(isLoggedIn, function(req, res) {
			res.sendFile(path + '/public/profile.html');
		});

	app.route('/api/:id')
		.get(isLoggedIn, function(req, res) {
			res.json(req.user.github);
		});

	app.route('/auth/github')
		.get(passport.authenticate('twitter'));

	app.route('/auth/twitter/callback')
		.get(passport.authenticate('twitter', {
			successRedirect: '/',
			failureRedirect: '/login'
		}));

	app.route('/api/:id/clicks')
		.get(isLoggedIn, clickHandler.getClicks)
		.post(isLoggedIn, clickHandler.addClick)
		.delete(isLoggedIn, clickHandler.resetClicks);

	app.route('/newPoll')
		.get(isLoggedIn, function(req, res) {
			res.render(path + '/public/newPoll.ejs', {displayName: req.user.github.displayName});
		});

	app.route('/addPoll')
		.post(isLoggedIn, clickHandler.addPoll);

	app.route('/myPoll')
		.get(isLoggedIn, function(req, res) {
			res.render(path + '/public/myPolls.ejs', {
				displayName: req.user.github.displayName
			});
		});

	app.route('/allpoll')
		.get(clickHandler.allPoll)
		.post(clickHandler.myPoll);

	app.route('/poll/*')
		.get(clickHandler.pollContent)
		.post(clickHandler.pollContentChar)
		.delete(clickHandler.updateVote);

	app.route('/ifMyPoll/*')
		.get(isLoggedIn, clickHandler.ifMyPoll);

	app.route('/removeMyPoll/*')
		.delete(isLoggedIn, clickHandler.removeMyPoll);
};
