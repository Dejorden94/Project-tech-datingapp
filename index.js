const express = require('express');
const app = express();
var name = "Dejorden";

app
	.use(express.static('static'))
	.use(notFound)
	.use(views)
	.listen(3000)
	
app.use('/static', express.static('static'));

function notFound(req, res) {
  res.status(404).render('not-found.ejs')
}
