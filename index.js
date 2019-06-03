//Bron: https://www.youtube.com/watch?v=gnsO8-xJ8rs&t=2121s
var express = require('express');
var path = require('path');
var bodyParser = require('body-parser');
var expressValidator = require('express-validator');
var mongojs = require('mongojs');
var db = mongojs('datingApp', ['interessts']);
//test array
var interesst = [{
	name: 'Golf'
}];
var app = express();
/*var mongoose = require('mongoose');*/
/*var Schema = mongoose.Schema;*/
//source: https://www.youtube.com/watch?v=oT2HOw3fWp4

//connect to mongoddb
/*mongoose.connect('mongodb://localhost/datingApp');

var db = mongoose.connection;

//Check of er een connectie is.
mongoose.connection.once('open',function(){
	console.log('Database is connected, cool..');
})
//Check if there is a error
.on('error', function(error){
	console.log('Ah oh, something went wrong. Darn..', error);
});
*/
/*db.on('error', console.error.blind(console, 'connection error'));
db.once('open', function(){
});*/

//Set templating engine to ejs
app.set('view engine', 'ejs');
//set path of views.
app.set('views', path.join(__dirname, 'views'));

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
	extended: false
}));

//Set static Path
app.use(express.static(path.join(__dirname, 'static')));

//Global vars
app.use(function (req, res, next) {
	res.locals.errors = null;
	next();
});
// Express validator middleware
app.use(expressValidator({
	errorFormatter: function (param, msg, value) {
		var namespace = param.split('.'),
			root = namespace.shift(),
			formParam = root;

		while (namespace.length) {
			formParam += '[' + namespace.shift() + ']';
		}
		return {
			param: formParam,
			msg: msg,
			value: value
		};
	}
}));

/*
//Source: https://mongoosejs.com/docs/api.html#model_Model.find
//Define a schema
var intersstsSchema = new Schema({name:String},
	{collection: 'interessts'});

var interesst = mongoose.model('interessts', intersstsSchema);

var allInteressts = interesst.findOne({type: 'name'});
*/
app.get('/', function (req, res) {
	db.interessts.find(function (err, docs) {
		res.render('index', {
			interesst: docs
		});
	});

});

app.post('/', function (req, res) {

	req.checkBody('interesst', 'Laat je matches weten wat jou interesseert').notEmpty();

	var errors = req.validationErrors();

	if (errors) {
		db.interessts.find(function (err, docs) {
		res.render('index', {
			interesst: docs,
			errors: errors
		});
	});

	} else {
		var newInteresst = {
			name: req.body.interesst
		};
		db.interessts.insert(newInteresst, function (error, result) {
			if (error) {
				console.log(error);
			}
			res.redirect('/');
		});
	}
});

app.use(notFound);

app.listen(3000, function () {
	console.log('Server gestart op Port 3000..');
});

function notFound(req, res) {
	res.status(404).render('not-found.ejs');
}
