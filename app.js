#!/usr/bin/env node
global.DB = require('./db/db');
global.Config = require('./config.json');

DB.load();

const express = require('express');
const app = express();
const cookieParser = require('cookie-parser');
const bodyParser = require('body-parser');
const cors = require('cors');
app.use(cors());

app.options('*', cors());

app.use(cookieParser());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

const mustache = require('mustache-express');
app.engine('html', mustache());
app.set('view engine', 'html');

app.set('views', __dirname+'/views');
app.use(express.static(__dirname+'/views/public'));

app.get('/', function (req, res, err){
	return res.json({
		hound:{
			author: 'Jo Colina',
			description: 'Hound is a simple server that allows you to track multiple urls with Campaigns (think Google Analytics) and Pixel tracking (in the future) for mails && articles',
			do: 'enjoy!'
		}
	});
});

app.use('/tracker', require('./routers/tracker'));
app.use('/api', require('./routers/api'));

app.listen(process.env.PORT || 1234, function(){
	console.log(`Server listening on port ${process.env.PORT || 1234}!`);
});