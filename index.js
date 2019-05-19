const express = require('express');
const app = express();

app
	.use(express.static('static'))
	.use(notFound)
	.listen(3000)

app.use('/static', express.static('public'));

function notFound(req, res) {
  res.status(404).render('not-found.ejs')
}