var express = require('express');
var path = require('path');
var bodyParser = require('body-parser');

var app = express();

app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended:false}));

//Set static Path
app.use(express.static(path.join(__dirname,'static')));

var matches = [
	{
		naam: "Jordan" 
	},
	{
		naam: "Christy"
	}
]

app.get('/', function(req, res){
	res.render('index',{
		name: 'Dejorden'
	});
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
