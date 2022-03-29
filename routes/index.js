var express = require('express');
var router = express.Router();
var User = require('../models/user');

router.get('/', function (req, res, next) {
	return res.render('regis.ejs');
});


router.post('/', function(req, res, next) {
	console.log(req.body);
	var person = req.body;


	if(!person.email || !person.uname || !person.passwd || !person.confpasswd){
		res.send();
	} else {
		if (person.passwd == person.confpasswd) {

			User.findOne({email:person.email},function(err,data){
				if(!data){
					var c;
					User.findOne({},function(err,data){

						if (data) {
							console.log("if data");
							c = data.unique_id + 1;
						}else{
							c=1;
						}

						var newPerson = new User({
							unique_id:c,
							email:person.email,
							username: person.uname,
							password: person.passwd,
							confpasswd: person.confpasswd
						});

						newPerson.save(function(err, Person){
							if(err)
								console.log(err);
							else
								console.log('Success');
						});

					}).sort({_id: -1}).limit(1);
					res.send({"Success":"You are registered,You can login now."});
				}else{
					res.send({"Success":"Email is already used."});
				}

			});
		}else{
			res.send({"Success":"password is not matched"});
		}
	}
});

router.get('/login', function (req, res, next) {
	return res.render('login.ejs');
});
router.get('/projects', function (req, res, next) {
	// return res.render('projects.ejs');
	User.findOne({unique_id:req.session.userId},function(err,data){
		console.log("data");
		console.log(data);
		if(!data){
			res.redirect('/');
		}else{
			//console.log("found");
			return res.render('projects.ejs');
		}
	});
});
router.get('/contact', function (req, res, next) {
	// return res.render('projects.ejs');
	User.findOne({unique_id:req.session.userId},function(err,data){
		console.log("data");
		console.log(data);
		if(!data){
			res.redirect('/');
		}else{
			//console.log("found");
			return res.render('contact.ejs');
		}
	});
});

router.post('/login', function (req, res, next) {
	//console.log(req.body);
	User.findOne({email:req.body.email},function(err,data){
		if(data){
			
			if(data.password==req.body.passwd){
				//console.log("Done Login");
				req.session.userId = data.unique_id;
				//console.log(req.session.userId);
				res.send({"Success":"Success!"});
				
			}else{
				res.send({"Success":"Wrong password!"});
			}
		}else{
			res.send({"Success":"This Email Is not registered!"});
		}
	});
});

router.get('/index', function (req, res, next) {
	// console.log("main");
	User.findOne({unique_id:req.session.userId},function(err,data){
		console.log("data");
		console.log(data);
		if(!data){
			res.redirect('/');
		}else{
			//console.log("found");
			return res.render('index.ejs');
			// return res.render('index.ejs', {"name":data.username,"email":data.email});
		}
	});
});

router.get('/logout', function (req, res, next) {
	console.log("logout")
	if (req.session) {
    // delete session object
    req.session.destroy(function (err) {
    	if (err) {
    		return next(err);
    	} else {
    		return res.redirect('/');
    	}
    });
}
});

module.exports = router;