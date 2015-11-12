var express = require('express');
var path = require('path');
var logger = require('morgan');
var bodyParser = require('body-parser');
var renderingEngine = require('ejs-locals');

var app = express();

app.engine('ejs', renderingEngine);
app.set('views', path.join(__dirname, '/views'));
app.set('view engine', 'ejs');
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

app.use(express.static(path.join(__dirname, 'public')));


app.get('/', function(req, res){
	res.render('index');
});

var answer = [{
	a : 1,
	e : 0.5,
	b : 3,
	k : null,
	d : 7,
	c : 2
},
{
	f : 2,
	z : 1.5,
	p : 3.8,
	o : 4,
	i : 9,
	w : 7
},
{
	q : 3,
	x : 11,
	p : 43,
	k : 45,
	l : 89,
	t : null
},
{
	p : 44,
	m : 12,
	s : 4,
	j : 3,
	o : 9,
	c : 10
}];

app.post('/api/*', function(req, res){
	var answerNumber = req.params[0].charAt(6)-1;
	if (answerNumber < answer.length){
		res.send(JSON.stringify(answer[answerNumber]));
		res.end();
	} else {
		res.sendStatus(404);
		res.end();
	}	
});




app.listen(8080, function () {    
    console.log('Express server listening on port 8080');
});

module.exports = app;