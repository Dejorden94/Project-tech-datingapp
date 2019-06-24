//Bron: https://www.youtube.com/watch?v=gnsO8-xJ8rs&t=2121s
require('dotenv').config();
var PORT = process.env.PORT || 3000;
var express = require('express');
var path = require('path');
var bodyParser = require('body-parser');
var expressValidator = require('express-validator');
var session = require('express-session');
var app = express();
var mongoose = require('mongoose');
var Schema = mongoose.Schema;

//source: https://www.youtube.com/watch?v=oT2HOw3fWp4

//Grote dank aan Nick connect to mongoddb
mongoose.connect(
	"mongodb+srv://" +
	  process.env.DB_USERNAME +
	  ":" +
	  process.env.DB_PASSWORD +
	  "@" +
	  process.env.DB_SERVER +
	  "/" +
	  process.env.DB_NAME +
	  "?retry?Writes=true",
	{ useNewUrlParser: true }
   );

var db = mongoose.connection;

//Source: https://mongoosejs.com/docs/api.html#model_Model.find
//Define a schema
var interstsSchema = new Schema({
	name: String
}, {
	collection: 'interessts'
});

var interest = mongoose.model('interessts', interstsSchema);


//Check of er een connectie is.
mongoose.connection.once('open', function () {
		console.log('Database is connected, cool..');
		interest.find({}, function (err, interests) {
			if (err) {
				console.log("Er gaat iets niet goed.");
			} else {
				interests.forEach(function (element) {
					console.log(element.name);
				});
			}
		});
	});

	//Check if there is a error
	db.on('error', function (error) {
		console.log('Ah oh, something went wrong. Darn..', error);
	});

//db.on('error', console.error.blind(console, 'connection error'));
db.once('open', function () {});

//Set templating engine to ejs
app.set('view engine', 'ejs');
//set path of views.
app.set('views', path.join(__dirname, 'views'));

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
	extended: false
}));

app
.use(session({
	resave: false,
	saveUninitalized: false,
	secret: 'secret'
}));


//Set static Path
app.use(express.static(path.join(__dirname, 'static')));

//Global vars
app.use(function (req, res, next) {
	res.locals.errors = null;
	next();
});
// Express validator middleware, kijkt of de input die wordt gegeven geldig is
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


//Renders the page and takes the dat from database (docs)
app.get('/', function (req, res) {
		//if there is no session redirect to login page
		if(!req.session.user){
			res.redirect('/login');
		}
	interest.find(function (err,interests ) {
		if (err) {
			console.log("Er gaat iets niet goed.");
		} else {
			res.render('index', {
				data: interests,
				user: req.session.user
			});
			console.log(req.session.user);
		}
	});

});


app.post('/', function (req, res) {
	req.checkBody('interest', 'Laat je matches weten wat jou interesseert').notEmpty();
	  
	var errors = req.validationErrors();
	//When tehir is a error,render the page with the error message
	if (errors) {
		interest.find(function (err, interests) {
			res.render('index', {
				data: interests,
				errors: errors,
				user: req.session.user
			});
		});
		//If everything is oke, make a new interesst
	} else {
		var newInteresst = {
			name: req.body.interest
		};
		interest.create(newInteresst, function (error, entry) {
			if (error) {
				console.log(error);
			}
			entry.save();
			req.session.asd = "asdas";
			res.redirect('/');
		});
	}
});

app.get('/login', function(req, res){
	res.render('login', {

	});
});

//makes a session
app.post('/submit',function(req, res){
	//gets the email form email field
	req.session.user = req.body.email;
	//reirects to index ejs
	res.redirect('/');
});

//Bron:https://www.youtube.com/watch?v=aZ16pkrMkZE&amp=&index=7 en groten dank aan Rober Hoekstra
app.delete('/interest/:id', function(req, res){
	let query = {_id:req.params.id};
	console.log(query);

	interest.deleteOne(query, function(err){
		if(err){
			console.log(err);
		}
		res.send('Succes');
	});
});

app.use(notFound);

//Port is 3000 orprocess.env.PORT beacause of Heroku
app.listen(PORT, function () {
	console.log('Server gestart op ' + PORT);
});

//If the status is 404 then render the not0found page
function notFound(req, res) {
	res.status(404).render('not-found.ejs');
}