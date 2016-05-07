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
			res.render(path + '/public/index.ejs');
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
		.get(passport.authenticate('github'));

	app.route('/auth/github/callback')
		.get(passport.authenticate('github', {
			successRedirect: '/',
			failureRedirect: '/login'
		}));

	app.route('/api/:id/clicks')
		.get(isLoggedIn, clickHandler.getClicks)
		.post(isLoggedIn, clickHandler.addClick)
		.delete(isLoggedIn, clickHandler.resetClicks);

	app.route('/newPoll')
		.get(isLoggedIn, function(req, res) {
			res.sendFile(path + '/public/newPoll.html');
		});

	app.route('/addPoll')
		.post(isLoggedIn, clickHandler.addPoll);

	app.route('/myPoll')
		.get(isLoggedIn, clickHandler.myPoll);

	app.route('/allpoll')
		.get(clickHandler.allPoll);

	app.route('/poll/*')
		.get(clickHandler.pollContent);

	app.route('/updateVote/*')
		.post(clickHandler.updateVote);
};
