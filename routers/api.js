const join = require('path').join;
const Analytics = require(join(__dirname, '../lib/analytics'));
const Shortener = require(join(__dirname, '../lib/shortener'));

let api = require('express').Router();

api.use('/', function(req, res, next){
	let key = req.query.app_key || req.get('X-Hound-Key') || req.body.app_key;
	if(!key){
		return res.status(403).json({error:{message:'You must be in possession of a valid app_key', code:403}});
	}

	if(key !== Config.app_key){
		return res.status(403).json({error:{message:'Invvalid app_key', code:403}});
	}

	return next();
});

// ******* CREATION ********
api.post('/campaigns/new', function(req, res, next){
	let c = new DB.Models.Campaign(req.body.id, req.body.name, req.body.description, req.body.redirect_uri);
	DB.Campaigns.add(c);
	return res.json(c);
});

api.post('/pixels/new', function(req, res, next){
	let p = new DB.Models.Pixel(req.body.id, req.body.campaign);
	DB.Pixels.add(p);
	return res.json(p);
});

api.post('/webhook', function(req, res, next){
	if(!req.body.url){
		let e = new Error('URL required');
		e.code = 400;
		throw e;
	}
	DB.Webhooks.add(req.body.url);
	return res.json({success:true});
});


// ******* DATA ACQUISITION ********
api.get('/campaigns', function(req, res, next){
	return res.json(DB.Campaigns.all());
});

api.get('/pixels', function(req, res, next){
	return res.json(DB.Pixels.all());
});


// ******* ANALYTICS ********
api.get('/analytics', function(req, res, next){
	return res.json(Analytics.batch(DB.Campaigns.all()));
});

api.get('/analytics/pixels', function(req, res, next){
	return res.json(DB.Pixels.all());
});

api.get('/analytics/pixels/:id', function(req, res, next){
	let pixel = DB.Pixels.get(req.params.id);
	if(!pixel){
		let e = new Error(`Pixel ${req.params.pixel} does not exist`);
		e.code = 404;
		throw e;
	}
	return res.json(pixel.analytics);
});

api.get('/analytics/:campaign', function(req, res, next){
	let campaign = DB.Campaigns.get(req.params.campaign);
	if(!campaign){
		let e = new Error(`Campaign ${req.params.campaign} does not exist`);
		e.code = 404;
		throw e;
	}
	return res.json(Analytics.crunch(campaign.analytics));
});

// ******* UTILS ********
api.get('/campaigns/:id', function(req, res, next){
	let campaign = DB.Campaigns.get(req.params.id);
	if(!campaign){
		let e = new Error(`Campaign ${req.params.id} does not exist`);
		e.code = 404;
		throw e;
	}

	let uri = (Config.https ? 'https://' : 'http://') + Config.host + `/tracker/${campaign.id}?` + campaign.makeuri(req.query.referrer, req.query.source, req.query.medium, req.query.extra, req.query.redir_fallback);

	if(req.query.shorten){
		return shorten(uri, req, res);
	} else {
		return res.json({
			uri: uri
		});
	}
});

api.get('/pixels/:id', function(req, res, next){
	let pixel = DB.Pixels.get(req.params.id);
	if(!pixel){
		let e = new Error(`Pixel ${req.params.id} does not exist`);
		e.code = 404;
		throw e;
	}

	let campaign = DB.Campaigns.get(pixel.campaign);
	if(!campaign){
		let e = new Error(`Campaign ${pixel.campaign} does not exist`);
		e.code = 404;
		throw e;
	}
	
	let uri = (Config.https ? 'https://' : 'http://') + Config.host + `/tracker/pixel/${pixel.id}?` + campaign.makeuri(req.query.referrer, req.query.source, req.query.medium, req.query.extra, req.query.redir_fallback);

	if(req.query.shorten){
		return shorten(uri, req, res);
	} else {
		return res.json({
			uri: uri
		});
	}
});

api.use(function(err, req, res, next){
	console.error(err);
	return res.status(err.code || 500).json({error:{message:err.message, code:err.code || 500}});
});

function shorten(uri, req, res){
	Shortener.bitly(uri).then(shortlink => {
		return res.json({
			uri: uri,
			short: shortlink
		});
	}).catch(e => {
		return res.json({
			uri: uri,
			short: null,
			error: e
		});
	});
}
module.exports = api;