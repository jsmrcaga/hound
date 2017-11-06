const join = require('path').join;
const Tracking = require(join(__dirname, '../tracking/tracking'));
const Utils = require(join(__dirname,  '../lib/utils'));
let tracker = require('express').Router();

tracker.post('/track', function(req, res, next){
	// TODO
});

tracker.get('/pixel/:id', function(req, res, next){
	let pixel = DB.Pixels.get(req.params.id);
	if(!pixel){
		return res.status(404).json({error:{message:`Pixel ${req.params.id} not found`, code:404}});
	}

	if(Utils.ignore(req)){
		return res.sendFile('./pixel.gif', {
				root: join(__dirname + '../../../files')
		});
	}

	Tracking.pixel(pixel, req);

	return pixel.make(req, res);
});

tracker.get('/:campaign', function(req, res, next){
	let campaign = DB.Campaigns.get(req.params.campaign);
	if(!campaign && req.query.redirect_uri){
		console.error(`Campaign ${req.params.campaign} not found`);
		return res.redirect(req.query.redirect_uri);

	} else if(!campaign && !req.query.redirect_uri){
		console.error(`Campaign ${req.params.campaign} not found and no fallback URI given`);
		return res.redirect('https://google.com');
	}

	if(Utils.ignore(req)){
		return res.redirect(campaign.redir || req.query.redirect_uri || 'https://google.com');
	}

	let url = Tracking.track(campaign, req);

	if(req.cookies['hound-user']){
		return res.redirect(url.uri);
	} else {
		return res.cookie('hound-user', url.user, {
			expires: new Date(Date.now() + 2592000000)
		}).redirect(url.uri);
	}
});

module.exports = tracker;