//Bron: https://www.youtube.com/watch?v=gnsO8-xJ8rs&t=2121s
var express = require('express');
var path = require('path');
var bodyParser = require('body-parser');
var expressValidator = require('express-validator');
var mongoose = require('mongoose');
var Schema = mongoose.Schema;
//source: https://www.youtube.com/watch?v=oT2HOw3fWp4

//connect to mongoddb
mongoose.connect('mongodb://localhost/datingApp');

var db = mongoose.connection;

//Check of er een connectie is.
mongoose.connection.once('open',function(){
	console.log('Database is connected, cool..');
})
//Check if there is a error
.on('error', function(error){
	console.log('Ah oh, something went wrong. Darn..', error);
});

/*db.on('error', console.error.blind(console, 'connection error'));
db.once('open', function(){
});*/

var app = express();

//Set templating engine to ejs
app.set('view engine', 'ejs');
//set path of views.
app.set('views', path.join(__dirname, 'views'));

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended:false}));

//Set static Path
app.use(express.static(path.join(__dirname,'static')));

//Global vars
app.use(function(req, res, next){
	res.locals.errors = null;
	next();
});
// Express validator middleware
app.use(expressValidator({
	errorFormatter: function(param, msg, value){
		var namespace = param.split('.'),
		root = namespace.shift() , formParam = root;

		while(namespace.length){
			formParam += '[' + namespace.shift() + ']';
		}
		return{
			param: formParam,
			msg: msg,
			value: value
		};
	}
}));

//test array
/*var interessts = [
	{
		name: 'Golf'
	}
];*/

//Define a schema
var intersstsSchema = mongoose.Schema({
	name:String
});

var interesst = mongoose.model('interessts', intersstsSchema);

interesst.find({name: {$gte: 'Gamen'}});

app.get('/', function(req, res){
	res.render('index',{
		interesst:interesst
    });	
});

app.post('/interesses/add', function(req, res){
	
	req.checkBody('interesse', 'Veld mag niet leeg zijn').notEmpty();

	var errors = req.validationErrors();

	if(errors){
		res.render('index',{
			interesst: interesst,
			errors: errors
		});
	}else{
		var newInterest = {
			interesst: req.body.interessts
		};
		console.log(newInterest);
	}	
	
});

app
	.use(notFound);
	//.use(views)
	app.listen(3000, function(){
		console.log('Server gestart op Port 3000..');
	});
	
function notFound(req, res) {
  res.status(404).render('not-found.ejs');
}
